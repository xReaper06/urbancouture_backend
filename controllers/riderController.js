require("dotenv").config();

const db = require("../config/dbConnection");


const addTodelivery = async(req,res)=>{
    let conn;
    try {
        conn = await db.getConnection();
        const {order_id} = req.body;
        const {id} = req.user;
        const addDel = await conn.query(`INSERT INTO item_deliver(order_id,user_id)VALUES(?,?)`,[
            order_id,id
        ]);
        await conn.query('UPDATE product_checkout SET status = 4 WHERE order_id = ?',[order_id]);
        if(!addDel){
            return res.status(404).json({
                msg:'Not Found'
            });
        }
        return res.status(201).json({
            msg:'Proceed to Deliver'
        });
    } catch (error) {
        console.log(error);
    }finally{
        if(conn){
            conn.release();
        }
    }
}
const getDeliverItem = async(req,res)=>{
    let conn;
    try {
        conn = await db.getConnection();
        const {id} = req.user;
        const [myAddress] = await conn.query(`
        SELECT * FROM user_address WHERE user_id = ?`,[id]);

        const result = await conn.query(`SELECT p.id,p.order_id,p.products,p.totalPrice,p.status,
        CONCAT_WS(' ',inf.fname,inf.mname,inf.lname) AS fullname, inf.phone, 
        CONCAT_WS(', ',addr.sitio,addr.baranggay,addr.city,addr.province, addr.zipcode) AS address
        FROM product_checkout AS p
        LEFT OUTER JOIN user_info AS inf ON inf.user_id = p.user_id
        LEFT OUTER JOIN user_address as addr ON addr.user_id = inf.user_id
        WHERE addr.city = LOWER(?) AND p.status = 3
        `,[myAddress[0].city]);
        if (result && result.length > 0) {
            const [items] = result;
            // Continue with your logic
            return res.status(200).json({
                items:items
            })
          } else {
            console.log('No results or an error occurred.');
            // Handle the case when there are no results or an error occurred
          }
        
    } catch (error) {
        console.log(error);
    }finally{
        if(conn){
            conn.release();
        }
    }
}
const deliveredItem = async(req,res)=>{
    let conn;
    try {
        conn = await db.getConnection();
        const {order_id} = req.body;
        const {image} = req.files;
        const delivered = await conn.query(`UPDATE item_deliver SET proof=?, status = 2, dateDelivered = now() WHERE order_id = ?`,[`images/${image[0].originalname}`,order_id]);
        if(!delivered){
            return res.status(404).json({
                msg:'Item Not Found'
            });
        }
        const updateCart = await conn.query(`UPDATE product_checkout SET status = 5 WHERE order_id = ?`,[order_id]);
        if(!updateCart){
            return res.status(404).json({
                msg:'product Not Found'
            })
        }
        return res.status(200).json({
            msg:'Item Delivered'
        })
    } catch (error) {
        console.log(error);
    }finally{
        if(conn){
            conn.release();
        }
    }
}
const getAllItemNeedtoDeliver = async(req,res)=>{
    let conn;
    try {
        conn = await db.getConnection();
        const {id} = req.user;
        const [itemToDeliver] = await conn.query(`
        SELECT c.id, c.order_id,p.products,p.totalPrice,
        CONCAT_WS(' ',inf.fname,inf.mname,inf.lname) AS fullname, inf.phone, 
        CONCAT_WS(', ',addr.sitio,addr.baranggay,addr.city,addr.province, addr.zipcode) AS address
        FROM item_deliver AS c
        LEFT OUTER JOIN product_checkout AS p ON p.order_id = c.order_id
        LEFT OUTER JOIN user_info AS inf ON inf.user_id = p.user_id
        LEFT OUTER JOIN user_address as addr ON addr.user_id = inf.user_id
        WHERE c.status = 1 AND c.user_id = ?
        `,[id]);
        return res.status(202).json({
            itemToDeliver:itemToDeliver
        });
    } catch (error) {
        console.log(error);
    }finally{
        if(conn){
            conn.release();
        }
    }
}
const getAllItemDelivered = async(req,res)=>{
    let conn;
    try {
        conn = await db.getConnection();
        const {id} = req.user;
        const [itemToDeliver] = await conn.query(`
        SELECT c.id, c.order_id,c.proof,p.products,p.totalPrice,
        CONCAT_WS(' ',inf.fname,inf.mname,inf.lname) AS fullname, inf.phone, 
        CONCAT_WS(', ',addr.sitio,addr.baranggay,addr.city,addr.province, addr.zipcode) AS address
        FROM item_deliver AS c
        LEFT OUTER JOIN product_checkout AS p ON p.order_id = c.order_id
        LEFT OUTER JOIN user_info AS inf ON inf.user_id = p.user_id
        LEFT OUTER JOIN user_address as addr ON addr.user_id = inf.user_id
        WHERE c.status = 2 AND c.user_id = ?
        `,[id]);
        return res.status(202).json({
            itemToDeliver:itemToDeliver
        });
    } catch (error) {
        console.log(error);
    }finally{
        if(conn){
            conn.release();
        }
    }
}
module.exports={
    addTodelivery,
    deliveredItem,
    getAllItemNeedtoDeliver,
    getDeliverItem,
    getAllItemDelivered
}

