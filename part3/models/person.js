const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then(res => {
    console.log('Connected to MongoDB')
  })
  .catch(err => {
    console.log("Error connecting to MongoDB", err.message)
  })

const personSchema = new mongoose.Schema({
  person: String,
  number: String,
})

// remove _v, ensure ID is string
personSchema.set('toJSON', {
  transform: ( ret => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret._v
  })
})

module.exports = mongoose.model('Person', personSchema)