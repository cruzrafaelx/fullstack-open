
import { useState } from 'react'
import BlogService from '../services/blogs'

const Blogs = ({ id, title, author, url, likes, user, fetchBlogs }) => {

const [visible, setVisible] = useState(false)

const showWhenViewed = { display: visible ? '' : 'none'}
const buttonName = !visible ? 'view' : 'hide'

const toggleVisibility = () => {
    setVisible(!visible)
}

//Handle like
const handleLike = async (id) => {

     const updatedBlog = {
      user: user.id,
      likes: likes + 1,
      author,
      title,
      url
    }

    await BlogService.like(id, updatedBlog)
    await fetchBlogs()
  }

  //Handle delete

const handleDelete = async (id) => {
    window.confirm(`Remove blog ${title} by ${author}`)
    await BlogService.remove(id)
    await fetchBlogs()
} 


const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
}

return(
    <div style={blogStyle}>
        <div className='container'>
            <div>{title} by {author}</div>
            <button onClick={toggleVisibility}>{buttonName}</button>
        </div>
        <div style={showWhenViewed}>
            <div>{url}</div>
            <div className='container'>
                <div>{likes}</div>
                <button onClick={() => handleLike(id)}>like</button>
            </div>
            <div>{user}</div>
            <button onClick={()=> handleDelete(id)}>remove</button>
        </div>
    </div>
    

)} 

export default Blogs