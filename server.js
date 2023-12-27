require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('./config/dbConnection.js');
const normalRouter = require('./routes/normalRoutes.js');
const app = express();

// Use bodyParser.urlencoded before bodyParser.json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

const corsOptions = {
    origin: process.env.ORIGIN_HOST, // Replace with your client app's URL
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
};

app.use(cors(corsOptions));

app.use('/api', normalRouter);
app.use('/api/images/', express.static('public'));

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
        message: err.message,
    });
});

app.listen(process.env.NORMAL_PORT, () => console.log(`Server is running on Port ${process.env.NORMAL_PORT}`));