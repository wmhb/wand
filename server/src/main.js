let util = require('util')
let express = require('express')
let app = express()
let http = require('http').Server(app)
let bodyParser = require('body-parser')
let argv = require('minimist')(process.argv.slice(2))
let port = parseInt(argv.p) || 65510

let wand = require('./lib/wand')
let io = wand.listen(http)
let namespaces = io.nsps

/*
  NODE INIT BOILERPLATE FOO
 */
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(require('./lib/admin'))
app.use(require('./lib/auth'))

app.use(function (err, req, res, next) {
  if (err.name === 'StatusError') {
    res.send(err.status, err.message)
  } else {
    next(err)
  }
})

http.listen(port, (err) => {
  if (err) {
    console.log(err.stack)
  }
  console.log('[INFO]'.blue.bold, '[main.http.listen]'.green, '-', 'listening on http://localhost:' + port + ' with ARGS: [' + util.inspect(argv, false, null) + ']')
  console.log('[INFO]'.blue.bold, '[main.http.listen]'.green, '-', 'socket.io listening on namespaces: ' + Object.keys(namespaces).toString())
})

// Kill Process correctly
process.on('SIGINT', () => {
  console.log('[SYSTEM]'.yellow.bold.underline, '[main.SIGINT]'.yellow.bold, '-', 'Caught SIGINT. Exiting in 2 second.'.yellow.bold)

  setTimeout(() => {
    process.exit(0)
  }, 2000)
})
