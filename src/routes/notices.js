const express = require('express')
const router = express.Router();
const Notice = require('../models/noticeModel');

router.get('/', async (req, res) => {
    const querypram = req.query
    Notice.find().sort({IssueDate: querypram.order || -1}).limit(querypram.limit || 10)
    .then(result =>{
        res.status(200).json({
            Notices : result
        })
    })
    .catch(err =>{
        next(err)
    })
  
})
router.get('/AndTags', async (req, res) => {
    const querypram = req.query
    const tagsArray = querypram.Tags.split(" ");
    Notice.find({Tags:{$all :tagsArray}}).sort({IssueDate: querypram.order || -1}).limit(querypram.limit || 10)

    .then(result =>{
        res.status(200).json({
            Notices : result
        })
    })
    .catch(err =>{
        next(err)
    })
  
})
router.get('/OrTags', async (req, res) => {
    const querypram = req.query
    const tagsArray = querypram.Tags.split(" ");
    Notice.find({Tags:{$in :tagsArray}}).sort({IssueDate: querypram.order || -1}).limit(querypram.limit || 10)

    .then(result =>{
        res.status(200).json({
            Notices : result
        })
    })
    .catch(err =>{
        next(err)
    })
  
})
router.get('/Search', async (req, res) => {
    const querypram = req.query
    Notice.find({RefNo : querypram.RefNo}).sort({IssueDate: querypram.order || -1}).limit(querypram.limit || 10)

    .then(result =>{
        res.status(200).json({
            Notices : result
        })
    })
    .catch(err =>{
        next(err)
    })
  
})
module.exports = router