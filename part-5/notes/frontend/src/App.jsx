import {useState, useEffect} from 'react'
import "./index.css"
import Note from './components/Note'
import NoteService from "./services/notes"
import LoginService from "./services/login"
import Notification from "./components/Notification"
import Footer from "./components/Footer"


const App = () => {

  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState(
    'a new note...'
  ) 
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  //GET: Fetch notes at first render
  useEffect(() => {
    console.log('effect')
    NoteService
      .getAll()
      .then(initialNotes => {
        console.log('promise fulfilled')
        console.log(initialNotes)
        setNotes(initialNotes)
      })
  }, [])

  //Shows and hides notes
  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)

  //Handles note changes
  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  //PUT: Toggles importance of note
  const toggleImportance = (id) => {
    const note = notes.find(n => n.id === id)
    console.log("matching note", note)
    const changedNote = {...note, important: !note.important }
    console.log("modified note", changedNote)
    NoteService
         .update(id, changedNote) 
         .then(returnedNote => {
          setNotes(notes.map(n => n.id === id ? returnedNote : n))
         })
         .catch(error => {
          setErrorMessage(
            `The note ${note.content} is already deleted!`
          )

          setTimeout(()=>{
            setErrorMessage(null)
          }, 5000)

          setNotes(notes.filter(n => n.id !== id))
         })
  }

  //POST: Add notes to server
  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    }
  
    NoteService
      .create(noteObject)
      .then(returnedNote => {
        console.log(returnedNote)
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const loggedUser = await LoginService.login({ username, password })
      setUser(loggedUser) //This is used to store the token after logging in
      setUsername('')
      setPassword('')
      NoteService.setToken(loggedUser.token)
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
    
  }

  const loginForm = () => (
    <>
    <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input
              type="text"
              value={username}
              onChange={({target}) => setUsername(target.value)} //explain this line
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="text"
              value={password}
              onChange={({target}) => setPassword(target.value)} //explain this line
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </>
  )

  const noteForm = () => (
    <>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange}/>
        <button type="submit">save</button>
      </form>  
    </>
  )

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage}/>
      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.username} is currently logged in</p>
        </div>
      )}
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          //Imported note component
          <Note key={note.id} 
                note={note}
                toggleImportance={()=>toggleImportance(note.id)} />
        ))}
      </ul>
      {user && noteForm()}
      <Footer />
    </div>
  )
}

export default App
