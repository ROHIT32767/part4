const BlogRouter = require('express').Router()
require('express-async-errors')
const Blog = require('../models/Blog.model')
const User = require('../models/User.model')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

BlogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
});

BlogRouter.post('/',middleware.userExtractor,async (request, response) => {
  const body = request.body
  const user = request.user
  if (!body.author || !body.url) {
    return response.status(400).end()
  }
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })
  if (!blog.likes) {
    blog.likes = 0
  }
  const savedblog = await blog.save()
  user.blogs = user.blogs.concat(savedblog._id)
  await user.save()
  response.status(201).json(savedblog)
})

BlogRouter.delete('/:id',middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user
  const getblog = await Blog.findById(request.params.id)
  if (!getblog) {
    return response.status(400).end()
  }
  const currentuser = await User.findById(user._id)
  console.log(getblog.user._id.toString())
  console.log(currentuser._id.toString())
  if(getblog.user._id.toString()!==currentuser._id.toString())
  {
    return response.status(400).json({ error: 'invalid user' })
  }
  const result = await Blog.findByIdAndDelete(request.params.id)
  response.status(201).json(result)
})

BlogRouter.put('/:id',middleware.userExtractor, async (request, response) => {
  const body = request.body
  console.log(`id in BlogRouter is ${request.params.id}`)
  if (!body.author || !body.url) {
    return response.status(400).end()
  }
  console.log(`id in BlogRouter is ${request.params.id}`)
  const getblog = await Blog.findById(request.params.id)
  if (!getblog) {
    return response.status(400).end()
  }
  const blog = new Blog(request.body)
  if (!blog.likes) {
    blog.likes = 0
  }
  const result = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true })
  response.status(200).json(result)
})

module.exports = BlogRouter



// BlogRouter.get('/', async (request, response) => {
//   const blogs = await Blog.find({})
//   response.status(200).json(blogs)
// })


// const getTokenFrom = request => {
//   const authorization = request.get('authorization')
//   if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
//     return authorization.substring(7)
//   }
//   return null
// }


  // // const token = getTokenFrom(request)
  // const decodedToken = jwt.verify(request.token, process.env.SECRET)
  // if (!decodedToken.id) {
  //   return response.status(401).json({ error: 'token missing or invalid' })
  // }