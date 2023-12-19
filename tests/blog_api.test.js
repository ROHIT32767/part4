const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app.js')
require('express-async-errors')
const api = supertest(app)
const Blog = require("../models/Blog.model")

const initialblogs = [
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10
  },
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0
  },
  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects = initialblogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
}, 20000)

test('Validating a GET request to /api/blogs', async () => {
  const result = await api.get("/api/blogs").expect(200).expect('Content-Type', /application\/json/)
}, 15000)

test('Validating contents of GET request to /api/blogs', async () => {
  const result = await api.get("/api/blogs")
  expect(result.body).toHaveLength(initialblogs.length)
})


test('Validating contents of POST request to /api/blogs', async () => {
  const newblog = {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  }
  await api
    .post('/api/blogs')
    .send(newblog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  const response = await api.get('/api/blogs')
  const contents = response.body.map(r => r.author)
  expect(response.body).toHaveLength(initialblogs.length + 1)
  expect(contents).toContain(
    "Michael Chan"
  )
})

test('Validating contents of POST request to /api/blogs without the field Likes', async () => {
  const newblog = {
    title: "Wings of Fire",
    author: "APJ Abdul Kalam",
    url: "https://isro.com/",
  }
  await api
    .post('/api/blogs')
    .send(newblog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  const response = await api.get('/api/blogs')
  const contents = response.body.map(r => r.author)
  expect(response.body).toHaveLength(initialblogs.length + 1)
  expect(contents).toContain(
    "APJ Abdul Kalam"
  )
  const newentry = response.body.filter(element => element.author === "APJ Abdul Kalam")
  console.log()
  expect(newentry[0].likes).toBe(0)
})

test('Validating contents of POST request to /api/blogs without the fields title/url', async () => {
  const newblog = {
    title: "The Last Lecture",
    author: "Samyadeb Bhattacharya",
    likes : 2
  }
  await api
    .post('/api/blogs')
    .send(newblog)
    .expect(400)

  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialblogs.length)
})

test('Validating contents of DELETE request to /api/blogs', async () => {
  const result1 = await api.get("/api/blogs")
  expect(result1.body).toHaveLength(initialblogs.length)
  const id  = result1.body[0]._id
  const response =  await api.delete(`/api/blogs/${id}`).expect(201)
  const result2 = await api.get("/api/blogs")
  expect(result2.body).toHaveLength(initialblogs.length-1)
},10000)


test('Validating contents of PUT request to /api/blogs', async () => {
  const updatebody = {
    title: "Testing Update",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 2
  }
  const result1 = await api.get("/api/blogs")
  expect(result1.body).toHaveLength(initialblogs.length)
  const id  = result1.body[0]._id
  const response =  await api.put(`/api/blogs/${id}`).send(updatebody).expect(200).expect('Content-Type', /application\/json/)
  const result2 = await api.get("/api/blogs")
  const contents = result2.body.map(element => element.title)
  expect(contents).toContain(
    "Testing Update"
  )
  expect(result2.body).toHaveLength(initialblogs.length)
},10000)

test('The unique identifier property of the blog posts is by default _id', async () => {
  const blogs = await api.get("/api/blogs")
  expect(blogs.body[0]._id).toBeDefined()
})

afterAll(() => mongoose.connection.close())

