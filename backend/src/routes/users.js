const express = require('express')

const router = express.Router()

const User = require('../models/user')
const Photo = require('../models/photo')

/* GET users listing. */
router.get('/', async (req, res) => {
  console.log(req.method)
  console.log('test!!!')
  const query = {}

  if (req.query.firstName) {
    query.firstName = req.query.firstName
  }

  if (req.query.lastName) {
    query.lastName = req.query.lastName
  }

  if (req.query.email) {
    query.email = req.query.email
  }

  if (req.query.age) {
    query.age = req.query.age
  }

  if (req.query.belt) {
    query.belt = req.query.belt
  }

  res.send(await User.find(query))
})

/* POST create a user */
router.post('/', async (req, res) => {
  const createdUser = await User.create(req.body)
  res.send(createdUser)
})

/* DELETE users */
router.delete('/', async (req, res) => {
  await User.deleteMany({})

  res.sendStatus(200)
})

/* DELETE a user */
router.delete('/byEmail/:email', async (req, res) => {
  console.log(req.params.email)

  await User.deleteOne({ email: req.params.email })

  res.sendStatus(200)
})

router.get('/initialize', async (req, res) => {
  // temporary delete for development
  // await User.deleteMany({})
  const mihri = await User.create({ firstName: 'mihri', age: 35, email: `mihri@example.com`, belt: 'white' })
  const armagan = await User.create({ firstName: 'armagan', age: 36, email: `armagan@example.com`, belt: 'yellow' })

  const steve = await User.create({
    firstName: 'steve',
    lastName: 'steve',
    age: 21,
    email: `steve@example.com`,
    belt: 'orange',
    city: 'berlin',
  })

  // await steve.setPassword('test')
  // await steve.save()

  mihri.setPassword('test')
  armagan.setPassword('test')
  steve.setPassword('test')

  steve.bio = 'An awesome hacker who has seen it all, and now sharing them all with you.'

  const berlinPhoto = await Photo.create({ filename: 'berlin.jpg' })
  const munichPhoto = await Photo.create({ filename: 'munich.jpg' })

  await steve.addPhoto(berlinPhoto)
  await steve.addPhoto(munichPhoto)

  await armagan.likePhoto(berlinPhoto)
  await mihri.likePhoto(berlinPhoto)

  res.sendStatus(200)
})

router.post('/:userId/adds', async (req, res) => {
  const user = await User.findById(req.params.userId)
  const photo = await Photo.findById(req.body.photoId)

  await user.addPhoto(photo)
  res.sendStatus(200)
})

router.post('/:userId/likes', async (req, res) => {
  const user = await User.findById(req.params.userId)
  const photo = await Photo.findById(req.body.photoId)

  await user.likePhoto(photo)
  res.sendStatus(200)
})

router.get('/:userId', async (req, res) => {
  console.log('Hello Karatekas')
  const user = await User.findById(req.params.userId)

  if (user) res.render('user', { user })
  else res.sendStatus(404)
})

router.get('/:userId/json', async (req, res) => {
  const user = await User.findById(req.params.userId)
  res.send(user)
})

router.delete('/', async (req, res) => {
  await User.deleteMany({})
  res.send()
})
module.exports = router
