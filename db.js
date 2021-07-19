const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const db = process.env.MONGO_URI
const connectDB = async (array) => {
    try {
      const conn = await mongoose.connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex:true
      })
      console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (err) {
      console.error(err)
      process.exit(1)
    }
  }
  
  module.exports = connectDB;