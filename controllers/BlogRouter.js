const BlogRouter = require('express').Router()
require('express-async-errors')
const Blog = require('../models/Blog.model')

BlogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.status(200).json(blogs)
})

BlogRouter.post('/', async (request, response) => {
  if (!request.body.author || !request.body.url) {
    return response.status(400).end()
  }
  const blog = new Blog(request.body)
  if (!blog.likes) {
    blog.likes = 0
  }
  const result = await blog.save()
  response.status(201).json(result)
})

BlogRouter.delete('/:id', async (request, response) => {
  const getblog = await Blog.findById(request.params.id)
  if (!getblog) {
    return response.status(400).end()
  }
  const result = await Blog.findByIdAndDelete(request.params.id)
  response.status(201).json(result)
})

BlogRouter.put('/:id', async (request, response) => {
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
  const result = await Blog.findByIdAndUpdate(request.params.id,request.body,{new:true})
  response.status(200).json(result)
})

module.exports = BlogRouter