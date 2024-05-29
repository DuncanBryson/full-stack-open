import {useState} from "react"
import phonebook from "../services/phonebook"
import Persons from "./Persons"

const Form = ({persons, setPersons, setNotification}) => {
  const handleName = (event) => setNewName(event.target.value)
  const handleNumber = (event) => setNewNumber(event.target.value)
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
          setNotification(`${newName} successfully updated`)
          setPersons(persons.map(per => per.id !== id ? per:returnPerson ))
        })
        .catch(error => setNotification(`Error: ${newName} has been deleted`))
    }else if (!existingNames.includes(newName)){
      phonebook
        .create(newPerson)
        .then (returnObject => {
          setNotification(`${newName} successfully added`)
          setPersons(persons.concat(returnObject))})
    }
    setNewName('')
    setNewNumber('')
  }
  return (
    <form onSubmit={addName}>
      <div>
        <label htmlFor="name">Name</label>
        <input value={newName} onChange={handleName} id='name'/>
      </div>
      <div>
        <label htmlFor="number">Number</label>
        <input value={newNumber} onChange={handleNumber} id='number' />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}
export default Form