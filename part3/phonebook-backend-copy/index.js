console.log('hello world')

require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))     //access frontend build (production mode) from 3001 backend server (which is also pushed to heroku)
app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())


// let persons = [
//   { 
//     "id": 1,
//     "name": "Arto Hellas", 
//     "number": "040-123456"
//   },
//   { 
//     "id": 2,
//     "name": "Ada Lovelace", 
//     "number": "39-44-5323523"
//   },
//   { 
//     "id": 3,
//     "name": "Dan Abramov", 
//     "number": "12-43-234345"
//   },
//   { 
//     "id": 4,
//     "name": "Mary Poppendieck", 
//     "number": "39-23-6423122"
//   }
// ]


  app.get('/', (request, response) => {
    response.send('<h1>Phonebook!</h1>')
  })

  app.get('/api/persons', (request, response) => {
    //response.json(persons)
    Person.find({}).then(p => {
      response.json(p)
    })
  })

  app.get('/info', (request, response) => {
    //const infoNumber = persons.length
    const time = new Date()

    Person.countDocuments({}).then(result => 
    response.send(
      `<p>Phonebook has info for ${result} people</p>
      <p>${time}</p>`
    ))
  })

  app.get('/api/persons/:id', (request, response, next) => {
    // const id = Number(request.params.id)
    // const person = persons.find(p => p.id === id)

    // if (person) {
    //   response.json(person)
    // } else {
    //   response.status(404).end()
    // }

    Person.findById(request.params.id).then(p => {
      if (p) {
        response.json(p)
      } else {
        response.status(404).end()
      }
    }).catch(error => next(error))
    // .catch(error => {
    //   console.log(error)
    //   response.status(400).send({ error: 'malformatted id' })
    // })

  })


  app.delete('/api/persons/:id', (request, response, next) => {
    // const id = Number(request.params.id)
    // persons = persons.filter(p => p.id !== id)

    // response.status(204).end()
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
  })




  morgan.token('added-person', (request, response)=> {
    return JSON.stringify(request.body)
  })

  app.use(morgan(':method :url :status :res[content-length] - :response-time ms :added-person'))

  const generateId= () => {
    const getRandomInt= Math.floor(Math.random() * 1000)
    return getRandomInt //+ persons.length
  }

  app.post('/api/persons', (request, response, next) => {
    const body = request.body
    
    //Validation:
        // if (body.name === undefined) {
        //   return response.status(400).json({ 
        //     error: 'name missing' 
        //   })
        // }

        // if (body.number === undefined) {
        //   return response.status(400).json({ 
        //     error: 'number missing' 
        //   })
        // }

        // const exist = persons.map(p => p.name).includes(body.name)
        // if (exist) {
        //   return response.status(400).json({
        //     error: 'name must be unique'
        //   })
        // }

    const person = new Person({
      name: body.name,
      number: body.number,
      id: generateId(),
    })

      // Person.findOneAndUpdate({name: body.name}, person, {new:true}).then(p => {
      //   if (p) {
      //     response.json(p)
      //   } else {
      //     person.save().then(p => {
      //       response.json(p)
      //     })
      //   }

        person.save()
          .then(p => {      //how to make this jump to PUT???
            response.json(p)
          })
          .catch(error => next(error))
    //response.json(person)
    // console.log(body)
    // console.log(person)
  })


  app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const person = {
      name: body.name,
      number: body.number
    }
  
    //const opts = { runValidators: true };
    Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true  })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
  })

  //Error Handler needs to be at the very end, or else can't load other if load error first
  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }
  
    next(error)
  }
  
  app.use(errorHandler)

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
  