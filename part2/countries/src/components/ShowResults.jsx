import React, { useState } from "react"
import ShowCountry from "./ShowCountry"
import Button from "./Button"

const ShowResults = ({filteredCountries, countries, countrySelected, setCountrySelected}) => {
  const results = filteredCountries.length
  //country selected with button 
  if(countrySelected) return ShowCountry(countrySelected)
  //search has acceptable number of results
  if(results >1 && results <=10) return(
      filteredCountries.map(c => {
        return (
        <p key={c.cca2}>{c.name.common}
        <Button country={c}
        setCountrySelected={setCountrySelected}/>
        </p>
        )
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
  // only one resultm show detailed
  if (results === 1) return(
    ShowCountry(filteredCountries[0])
  )
  

}
export default ShowResults