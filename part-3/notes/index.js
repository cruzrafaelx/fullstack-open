const express = require('express')
const app = express()
app.use(express.json())

let notes = [
    {
      id: "1",
      content: "HTML is easy",
      important: true
    },
    {
      id: "2",
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: "3",
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]

  //Function to generate a new Id based on the largest id. 
  const generateId = () => {
      const maxId = notes.length > 1 
                    ? Math.max(...notes.map(n => Number(n.id))) 
                    : 0

      return(maxId + 1)
  } 

  //GET, fetches the root directory
  app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
  //GET, fetches all the notes
  app.get('/api/notes', (request, response) => {
    response.json(notes)
    console.log(request.headers)
  })

  //GET, fetches a specific note using its id
  app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id
    const note = notes.find(note => note.id === id)
    if(note){
        response.json(note)
        console.log(request.headers)
    }
    else{
        response.statusMessage = "Id is non-existent"
        response.status(404).end()
    }
  })

  //DELETE, deletes a note
  app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id
    notes = notes.filter(note => note.id !== id)

    response.status(204).end()
  })

  //POST, creates a new note
  app.post('/api/notes', (request, response) => {
    const body = request.body
    
    //We check if there is a content, if not, return a 404
    if(!body.content){
      return response.status(404).json({
        error: 'content missing'
      })
    }

    //If there is a content, create a new note object, use the generateId function 
    const note = {
      content: body.content,
      important: body.important || false,
      id: generateId(),
    }
    
    //Concat the new note object to the existing notes array
    notes = notes.concat(note)

    //respond with the new note object using the json-parser method to the client
    response.json(note)
  })

  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })