import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: "040-1234567"}
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const addName = (event) => {
    event.preventDefault()
    const names = persons.map((person) => person.name)
    if (names.includes(newName)){
      alert(`${newName} has already been entered`)
    }else setPersons(persons.concat({
      name: newName,
      number: newNumber
    }))
    setNewName('')
    setNewNumber('')
  }
  const handleName = (event) => setNewName(event.target.value)
  const handleNumber = (event) => setNewNumber(event.target.value)

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addName}>
        <div>
          <label htmlFor="name">Name</label>
          <input value={newName} onChange={handleName} id='name'/>
        </div>
        <div>
          <label htmlFor="number">Number</label>
          <input value={newNumber} onChange={handleNumber} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map((person)=>
      <p key={person.name}>{person.name} {person.number}</p>
      )}
    </div>
  )
}

export default App