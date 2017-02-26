let express = require('express')
let _ = require('underscore')
let config = require('./../config/config')
let jwt = require('jsonwebtoken')

let app = module.exports = express.Router()

// XXX: This should be a database of users :).
let users = [
  {
    id: 1,
    username: 'admin',
    password: 'pass',
    role: 'admin'
  }
]

function createAdminToken (user) {
  return jwt.sign(_.omit(user, 'password'), config.secret, { expiresIn: 60 * 5 })
}

function getUserScheme (req) {
  let username
  let type
  let userSearch = {}

  if (req.body.username) { // The POST contains a username and not an email
    username = req.body.username
    type = 'username'
    userSearch = { username: username }
  } else if (req.body.email) { // The POST contains an email and not an username
    username = req.body.email
    type = 'email'
    userSearch = { email: username }
  }

  return {
    username: username,
    type: type,
    userSearch: userSearch
  }
}

app.get('/auth/check', function (req, res) {
  console.log('/USER/AUTH/', req.headers.authorization)
  try {
    let token = req.headers['authorization'].replace(/^Bearer\s/, '')
    var decoded = jwt.verify(token, config.secret)
    console.log('dec', decoded)
    res.status(201).send({valid: true})
  } catch (err) {
    console.log('err', err)
    res.status(401).send({valid: false})
  }
})

app.post('/auth/login', function (req, res) {
  let userScheme = getUserScheme(req)

  if (!userScheme.username || !req.body.password) {
    return res.status(401).send('You must submit your username AND password')
  }

  let user = _.find(users, userScheme.userSearch)

  if (!user) {
    return res.status(401).send('Ooops! Something went wrong!')
  }

  if (user.password !== req.body.password) {
    return res.status(401).send('Ooops! Something went wrong!')
  }

  if (user.role === 'admin') {
    console.log('success...creating token for ' + user.username)
    res.status(201).send({
      id_token: createAdminToken(user)
    })
  }
})
