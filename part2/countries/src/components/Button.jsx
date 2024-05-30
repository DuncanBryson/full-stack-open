import React from "react";
import ShowCountry from "./ShowCountry";

const Button = ({country, setCountrySelected}) => {
  const handleClick = () => {
    setCountrySelected(country)
    ShowCountry(country)
}
  return (
    <button key={country.ccn3} onClick={handleClick}>Show</button>
  )
}

export default Button