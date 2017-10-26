const logger = require('./logger')

let express = require('express')
let _ = require('underscore')
let config = require('./../config/config')
let jwt = require('jsonwebtoken')

let app = module.exports = express.Router()

function createAdminToken (user) {
  return jwt.sign(_.omit(user, 'password'), config.secret, { expiresIn: '4h' })
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
  try {
    let token = req.headers['authorization'].replace(/^Bearer\s/, '')
    jwt.verify(token, config.secret)
    res.status(201).send({valid: true})
  } catch (err) {
    res.status(401).send({valid: false})
  }
})

app.post('/auth/login', function (req, res) {
  let userScheme = getUserScheme(req)

  if (!userScheme.username || !req.body.password) {
    return res.status(401).send('You must submit your username AND password')
  }

  let user = _.find(config.users, userScheme.userSearch)

  if (!user) {
    return res.status(401).send('Ooops! Something went wrong!')
  }

  if (user.password !== req.body.password) {
    return res.status(401).send('Ooops! Something went wrong!')
  }

  if (user.role === 'admin') {
    logger.info('[wand.auth.login]'.green, ' - User ' + user.username + ' logged in successfully.'.white)
    res.status(201).send({
      id_token: createAdminToken(user)
    })
  }
})
