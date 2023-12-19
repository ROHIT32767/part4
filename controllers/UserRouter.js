const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/User.model')

usersRouter.post('/', async (request, response) => {
  console.log(request.body)

 const { username, name, password } = request.body

  if (password.length < 3) {
    return response.status(400).json({ error: `User validation failed: username: Path password is shorter than the minimum allowed length (3)` })
  }

  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response.status(400).json({
      error: 'username must be unique'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()
  console.log(savedUser)
  response.status(201).json(savedUser)
})

// usersRouter.get('/', async (request, response) => {
//   const users = await User.find({})
//   response.json(users)
// })

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs')

  response.json(users)
})

module.exports = usersRouter