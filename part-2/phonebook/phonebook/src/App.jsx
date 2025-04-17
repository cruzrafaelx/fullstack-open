import { useState, useEffect } from 'react'
import Filter from "./Components/Filter"
import Form from "./Components/Form"
import Persons from "./Components/Persons"
import './App.css'

function App() {

    const [persons, setPersons] = useState([
      { name: 'Arto Hellas', number: '040-123456', id: 1 },
      { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
      { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
      { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
    ]) 

    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [newFilter, setNewFilter] = useState('')
    const [newFilteredList, setNewFilteredList] = useState([])

    const handleNameChange = (event) => {
      setNewName(event.target.value)
      console.log(event.target.value)
    }

    const handleNumberChange = (event) => {
      setNewNumber(event.target.value)
      console.log(event.target.value)
    }

    const handleFilterChange = (event) => {
      const filterValue = event.target.value
      setNewFilter(filterValue)
      console.log(filterValue)
      setNewFilteredList(filterNames(filterValue))
    }

    //Asynchronous log of persons array
    useEffect(() => {
      console.log(persons)
    }, [persons])

    const filterNames = (value) => {
      const filteredList = persons.filter(person => person.name.toLowerCase().includes(value))
      return filteredList
    }

    const handleSubmit = (event) => {
      event.preventDefault()
      
      if(persons.some(person => person.name === newName)){
        alert(`${newName} is already added to the phonebook`)
      } 

      else if(newName === '' || newNumber === ''){
        alert('No field can be left empty!')
      }
      
      else{
        const newPerson = [...persons, {name: newName, number: newNumber}]
        setPersons(newPerson)
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
