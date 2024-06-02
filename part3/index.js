require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')
const { log } = require('console')


app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
// Provides helpful console logs for debugging
// Printing content not good practice but useful for this exercise
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content', {
    skip: (req) => req.method !== "POST"
}))
morgan.token('content', (req) => {

  return JSON.stringify(req.body)
})
app.use(morgan('tiny', {
  skip:(req) => req.method === "POST"
}))



app.get('/api/phonebook', (req, res) => {
  Person.find({}).then(phonebook =>{
    res.json(phonebook)
  })
})

app.get('/info', (req,res) => {
  res.send(`
    <p>Phonebook has info for ${Person.length} people</p>
    <p>${new Date}</p>
  `)
})

app.get('/api/phonebook/:id', (req,res) => {
  Person.findById(req.params.id).then(person =>{
    res.json(person)
  })
})

// still to update with mongo
app.delete('/api/phonebook/:id', (req,res) => {
  Person.findByIdAndDelete(req.params.id)
    .then(res.status(204).end())
    .catch(err  =>console.log(err))
})


app.post('/api/phonebook', (req,res) => {
  const content = req.body
  if(!content.name || !content.number) {
    res.status(400).json({
      error: "Missing name or number"
    })
  }
  Person.find({name: content.name})
    .then(per => {
      // check if person already entered
      if(per[0]){
        res.status(400).json({
          error: "Name is not unique"
        })
      } else{
        // save new person
        const person = new Person({
          name: content.name,
          number: content.number
        }) 
        person.save().then(savedPerson => {
          res.json(savedPerson)
        })
      }
    })
  
})
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})