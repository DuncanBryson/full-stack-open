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
      <Form 
      persons={persons}
      setPersons={setPersons}
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