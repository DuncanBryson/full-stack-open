import React from "react"
import phonebook from "../services/phonebook"

const Persons = ({persons, filter, setPersons}) => {
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
  persons.map((person)=>{
    if(person.name.toLowerCase().includes(filter.toLowerCase()))
    return (
      <p key={person.name}>{person.name} {person.number}
      <button value={person.id} onClick={handleRemove}>Delete</button>
      </p>
    )
  })
  )
}

export default Persons