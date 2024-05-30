import React from "react"
const ShowCountry = (country) => (
  <>
  <h1>{country.name.common}</h1>
  <p>Capital: {country.capital}</p>
  <p>Area: {country.area} square km</p>
  <h3>Languages</h3>
  <ul>
  {Object.values(country.languages).map(lang =>{
    return <li key={lang}>{lang}</li>
  })}
  </ul>
  <img src={country.flags.png} alt={country.flags.alt}/>
  </>
)

export default ShowCountry