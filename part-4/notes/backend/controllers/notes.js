const notesRouter = require('express').Router()
const Note = require('../models/note')

// //GET, fetches the root directory
// notesRouter.get('/', (request, response) => {
//   response.send('<h1>Hello World!</h1>')
// })

//GET, fetches all the notes
notesRouter.get('/', (request, response, next) => {
  Note.find({})
    .then(notes => {
      response.json(notes)
    })
    .catch(error => {
      next(error)
    })
})

//GET, fetches a specific note using its id
notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
  response.status(200).json(note)
})

//POST, creates a new note
notesRouter.post('/', async (request, response) => {
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

  const savedNote = await note.save()
  response.status(201).json(savedNote)
})

//PUT, updates importance of a note
notesRouter.put('/:id', (request, response, next) => {

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
notesRouter.delete('/:id', async (request, response) => {

 await Note.findByIdAndDelete(request.params.id)
 response.status(204).end()
   
})

module.exports = notesRouter