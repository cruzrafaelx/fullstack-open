require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

app.use(express.json())//json-parser
app.use(morgan('tiny'))//request logger
app.use(cors())//allows CORS
app.use(express.static('dist'))//show static content

//GET all persons
app.get('/api/phonebook', (request, response) => {
    Person.find({}).then(people => {
        people.forEach(p => console.log(p))
        response.json(people)
    })
    
})

//GET info
app.get('/info', (request, response) => {
    const numPeople = persons.length
    const date = new Date()

    response.send(`
        <p>Phonebook has info for ${numPeople}</p>
        <p>${date.toString()}</p>
        `)
}) 

//GET a specific person
app.get('/api/phonebook/:id', (request, response) => {
    const id = request.params.id
    Person.findById(id).then(person =>{
        response.json(person)
    })
})

//DELETE a specific person
app.delete('/api/phonebook/:id', (request, response) => {
    const id = request.params.id
    Person.findByIdAndDelete(id)
    .then(person => {
        if(!person){
            return response.status(404).json({error: 'contact does not exist!'})
        }
        else{
            console.log('Contact deleted!')
            response.json(204).end()
        }
    })
    .catch(error => {
        response.status(404).json({error: 'Invalid ID or deletion failed!'})
    })
})

//POST a new person
app.post('/api/phonebook', (request, response) => {
    const body = request.body

    //Error handling: No name or no number
    if(!body.name || !body.number){
        response.status(400).json(
            {error: "Name or number cannot be empty"}
        )
    }

    //Error handling: Name already exists
    else if(persons.some(person => body.name === person.name)){
        response.status(400).json(
            {error: "Name already exists!"}
        )
    }

    else {

        const person = new Person({
            name : body.name,
            number: body.number 
        })

        person.save().then(returnedPerson => {
            response.json(returnedPerson)
        })
    }
})

//PUT change number of an existing contact
app.put('/api/phonebook/:id', (request, response) => {
    const body = request.body
    const id = request.params.id

    Person.findByIdAndUpdate(id,
    {number: body.number},
    {new: true}
    )
    .then(returnedPerson => {
        response.json(returnedPerson)
    })
})

//Create server
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})