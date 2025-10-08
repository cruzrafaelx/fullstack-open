import { useState } from 'react'

const BlogForm = ({ handleCreateBlog }) => {

    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const addBlog = (event) => {
        event.preventDefault()
        handleCreateBlog({title, author, url})
        setTitle('')
        setAuthor('')
        setUrl('')
    }

    return (
    <div style={{padding: '1em 0'}}>
        <form className='blog-form' 
              onSubmit={addBlog}>
            <label>
                title:
                <input
                    type='text'
                    onChange={({target}) => setTitle(target.value)}
                    value={title}
                />
            </label>

            <label>
                author:
                <input
                    type='text'
                    onChange={({target}) => setAuthor(target.value)}
                    value={author}
                />
            </label>

            <label>
                url:
                <input
                    type='text'
                    onChange={({target}) => setUrl(target.value)}
                    value={url}
                />
            </label>
            <button type='submit'>create</button>
        </form>
    </div>
    )
}
    


export default BlogForm