
import { useState } from 'react'

const NoteForm = ({ createNote }) => {
  
  const [newNote, setNewNote] = useState(
      'a new note...'
    ) 

  //Handles note changes
  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  //POST: Add notes to server
  const addNote = (event) => {
    event.preventDefault()
    createNote({
      content: newNote,
      important: true,
    })

    setNewNote('')
  }

  return(
  <div>
    <form onSubmit={addNote}>
      <input value={newNote} onChange={handleNoteChange}/>
      <button type="submit">save</button>
    </form>  
  </div>
)}

export default NoteForm