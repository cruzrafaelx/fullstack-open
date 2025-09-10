require('dotenv').config() //environment variables (PORT)
const express = require('express')
const cors = require('cors') //cors middleware
const Note = require('./models/note') //Note model
const app = express()

app.use(express.json()) //json parser middleware
app.use(cors()) //cross origin resource sharing middleware
app.use(express.static('dist')) //handles static files


//<-- ROUTE HANDLERS -->

//GET, fetches the root directory
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

//GET, fetches all the notes
app.get('/api/notes', (request, response, next) => {
  Note.find({})
    .then(notes => {
      response.json(notes)
    })
    .catch(error => {
      next(error)
    })
})

//GET, fetches a specific note using its id
app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if(note){
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

//POST, creates a new note
app.post('/api/notes', (request, response, next) => {
  const body = request.body

  //We check if there is a content, if not, return a 400 since the error is from the user (invalid request or malforemed)
  if(!body.content){
    return response.status(400).json({ error: 'content missing' })
  }

  //If there is a content, create a new note object using the Note model (constructor function)
  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => {
      next(error)
    })
})

//PUT, updates importance of a note
app.put('/api/notes/:id', (request, response, next) => {

  Note.findByIdAndUpdate(request.params.id,
    { important: request.body.important }, // set new value
    { new: true } // return updated document
  )
    .then(updatedNote => {
      if(!updatedNote){
        return response.status(404).json({ error: 'Note not found!' })
      } else {
        response.json(updatedNote)
      }
    })
    .catch(error => next(error))
})

//DELETE, deletes a note
app.delete('/api/notes/:id', (request, response, next) => {

  Note.findByIdAndDelete(request.params.id)
    .then(deletedNote => {
      if(!deletedNote){
        return response.status(404).json({ error: 'document not found!' })
      }
      else{
        response.status(204).end()
      }
    })
    .catch(error =>  {
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
  } else if(error.name === 'ValidationError'){
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// handler of requests with results to errors
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is running in port ${PORT}`)
} )