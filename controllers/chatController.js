require("dotenv").config();

const db = require("../config/dbConnection");

const getMyRoom = async(req,res)=>{
    let conn;
    try {
        conn = await db.getConnection();
        const {id} = req.user;
        const [myRoom] = await conn.query('SELECT * FROM rooms WHERE user_id = ?',[id]);
        return res.status(200).json({
            myRoom:myRoom
        })
    } catch (error) {
        console.log(error);
    }finally{
        if(conn){
            conn.release();
        }
    }
}
const getAllRooms = async(req,res)=>{
    let conn;
    try {
        conn = await db.getConnection();
        const [myRooms] = await conn.query(`
        SELECT r.id,r.room_id,pr.image AS profile,
        CONCAT_WS(' ',inf.fname,inf.mname,inf.lname) AS fullname,u.status
        FROM rooms AS r
        LEFT OUTER JOIN user_profile AS pr ON pr.user_id = r.user_id
        LEFT OUTER JOIN user_info AS inf ON inf.user_id = r.user_id
        LEFT OUTER JOIN users AS u ON u.id = r.user_id
        `);
        return res.status(200).json({
            myRooms:myRooms
        })
    } catch (error) {
        console.log(error);
    }finally{
        if(conn){
            conn.release();
        }
    }
}
const getConvo = async(req,res)=>{
    let conn;
    try{
        conn = await db.getConnection();
        const {room_id} = req.body
        const [allConvo] = await conn.query('SELECT * FROM message WHERE room_id =?',[room_id]);
        return res.status(200).json({
            allConvo:allConvo
        })
    }catch(error){
        console.log(error);
    }finally{
        if(conn){
            conn.release();
        }
    }
}
module.exports={
    getMyRoom,
    getAllRooms,
    getConvo
}

