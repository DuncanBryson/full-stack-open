require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

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
  Person.find({}).then(phonebook=>{
    res.send(`
    <p>Phonebook has info for ${phonebook.length} people</p>
    <p>${new Date}</p>
  `)
  })

})

app.get('/api/phonebook/:id', (req,res, next) => {
  Person.findById(req.params.id).then(person =>{
    res.json(person)
  })
    .catch(err => next(err))
})

app.delete('/api/phonebook/:id', (req,res,next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(res.status(204).end())
    .catch(error => next(error))
})


app.post('/api/phonebook', (req,res,next) => {
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
          .catch(err => next(err))
      }
    })
    .catch(err=>next(err))
  
})

app.put('/api/phonebook/:id',(req,res,next) => {
  const { name, number } = req.body
  Person.findByIdAndUpdate(req.params.id,
    {name, number},
    {new: true, runValidators: true, context: 'query'})
    .then(updatedPerson =>{
      res.json(updatedPerson)
    })
    .catch(err => next(err))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const errorHandler = (err, req, res, next) => {
  console.error(err.message)

  if(err.name === 'CastError') {
    return res.status(400).send({error: 'Malformatted ID'})
  }else if (err.name === 'ValidationError'){
    return res.status(400).send({error: err.message})
  }

  next(err)
}

app.use(errorHandler)