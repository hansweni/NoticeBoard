const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const Notice = require('../models/noticeModel');
const User = require('../models/userModel');
const {signAccessToken} = require('../helpers/generateAccessToken')
const {verifyAccessToken} = require('../helpers/verifyAccessToken')
const jwt_decode = require("jwt-decode");
require('dotenv').config();

router.post('/login', async (req, res, next) => {
    try {
        const userid = req.body.UserId;
        const user = await User.findOne({UserId:userid});
        if(!user) throw createError.NotFound('Not A Registered User')
        if(user.Password !== req.body.Password) throw createError.Unauthorized('Either User Id or Password is Not Valid')
        const token = await signAccessToken(user.UserId);
        res.cookie("ACCESS_TOKEN" , token,{httpOnly:true, maxAge:600000});
        res.status(200).send({message : "Login Sucessfully"});
    } catch (error) {
        res.send(error)
    }
  
})


const multer =require('multer');
const upload =  multer({
    // dest : 'uploads',
    limits: {
        fileSize: 5000000 // 5 MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.endsWith('.pdf')) {
            return cb(new Error('Please upload an PDFs File Only'))
        }

        cb(undefined, true)
    }
})
// router.post('/upload', upload.single('upload'), (req, res) =>{
//     res.send("File uploaded")
// })
// router.post('/upload', upload.single('upload'), async (req, res) => {
//     req.Notice.NoticeFile = req.file.buffer
//     await req.Notice.save()
//     res.send("File Uploaded | Sucessfully ")
// }, (error, req, res, next) => {
//     res.status(400).send({ error: error.message })
// })
router.post('/upload', upload.single('upload') ,(req, res, next) =>{
    const querypram = req.query
    Notice.findOneAndUpdate({RefNo:querypram.RefNo},{
        $set:{
            NoticeFile: req.file.buffer
        }
    })
    .then(result =>{
        console.log('Updated Successfully');
        res.status(200).send({msg: "File added Sucessfully "});
    })
    .catch(err =>{
        console.log(err);
        res.status(500).send({msg : "Error"});
    })
    
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.get('/view', async (req, res) =>{
    try{
        const querypram = req.query
       const output = await Notice.findOne({RefNo : querypram.RefNo})
       if(!output){
        throw new Error()
       }
         res.set('Content-Type', 'application/pdf');
         res.send(output.NoticeFile)
    }catch(e){
        res.status(404).send("Not Found")
    }
})
// ----------------------------------------------------------------------------------

router.post('/notice',verifyAccessToken, async (req, res, next)=>{
    try {
        const notice = new  Notice({ 
            RefNo:req.body.RefNo,
            IssueDate: req.body.IssueDate,
            Subject: req.body.Subject,
            Tags: req.body.Tags,
            Body: req.body.Body,
            IssuerName: req.body.IssuerName,
            IssuerDesignation:req.body.IssuerDesignation,
            LastModifiedOn : req.body.LastModifiedOn,
            PostedBy: req.body.PostedBy
        })
        notice.save()
        .then(result =>{
            console.log("Saved sucessfully")
            res.status(200).send(req.body);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).send({msg : "Error"});
        })
    } catch (error) {
        res.send(error)
    }
} )
router.put('/notice', verifyAccessToken, (req, res, next) =>{
    const querypram = req.query
    Notice.findOneAndUpdate({RefNo:querypram.RefNo},{
        $set:{
            RefNo:req.body.RefNo,
            IssueDate: req.body.IssueDate,
            Subject: req.body.Subject,
            Tags: req.body.Tags,
            Body: req.body.Body,
            IssuerName: req.body.IssuerName,
            IssuerDesignation:req.body.IssuerDesignation,
            LastModifiedOn : req.body.LastModifiedOn, 
            PostedBy: req.body.PostedBy
        }
    })
    .then(result =>{
        console.log('Updated Successfully');
        res.status(200).send(req.body);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).send({msg : "Error"});
    })
    
})
router.delete('/notice', verifyAccessToken, (req, res, next) =>{
    const querypram = req.query
    Notice.findOneAndDelete({RefNo:querypram.RefNo})
    .then(result =>{
        if(result !== null){
            res.status(200).send({msg : 'Deleted Sucessfully'});
        }else{
            res.status(200).send({msg : "Error"});
        }
        
    })
    .catch(err =>{
        console.log(err);
        res.status(500).send({msg : "Error"});
    })
})
router.post('/addAdmin', verifyAccessToken, async (req, res, next) => {
    try {
        const cookies = req.cookies;
        const token = cookies.ACCESS_TOKEN
        var decoded = jwt_decode(token);
        if(decoded.aud !== process.env.SUPER_ADMIN) throw createError.Unauthorized();
        const user = new User({
            UserId : req.body.UserId,
            Password : req.body.Password,
            DSign : req.body.DSign
        })
        user.save()
        .then(result =>{
            res.status(200).send(req.body);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).send({msg : "Error"});
        })
    } catch (error) {
        res.send(error)
    }
  
})
module.exports = router