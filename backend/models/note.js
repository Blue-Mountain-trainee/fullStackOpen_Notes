const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

// ネットワーク問題のローカルな回避策．いずれ削除予定
const dns = require('node:dns')
dns.setServers(['1.1.1.1'])

const url = process.env.MONGODB_URI

// console.log('connecting to', url)
mongoose.connect(url, { family: 4 })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Note', noteSchema)