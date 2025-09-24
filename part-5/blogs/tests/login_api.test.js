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