import {useState, useEffect, useRef } from 'react'
import "./index.css"
import Note from './components/Note'
import NoteService from "./services/notes"
import LoginService from "./services/login"
import Login from "./components/Login"
import Notification from "./components/Notification"
import Footer from "./components/Footer"
import Toggleable from "./components/Toggleable"
import NoteForm from "./components/NoteForm"


const App = () => {

  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const noteFormRef = useRef()

  //GET: Fetch notes at first render
  useEffect(() => {
    console.log('effect')
    NoteService
      .getAll()
      .then(initialNotes => {    
       if(Array.isArray(initialNotes)){
        console.log('promise fulfilled')
        console.log(initialNotes)
        setNotes(initialNotes)
       }

       else{
        setNotes([])
       }  
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if(loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      NoteService.setToken(user.token)
    }
  }, [])

  //Shows and hides notes
  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)

  

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
  const addNote = async (noteObject) => {
    noteFormRef.current.toggleVisibility()
    const returnedNote =  await NoteService.create(noteObject)
    setNotes(notes.concat(returnedNote))
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      //returns user with token
      const loggedUser = await LoginService.login({ username, password })
      setUser(loggedUser) 
      
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(loggedUser))
      
      setUsername('')
      setPassword('')
      NoteService.setToken(loggedUser.token)
    } 
    
    catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
    NoteService.setToken(null)
  }

  const loginFormProps = { username, setUsername, password, setPassword, handleLogin, isLoggedIn, setIsLoggedIn }

  return (
    <div>
      <h1>Notes</h1>

      <Notification message={errorMessage}/>
      
      {!user &&
      <Toggleable buttonLabel='Login'>
        <Login {...loginFormProps} />
      </Toggleable>
      }

      {user && 
        <div>
          <div>
            <p>{user.username} is currently logged in</p>
          </div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      }

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
      
      {user &&
        <Toggleable buttonLabel='new note' ref={noteFormRef}>
          <NoteForm createNote={addNote}/>
        </Toggleable>
      }
      

      <Footer />
    </div>
  )
}

export default App
