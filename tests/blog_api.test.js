const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app.js')
require('express-async-errors')
const api = supertest(app)
const Blog = require("../models/Blog.model")
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const User = require('../models/User.model')

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

const initialusers = [
  {
    username: "Usertests",
    name: "Usertests",
    password: "Usertests"
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  const promiseArray2 = initialusers.map(async (user) => {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(user.password, saltRounds)
    return { username: user.username, name: user.name, passwordHash: passwordHash };
  })
  const arr = await Promise.all(promiseArray2)
  console.log(promiseArray2)
  const userObjects = arr.map(user => new User(user))
  const promiseArray3 = userObjects.map(postusers => postusers.save())
  await Promise.all(promiseArray3)
  const Userlist = await User.find({})
  const FirstUser = Userlist[0]
  const postinitialblogs = initialblogs.map(blog => ({ ...blog, user: FirstUser._id }))
  const blogObjects = postinitialblogs.map(blog => new Blog(blog))
  const promiseArray1 = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray1)
}, 30000)


const getToken = async () => {
  const username = initialusers[0].username;
  const password = initialusers[0].password;
  const obj = { username, password }
  const response = await api.post("/api/login").send(obj).expect(200).expect('Content-Type', /application\/json/);
  return response.body.token;
}


// test('Validating a GET request to /api/blogs', async () => {
//   // console.log("Entered Test")
//   const result = await api.get("/api/blogs").expect(200).expect('Content-Type', /application\/json/)
// }, 15000)

// test('Validating contents of GET request to /api/blogs', async () => {
//   const result = await api.get("/api/blogs")
//   expect(result.body).toHaveLength(initialblogs.length)
// })


test('Validating contents of POST request to /api/blogs', async () => {
  const newblog = {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  }
  const token = await getToken();
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
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

// test('Validating contents of POST request to /api/blogs without the field Likes', async () => {
//   const newblog = {
//     title: "Wings of Fire",
//     author: "APJ Abdul Kalam",
//     url: "https://isro.com/",
//   }
//   const token = await getToken();
//   await api
//     .post('/api/blogs')
//     .set('Authorization', `Bearer ${token}`)
//     .send(newblog)
//     .expect(201)
//     .expect('Content-Type', /application\/json/)
//   const response = await api.get('/api/blogs')
//   const contents = response.body.map(r => r.author)
//   expect(response.body).toHaveLength(initialblogs.length + 1)
//   expect(contents).toContain(
//     "APJ Abdul Kalam"
//   )
//   const newentry = response.body.filter(element => element.author === "APJ Abdul Kalam")
//   console.log()
//   expect(newentry[0].likes).toBe(0)
// })

// test('Validating contents of POST request to /api/blogs without the fields title/url', async () => {
//   const newblog = {
//     title: "The Last Lecture",
//     author: "Samyadeb Bhattacharya",
//     likes: 2
//   }
//   const token = await getToken();
//   await api
//     .post('/api/blogs')
//     .set('Authorization', `Bearer ${token}`)
//     .send(newblog)
//     .expect(400)
//   const response = await api.get('/api/blogs')
//   expect(response.body).toHaveLength(initialblogs.length)
// })

// test('Validating contents of DELETE request to /api/blogs', async () => {
//   const result1 = await api.get("/api/blogs")
//   expect(result1.body).toHaveLength(initialblogs.length)
//   const id = result1.body[0]._id
//   const token = await getToken();
//   const response = await api.delete(`/api/blogs/${id}`).set('Authorization', `Bearer ${token}`).expect(201)
//   const result2 = await api.get("/api/blogs")
//   expect(result2.body).toHaveLength(initialblogs.length - 1)
// }, 10000)


// test('Validating contents of PUT request to /api/blogs', async () => {
//   const updatebody = {
//     title: "Testing Update",
//     author: "Robert C. Martin",
//     url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
//     likes: 2
//   }
//   const result1 = await api.get("/api/blogs")
//   expect(result1.body).toHaveLength(initialblogs.length)
//   const id = result1.body[0]._id
//   const token = await getToken();
//   const response = await api.put(`/api/blogs/${id}`).set('Authorization', `Bearer ${token}`).send(updatebody).expect(200).expect('Content-Type', /application\/json/)
//   const result2 = await api.get("/api/blogs")
//   const contents = result2.body.map(element => element.title)
//   expect(contents).toContain(
//     "Testing Update"
//   )
//   expect(result2.body).toHaveLength(initialblogs.length)
// }, 10000)

// test('The unique identifier property of the blog posts is by default _id', async () => {
//   const blogs = await api.get("/api/blogs")
//   expect(blogs.body[0]._id).toBeDefined()
// })


// // User Authentication Tests

// describe('when there is initially one user in db', () => {
//   beforeEach(async () => {
//     await User.deleteMany({})
//     const passwordHash = await bcrypt.hash('sekret', 10)
//     const user = new User({ username: 'root', passwordHash })
//     await user.save()
//   })

//   test('creation succeeds with a fresh username', async () => {
//     const usersAtStart = await helper.usersInDb()
//     const newUser = {
//       username: 'mluukkai',
//       name: 'Matti Luukkainen',
//       password: 'salainen',
//     }
//     await api
//       .post('/api/users')
//       .send(newUser)
//       .expect(201)
//       .expect('Content-Type', /application\/json/)

//     const usersAtEnd = await helper.usersInDb()
//     expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

//     const usernames = usersAtEnd.map(u => u.username)
//     expect(usernames).toContain(newUser.username)
//   })

//   test('creation fails with proper statuscode and message if username already taken', async () => {
//     const usersAtStart = await helper.usersInDb()

//     const newUser = {
//       username: 'root',
//       name: 'Superuser',
//       password: 'salainen',
//     }

//     const result = await api
//       .post('/api/users')
//       .send(newUser)
//       .expect(400)
//       .expect('Content-Type', /application\/json/)

//     expect(result.body.error).toContain('username must be unique')

//     const usersAtEnd = await helper.usersInDb()
//     expect(usersAtEnd).toEqual(usersAtStart)
//   })

// })


afterAll(() => mongoose.connection.close())

