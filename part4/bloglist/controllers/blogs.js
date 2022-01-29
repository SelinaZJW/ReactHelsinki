const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

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
  const body = request.body
  const user = await User.findById(body.userId)
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
    const savedBlog = await blog.save()
    user.blogs = await user.blogs.concat(savedBlog._id)
    console.log(savedBlog._id)
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

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
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