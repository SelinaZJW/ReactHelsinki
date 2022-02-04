const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const config = require('../utils/config')
console.log(config.MONGODB_URI)

const Blog = require('../models/blog')
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
    
    const blogObjects = initialBlogs
        .map(b => new Blog(b))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
    
    })


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
            .set( 'authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNlbGluYVp6eiIsImlkIjoiNjFmNWI0ZTNlY2YwY2YwOWUyNTQ5MDgzIiwiaWF0IjoxNjQzNTA0NjgyfQ.72DI7yr7OqgwWO69VINc9-6Nj9y16quMNO5nlsDPa8Y' )
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
                            .set( 'authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNlbGluYVp6eiIsImlkIjoiNjFmNWI0ZTNlY2YwY2YwOWUyNTQ5MDgzIiwiaWF0IjoxNjQzNTA0NjgyfQ.72DI7yr7OqgwWO69VINc9-6Nj9y16quMNO5nlsDPa8Y' )

    console.log(response)

    expect(response.status).toEqual(400)
})

afterAll(() => {
  mongoose.connection.close()
})