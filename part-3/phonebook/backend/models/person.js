
require('dotenv').config()
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('Connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log('Succesfully connected to MongoDB')
  })
  .catch(error => {
    console.log('Error connecting to mongo DB: ', error.message)
    process.exit(1)
  })


const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: function (num) {
        const regex = /^\d{2,3}-\d+$/
        return regex.test(num)
      },
      message: props => `${props.value} is not a valid number! Format must be 2-3 digits, hypen, then digits (e.g. 12-3456)`
    },
    required: true
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)