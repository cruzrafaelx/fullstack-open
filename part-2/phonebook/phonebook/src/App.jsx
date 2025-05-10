import { useState, useEffect } from 'react'
import phoneService from './services/phonebook'
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

    //Set and display initial phonebook 
    useEffect(() => {
      phoneService
      .getAll()
      .then(res =>  {
        setPersons(res)
        setNewFilteredList(res)
      })
    }, [])

    //Immediately adds the new person to the phonebook
    useEffect(()=> {
      setNewFilteredList(persons)
    }, [persons])

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

    //Handles deletion of a person
    const handleDelete = (id) => {
      if(window.confirm("Do you want to delete this person?")){
        phoneService.removePerson(id)
      }
      const modifiedPersons = persons.filter(n => n.id !== id)
      setPersons(modifiedPersons)
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
      const filteredList = persons.filter(person => person.name.toLowerCase().includes(value.toLowerCase()))
      return filteredList
    }

    //Handles submit event, sets the name and number input to empty. 
    const handleSubmit = (event) => {
      event.preventDefault()
      
      if(persons.some(person => person.name === newName)){
        if(window.confirm(`${newName} is already added to the phonebook, replace existing number?`)){
          
          //map over the persons array and filter out element that has newName
          const changedPerson = persons.filter(person => person.name === newName)
          
          //create a new object with the modified number for this element
          const changedData = {...changedPerson[0], number: newNumber}

          //use changeNum: submit the id and the new object
          const id = changedPerson[0].id
          phoneService
          .changeNum(id, changedData)

          //setPersons with the modified object
          const updatedPersons = persons.map(person => {
            
            if(person.id === id){
              return changedData
            }
            else{
              return person
            }
          })
          
          setPersons(updatedPersons)
        }
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
            valueNum={newNumber}
            />
      <h2>Numbers</h2>
      <Persons filter={newFilteredList}
               onDelete={handleDelete} />
    </div>
  )
}

export default App
