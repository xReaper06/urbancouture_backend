require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const db = require('./config/dbConnection.js');
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


app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';
    res.status(err.statusCode).json({
        message: err.message,
    });
});




io.on('connection', async(socket) => {
    let conn;
    conn = await db.getConnection();
    socket.on('join-room',async(data)=>{
        socket.join(data.room_id);
    })
    socket.on('send-message', async(data) => {
        console.log(data)
        await conn.query('INSERT INTO message(room_id,user_id,admin_id,content,created)VALUES(?,?,1,?,now())',[data.room_id,data.user_id,data.context])
        const formdata = {
            room_id:data.room_id,
            user_id:data.user_id,
            context:data.context
        }
        io.to(data.room_id).emit('chat-message',formdata);
    });
});

http.listen(process.env.CHAT_PORT, () => {
    console.log(`Server is running on port ${process.env.CHAT_PORT}`);
});