const mongoose = require('mongoose')

const NoticeModel = new mongoose.Schema({
    RefNo:{
      type: String,
      required: true,
      unique: true,
    }, 
    IssueDate: {
      type: Date,
      required: true,
    },
    Subject: {
      type: String,
      required: true,
    },
    Tags: {
        type: Array,
      },
    Body : {
        type: String,
        required :true
    },
    IssuerName :{
        type : String,
        required: true
    },
    IssuerDesignation :{
        type : String,
        required : true
    },
    LastModifiedOn :{
        type : String,
        required : true
    },
    PostedBy : {
        type : String,
        required : true
    }, 
    NoticeFile: {
      type: Buffer
  }
  })

const Notices = mongoose.model('notices', NoticeModel)
module.exports = Notices