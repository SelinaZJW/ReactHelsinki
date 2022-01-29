const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const User = require('../models/user')
const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
      await User.deleteMany({})
  
      const passwordHash = await bcrypt.hash('secret', 10)
      const user = new User({ username: 'root', passwordHash })
  
      await user.save()
    })


describe('adding an invalid user would fail when', () => {
    
    test('the username is under 3 characters', async () => {
      const usersAtStart = await User.find({})
  
      const newUser = {
        username: 'we',
        password: 'salainen',
      }
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

        expect(result.body.error).toContain('shorter than the minimum allowed length')
        //?????
  
      const usersAtEnd = await User.find({})
      expect(usersAtEnd).toHaveLength(usersAtStart.length)

    }, 100000)
  
    test('username is not unique', async () => {
      const usersAtStart = await User.find({})
  
      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen',
      }
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
      expect(result.body.error).toContain('`username` to be unique')
  
      const usersAtEnd = await User.find({})
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })  

    test('username is missing', async () => {
        const usersAtStart = await User.find({})
        
        const newUser = {
            username: '',
            name: 'Superuser',
            password: 'salainen',
          }

        const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    
        expect(result.body.error).toContain('`username` is required')

        const usersAtEnd = await User.find({})
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('password is under 3 characters', async () => {
        const usersAtStart = await User.find({})
    
        const newUser = {
          username: 'wewww',
          password: '12',
        }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
  
          expect(result.body.error).toContain('password must contain more than 3 characters')
    
        const usersAtEnd = await User.find({})
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('password is missing', async () => {
        const usersAtStart = await User.find({})
        
        const newUser = {
            username: '123455',
            name: 'Superuser',
            password: '',
          }

        const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    
        expect(result.body.error).toContain('password is required')

        const usersAtEnd = await User.find({})
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
  })


  afterAll(() => {
    mongoose.connection.close()
  })