const mongoose = require('mongoose')

const UserModel = new mongoose.Schema({
    UserId: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    Password: {
      type: String,
      required: true,
    },
    DSign: {
        type: String,
      }
  })

const User = mongoose.model('user', UserModel)
module.exports = User