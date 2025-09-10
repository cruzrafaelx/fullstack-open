import { useState, useEffect } from 'react'
import phoneService from './services/phonebook'
import Filter from "./Components/Filter"
import Form from "./Components/Form"
import Persons from "./Components/Persons"
import Notification from "./Components/Notification"

function App() {

    const [persons, setPersons] = useState([]) 
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [newFilter, setNewFilter] = useState('')
    const [newFilteredList, setNewFilteredList] = useState([])
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    console.log(persons)

    //Set and display initial phonebook 
    useEffect(() => {
      phoneService
      .getAll()
      .then(res =>  {
        setPersons(res)
        setNewFilteredList(res)
      })
    }, [])

    //Immediately displays the new person to the phonebook
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
      
      //Replace number for an existing contact
      if(persons.some(person => person.name === newName)){

        //Confirm with user if delete 
        if(window.confirm(`${newName} is already added to the phonebook, replace existing number?`)){
          
          //Check if newNumber is not blank
          if(newNumber.length > 0){
            //map over the persons array and filter out element that has newName
          const changedPerson = persons.filter(person => person.name === newName)
          
          //create a new object with the modified number for this element
          const changedData = {...changedPerson[0], number: newNumber}
          

          //use changeNum: submit the id and the new object
          const id = String(changedPerson[0].id)
          console.log(id, typeof(id))
          phoneService
          .changeNum(id, changedData)
          .then(() =>{
            setSuccess(`${changedData.name}'s number was changed to ${changedData.number}`)
            setTimeout(() => {
              setSuccess(null)
            }, 3000)

            //setPersons with the modified object
            const updatedPersons = persons.map(person => person.id === id ? changedData : person)
            setPersons(updatedPersons)
            
          })
          .catch(error => {
            setError(`${changedData.name} has been deleted from the server`)
            setTimeout(()=>{
              setError(null)
            }, 3000)
          })
          
          }

          else{
            alert("Number cannot be left blank!")
          }
          
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
            setSuccess(`${newPerson.name} has been added`)
            setTimeout(()=>{
              setSuccess(null)
            }, 3000)
          })
          .catch(error => {
           setError(error.response.data.error)
           setTimeout(()=>{
              setError(null)
           }, 10000)
          })
        setNewName('')
        setNewNumber('')
      }
    }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification error={error} success={success}/>
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
