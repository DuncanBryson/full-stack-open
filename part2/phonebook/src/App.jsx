import { useEffect, useState } from 'react'
import phonebook from './services/phonebook'

const Filter = ({handleFilter, filter}) =>(
  <div>
  <label htmlFor="filter">filter shown with</label>
  <input value={filter} onChange={handleFilter} id='filter' />
</div>
)

const Form = ({addName, newName, handleName, newNumber, handleNumber}) => (
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
)

const Persons = ({persons, filter, handleRemove}) => (
  persons.map((person)=>{
    if(person.name.toLowerCase().includes(filter.toLowerCase()))
    return (
      <p key={person.name}>{person.name} {person.number}
      <button value={person.id} onClick={handleRemove}>Delete</button>
      </p>
    )
  })
)

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
    const names = persons.map((person) => person.name)
    if (names.includes(newName)){
      alert(`${newName} has already been entered`)
    }else {
      phonebook
        .create({name:newName, number:newNumber})
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
    console.log(event.target.value)
    phonebook
      .remove(event.target.value)
      .then(id => setPersons(persons.filter(p => p.id !== id)))
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