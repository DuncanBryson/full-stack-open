import React from "react"

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

export default Persons