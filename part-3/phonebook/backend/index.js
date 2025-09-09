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


//<-- ROUTE HANDLERS -->

// //GET info
// app.get('/info', (request, response) => {
//     const numPeople = persons.length
//     const date = new Date()

//     response.send(`
//         <p>Phonebook has info for ${numPeople}</p>
//         <p>${date.toString()}</p>
//         `)
// }) 

//GET all persons
app.get('/api/phonebook', (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })
})

//GET a specific person
app.get('/api/phonebook/:id', (request, response, next) => { 
    Person.findById(request.params.id)
    .then(person =>{
        if(person){
            response.json(person)
        } else {
            return response.status(404).end()
        }
    })
    .catch(error => {
        next(error)
    })
})

//DELETE a specific person
app.delete('/api/phonebook/:id', (request, response, next) => {
    
    Person.findByIdAndDelete(request.params.id)
    .then(person => {
        if(!person){
            return response.status(404).json({error: 'contact does not exist!'})
        }
        else{
            response.status(204).end()
        }
    })
    .catch(error => {
        next(error)
    })
})

//POST a new person
app.post('/api/phonebook', (request, response, next) => {
    const body = request.body

    //Error handling: No name or no number
    if(!body.name || !body.number){
        return response.status(400).json({error: "Name or number cannot be empty"})
    }

    Person.findOne({name: body.name})
    .then(existingPerson =>{
        //Error handling: Name already exists
        if(existingPerson){
             return response.status(400).json({error: "Name already exists!"})
        }

        const person = new Person({
            name : body.name,
            number: body.number 
        })

        person.save()
        .then(returnedPerson => {
            response.json(returnedPerson)
        })
        .catch(error => {
            console.error('Error saving person:', error.message)
            next(error)
        })
    })
    .catch(error => {
        console.error('Error finding person:', error.message)
        next(error)
    })    
})

//PUT change number of an existing contact
app.put('/api/phonebook/:id', (request, response, next) => {
  
    Person.findByIdAndUpdate(request.params.id,
    {number: request.body.number},
    {new: true}
    )
    .then(returnedPerson => {
        if(returnedPerson){
            response.json(returnedPerson)
        } else{
            return response.status(404).send({error: "Person not found!"})
        }
    })
    .catch(error => {
        next(error)
    })
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
// handler of requests with unknown endpoint
app.use(unknownEndpoint)
  
  
const errorHandler = (error, request, response, next) => {
console.error(error.message)

if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
} 

next(error)
}

// handler of requests with results to errors
app.use(errorHandler)


//Create server
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})