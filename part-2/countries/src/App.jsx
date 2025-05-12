import { useState, useEffect } from 'react'
import axios from 'axios'


function App() {
  
  const [countries, setCountries] = useState([])
  const [value, setValue] = useState("")
  const [countryFilter, setCountryFilter] = useState([])
  const [weather, setWeather] = useState([])
  
  

  useEffect(()=>{
    axios
    .get('https://studies.cs.helsinki.fi/restcountries/api/all')
    .then(res => {
      setCountries(res.data)
    })
  }, [])

  useEffect(()=>{
    if(countryFilter.length === 1){
      const apiKey = "0044f30bf7a7caeaa0381a43c2222d02"
      const lat = countryFilter[0].latlng[0]
      const long = countryFilter[0].latlng[1]
      axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}`)
      .then(res => setWeather(res.data))
      
    }
  }, [countryFilter])

  useEffect(()=>{
    console.log(weather)
  },[weather])



  const handleChange = (event) => {
    setValue(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  const handleShow = (country) => {
    setCountryFilter(country)
  }

  useEffect(()=>{
    filterCountry()
  }, [value])

  //Renders the country depending on the given conditions
  const displayCountry = () => {
    
    if(countryFilter.length > 0) {

      //Displays a caution if there are more than 10 countries found
      if(countryFilter.length >= 10){
        return <p>Please enter a more specific filter</p>
      }
      
      //Displays country names together with show button if  1 < country > 10
      else if(countryFilter.length > 1 && countryFilter.length < 10){
        return countryFilter.map(country => {
          return (
          <div>
            <p>{country.name.common}</p>
            <button onClick={()=>handleShow([country])}>Show more</button>
          </div>
          )
        })
      }
      
      //Displays country details if there is only 1 match
      else if(countryFilter.length === 1) {

        return (
          <div>
            <h1>{countryFilter[0].name.common}</h1>
            <p>Capital: {countryFilter[0].capital[0]}</p>
            <h2>Languages</h2>
            <ul>
              {Object.keys(countryFilter[0].languages).map(key => {
                return <li key={key}>{countryFilter[0].languages[key]}</li>
              })}
            </ul>
            <img src={countryFilter[0].flags.png} alt={`${countryFilter[0].name.common} flag`}/>  
            <h2>Weather in {countryFilter[0].name.common}</h2>
            <p>Temperature: {(weather && weather.main) && (weather.main.temp - 273.15).toFixed(2)} degrees celsius</p>
            <img src={(weather && weather.weather) && `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}></img>
            <p>{(weather && weather.weather) && weather.weather[0].description}</p>
            <p>Wind speed: {(weather && weather.wind) && weather.wind.speed} m/s</p>
          </div>
        )
      }
    }
    //Fix the temperature
    //Display the weather logo
    //Display wind speed
    return null
  }

  console.log(countryFilter)
  
  //Make a filter handler that filters all the countries depending on the value 
  const filterCountry = () =>{
    if(countries.length > 0){

      //Displays the name of the country if there is an exact match
      const exactMatch = countries.find(country => {
        const countryName = country.name.common
        return countryName.toLowerCase() === value.toLowerCase()
      })

      console.log("exact match: ", exactMatch)
      
      if(exactMatch){
        setCountryFilter([exactMatch]) 
      }
      
      else{
        const filteredCountries = countries.filter(country => {
          const countryName = country.name.common
          return countryName.toLowerCase().includes(value.toLowerCase())
        })  
        setCountryFilter(filteredCountries)
      }
    }
  }


  return (
    <div>
      <form>
        <p>find countries</p>
        <input value={value} onChange={handleChange}></input>
      </form>
      <div>
        {displayCountry()}
      </div>
    </div>
  )
}

export default App
