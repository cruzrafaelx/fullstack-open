import { useState } from 'react'
import './App.css'

function App() {

    const [persons, setPersons] = useState([
      { name: 'Arto Hellas' }
    ]) 
    
    const [newName, setNewName] = useState('')

    const handleSubmit = (event) => {
      event.preventDefault()
      
      if(persons.some(person => person.name === newName)){
        alert("This name exists in the phone book already!")
      } 
      
      else{
        const newPerson = [...persons, {name: newName}]
        setPersons(newPerson)
        console.log(persons)
      }
    }

    const handleChange = (event) => {
      setNewName(event.target.value)
      console.log(event.target.value)
    }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={handleSubmit}>
        <div>
          name: <input onChange={handleChange} value={newName}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      ...
    </div>
  )
}

export default App
