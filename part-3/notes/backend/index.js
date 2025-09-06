require('dotenv').config() //environment variables (PORT)
const express = require('express')
const cors = require('cors') //cors middleware
const Note = require('./models/note') //Note model
const app = express()

app.use(express.json()) //json parser middleware
app.use(cors()) //cross origin resource sharing middleware
app.use(express.static('dist')) //handles static files

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
    Note.find({}).then(notes => {
      response.json(notes)

    })
  })

  //GET, fetches a specific note using its id
  app.get('/api/notes/:id', (request, response) => {
    Note.findById(request.params.id).then(note => {
      response.json(note)
    })
  })

  //DELETE, deletes a note
  app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id

    Note.findByIdAndDelete(id)
    .then(deletedNote => {
      if(!deletedNote){
        return response.status(404).json({error: 'document not found!'})
      } 
      else{
        console.log('Document deleted: ', deletedNote)
        response.status(204).end()
      }
    })
    .catch(err => response.status(400).json({error: 'Invalid id or deletion failed!'}))


    // notes = notes.filter(note => note.id !== id)
    // response.status(204).end()
  })

  //POST, creates a new note
  app.post('/api/notes', (request, response) => {
    const body = request.body
    
    //We check if there is a content, if not, return a 404
    if(!body.content)return response.status(404).json({error: 'content missing'})
    
    //If there is a content, create a new note object using the Note model (constructor function)
    const note = new Note({
      content: body.content,
      important: body.important || false,
    })

    note.save().then(savedNote => {
      response.json(savedNote)
    })
    
    // //Concat the new note object to the existing notes array
    // notes = notes.concat(note)
  })

  //PUT, updates importance of a note
  app.put('/api/notes/:id', (req,res) => {
    const id = req.params.id
    const body = req.body

    Note.findByIdAndUpdate(id,
      { important: body.important}, // set new value
      { new: true } // return updated document
    )
      .then(updatedNote => {
        if(!updatedNote) return res.status(404).json({error: 'Note not found!'})
        res.json(updatedNote)
      })
      .catch(err => res.status(400).json({error: 'Malformed request or invalid ID'})) 

    // const id = req.params.id
    // const index = notes.findIndex(n => id === n.id)
    // console.log(index)
    // const body = req.body

    // //Check if id exists
    // if (index === -1) {
    //     return res.status(404).json({ error: 'note not found' })
    //   }

    // //Assign note to oldNote
    // const oldNote = notes[index]

    // //Updated note
    // const updatedNote = {...oldNote, important: body.important}

    // //Re-assign value of chosen note with the updated note value
    // notes[index] = updatedNote

    // res.json(updatedNote)
  })
  
  const PORT = process.env.PORT
  app.listen(PORT, () => {
      console.log(`Server is running in port ${PORT}`)
  } )