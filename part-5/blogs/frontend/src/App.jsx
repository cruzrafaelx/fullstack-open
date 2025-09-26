import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogService from './services/blogs'
import LoginService from './services/login'
import LoginForm from './components/LoginForm'


function App() {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  //Check if user details is saved in localStorage
  useEffect(()=> {
    const loggedUser = window.localStorage.getItem('loggedUser')
    if(loggedUser){
      const user = JSON.parse(loggedUser)
      setUser(user)
      BlogService.setToken(user.token)
      fetchBlogs()
    }
    
  }, [])

  //Fetch blogs of user
  const fetchBlogs = async () => {
    console.log('Fetching user blogs from database')

    try{
      const initialBlogs = await BlogService.getAll()
      console.log('promise fulfilled!', initialBlogs)
      setBlogs(initialBlogs)
    }

    catch(error){
      console.error(error.response.data)
    }
  }


  //Handle login
  const handleLogin = async (event) => {
    event.preventDefault()

    try{
      const userDetails = await LoginService.login({ username, password })

      console.log('Login successful', userDetails)
      setUser(userDetails)
      window.localStorage.setItem('loggedUser', JSON.stringify(userDetails))
      
      setUsername('')
      setPassword('')

      BlogService.setToken(userDetails.token)
      fetchBlogs()
    }

    catch(error){
      console.log('Wrong credentials!')
      console.error(error.response.data)
    }
  }

  //Handle logout
  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedUser')
    setUser(null)
    BlogService.setToken(null)
  }

  //Contains blog list
  const blogsList = blogs.map(blog => 
      (<Blog 
        key={blog.id}
        title={blog.title}
        author={blog.author}
      />))
 
  const loginFormProps = { username, password, setUsername, setPassword, handleLogin}
 
  return (
    <>
      <h1>Blog List</h1>

      {!user 
      ? <LoginForm {...loginFormProps}/> 
      : (<div>
          <p>{user.user} is logged in</p> 
          <button onClick={handleLogout}>logout</button>
        </div>)
      }

      {user && blogsList}
    </>
  )
}

export default App
