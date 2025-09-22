const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')


loginRouter.post('/', async ( request, response ) => {
    const { username, password } = request.body

    const user = await User.findOne({ username })

    console.log(user)
    const passwordCorrect = user == null
    ? false
    : bcrypt.compare(password, user.passwordHash)

    if(!(user && passwordCorrect)){
        response
        .status(400)
        .json({ error: 'Invalid username or password' })
    }

    const userForToken = {
        username: user.username,
        id: user._id
    }

    const token = jwt.sign(
        userForToken,
        process.env.SECRET,
        { expiresIn: 60*60}
    )

    response
    .status(200)
    .json({ token, user: user.username, id: user._id })
})

module.exports = loginRouter