const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.json())
app.use(morgan('tiny'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateId = () => {
    const maxId = persons.length > 0 
                ? Math.max(...persons.map(p => Number(p.id)))
                : 0

    return maxId + 1
}

const newId = () => {
    return Math.floor(Math.random() * 100000)
}


app.get('/api/phonebook', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const numPeople = persons.length
    const date = new Date()

    response.send(`
        <p>Phonebook has info for ${numPeople}</p>
        <p>${date.toString()}</p>
        `)
}) 

app.get('/api/phonebook/:id', (request, response) => {

    const id = request.params.id
    const person = persons.find(p => p.id === id)

    if(person){
        response.json(person)
    } 

    else{
        response.statusMessage = "Person non existent"
        response.status(404).end()
    }
})

app.delete('/api/phonebook/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.end()
})

app.post('/api/phonebook', (request, response) => {
    const body = request.body
    console.log(body)

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
        const person = {
            id : generateId(),
            name : body.name,
            number: body.number 
        }

        persons.push(person)
        response.json(person)
    }
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})