const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const tokenExtractor = (request, response, next) => {
  //request.token = ''
  const authorization =  request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
     request.token = authorization.substring(7)
  } 
  // else {
  //   return null 
  // }
  // this blocks up the server!!
  
  next()
}

const userExtractor = async (request, response, next) => {
  const authorization =  request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    request.decodedToken = decodedToken
    request.user = await User.findById(request.decodedToken.id)
 } 
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  requestLogger,
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler
}