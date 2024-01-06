require("dotenv").config();

const db = require("../config/dbConnection");
const bcrypt = require('bcryptjs');
const { json } = require("express");
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

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
                prod.original_stocks,
                prod.updated_stocks,
                prod.price,
                prod.status,
                prod.is_deleted,
                CAST(AVG(rating.stars) AS FLOAT) AS ratings
            FROM
                products AS prod
            LEFT OUTER JOIN
                product_ratings AS rating ON rating.product_id = prod.id
            GROUP BY
                prod.id,
                prod.image,
                prod.productname,
                prod.productdesc,
                prod.original_stocks,
                prod.updated_stocks,
                prod.price,
                prod.status,
                prod.is_deleted
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
const denyRiderApplicant = async(req,res)=>{
  let conn;
  try {
    const {email} = req.body;
    conn = await db.getConnection();
    const deny = await conn.query(`UPDATE rider_applicant SET status = 3 WHERE email = ?`,[email]);
    if(!deny){
      return res.status(404).json({
        msg:'Email not Found'
      })
    }
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Rider Application Denied",
      text: `To Hello ${email}, Your Application is Denied due to some Reasons Thanks for the try`,
    };

    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
    return res.status(200).json({
      msg:'Application has been Denied'
    })
  } catch (error) {
    console.log(error);
  }finally{
    if(conn){
      conn.release();
    }
  }
}
const acceptRiderApplicant = async(req,res)=>{
  let conn;
  try {
    const {email} = req.body;
    conn = await db.getConnection();
    const accept = await conn.query(`UPDATE rider_applicant SET status = 2 WHERE email = ?`,[email]);

    if(!accept){
      return res.status(404).json({
        msg:'Email not Found'
      });
    }
    const token = jwt.sign(
      {
        email: req.body.email,
      },
      process.env.ACCEPT_TOKEN, // Your JWT secret key
      { expiresIn: "24h" } // Set the expiration time (e.g., 1 hour)
    );
    const registrationlink = `${process.env.ORIGIN_HOST}/RegistrationsRider/${token}`;

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Rider Application Accepted",
      text: `To Hello ${email}, You are Accepted As our Rider Please click the following link to Register: ${registrationlink}`,
    };

    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
    return res.status(200).json({
      msg:'Rider Accepted'
    })
  } catch (error) {
   console.log(error) 
  }
}

const getAllRidersApplicant = async (req,res)=>{
  let conn;
  try{
    conn = await db.getConnection();
    const [applicants] = await conn.query(`SELECT * FROM rider_applicant WHERE status = 1`);
    return res.status(200).json({
      applicants:applicants
    })
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
    SELECT pc.*,
       CONCAT_WS(', ', addr.sitio, addr.baranggay, addr.city, addr.province) AS address, addr.zipcode, CONCAT_WS(' ',info.fname,info.mname,info.lname) AS fullname, info.phone
        FROM product_checkout AS pc 
        LEFT OUTER JOIN user_address AS addr ON addr.user_id = pc.user_id 
        LEFT OUTER JOIN user_info AS info ON info.user_id = pc.user_id
        WHERE pc.status = 2
    `);
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
const pendingOrders = async (req,res)=>{
  let conn;
  try {
    conn = await db.getConnection();
    const [allItemsProccessed] = await conn.query(`
    SELECT pc.*,
       CONCAT_WS(', ', addr.sitio, addr.baranggay, addr.city, addr.province) AS address, addr.zipcode, CONCAT_WS(' ',info.fname,info.mname,info.lname) AS fullname, info.phone
        FROM product_checkout AS pc 
        LEFT OUTER JOIN user_address AS addr ON addr.user_id = pc.user_id 
        LEFT OUTER JOIN user_info AS info ON info.user_id = pc.user_id
        WHERE pc.status = 1
    `);
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
    SELECT pc.*,
       CONCAT_WS(', ', addr.sitio, addr.baranggay, addr.city, addr.province) AS address, addr.zipcode, CONCAT_WS(' ',info.fname,info.mname,info.lname) AS fullname, info.phone
        FROM product_checkout AS pc 
        LEFT OUTER JOIN user_address AS addr ON addr.user_id = pc.user_id 
        LEFT OUTER JOIN user_info AS info ON info.user_id = pc.user_id
        WHERE pc.status = 3
    `);
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
    const itemProcess = await conn.query(`UPDATE product_checkout SET status = 2 WHERE order_id = ?`,[order_id]);
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
    const itemShipped = await conn.query(`UPDATE product_checkout SET status = 3 WHERE order_id = ?`,[order_id]);
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
const allSales = async(req,res)=>{
  let conn;
  try {
    conn = await db.getConnection();
    const [allsales] = await conn.query(`SELECT SUM(totalPrice) AS total FROM product_checkout WHERE status = 6`);
    const [countApplicants] = await conn.query(`SELECT COUNT(id) AS applicants FROM rider_applicant WHERE status = 1`);
    const [allProductName] = await conn.query(`SELECT id,productname FROM products`);
    const [products] = await conn.query(`SELECT c.product_id,c.quantity,c.price,c.updated,p.productname
    FROM product_cart AS c 
    LEFT OUTER JOIN products AS p ON p.id = c.product_id
    WHERE c.status = 2`);
    let myProducts = []
    allProductName.forEach(namedata=>{
      products.forEach(thisdata=>{
        if(thisdata.product_id == namedata.id){
          myProducts.push({
            id:thisdata.product_id,
            quantity:thisdata.quantity,
            price:thisdata.price,
            productname:thisdata.productname,
            updated:thisdata.updated
          })
        }
        })
    })
    return res.status(200).json({
      allsales:allsales[0],
      countApplicants:countApplicants[0],
      allProductName:allProductName,
      products:myProducts
    })
  } catch (error) {
    console.log(error);
  }finally{
    if(conn){
      conn.release();
    }
  }
}
const deliveringItem = async(req,res)=>{
  let conn
  try {
    conn = await db.getConnection();
    const [response] = await conn.query(`
    SELECT c.id, c.order_id,p.products,p.totalPrice,p.status,
        CONCAT_WS(' ',rider.fname,rider.mname,rider.lname) AS ridername, 
        CONCAT_WS(' ',inf.fname,inf.mname,inf.lname) AS fullname, inf.phone, 
        CONCAT_WS(', ',addr.sitio,addr.baranggay,addr.city,addr.province, addr.zipcode) AS address
        FROM item_deliver AS c
        LEFT OUTER JOIN product_checkout AS p ON p.order_id = c.order_id
        LEFT OUTER JOIN user_info AS rider ON rider.user_id = c.user_id
        LEFT OUTER JOIN user_info AS inf ON inf.user_id = p.user_id
        LEFT OUTER JOIN user_address as addr ON addr.user_id = inf.user_id
        WHERE c.status = 1 AND p.status BETWEEN 4 AND 5
    `)
    return res.status(200).json({
      delivering:response
    })
  } catch (error) {
    console.log(error);
  }finally{
    if(conn){
      conn.release()
    }
  }
}
const addNewStocks = async(req,res)=>{
  let conn;
  try {
    conn = await db.getConnection();
    const {prod_id,addedStocks} = req.body;
    const [CuStocks] = await conn.query('SELECT * FROM products WHERE id = ?',[prod_id]);
    const updatedStocks = parseInt(CuStocks[0].updated_stocks)
    const new_stocks = updatedStocks + addedStocks;
    if(parseInt(CuStocks[0].original_stocks) < parseInt(new_stocks)){
      await conn.query('UPDATE products SET original_stocks = ?, updated_stocks = ?, updated = now() WHERE id = ?',[
        new_stocks,new_stocks,prod_id
      ])
      return res.status(200).json({
        msg:'Stocks Updated'
      })
    }else{
      await conn.query('UPDATE products SET updated_stocks = ?, updated = now() WHERE id = ?',[
        new_stocks,prod_id
      ]);
      return res.status(200).json({
        msg:'Stocks Updated'
      })
    }
  } catch (error) {
    console.log(error);
  }finally{
    if(conn){
      conn.release
    }
  }
}
const unavailableStock = async(req,res)=>{
  let conn;
  try {
    conn = await db.getConnection();
    const {prod_id} = req.body;
    const response = await conn.query('UPDATE products SET status = 2 WHERE id = ?',[prod_id]);
    if(!response){
      return res.status(404).json({
        msg:'error Setting status'
      })
    }
    return res.status(200).json({
      msg:'Successfully updated'
    })
  } catch (error) {
    console.log(error);
  }finally{
    if(conn){
      conn.release()
    }
  }
}
const ProductSoldHistory = async(req,res)=>{
  let conn;
  try {
    conn = await db.getConnection();
    const [products] = await conn.query(`
    SELECT c.id,c.order_id,c.proof,p.products,p.totalPrice,p.status,
        CONCAT_WS(' ',rider.fname,rider.mname,rider.lname) AS ridername,
        CONCAT_WS(' ',inf.fname,inf.mname,inf.lname) AS fullname, inf.phone, 
        CONCAT_WS(', ',addr.sitio,addr.baranggay,addr.city,addr.province, addr.zipcode) AS address
        FROM item_deliver AS c
        LEFT OUTER JOIN product_checkout AS p ON p.order_id = c.order_id
        LEFT OUTER JOIN user_info AS rider ON rider.user_id = c.user_id
        LEFT OUTER JOIN user_info AS inf ON inf.user_id = p.user_id
        LEFT OUTER JOIN user_address as addr ON addr.user_id = inf.user_id
        WHERE c.status = 2 AND p.status = 6
    `);
    return res.status(200).json({
      products:products
    })
  } catch (error) {
    console.log(error);
  }finally{
    if(conn){
      conn.release();
    }
  }
}
const getAllRiders = async(req,res)=>{
  let conn;
  try {
    conn = await db.getConnection();
    const [riders] = await conn.query(`
    SELECT u.id,u.username,
    CONCAT_WS(' ', inf.fname,inf.mname,inf.lname) AS fullname,inf.email, inf.phone,
    CONCAT_WS(', ',addr.sitio,addr.baranggay,addr.city,addr.province,addr.zipcode) AS address,
    r.role_name AS role
    FROM users AS u
    LEFT OUTER JOIN user_info AS inf ON inf.user_id = u.id
    LEFT OUTER JOIN user_address AS addr ON addr.user_id = u.id
    LEFT OUTER JOIN roles AS r ON r.role_id = u.role
    WHERE u.role = 2
    `);
    return res.status(200).json({
      riders:riders
    })
  } catch (error) {
    console.log(error);
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
  riderRegistration,
  pendingOrders,
  getAllRidersApplicant,
  acceptRiderApplicant,
  denyRiderApplicant,
  deliveringItem,
  ProductSoldHistory,
  addNewStocks,
  allSales,
  unavailableStock,
  getAllRiders
}