import { useState, useEffect, useRef } from 'react'
import './app.css'
import Blog from './components/Blog'
import BlogService from './services/blogs'
import LoginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Toggleable from './components/Toggleable'

function App() {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
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
  
  const blogFormRef = useRef()

  //Fetch blogs of user
  const fetchBlogs = async () => {

    try{
      const initialBlogs = await BlogService.getAll()
      const sortedBlogs = initialBlogs.sort((a, b) => b.likes - a.likes)
      setBlogs(sortedBlogs)
    }

    catch(error){
      console.error(error.response.data)
    }
  }

  //Handle create blog
  const handleCreateBlog = async (blogObject) => {
    
    blogFormRef.current.toggleVisibility()
    
    try{
      console.log('Blog created!', user.token)

      if(!blogObject.title || !blogObject.author){
        setError('Title, author, or url cannot be blank!')
        setTimeout(()=> setError(null), 5000)
        return
      }

      await BlogService.create(blogObject)
      setSuccess(`A new blog ${blogObject.title} by ${blogObject.author}`)
      
      await fetchBlogs()
      
      setTimeout(()=> setSuccess(null), 5000)
    }
    
    catch(error){
      console.error(error)

      let errorMessage = "Something went wrong"

      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error
      } 
      
      else if (error.message) {
         errorMessage = error.message
      }

      setError(errorMessage)
      setTimeout(()=> setError(null), 5000)
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
        setUsername('')
        setPassword('')
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


  const loginFormProps = { username, password, setUsername, setPassword, handleLogin}
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
    : blogs.map(blog => (
    <Blog 
    key={blog.id}
    id={blog.id}
    title={blog.title}
    author={blog.author}
    url={blog.url}
    likes={blog.likes}
    user={user.user}
    fetchBlogs={fetchBlogs}
    />))

  //Blog form
  const blogForm = user
  ? <BlogForm handleCreateBlog={handleCreateBlog}/>
  : <p>Log in to start creating blogs</p>

  return (
    <>
      { error || success ? <Notification {...notificationProps}/> : null }
      <h1>Blog List</h1>
      {loginForm}
      <Toggleable ref={blogFormRef} buttonLabel={'create a blog'}>
        {blogForm}
      </Toggleable>
      {blogsList}
    </>
  )
}

export default App
