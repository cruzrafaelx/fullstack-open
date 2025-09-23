const { test, beforeEach, after, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user') 
const helper = require('./test_helper')

const api = supertest(app)


beforeEach( async () => {

    //Clear users and blogs, and seeds a test user
    await User.deleteMany({})
    await Blog.deleteMany({})

    //Create a test user
    const testUser = await User.create({
        username: "testuser1",
        name: "test user",
        passwordHash: await helper.hashPassword('secret')
    })

    const testUserId = testUser._id.toString()

    //Seed initial blogs with test user
    const initialBlogs = helper.initialBlogs.map(blog => ({
        ...blog,
        user: testUserId
    }))

    await Blog.insertMany(initialBlogs)
})

describe('blogs api test', () => {
    
    test('GET /blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('GET /returned blog includes user (name and username)', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        const blogs = await helper.blogsFromDb()
        const blog = blogs[0]

        assert.ok(blog.user)
        assert.ok(blog.user.name)
        assert.ok(blog.user.username)
    })

    test('GET /blogs returns empty array if no blogs exist', async () => {
        await Blog.deleteMany({})
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        const blogsAfter = await Blog.find({})
        assert.strictEqual(blogsAfter.length, 0)
    })

    test('POST /a valid blog can be added', async () => {

        const testUser = await User.findOne({ username: "testuser1" })
        const token = await helper.extractToken(testUser)

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(helper.newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        

        const blogsAtEnd = await helper.blogsFromDb()

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
        
        const savedBlog = blogsAtEnd.filter(blog => blog.title === 'This is a new blog')[0]

        assert.ok(savedBlog.user)
        assert.strictEqual(savedBlog.title, 'This is a new blog')
        assert.strictEqual(savedBlog.author, 'Pawpaw Kiki')
    })

    test('POST /like defaults to 0 if missing', async () => {

        const newBlog = {
            title: "This is a new blog",
            author: "Pawpaw Kiki",
            url: "www.blog.com"
        }

        const testUser = await User.findOne({ username: "testuser1" })
        const token = await helper.extractToken(testUser)

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const savedBlog = await Blog.findOne({ title: "This is a new blog" })
        assert.strictEqual(savedBlog.likes, 0)
    })

    test('POST /error with 401 if no token is provided', async () => {

        await api
            .post('/api/blogs')
            .send(helper.newBlog)
            .expect(401)
            .expect('Content-Type', /application\/json/)
    })

    test('POST /error with 401 if invalid token is provided', async () => {

        await api
            .post('/api/blogs')
            .set('Authorization', 'Bearer invalidToken')
            .send(helper.newBlog)
            .expect(401)
            .expect('Content-Type', /application\/json/)
    })

    test('POST /error with 400 if required fields (title, author) are not provided', async () => {
        
        const incompleteBlog = {
            url: "www.blog.com"
        }

        const testUser = await User.findOne({ username: "testuser1" })
        const token = await helper.extractToken(testUser)

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(incompleteBlog)
            .expect(400)
            .expect('Content-Type', /application\/json/)
    })

    test('DELETE /a blog is deleted', async () => {

        const testUser = await User.findOne({ username: "testuser1" })
        const token = await helper.extractToken(testUser)
        const blogId = await helper.existingBlogId()
       

        await api 
            .delete(`/api/blogs/${blogId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)


        const blogsAtEnd = await helper.blogsFromDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })

    test('DELETE /error with 404 if the blog doesnt exist', async () => {
        const testUser = await User.findOne({ username: "testuser1" })
        const token = await helper.extractToken(testUser)

        await api
            .delete(`/api/blogs/${helper.nonExistingId()}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404)
    })

    test('DELETE /error 401 if the blog belongs to another user', async () => {

        const blogId = await helper.existingBlogId()

        const anotherUser = await User.create({
            username: "testuser2",
            name: "User Two",
            passwordHash: await helper.hashPassword("hello")
        })

        const anotherToken = await helper.extractToken(anotherUser)

        await api
            .delete(`/api/blogs/${blogId}`)
            .set('Authorization', `Bearer ${anotherToken}`)
            .expect(401)
    })
})

describe('login api test', () => {
    test('POST /Able to login succesfully', async () => {

        const userLogin = {
            username: "testuser1",
            password: "secret"
        } 

        const validUser = await User.findOne({ username: "testuser1" })

        await api
        .post('/api/login')
        .send(userLogin)
        .expect(200)
        .expect('Content-Type', /application\/json/)

        const passwordCorrect = await bcrypt.compare(userLogin.password, validUser.passwordHash)
        assert.strictEqual(passwordCorrect, true)

    })

    test('POST, /error 400 if user doesnt exist', async () => {

        const userLogin = {
            username: "testuser6",
            password: "secret"
        } 

        await api
        .post('/api/login')
        .send(userLogin)
        .expect(400)

        const user = await User.findOne({ username: "testuser5" })
        assert.strictEqual(user, null)
        
    })

    test('POST, /error 400 if password is false', async () => {

        const userLogin = {
            username: "testuser5",
            password: "false"
        } 

        const validUser = await User.findOne({ username: "testuser1" })

        await api
        .post('/api/login')
        .send(userLogin)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        const passwordCorrect = await bcrypt.compare(userLogin.password, validUser.passwordHash)
        assert.strictEqual(passwordCorrect, false)
        
    })
})

after(async () => {
    await mongoose.connection.close()
})