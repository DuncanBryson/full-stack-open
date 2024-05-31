const express = require('express')
const app = express()
app.use(express.json())


let persons = [
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

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req,res) => {
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date}</p>
  `)
})

app.get('/api/persons/:id', (req,res) => {
  const id = Number(req.params.id)
  const person = persons.find(p =>p.id === id)
  if(person) res.json(person)
  else res.status(404).end()
})

app.delete('/api/persons/:id', (req,res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p=> p.id !==id)
  res.status(204).end()
})

app.post('/api/persons', (req,res) => {
  const content = req.body
  if(!content.name || !content.number) {
    res.status(400).json({
      error: "Missing name or number"
    })
  } else if (persons.find(p => p.name ===content.name)){
    res.status(400).json({
      error: "Name is not unique"
    })
  }else {
    const person =({
      name: content.name,
      number: content.number,
      id: makeID()
    })
    persons.push(person)
    res.json(person)
  }
  
})

const makeID = () => {
  let id = Math.floor(Math.random()*10000)
  if(persons.find(p => p.id === id)){
    return makeID()
  } else return id
}

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})