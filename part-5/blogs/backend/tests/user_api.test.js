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

describe('user api test', () => {

    const baseUser = {
        username: "testuser2",
        name: "test user 2",
        password: "secret2"
    }

    test('POST /a valid user can be added', async  () => {
        await api
            .post('/api/users')
            .send(baseUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
            
        const savedUser = await User.findOne({ username: "testuser2"})
        const passwordCorrect = await bcrypt.compare(baseUser.password, savedUser.passwordHash)
        
        assert.strictEqual(passwordCorrect, true)
    })

    test('POST /user creation fails if username is a duplicate', async () => {
        
        const userDuplicate = {
            username: "testuser1",
            name: "Double User",
            password: "Double"
        }

        const response = await api
            .post('/api/users')
            .send(userDuplicate)
            .expect(400)
        
        assert.strictEqual(response.body.error, "expected `username` to be unique")
    })

    test('POST /user creation fails if password is shorter than 3 characters', async () => {
        const user = {...baseUser}
        user.password = "tw"

        const response = await api
            .post('/api/users')
            .send(user)
            .expect(400)
            
        assert.strictEqual(response.body.error, "Password must be atleast 3 characters long")
            
    })
    
    test('POST /user creation fails if username is missing', async () => {
        const user = {...baseUser}
        delete user.username

        const response = await api
            .post('/api/users')
            .send(user)
            .expect(400)
        
        assert.strictEqual(response.body.error, "User validation failed: username: Path `username` is required.")
    })

    test('POST /user creation fails if name is missing', async () => {
        const user = {...baseUser}
        delete user.name

        const response = await api
            .post('/api/users')
            .send(user)
            .expect(400)
        
        assert.strictEqual(response.body.error, "User validation failed: name: Path `name` is required.")
    })

    test('POST /user creation fails if password is missing', async () => {
        const user = {...baseUser}
        delete user.password

        const response = await api
            .post('/api/users')
            .send(user)
            .expect(400)
        
        assert.strictEqual(response.body.error, "Password must be atleast 3 characters long")
    })
})

after(async () => {
    await mongoose.connection.close()
})