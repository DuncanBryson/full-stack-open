const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content', {
    skip: (req) => req.method !== "POST"
}))
morgan.token('content', (req) => {

  return JSON.stringify(req.body)
})
app.use(morgan('tiny', {
  skip:(req) => req.method === "POST"
}))



let phonebook = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/phonebook', (req, res) => {
  res.json(phonebook)
})

app.get('/info', (req,res) => {
  res.send(`
    <p>Phonebook has info for ${phonebook.length} people</p>
    <p>${new Date}</p>
  `)
})

app.get('/api/phonebook/:id', (req,res) => {
  const id = Number(req.params.id)
  const person = phonebook.find(p =>p.id === id)
  if(person) res.json(person)
  else res.status(404).end()
})

app.delete('/api/phonebook/:id', (req,res) => {
  const id = Number(req.params.id)
  phonebook = phonebook.filter(p=> p.id !==id)
  res.status(204).end()
})

app.post('/api/phonebook', (req,res) => {
  const content = req.body
  if(!content.name || !content.number) {
    res.status(400).json({
      error: "Missing name or number"
    })
  } else if (phonebook.find(p => p.name ===content.name)){
    res.status(400).json({
      error: "Name is not unique"
    })
  }else {
    const person =({
      name: content.name,
      number: content.number,
      id: makeID()
    })
    phonebook.push(person)
    res.json(person)
  }
  
})

const makeID = () => {
  let id = Math.floor(Math.random()*10000)
  if(phonebook.find(p => p.id === id)){
    return makeID()
  } else return id
}

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})