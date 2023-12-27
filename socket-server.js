require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const db = require('./config/dbConnection.js');
const chatRouter = require('./routes/chatRoutes.js');
const app = express();
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
    cors:true,
    origins: [process.env.ORIGIN_HOST],
}); // Add this line
const cors = require('cors');



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const corsOptions = {
    origin: process.env.ORIGIN_HOST,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));



app.use(express.static('public'));
app.use('/api', chatRouter);
// app.use('/api/uploads', express.static('public'));

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';
    res.status(err.statusCode).json({
        message: err.message,
    });
});




// io.on('connection', async(socket) => {
//     let conn;
//     conn = await db.getConnection();
//     socket.on('join-room',async(data)=>{
//         socket.join(data.room_id);
//         const [joinedroom] = await conn.query('SELECT * FROM joinedroom WHERE users_id =? ',[data.users_id]);
//         if(joinedroom.length<1){
//             await conn.query('INSERT INTO joinedroom(users_id,room_id)VALUES(?,?)',[data.users_id,parseInt(data.room_id)])
//             const [myrooms] = await conn.query('SELECT * FROM rooms WHERE room_id =?',[data.room_id]);
//             console.log(`You joined room: ${data.room_id}`);
//             const [users] = await conn.query('SELECT id,username FROM users WHERE id =? ',[data.users_id]);
//         const [joinedrooms] = await conn.query('SELECT joinedroom.users_id,joinedroom.room_id,users.id,users.username FROM joinedroom LEFT JOIN users ON joinedroom.users_id = users.id');
//             const formdata = {
//                 users_id:users[0].id,
//                 username:users[0].username,
//                 userJoined:joinedrooms
//             }
//             const [room] = await conn.query('SELECT * FROM myrooms WHERE room_id =? AND users_id =?',[data.room_id,data.users_id])
//             if(room.length < 1){
//                 await conn.query('INSERT INTO myrooms(room_id,users_id,room_name)VALUES(?,?,?)',[data.room_id,data.users_id,myrooms[0].room_name])
//                 io.to(data.room_id).emit('user-joined',formdata)
//             }else{
//                 io.to(data.room_id).emit('user-joined',formdata)
//             }
//         }else{
//             const [myrooms] = await conn.query('SELECT * FROM rooms WHERE room_id =?',[data.room_id]);
//             console.log(`You joined room: ${data.room_id}`);
//             const [joinedrooms] = await conn.query('SELECT joinedroom.users_id,joinedroom.room_id,users.id,users.username FROM joinedroom LEFT JOIN users ON joinedroom.users_id = users.id',);
//             const [users] = await conn.query('SELECT id,username FROM users WHERE id =? ',[data.users_id]);
//             const formdata = {
//                 users_id:users[0].id,
//                 username:users[0].username,
//                 userJoined:joinedrooms
//             }
//             const [room] = await conn.query('SELECT * FROM myrooms WHERE room_id =? AND users_id =?',[data.room_id,data.users_id])
//             if(room.length <1){
//                 await conn.query('INSERT INTO myrooms(room_id,users_id,room_name)VALUES(?,?,?)',[data.room_id,data.users_id,myrooms[0].room_name])
//                 io.to(data.room_id).emit('user-joined',formdata)
//             }else{
//                 io.to(data.room_id).emit('user-joined',formdata)
//             }
//         }
//     })
//     socket.on('send-message', async(data) => {
//         await conn.query('INSERT INTO messages(users_id,room_id,message,created)VALUES(?,?,?,now())',[data.users_id,data.room_id,data.message])
//         const [response] = await conn.query('SELECT * FROM users WHERE id = ?',[data.users_id])
//         const formdata = {
//             profilepic:response[0].profilepic,
//             username:response[0].username,
//             users_id:data.users_id,
//             room_id:data.room_id,
//             message:data.message
//         }
//         io.to(data.room_id).emit('chat-message',formdata);
//     });

//     socket.on('disconnection', async(data) => {
//         await conn.query('DELETE FROM joinedroom WHERE users_id =?',[data.users_id]);
//         const [joinedrooms] = await conn.query('SELECT joinedroom.*,users.* FROM joinedroom LEFT JOIN users ON joinedroom.users_id = users.id');
//         const formdata ={
//             users_id:data.users_id,
//             username:data.username,
//             userJoined:joinedrooms
//         }
//         io.to(data.room_id).emit('user-disconnected',formdata)
//       });
// });

http.listen(process.env.CHAT_PORT, () => {
    console.log(`Server is running on port ${process.env.CHAT_PORT}`);
});