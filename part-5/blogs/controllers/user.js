const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

userRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', {title: 1})
    response.status(200).json(users)
})
 
userRouter.post('/', async (request, response) => {
    const { name, username, password } = request.body

    if(!password || password.length < 3){
        return response.status(400).json({ error: 'Password must be atleast 3 characters long'})
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        name,
        username,
        passwordHash
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
})

module.exports = userRouter
