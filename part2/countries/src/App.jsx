import { useState, useEffect } from 'react'
import axios from 'axios'
import ShowCountries from './components/ShowCountries'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [countries, setCountries] = useState(null)
  const [filteredCountries, setFilteredCountries] = useState([])

  const handleSearch = (query) => {setSearchQuery(query.target.value)}

  useEffect(() => {
    axios.get("https://studies.cs.helsinki.fi/restcountries/api/all")
    .then(response => setCountries(response.data))
  }, [])
 
  useEffect(() =>{
    const compare = (name) => (
      JSON.stringify(name)
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    )
    if(countries){
      setFilteredCountries(countries.filter(country =>(
        compare(country.name.official) || compare(country.name.common)
      )))
  }}, [countries, searchQuery])
  return (
    <>
      <label htmlFor="search">Find Countries:</label>
      <input type="text" id='search' value={searchQuery} onChange={handleSearch}/>
      <ShowCountries 
      countries={countries}
      filteredCountries={filteredCountries}
      />
    </>
  )
}

export default App
