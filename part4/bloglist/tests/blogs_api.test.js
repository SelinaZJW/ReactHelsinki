const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const config = require('../utils/config')
console.log(config.MONGODB_URI)

const Blog = require('../models/blog')
const User = require('../models/user')

const { initial } = require('lodash')
const initialBlogs = [
    {
    _id: "61f1968d141ae09494e87d34",
    title: "How to make a tiger cake",
    author: "SelinaaaZ",
    url: "http://how-to-make-a-tiger-cake.com",
    likes: 100000,
    },
    {
    _id: "61f19727141ae09494e87d37",
    title: "The perils of cooking",
    author: "SnigerrM",
    url: "http://the-perils-of-cooking.com",
    likes: 29385,
    },
    {
    _id: "61f1a4dace0bd43815a4e610",
    title: "The makings of a great cook",
    author: "GordonRamseee",
    url: "http://i-am-a-great-cook.com",
    likes: 882345,
    }
    ]

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    
    const blogObjects = initialBlogs
        .map(b => new Blog(b))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
    
    })


describe ('when three blogs are saved', ()=> {
    test('blogs are returned as json', async () => {
        await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    }, 100000) 

    test('there are three blogs', async () => {
        const response = await api.get('/api/blogs')
        console.log(response.body)
    
        expect(response.body).toHaveLength(initialBlogs.length)
    }, 100000)
    

    test('identifier property is named id', async ()=> {
        const response = await api.get('/api/blogs/61f19727141ae09494e87d37')

        expect(response.body.id).toBeDefined()
    })
})



describe('a user is logged in', () => {
    let headers
  
    beforeEach(async () => {
      const newUser = {
        username: 'janedoez',
        name: 'Jane Z. Doe',
        password: 'password',
      }
  
      await api
        .post('/api/users')
        .send(newUser)
  
      const result = await api
        .post('/api/login')
        .send(newUser)
  
      headers = {
        'Authorization': `bearer ${result.body.token}`
      }
    })


test('a blog can be added', async () => {
    const newBlog = {
        title: "post test with added blog",
        author: "devloper",
        url: "http://added.com",
        likes: 100,
    }

    await api
            .post('/api/blogs')
            .send(newBlog)
            .set(headers)
            //.setHeader({ Authorization: token })
            //authorization??? how to define token within tests
    const  response = await api.get('/api/blogs')
    console.log(response.body)

    expect(response.body).toHaveLength(initialBlogs.length + 1)

    const blogTitles = response.body.map(r => r.title)
    expect(blogTitles).toContainEqual('post test with added blog')
})

test('an added blog missing likes entry is default at 0 likes', async () => {
    const newBlog = {
        title: "post test with added blog",
        author: "devloper",
        url: "http://added.com"
    }

    await api
            .post('/api/blogs')
            .send(newBlog)
            .set(headers)
            //.set( 'authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNlbGluYVp6eiIsImlkIjoiNjFmNWI0ZTNlY2YwY2YwOWUyNTQ5MDgzIiwiaWF0IjoxNjQzNTA0NjgyfQ.72DI7yr7OqgwWO69VINc9-6Nj9y16quMNO5nlsDPa8Y' )
    const response = await api.get('/api/blogs')
    const addedBlog = response.body[initialBlogs.length]
    expect(addedBlog.likes).toEqual(0)
})

test('if new blog has no title and no url, backend responds with 400 bad request', async () => {
    const newBlog = {
        author: "devloper",
        likes: 2000
    }
    const response = await api
                            .post('/api/blogs')
                            .send(newBlog)
                            .set(headers)
                            //.set( 'authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNlbGluYVp6eiIsImlkIjoiNjFmNWI0ZTNlY2YwY2YwOWUyNTQ5MDgzIiwiaWF0IjoxNjQzNTA0NjgyfQ.72DI7yr7OqgwWO69VINc9-6Nj9y16quMNO5nlsDPa8Y' )

    //console.log(response)

    expect(response.status).toEqual(400)
})
  
  test('but cannot add blogs if there is no token', async () => {
    const newBlog = {
        title: "post test with added blog",
        author: "devloper",
        url: "http://added.com"
    }
    const response = await api
                            .post('/api/blogs')
                            .send(newBlog)
    expect(response.status).toEqual(401)
    //why is this 500, not 401?????
  })

})

afterAll(() => {
  mongoose.connection.close()
})