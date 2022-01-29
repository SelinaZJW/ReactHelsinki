const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {user:0, likes: 0})
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
    const body = request.body
    
    if (!body.password  ) {
        response.status(400).send({ error: 'password is required' })
    } else if (body.password.length < 3) {
        response.status(400).send({ error: 'password must contain more than 3 characters' })
    } else {

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    })
  
    const savedUser = await user.save()
  
    response.json(savedUser)
    }

  })
  




module.exports = usersRouter