const config = require('./config/config')
const logger = require('./lib/logger')
const argv = require('minimist')(process.argv.slice(2))
const port = parseInt(argv.p) || config.ports.node
const util = require('util')

let request = require('request')
let express = require('express')
let app = express()
let http = require('http').Server(app)
let bodyParser = require('body-parser')

let wand = require('./lib/wand')
let io = wand.listen(http)
let namespaces = io.nsps

/**
 * WMHB Events
 */
function transformEvents (events) {
  let index = events[0].talks.findIndex(item => item.speaker === 'Du?' || item.title === 'Du?')
  if (index >= 0) {
    events[0].talks.splice(index, 1)
  }
  events[0].talks.forEach(function (el, i) {
    el['imgUrl'] = events[0].url + '/' + el.img
  })

  return events
}

function getEvents () {
  return new Promise(function (resolve, reject) {
    request(config.eventsAPIHost + config.eventsAPIPath, function (err, response, body) {
      if (err) return reject(err)
      try {
        resolve(transformEvents(JSON.parse(body)))
      } catch (e) {
        reject(e)
      }
    })
  })
}

/**
 * Node Express Boilerplate
 */
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.use(require('./lib/admin'))
app.use(require('./lib/auth'))

app.get('/events/all', function (req, res) {
  getEvents()
    .then((event) => {
      res.status(200).send({
        events: event
      })
    })
    .catch((e) => {
      res.status(500, {
        error: e
      })
    })
})

app.get('/config',
  function (req, res) {
    res.status(200).send({
      config: {
        APIUrl: config.APIHost + config.APIUrl,
        APIEvents: config.APIHost + config.APIEventsUrl,
        APILoginUrl: config.APIHost + config.APILoginUrl,
        APIAuthUrl: config.APIHost + config.APIAuthUrl,
        ports: config.ports,
        soundcloud: config.soundcloud
      }
    })
  })

app.use(function (err, req, res, next) {
  if (err.name === 'StatusError') {
    res.send(err.status, err.message)
  } else {
    next(err)
  }
})

http.listen(port, (err) => {
  if (err) {
    return err
  }
  logger.info('[main.http.listen]'.green, ' - listening on http://localhost:' + port + ' with ARGS: [' + util.inspect(argv, false, null) + ']'.white)
  logger.info('[main.http.listen]'.green, ' - socket.io listening on namespaces: ' + Object.keys(namespaces).toString() + ''.white)
})

// Kill Process correctly
process.on('SIGINT', () => {
  logger.warn('[main.SIGINT]'.yellow.bold, ' - Caught SIGINT. Exiting in 2 second.'.yellow.bold)

  setTimeout(() => {
    process.exit(0)
  }, 2000)
})
