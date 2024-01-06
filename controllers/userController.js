require("dotenv").config();

const db = require("../config/dbConnection");
const bcrypt = require('bcryptjs');
const crypto = require('crypto');


const getUsersInfo = async(req,res)=>{
    let conn;
    try {
        conn = await db.getConnection();
        const {id} = req.user;
        const [user_info] = await conn.query(`
                SELECT 
            users.id,
            CONCAT_WS(' ', user_info.fname, user_info.mname, user_info.lname) AS fullname,
            user_info.email,
            user_info.phone,
            CONCAT_WS(', ', user_add.sitio, user_add.baranggay, user_add.city, user_add.province) AS address,
            profile.image AS profile_picture
        FROM users
        LEFT OUTER JOIN 
            user_info ON user_info.user_id = users.id
        LEFT OUTER JOIN 
            user_address AS user_add ON user_add.user_id = users.id
        LEFT OUTER JOIN 
            user_profile AS profile ON profile.user_id = users.id
        WHERE users.id = ?`,[id]);
        if(user_info.length <=0){
            return res.status(404).json({
                msg:'User info not found'
            });
        }
        return res.status(200).json({
            user_info:user_info[0]
        });
    } catch (error) {
        console.log(error);
    }finally{
        if(conn){
            conn.release()
        }
    }
}

const getAllProduct = async(req,res)=>{
    let conn;
    try {
        conn = await db.getConnection();
        const [allProduct] = await conn.query(`
        SELECT
                prod.id,
                prod.image,
                prod.productname,
                prod.productdesc,
                prod.updated_stocks,
                prod.price,
                CAST(AVG(rating.stars) AS FLOAT) AS ratings
            FROM
                products AS prod
            LEFT OUTER JOIN
                product_ratings AS rating ON rating.product_id = prod.id
            WHERE prod.is_deleted = 0 AND prod.updated_stocks > 0 AND prod.status = 0
            GROUP BY
                prod.id,
                prod.image,
                prod.productname,
                prod.productdesc,
                prod.updated_stocks,
                prod.price
            `);
            if(allProduct.length <=0){
                return res.status(400).json({
                    msg:'Empty Fields'
                })
            }
            return res.status(200).json({
                allProduct:allProduct
            })
    } catch (error) {
        console.log(error);
    }finally{
        if(conn){
            conn.release();
        }
    }
}
const viewProduct = async(req,res)=>{
    let conn;
    try {
        conn = await db.getConnection();
        const {prod_id} = req.body;
        const [product] = await conn.query(`
        SELECT
        prod.id,
        prod.image,
        prod.productname,
        prod.productdesc,
        prod.updated_stocks,
        prod.price,
        CAST(AVG(rating.stars) AS FLOAT) AS rate
    FROM
        products AS prod
    LEFT OUTER JOIN
        product_ratings AS rating ON rating.product_id = prod.id
    WHERE prod.id = ? AND prod.is_deleted = 0 AND prod.updated_stocks > 0 AND prod.status = 0
    GROUP BY
        prod.id,
        prod.image,
        prod.productname,
        prod.productdesc,
        prod.updated_stocks,
        prod.price
        `,[prod_id]);

        const [review] = await conn.query(`
        SELECT rate.id,rate.stars,rate.comment,rate.created,prd.image,prd.productname,
            CONCAT_WS(' ',inf.fname,inf.mname,inf.lname) AS fullname,
            prof.image AS profile
            FROM product_ratings AS rate 
            LEFT OUTER JOIN products AS prd ON prd.id = rate.product_id
            LEFT OUTER JOIN user_info AS inf ON inf.user_id = rate.user_id
            LEFT OUTER JOIN user_profile AS prof ON prof.user_id = rate.user_id
            WHERE rate.product_id = ? 
            `,[product[0].id]);
        return res.status(200).json({
            product:product[0],
            review:review
        })
    } catch (error) {
        console.log(error);
    }finally{
        if(conn){
            conn.release();
        }
    }
}
const addToCart = async(req,res)=>{
    let conn;
    try {
        conn = await db.getConnection();
        const {prod_id,quantity,totalPrice}=req.body;
        const {id} = req.user;
        const [condition] = await conn.query('SELECT updated_stocks FROM products WHERE id = ?',[prod_id]);
        const [condition2] = await conn.query('SELECT * FROM product_cart WHERE product_id = ? AND user_id = ? AND status = 1',[prod_id,id]);
        if(condition.length <=0){
            return res.status(403).json({
                msg:'item not Found'
            });
        }
        if(condition[0].updated_stocks < quantity){
            return res.status(401).json({
                msg:'Stocks is not fit to your expected Quantity Order'
            })
        }
        if(condition2.length > 0 ){
            return res.status(403).json({
                msg:'This item is already in your Cart'
            });
        }
        let cart_id = crypto.randomBytes(5).toString('hex');
        const result = await conn.query('INSERT INTO product_cart(cart_id,user_id,product_id,quantity,price,status,created)VALUES(?,?,?,?,?,1,now())',[
            cart_id,id,prod_id,quantity,totalPrice
        ]);
        if(!result){
            return res.status(404).json({
                msg:'Item not Found'
            })
        }
        return res.status(201).json({
            msg:'Item Added to Cart'
        });
    } catch (error) {
        console.log(error)
    }finally{
        if(conn){
            conn.release();
        }
    }
}
const viewProductCart = async(req,res)=>{
    let conn;
    try {
        conn = await db.getConnection();
        const {cart_id} = req.body;
        const {id} = req.user;
        const [thisProd] = await conn.query(`
        SELECT cart.id,cart.quantity,prod.price
        FROM product_cart AS cart
        LEFT OUTER JOIN products AS prod ON prod.id = cart.product_id
        WHERE cart.user_id = ? AND cart.id = ? AND cart.status = 1
        `,[id,cart_id])
        return res.status(200).json({
            product:thisProd[0]
        })
    } catch (error) {
        console.log(error)
    }finally{
        if(conn){
            conn.release()
        }
    }
}
const editCart = async(req,res)=>{
    let conn;
    try {
        conn = await db.getConnection();
        const {cart_id,quantity} = req.body;
        const [selectCart] = await conn.query(`
        SELECT cart.id,prod.updated_stocks,prod.price
        FROM product_cart AS cart
        LEFT JOIN products AS prod ON prod.id = cart.product_id
        WHERE cart.id = ?
        `,[cart_id]);
        if(selectCart[0].updated_stocks < quantity){
            return res.status(403).json({
                msg:'The Quantity is Higher than the Available Stocks'
            });
        }
        let updatedPrice; 
        updatedPrice = selectCart[0].price * quantity
        const updateProd = await conn.query('UPDATE product_cart SET quantity = ?, price = ? WHERE id = ?',[
            quantity,updatedPrice,cart_id
        ]);
        if(!updateProd){
            return res.status(404).json({
                msg:'Failed to Update This Product in your Cart!!'
            });
        }
        console.log(updatedPrice);
        return res.status(200).json({
            msg:'Updated SuccessFully'
        });
    } catch (error) {
        console.log(error);
    }finally{
        if(conn){
            conn.release();
        }
    }
}
const checkout = async(req,res)=>{
    let conn;
    try {
        conn = await db.getConnection();
        const {prod_id,selectedItems,cart_id} = req.body;
        const {id} = req.user
        const query1 = 'SELECT updated_stocks,productname FROM products WHERE id = ?'
        const query = 'SELECT quantity,price FROM product_cart WHERE product_id = ? AND user_id = ? AND status = 1'
        let original_prod;
        let cart_prod;
        let totalPrice = 0;
        let orderID = crypto.randomBytes(5).toString('hex');
            for (let i = 0; i < prod_id.length; i++) {
                [original_prod] = await conn.query(query1,[prod_id[i]]);
                [cart_prod] = await conn.query(query,[prod_id[i],id]);
                let productPrice = parseFloat(cart_prod[0].price);

                if (!isNaN(productPrice)) {
                    totalPrice += productPrice;
                }

                if(original_prod[0].updated_stocks < cart_prod[0].quantity){
                    await conn.query('UPDATE products  SET status = 1, updated = now() WHERE id = ?',[prod_id[i]]);
                    return res.status(403).json({
                        msg:`Item ${original_prod[0].productname} is not Available at the moment`
                    })
                }else{
                    let new_stocks = original_prod[0].updated_stocks - cart_prod[0].quantity;
                    await conn.query('UPDATE products SET updated_stocks = ? WHERE id = ?',[new_stocks,prod_id[i]]);
                }
            }
            for (let i = 0; i < cart_id.length; i++) {
                await conn.query('UPDATE product_cart SET status = 2,updated = now() WHERE id = ?',[cart_id[i]])
            }
            const checkoutThis = await conn.query(`INSERT INTO product_checkout(order_id,user_id,products,totalPrice,status,created)VALUES(?,?,?,?,1,now())`,[
                orderID,id,JSON.stringify(selectedItems),totalPrice
            ])
            if(!checkoutThis){
                return res.status.json({
                    msg:'Error Checkout'
                })
            }
            await conn.query('INSERT INTO rooms(room_id,user_id,created)VALUES(?,?,now())',[orderID,id])
            return res.status(200).json({
                msg:`Items is Check Outed Goto your the Tracking Order`
            });
    } catch (error) {
        console.log(error);
    }finally{
        if(conn){
            conn.release();
        }
    }
}
const getMyProductCart = async(req,res)=>{
    let conn;
    try {
        conn = await db.getConnection();
        const {id} = req.user;
        const [myProductCart] = await conn.query(`
        SELECT cart.id,cart.product_id,cart.quantity,cart.status,cart.created,prod.image,prod.productname,prod.updated_stocks,prod.price
        FROM product_cart AS cart 
        LEFT OUTER JOIN products AS prod ON prod.id = cart.product_id 
        WHERE cart.user_id = ? AND cart.status = 1
        `,[id]);
        return res.status(200).json({
            myProductCart:myProductCart
        });
    } catch (error) {
        console.log(error);
    }finally{
        if(conn){
            conn.release();
        }
    }
}
const trackMyorder = async(req,res)=>{
    let conn;
    try {
        conn = await db.getConnection();
        const {id} = req.user;
        const [orderTrack] = await conn.query(`
        SELECT pc.*,
       CONCAT_WS(', ', addr.sitio, addr.baranggay, addr.city, addr.province) AS address, addr.zipcode
        FROM product_checkout AS pc 
        LEFT OUTER JOIN user_address AS addr ON addr.user_id = pc.user_id 
        WHERE pc.user_id = ? AND pc.status BETWEEN 1 AND 4
        `,[id]);
        if(orderTrack.length <=0){
            return res.status(404).json({
                msg:'Empty Orders'
            });
        }
        return res.status(200).json({
            orderTrack:orderTrack
        });
    } catch (error) {
        console.log(error);
    }finally{
        if(conn){
            conn.release();
        }
    }
}
const puchaseHistory = async(req,res)=>{
    let conn;
    try {
        conn = await db.getConnection();
        const {id} = req.user;
        const [orderHistory] = await conn.query(`
        SELECT pc.*,
       CONCAT_WS(', ', addr.sitio, addr.baranggay, addr.city, addr.province) AS address, addr.zipcode
        FROM product_checkout AS pc 
        LEFT OUTER JOIN user_address AS addr ON addr.user_id = pc.user_id 
        WHERE pc.user_id = ? AND pc.status BETWEEN 5 AND 6`,[id]);
        return res.status(200).json({
            orderHistory:orderHistory
        });
    } catch (error) {
        console.log(error);
    }finally{
        if(conn){
            conn.release();
        }
    }
}

const changePassword = async (req,res)=>{
    let conn;
    try {
        conn = await db.getConnection();
        const {newPassword} = req.body;
        const {id} = req.user;
        const [user] = await conn.query('SELECT password FROM users WHERE id = ?',[id]);
        const hashPass = await bcrypt.hash(newPassword,10);
        const verifyPass = await bcrypt.compare(hashPass,user[0].password);
        if(verifyPass){
            return res.status(403).json({
                msg:'Password is Already Exist Try to Change Another Password'
            });
        }
        const updatedPass = await conn.query('UPDATE users SET password = ? WHERE id = ?',[hashPass,id]);
        if(!updatedPass){
            return res.status(404).json({
                msg:'User is not Authorized'
            });
        }
        return res.status(201).json({
            msg:'Password Change SuccessFully!!'
        })
    } catch (error) {
        console.log(error);
    }finally{
        if(conn){
            conn.release();
        }
    }
}
const changeProfilePic = async(req,res)=>{
    let conn;
    try {
        conn = await db.getConnection();
        const {image} = req.files;
        const {id} = req.user;
        const changepic = await conn.query('UPDATE user_profile SET image = ?,updated = now() WHERE user_id = ?',[`images/${image[0].originalname}`,id]);
        if(changepic.affectedRows <=0){
            return res.status(404).json({
                msg:'image is not found'
            });
        }
        return res.status(200).json({
            msg:'Profile is Successfully Changed!!'
        });
    } catch (error) {
        console.log(error);
    }finally{
        if(conn){
            conn.release();
        }
    }
}
const changeAddress = async(req,res)=>{
    let conn;
    try {
        conn = await db.getConnection();
        const {sitio,baranggay,city,province,zipcode} = req.body;
        const {id} = req.user;
        const changeAdd = await conn.query('UPDATE user_address SET sitio = ?, baranggay = ?, city = ?, province = ?, zipcode = ?, status = 2, updated = now() WHERE user_id = ?',[
            sitio,baranggay,city,province,zipcode,id
        ]);
        if(changeAdd.affectedRows <= 0){
            return res.status(404).json({
                msg:'Error Changing Address'
            });
        }
        return res.status(201).json({
            msg:'Successfully Changing Address!!'
        });
    } catch (error) {
        console.log(error);
    }finally{
        if(conn){
            conn.release();
        }
    }
}
const changeInfo = async(req,res)=>{
    let conn;
    try {
        conn = await db.getConnection();
        const {fname,lname,mname,email,phone} = req.body;
        const {id} = req.user;
        const changeAdd = await conn.query('UPDATE user_info SET fname=?,lname = ?, mname = ?, email = ?, phone = ? WHERE user_id = ?',[
            fname,lname,mname,email,phone,id
        ]);
        if(changeAdd.affectedRows <= 0){
            return res.status(404).json({
                msg:'Error Changing Info'
            });
        }
        return res.status(201).json({
            msg:'Successfully Changing Info!!'
        });
    } catch (error) {
        console.log(error);
    }finally{
        if(conn){
            conn.release();
        }
    }
}
const Rateproduct = async(req,res)=>{
    let conn;
    try {
        conn = await db.getConnection();
        const {prod_id,rate,comment} = req.body;
        const {id} = req.user;
        const [validateRate] = await conn.query('SELECT * FROM product_ratings WHERE product_id = ? AND user_id = ?',[
            prod_id,id
        ]);
        if(validateRate.length > 0){
            return res.status(403).json({
                msg:'This Product is Already Rated by You!!'
            })
        }
        const rateProd = await conn.query('INSERT INTO product_ratings(product_id,user_id,stars,comment,created)VALUES(?,?,?,?,now())',[prod_id,id,rate,comment]);
        if(!rateProd){
            return res.status(404).json({
                msg:'Rating Failed'
            });
        }
        return res.status(201).json({
            msg:'Successfully Rate the Product'
        })
    } catch (error) {
        console.log(error);
    }finally{
        if(conn){
            conn.release();
        }
    }
}
const removeFromCart = async(req,res)=>{
    let conn;
    try {
        conn = await db.getConnection();
        const {cart_id} = req.body;
        const removeProdCart = await conn.query('DELETE FROM product_cart WHERE id=?',[cart_id]);
        if(!removeProdCart){
            return res.status(404).json({
                msg:'Product Failed to remove!!'
            });
        }
        return res.status(200).json({
            msg:'Product Remove from Cart!!'
        })
    } catch (error) {
        console.log(error);
    }finally{
        if(conn){
            conn.release();
        }
    }
}
const confirmDelivery = async(req,res)=>{
    let conn;
    try {
        conn = await db.getConnection();
        const {order_id} = req.body;
        const confirm = await conn.query(`UPDATE product_checkout SET status = 6 WHERE order_id = ?`,[order_id]);
        if(!confirm){
            return res.status(404).json({
                msg:'Failed to Confirm..'
            });
        }
        return res.status(200).json({
            msg:'successFully Confirmed'
        })
    } catch (error) {
        console.log(error);
    }finally{
        if(conn){
            conn.release();
        }
    }
}
const UpdateQuantity = async(req,res)=>{
    let conn;
    try {
        conn = await db.getConnection();
        const {cart_id,quantity} = req.body;
        const [selectCart] = await conn.query(`
        SELECT cart.id,prod.updated_stocks,prod.price
        FROM product_cart AS cart
        LEFT JOIN products AS prod ON prod.id = cart.product_id
        WHERE cart.id = ?
        `,[cart_id]);
        if(selectCart[0].updated_stocks < quantity){
            return res.status(403).json({
                msg:'The Quantity is Higher than the Available Stocks'
            });
        }
        let updatedPrice; 
        updatedPrice = selectCart[0].price * quantity
        const updateProd = await conn.query('UPDATE product_cart SET quantity = ?, price = ? WHERE id = ?',[
            quantity,updatedPrice,cart_id
        ]);
        if(!updateProd){
            return res.status(404).json({
                msg:'Failed to Update This Product in your Cart!!'
            });
        }
        console.log(updatedPrice);
        return res.status(200).json({
            msg:'Updated SuccessFully'
        });
    } catch (error) {
        console.log(error);
    }finally{
        if(conn){
            conn.release();
        }
    }
}
module.exports = {
    getAllProduct,
    viewProduct,
    getUsersInfo,
    addToCart,
    checkout,
    getMyProductCart,
    trackMyorder,
    puchaseHistory,
    changePassword,
    changeAddress,
    changeProfilePic,
    Rateproduct,
    removeFromCart,
    editCart,
    viewProductCart,
    confirmDelivery,
    UpdateQuantity,
    changeInfo,
}

