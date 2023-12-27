require("dotenv").config();

const db = require("../config/dbConnection");


const addTodelivery = async(req,res)=>{
    let conn;
    try {
        conn = await db.getConnection();
        const {order_id,total_price} = req.body;
        const {id} = req.user;
        const addDel = await conn.query(`INSERT INTO delivery_proof(order_id,user_id,total_price)VALUES(?,?)`,[
            order_id,id,total_price
        ]);
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
const deliveredItem = async(req,res)=>{
    let conn;
    try {
        conn = await db.getConnection();
        const {order_id} = req.body;
        const {image} = req.files;
        const delivered = await conn.query(`UPDATE delivery_proof SET image=?, SET created = now() WHERE order_id = ?`,[`images/${image[0].originalname}`,order_id]);
        if(!delivered){
            return res.status(404).json({
                msg:'Item Not Found'
            });
        }
        await conn.query(`UPDATE product_cart SET status = 5 WHERE order_id = ?`,[order_id]);
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
        SELECT del.order_id,del.total_price,cart.quantity,cart.size,prod.image,prod.productname,
        CONCAT_WS(' ',inf.fname,inf.mname,inf.lname) AS fullname, inf.phone, 
        CONCAT_WS(', ',addr.sitio,addr,baranggay,addr.city,addr.province) AS address
        FROM delivery_proof AS del
        LEFT OUTER JOIN product_cart AS cart ON cart.order_id = del.order_id
        LEFT OUTER JOIN products AS prod ON prod.id = cart.product_id
        LEFT OUTER JOIN user_info AS inf ON inf.user_id = cart.user_id
        LEFT OUTER JOIN user_address AS addr ON addr.user_id = inf.user_id
        WHERE cart.status = 4 WHERE del.user_id = ?
        `,[id]);
        if(itemToDeliver<=0){
            return res.status(404).json({
                msg:'Item is Empty'
            });
        }
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
    getAllItemNeedtoDeliver
}

