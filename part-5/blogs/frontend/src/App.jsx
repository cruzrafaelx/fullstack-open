import { useState, useEffect } from 'react'
import './app.css'
import Blog from './components/Blog'
import BlogService from './services/blogs'
import LoginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'



function App() {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

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
      setError(`${error.response.data.error}`)
      setTimeout(()=>{
        setError(null)
        setTitle('')
        setAuthor('')
        setUrl('')
      }, 5000)
    }
  }

  //Handle logout
  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedUser')
    setUser(null)
    BlogService.setToken(null)
  }

  //Handle create blog
  const handleCreateBlog = async (event) => {
    event.preventDefault()
    
    
    try{
      console.log('Blog created!', user.token)
      await BlogService.create({title, author, url})
      setSuccess(`A new blog ${title} by ${author}`)
      
      setTitle('')
      setAuthor('')
      setUrl('')
      
      await fetchBlogs()
      
      setTimeout(()=> setSuccess(null), 5000)
    }
    
    catch(error){
      console.error(error)
      setError(error)
      setTimeout(()=> setError(null), 5000)
    }
  }

  const loginFormProps = { username, password, setUsername, setPassword, handleLogin}
  const blogFormProps = { title, author, url, setTitle, setAuthor, setUrl, handleCreateBlog }
  const notificationProps =  { success, error }
  
  //Login form
  const loginForm = !user 
  ? <LoginForm {...loginFormProps}/> 
  : <div>
      <p>{user.user} is logged in</p> 
      <button onClick={handleLogout}>logout</button>
    </div>

  //Blog list
  const blogsList = !user 
  ? null
  : blogs.length === 0
    ? <p>No blogs yet</p>
    : blogs.map(blog => (<Blog 
    key={blog.id}
    title={blog.title}
    author={blog.author} />))
  
  
  //Blog form
  const blogForm = user
  ? <BlogForm {...blogFormProps}/>
  : <p>Log in to start creating blogs</p>

  return (
    <>
      { error || success ? <Notification {...notificationProps}/> : null }
      <h1>Blog List</h1>
      {loginForm}
      {blogForm}
      {blogsList}
    </>
  )
}

export default App
