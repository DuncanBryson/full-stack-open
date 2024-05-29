import React from "react"

const Form = ({addName, newName, handleName, newNumber, handleNumber}) => (
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
export default Form