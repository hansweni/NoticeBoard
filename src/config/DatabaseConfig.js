const mongoose = require('mongoose')
require('dotenv').config();

const URI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@project-noticeboard.7gr5hyw.mongodb.net/project-NoticeBoard?retryWrites=true&w=majority
DB_NAME = project-NoticeBoard`
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('connected to MongoDb Atlas.....')
  })
  .catch((err) => console.log(err.message))

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to Database')
})

mongoose.connection.on('error', (err) => {
  console.log(err.message)
})

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection is disconnected.')
})

process.on('SIGINT', async () => {
  await mongoose.connection.close()
  process.exit(0)
})