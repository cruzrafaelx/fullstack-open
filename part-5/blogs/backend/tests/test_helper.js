const Blog = require('../models/blog')
const User = require('../models/user') 
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const initialBlogs = [
    {
        title: 'My test blog 1',
        author: 'Bubu',
        url: 'http://test.com',
        likes: 4 
    },
    {
        title: 'My test blog 2',
        author: 'Paw',
        url: 'http://test.com',
        likes: 3 
    },
    {
        title: 'My test blog 3',
        author: 'Zen',
        url: 'http://test.com',
        likes: 2
    },
]

const newBlog = {
    title: "This is a new blog",
    author: "Pawpaw Kiki",
    url: "www.blog.com",
    likes: 1
}

const existingBlogId = async () => {
    const blog = await Blog.findOne({title: 'My test blog 1'})
    return blog._id.toString()
}


//Non-existing ID
const nonExistingId = () => {
   return new mongoose.Types.ObjectId().toString()
  }

//Hash the password
const hashPassword = async password => {
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    return hashedPassword
}

//Extract token
const extractToken = async (user) => {
    
    const userForToken = {
        user: user.username,
        id: user._id.toString()
    }

    const token =  jwt.sign(userForToken, process.env.SECRET)
    return token
}

//Fetch blogs from DB
const blogsFromDb = async () => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    return blogs
}

//Fetch users from DB
const usersFromDb = async () => {
    const blogs = await Blog.find({}).populate('blog', { username: 1, name: 1 })
    return blogs
}


module.exports = {
    
    newBlog,
    initialBlogs,
    existingBlogId,
    nonExistingId,
    hashPassword,
    blogsFromDb, 
    extractToken
}