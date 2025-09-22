require('dotenv').config();

const express       = require('express');
const app           = express();
const connectDB = require('./config/db');



const PORT = process.env.PORT;
connectDB()

app.listen(PORT, ()=>{
    console.log(`Listening on ${PORT}`)
})
