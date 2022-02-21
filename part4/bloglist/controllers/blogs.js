const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}


blogsRouter.get('/', async (request, response) => {
  // Blog.find({}).then(b => {
  //   response.json(b)
  // })
  const blogs = await Blog.find({}).populate('user', {blogs: 0})
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response, next) => {
  // Blog.findById(request.params.id)
  //   .then(blog => {
  //     if (blog) {
  //       response.json(blog)
  //     } else {
  //       response.status(404).end()
  //     }
  //   })
  //   .catch(error => next(error))

    const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }       
    //no need for catch, bc of express-async-error library
})

blogsRouter.post('/', async (request, response, next) => {
  console.log("POST /api/blogs")
  console.log(request.headers)
  console.log("Token:")
  console.log(request.token)
  //console.log(request.decodedToken.id)
  // console.log(request.user)
  const body = request.body
  //const user = await User.findById(body.userId)
  
  //const token = getTokenFrom(request)
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  //const user = await User.findById(decodedToken.id)
  const user = request.user
  console.log(user)


  const blog = new Blog ({
    title: body.title,
    author: body.author,
    url: body.url,
    //likes: !body.likes ? 0 : body.likes
    likes: body.likes || 0, 
    user: user._id
  })

  // blog.save()
  //   .then(savedBlog => {
  //     response.json(savedBlog)
  //   })
  //   .catch(error => next(error))

  if (!body.title && !body.url) {
    response.status(400).end()
  } else {
    const blog_ = await blog.save() //.populate('user', { blogs: 0 })
    const savedBlog = await Blog.populate(blog_, 'user' )

    user.blogs = await user.blogs.concat(savedBlog._id)
    console.log(user.blogs)
    await user.save()
    response.json(savedBlog )
  }
  
})

blogsRouter.delete('/:id', async (request, response, next) => {
  // Blog.findByIdAndRemove(request.params.id)
  //   .then(() => {
  //     response.status(204).end()
  //   })
  //   .catch(error => next(error))

  //const token = getTokenFrom(request)

  const blog = await Blog.findById(request.params.id)
  console.log(blog)
  console.log(request.user)

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  } else if (request.user.id !== blog.user.toString()) {
    return response.status(401).json({error: 'not authorised; only creator of this blog can delete it'})
  } else {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body
  //const user = request.user

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes, 
    comments: body.comments
  }

    // Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    // .then(updatedBlog => {
    //   response.json(updatedBlog)
    // })
    // .catch(error => next(error))

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog)
})

module.exports = blogsRouter