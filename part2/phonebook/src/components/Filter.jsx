import React from "react"

const Filter = ({handleFilter, filter}) =>(
  <div>
  <label htmlFor="filter">Find: </label>
  <input value={filter} onChange={handleFilter} id='filter' />
</div>
)

export default Filter