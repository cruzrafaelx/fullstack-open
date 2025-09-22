const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middlewares')

//GET: Fetch all blogs
blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1})
    response.json(blogs)
  })

//POST: create a new blog
blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
const { title, author, url, likes } = request.body

const user = request.user

const blog = new Blog({
  title,
  author,
  url,
  likes,
  user: user.id
})

const savedBlog = await blog.save()
user.blogs = user.blogs.concat(savedBlog._id)
await user.save()

response.status(201).json(savedBlog)
})

//DELETE: delete a blog
blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {

  const blogId = request.params.id
  const blog = await Blog.findById(blogId)

  if(!blog){
    return response.status(404).json({ error: "Blog not found! "})
  }

  //Fetch user using token through middleware userExtractor
  const userObject = request.user

  if (blog.user._id.toString() !== userObject._id.toString()) {
    return response.status(401).json({ error: 'Unauthorized' })
  }

  await Blog.findByIdAndDelete(blogId)
  response.status(204).end()
})

module.exports = blogsRouter