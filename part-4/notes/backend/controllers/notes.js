const jwt = require('jsonwebtoken')
const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')



//GET, fetches all the notes
notesRouter.get('/', async ( request, response ) => {
  const notes = await Note
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(notes)
})

//GET, fetches a specific note using its id
notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
  response.status(200).json(note)
})

//Get token
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')){
    return authorization.replace('Bearer ', '')
  }
}

//POST, creates a new note
notesRouter.post('/', async (request, response) => {
  const body = request.body

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if(!decodedToken.id){
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(body.userId)

  console.log(user)
  //We check if there is a content, if not, return a 400 since the error is from the user (invalid request or malforemed)
  if(!user){
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  else if(!body.content){
    return response.status(400).json({ error: 'content missing' })
  }

  //If there is a content, create a new note object using the Note model (constructor function)
  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user._id
  })

  const savedNote = await note.save()

  //Save the newly created note's id to the notes field of the user and save it to users collection
  user.notes = user.notes.concat(savedNote._id)

  await user.save()
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