import { useEffect, useState } from 'react'
import phonebook from './services/phonebook'
import Filter from './components/Filter'
import Form from './components/Form'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [notification, setNotification] = useState("Loading Phonebook")
  
  useEffect(() => {
    phonebook
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
        setNotification("Phonebook Loaded")
      })
  },[])

  const [filter, setFilter] = useState('')
  const handleFilter = (event) => setFilter(event.target.value)
 

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification 
      notification={notification}
      setNotification={setNotification} 
      />
      <Filter handleFilter={handleFilter} filter = {filter} />
      <h2>Add New:</h2>
      <Form 
      persons={persons}
      setPersons={setPersons}
      setNotification={setNotification}
       />
      <h2>Numbers</h2>
      <Persons 
        persons={persons} 
        filter={filter}
        setPersons={setPersons}
        setNotification={setNotification}
      />
    </div>
  )
}

export default App