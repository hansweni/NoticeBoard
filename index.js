const express = require('express');
const cookieParser = require('cookie-parser');
require('./src/config/DatabaseConfig');
require('dotenv').config();
const path = require("path");
const logger = require("morgan");

//Rotues imports 
const notice = require('./src/routes/notices');
const admin = require('./src/routes/admin');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(logger("dev"));


// cors is added 
const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) // Use th

app.use('/api/notice',notice);
app.use('/api/admin',admin);

app.get("/",  (req, res)=> {
    app.use(express.static(path.resolve(__dirname,'client','build')))
   res.sendFile(path.resolve(__dirname,'client','build','index.html'))
});


const PORT = process.env.PORT || 5005;
app.listen(PORT,()=>{
    console.log(`Server is up on port ${PORT}`);
});