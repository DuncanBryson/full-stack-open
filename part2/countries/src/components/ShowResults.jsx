import React from "react"
import ShowCountry from "./ShowCountry"

const ShowResults = ({filteredCountries, countries}) => {
  const results = filteredCountries.length
  if(results >1 && results <=10) return(
      filteredCountries.map(c => {
        return (<p key={c.ccn3}>{c.name.common}</p>)
      })
   
  ) 
  if (results >10) return (
    <p>Too many results, please specify</p>
  )
  if (countries === null ) return (
    <p>Fetching data, please wait</p>
  )
  if (results === 0) return (
    <p>Please broaden your search</p>
  )
  if (results === 1) return(
    ShowCountry(filteredCountries[0])
  )

}
export default ShowResults