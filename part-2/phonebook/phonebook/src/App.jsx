import { useState, useEffect } from 'react'
import phoneService from './services/phonebook'
import axios from 'axios'
import Filter from "./Components/Filter"
import Form from "./Components/Form"
import Persons from "./Components/Persons"
import './App.css'

function App() {

    const [persons, setPersons] = useState([]) 
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [newFilter, setNewFilter] = useState('')
    const [newFilteredList, setNewFilteredList] = useState([])

    //Display initial phonebook, will only render once
    useEffect(()=> {
      phoneService
      .getAll()
      .then(res => setNewFilteredList(res))
    }, [])
    
    //Fetch phonebook
    useEffect(() => {
      phoneService
      .getAll()
      .then(res => setPersons(res))
    }, [])

    //Handles name change
    const handleNameChange = (event) => {
      setNewName(event.target.value)
      console.log(event.target.value)
    }

    //Handles number change
    const handleNumberChange = (event) => {
      setNewNumber(event.target.value)
      console.log(event.target.value)
    }

    //Handles the filtration of the names
    const handleFilterChange = (event) => {
      const filterValue = event.target.value
      setNewFilter(filterValue)
      console.log(filterValue)
      setNewFilteredList(filterNames(filterValue))
    }
    
    //Function that returns a list of the filtered names depending on the parameter
    const filterNames = (value) => {
      const filteredList = persons.filter(person => person.name.toLowerCase().includes(value))
      return filteredList
    }

    //Handles submit event, sets the name and number input to empty. 
    const handleSubmit = (event) => {
      event.preventDefault()
      
      if(persons.some(person => person.name === newName)){
        alert(`${newName} is already added to the phonebook`)
      } 

      else if(newName === '' || newNumber === ''){
        alert('No field can be left empty!')
      }
      
      else{
        const newPerson = {name: newName, number: newNumber}
        phoneService
          .addNew(newPerson)
          .then(res => {
            console.log(res)
            setPersons([...persons, res])
          })
        setNewName('')
        setNewNumber('')
      }
    }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={newFilter} onChange={handleFilterChange}/>
      <Form onSubmit={handleSubmit} 
            onChangeName={handleNameChange} 
            onChangeNum={handleNumberChange}
            valueName={newName}
            valueNum={newNumber}/>
      <h2>Numbers</h2>
      <Persons filter={newFilteredList} />
    </div>
  )
}

export default App
