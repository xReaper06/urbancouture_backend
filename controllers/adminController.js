require("dotenv").config();

const db = require("../config/dbConnection");
const bcrypt = require('bcrypt');

const insertProduct = async(req,res)=>{
  let conn;
  try {
    conn = await db.getConnection();
    const {prod_name,prod_desc,original_stocks,price} = req.body;
    const {image} = req.files;
    const {id} = req.user;
    const insertProd = await conn.query('INSERT INTO products(user_id,image,productname,productdesc,original_stocks,updated_stocks,price,created)VALUES(?,?,?,?,?,?,?,now())',[
      id,`images/${image[0].originalname}`,prod_name,prod_desc,original_stocks,original_stocks,price
    ]);
    if(!insertProd){
      return res.status(403).json({
        msg:'Product is failed to Insert'
      });
    }
    return res.status(201).json({
      msg:'Product is Inserted'
    });
  } catch (error) {
    console.log(error);
  }finally{
    if(conn){
      conn.release();
    }
  }
}

const getAllProductInserted = async(req,res)=>{
  let conn;
  try {
    conn = await db.getConnection();
    const [insertedProd] = await conn.query(`
    SELECT
                prod.id,
                prod.image,
                prod.productname,
                prod.productdesc,
                prod.updated_stocks,
                prod.price,
                prod.status,
                prod.is_deleted,
                AVG(rating.stars) AS ratings
            FROM
                products AS prod
            LEFT OUTER JOIN
                product_ratings AS rating ON rating.product_id = prod.id
            GROUP BY
                prod.id,
                prod.image,
                prod.productname,
                prod.productdesc,
                prod.updated_stocks,
                prod.price,
                prod.status,
                prod.is_deleted,
                ratings
    `);
    if(insertedProd.length <= 0){
      return res.status(404).json({
        msg:'Product is empty'
      });
    }
    return res.status(200).json({
      insertedProd:insertedProd
    });
  } catch (error) {
    console.log(error);
  }finally{
    if(conn){
      conn.release();
    }
  }
}
const getProofOfDelivery = async(req,res)=>{
  let conn;
  try {
    conn = await db.getConnection();
    const [proof] = await conn.query(`
    SELECT del.order_id,del.total_price,del.created,cart.quantity,cart.price,cart.size,cart.status,prod.image,prod.productname,
CONCAT_WS(' ', inf.fname,inf.mname,inf.lname) AS fullname, inf.phone, CONCAT_WS(', ',addr.sitio,addr.baranggay,addr.city,addr.province) AS address
    FROM delivery_proof AS del
    LEFT OUTER JOIN product_cart AS cart ON cart.order_id = del.order_id
    LEFT OUTER JOIN products AS prod ON prod.id = cart.product_id
    LEFT OUTER JOIN user_info AS inf ON inf.user_id = cart.user_id
    LEFT OUTER JOIN user_address AS addr ON addr.user_id = inf.user_id
    `);
    if(proof.length <= 0){
      return res.status(404).json({
        msg:'data is Empty'
      });
    }
    return res.status(200).json({
      proof:proof
    });
  } catch (error) {
    console.log(error);
  }finally{
    if(conn){
      conn.release();
    }
  }
}
const updateProof = async(req,res)=>{
  let conn;
  try {
    conn = await db.getConnection();
    const {order_id} = req.body;
    // const {image} = req.files;
    // const updateDel = await conn.query(`UPDATE delivery_proof SET image = ? created = now() WHERE order_id = ?`,[
    //   `images/${image[0].originalname}`,order_id
    // ])
    // if(updateDel.affectedRows <= 0){
    //   return res.status(404).json({
    //     msg:'Update Error'
    //   });
    // }
    const updateDel = await conn.query(`UPDATE product_cart SET status = status = 5 WHERE order_id = ?`,[order_id]);
    if(!updateDel){
      return res.status(404).json({
        msg:"error Update Delivery"
      });
    }
    return res.status(200).json({
      msg:"updated Status"
    });
  } catch (error) {
    console.log(error);
  }finally{
    if(conn){
      conn.release();
    }
  }
}

const getAllItemsDelivered = async(req,res)=>{
  let conn;
  try{
    conn = await db.getConnection();
    const [allItemsDelivered] = await conn.query(`
    SELECT cart.order_id,cart.quantity,cart.price,size,prod.image,prod.productname,CONCAT_WS(' ',inf.fname,inf.mname,inf.lname) AS fullname, inf.phone, CONCAT_WS(', ', addr.sitio,addr.baranggay,addr.city,addr.province) AS address
    FROM product_cart AS cart
    LEFT OUTER JOIN products AS prod ON prod.id = cart.product_id
    LEFT OUTER JOIN user_info AS inf ON inf.user_id = cart.user_id
    LEFT OUTER JOIN user_address AS addr ON addr.user_id = inf.user_id
    WHERE cart.status = 5
    `);
    if(allItemsDelivered.length <= 0){
      return res.status(404).json({
        msg:'delivered not Found'
      });
    }
    return res.status(200).json({
      allItemsDelivered:allItemsDelivered
    });
  }catch(error){
    console.log(error);
  }finally{
    if(conn){
      conn.release();
    }
  }
}
const getAllItemsCheckedOut = async (req,res)=>{
  let conn;
  try {
    conn = await db.getConnection();
    const [allItemsCheckedOut] = await conn.query(`
    SELECT cart.order_id,cart.quantity,cart.price,size,prod.image,prod.productname,CONCAT_WS(' ',inf.fname,inf.mname,inf.lname) AS fullname, inf.phone, CONCAT_WS(', ', addr.sitio,addr.baranggay,addr.city,addr.province) AS address
    FROM product_cart AS cart
    LEFT OUTER JOIN products AS prod ON prod.id = cart.product_id
    LEFT OUTER JOIN user_info AS inf ON inf.user_id = cart.user_id
    LEFT OUTER JOIN user_address AS addr ON addr.user_id = inf.user_id
    WHERE cart.status = 2
    `);
    if(allItemsCheckedOut.length <= 0){
      return res.status(404).json({
        msg:'Empty Items Checked Out!!'
      });
    }
    return res.status(200).json({
      allItemsCheckedOut:allItemsCheckedOut
    });
  } catch (error) {
    console.log(error);
  }finally{
    if(conn){
      conn.release()
    }
  }
}
const getAllItemsProccessed = async (req,res)=>{
  let conn;
  try {
    conn = await db.getConnection();
    const [allItemsProccessed] = await conn.query(`
    SELECT cart.order_id,cart.quantity,cart.price,size,prod.image,prod.productname,CONCAT_WS(' ',inf.fname,inf.mname,inf.lname) AS fullname, inf.phone, CONCAT_WS(', ', addr.sitio,addr.baranggay,addr.city,addr.province) AS address
    FROM product_cart AS cart
    LEFT OUTER JOIN products AS prod ON prod.id = cart.product_id
    LEFT OUTER JOIN user_info AS inf ON inf.user_id = cart.user_id
    LEFT OUTER JOIN user_address AS addr ON addr.user_id = inf.user_id
    WHERE cart.status = 2
    `);
    if(allItemsProccessed.length <= 0){
      return res.status(404).json({
        msg:'Empty Items Proccessed!!'
      });
    }
    return res.status(200).json({
      allItemsProccessed:allItemsProccessed
    });
  } catch (error) {
    console.log(error);
  }finally{
    if(conn){
      conn.release()
    }
  }
}
const getAllItemsShipped = async (req,res)=>{
  let conn;
  try {
    conn = await db.getConnection();
    const [allItemsShipped] = await conn.query(`
    SELECT cart.order_id,cart.quantity,cart.price,size,prod.image,prod.productname,CONCAT_WS(' ',inf.fname,inf.mname,inf.lname) AS fullname, inf.phone, CONCAT_WS(', ', addr.sitio,addr.baranggay,addr.city,addr.province) AS address
    FROM product_cart AS cart
    LEFT OUTER JOIN products AS prod ON prod.id = cart.product_id
    LEFT OUTER JOIN user_info AS inf ON inf.user_id = cart.user_id
    LEFT OUTER JOIN user_address AS addr ON addr.user_id = inf.user_id
    WHERE cart.status = 2
    `);
    if(allItemsShipped.length <= 0){
      return res.status(404).json({
        msg:'Empty Items Shipped!!'
      });
    }
    return res.status(200).json({
      allItemsShipped:allItemsShipped
    });
  } catch (error) {
    console.log(error);
  }finally{
    if(conn){
      conn.release()
    }
  }
}
const itemProcess = async (req,res)=>{
  let conn;
  try {
    conn = await db.getConnection();
    const {order_id} = req.body;
    const itemProcess = await conn.query(`UPDATE product_cart SET status = 3 WHERE order_id = ?`,[order_id]);
    if(!itemProcess){
      return res.status(404).json({
        msg:'Item Not Found'
      });
    }
    return res.status(200).json({
      msg:'Item Has been Proccess!!'
    });
  } catch (error) {
    console.log(error);
  }finally{
    if(conn){
      conn.release();
    }
  }
}
const itemShipped = async (req,res)=>{
  let conn;
  try {
    conn = await db.getConnection();
    const {order_id} = req.body;
    const itemShipped = await conn.query(`UPDATE product_cart SET status = 4 WHERE order_id = ?`,[order_id]);
    if(!itemShipped){
      return res.status(404).json({
        msg:'Item Not Found'
      });
    }
    return res.status(200).json({
      msg:'Item Has been Proccess!!'
    });
  } catch (error) {
    console.log(error);
  }finally{
    if(conn){
      conn.release();
    }
  }
}
const riderRegistration = async(req,res)=>{
  let conn;
  try {
    conn = await db.getConnection();
    const {username,password,sitio,baranggay,city,province,zipcode,fname,lname,mname,email,phone} = req.body;
    const {image} = req.files;
    const [res] = await conn.query('SELECT username FROM users WHERE username = ?',[
      username
    ]);
    if(res.length > 0){
      return res.status(401).json({
        msg:'username is already Exist!!'
      });
    }
    const hashedPass = await bcrypt.hash(password,10);
    const res2 = await conn.query(`INSERT INTO users(username,password,role,status,created)VALUES(?,?,1,'new',now())`,[
      username,hashedPass
    ]);
    if(!res2){
      return res.status(400).json({
        msg:'ERROR REGISTRATION'
      })
    }
    await conn.query('INSERT INTO address(user_id,sitio,baranggay,city,province,zipcode,status,created)VALUES(?,?,?,?,?,?,1,now())',[
      res2[0].insertId,sitio,baranggay,city,province,zipcode
    ]);
    await conn.query('INSERT INTO user_info(user_id,fname,lname,mname,email,phone,status,created)VALUES(?,?,?,?,?,?,1,now())',[
      res2[0].insertId,fname,lname,mname,email,phone
    ])
    await conn.query('INSERT INTO user_profile (user_id,image,created)VALUES(?,?,now())',[
      res2[0].insertId,`images/${image[0].originalname}`
    ])
    return res.status(201).json({
      msg:'User is Registered'
    });
  } catch (error) {
    console.log(error)
  }finally{
    if(conn){
      conn.release();
    }
  }
}
module.exports = {
  insertProduct,
  getAllProductInserted,
  getProofOfDelivery,
  updateProof,
  getAllItemsDelivered,
  getAllItemsCheckedOut,
  getAllItemsProccessed,
  getAllItemsShipped,
  itemProcess,
  itemShipped,
  riderRegistration
}