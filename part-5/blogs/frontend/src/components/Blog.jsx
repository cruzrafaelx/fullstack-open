
import { useState } from 'react'

const Blogs = ({ title, author, url, likes, user }) => {

const [visible, setVisible] = useState(false)

const showWhenViewed = { display: visible ? '' : 'none'}
const buttonName = !visible ? 'view' : 'hide'

const toggleVisibility = () => {
    setVisible(!visible)
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
                <button>like</button>
            </div>
            <div>{user}</div>
        </div>
    </div>
    

)} 

export default Blogs