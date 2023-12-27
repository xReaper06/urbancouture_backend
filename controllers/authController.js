require("dotenv").config();

const bcrypt = require("bcrypt");
const db = require("../config/dbConnection");
const jwt = require("jsonwebtoken");

const userRegistration = async(req,res)=>{
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

const login = async(req,res)=>{
  let conn;
  try {
    conn = await db.getConnection();
    const {username ,password} = req.body;
    const [user] = await conn.query('SELECT id,username,password,role FROM users WHERE username = ?',[
      username
    ]);
    if(user.length <= 0){
      return res.status(401).json({
        msg:'This Username is not Registered'
      });
    }
    const hashedPass = user[0].password;

    const passMatch = await bcrypt.compare(password,hashedPass);

    if(!passMatch){
      return res.status(401).json({
        msg:'Password is Incorrect!!'
      });
    }
    const AccessToken = generateAccessToken(user);
    
    const RefreshToken = jwt.sign(
      {id:user[0].id},
      process.env.REFRESH_TOKEN,
      {expiresIn:"1d"}
    );

    await conn.query('INSERT INTO json_token(user_id,token,created)VALUES(?,?,now())',[
      user[0].id,RefreshToken
    ])
    await conn.query('UPDATE SET last_loggin = now(),status = 1 WHERE id = ?',[user[0].id]);

    return res.status(200).json({
      msg:'logged in successfully',
      accessToken:AccessToken,
      refreshToken:RefreshToken,
      user:{
        id:user[0].id,
        username:user[0].username,
        role:user[0].role
      }
    });

  } catch (error) {
    console.log(error);
  }finally{
    if(conn){
      conn.release();
    }
  }
}
const generateAccessToken = (user) => {
  return jwt.sign({ id: user[0].id }, process.env.ACCESS_TOKEN, {
    expiresIn: "30m",
  });
};
const Token = async (req,res)=>{
  let conn;
  try {
    conn = await db.getConnection();
    const {token} = req.body;

    const [refreshToken] = await conn.query('SELECT token FROM json_token WHERE token = ?',[
      token
    ]);
    if(refreshToken.length <= 0){
      return res.status(404).json({
        msg:'Token Not Found'
      });
    }
    const decodedId = jwt.verify(refreshToken[0].token,process.env.REFRESH_TOKEN);

    const [user] = await conn.query('SELECT id,username,role FROM users WHERE id = ?',[
      decodedId
    ]);
    if(user.length <=0){
      return res.status(404).json({
        msg:'User not Found!!'
      });
    }
    const AccessToken = generateAccessToken(user);

    return res.status(200).json({
      accessToken:AccessToken,
      user:{
        id:user[0].id,
        username:user[0].username,
        role:user[0].role
      }
    });
  } catch (error) {
    console.log(error);
  }finally{
    if(conn){
      conn.release();
    }
  }
}

const logout = async (req, res) => {
  let conn;
  try {
    conn = await db.getConnection();
    const { id } = req.user;
    const removeTokenResult = await conn.query(
      `DELETE FROM tokens WHERE user_id = ?;`,
      [id]
    );
    const updateLogin = await conn.query(
      `UPDATE users SET last_loggin = now(), status = 0 WHERE id = ?`,
      [id]
    );

    if (!removeTokenResult && !updateLogin) {
      return res.status(400).json({
        msg: "Error Logout",
      });
    }

    return res.status(200).json({
      msg: "Logout Successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Internal Server Error",
    });
  } finally {
    if (conn) {
      conn.release();
    }
  }
};


module.exports = {
  userRegistration,
  login,
  Token,
  logout
}