import { useState, useEffect } from 'react'
import axios from 'axios'


function App() {
  
  const [countries, setCountries] = useState(null)
  const [value, setValue] = useState("Type a country...")

  useEffect(()=>{
    axios
    .get('https://studies.cs.helsinki.fi/restcountries/api/all')
    .then(res => {
      setCountries(res.data)
    })
  }, [])

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log(value)
  }
  

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <p>find countries</p>
        <input value={value} onChange={handleChange}></input>
        <button type='submit'>Submit</button>
      </form>
    </div>
  )
}

export default App
