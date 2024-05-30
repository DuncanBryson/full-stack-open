import axios from "axios";
import { useEffect, useState } from "react";
const api_key = import.meta.env.VITE_API_KEY

const Weather = ({capital, cca3}) => {
  const [weatherResult,setWeatherResult] = useState(null)

  useEffect(() =>{
    if(!capital) return null
    const params = {
      q : `${capital},${cca3}`,
      units : "metric",
      appid : api_key
    }
    axios.get("https://api.openweathermap.org/data/2.5/weather?",{params})
    .then(result => setWeatherResult(result.data)
  )}, [capital])



  if(weatherResult){
    return(
    <>
      <h3>Weather in {capital}</h3>
      <p>Temperature is {weatherResult.main.temp} ºC</p>
      <img src={`https://openweathermap.org/img/wn/${weatherResult.weather[0].icon}@2x.png`} alt="Weather Icon"/>
      <p>Wind is {weatherResult.wind.speed} m/s</p>
    </>
  )}
  else return null
}

export default Weather