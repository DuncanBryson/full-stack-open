import { useEffect, useState } from 'react'
import phonebook from './services/phonebook'
import Filter from './components/Filter'
import Form from './components/Form'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  useEffect(() => {
    phonebook
      .getAll()
      .then(initialPersons =>setPersons(initialPersons))
  },[])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const addName = (event) => {
    event.preventDefault()
    const existingNames = persons.map((person) => person.name)
    const newPerson = {name: newName, number: newNumber}
    if (existingNames.includes(newName) && window.confirm(
      `${newName} is already in your phonebook. Update their number?`
    )){
      const id = persons.find(p => p.name === newName).id
      phonebook
        .update(id, newPerson)
        .then(returnPerson => {
          setPersons(persons.map(per => per.id !== id ? per:returnPerson ))
        })
    }else if (!existingNames.includes(newName)){
      phonebook
        .create(newPerson)
        .then (returnObject => setPersons(persons.concat(returnObject)))
    }
    setNewName('')
    setNewNumber('')
  }
  const handleName = (event) => setNewName(event.target.value)
  const handleNumber = (event) => setNewNumber(event.target.value)
  
  const [filter, setFilter] = useState('')
  const handleFilter = (event) => setFilter(event.target.value)
  const handleRemove = event => {
    const target = event.target.value
    if(window.confirm(
      `Delete ${persons.find(p=>p.id === target).name}?`
    )){
    phonebook
      .remove(target)
      .then(id => setPersons(persons.filter(p => p.id !== id)))}
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter handleFilter={handleFilter} filter = {filter} />
      <h2>Add New:</h2>
      <Form addName={addName}
        newName={newName}
        handleName={handleName}
        newNumber={newNumber}
        handleNumber={handleNumber}
      />
      <h2>Numbers</h2>
      <Persons 
        persons={persons} 
        filter={filter}
        handleRemove={handleRemove}
      />
    </div>
  )
}

export default App