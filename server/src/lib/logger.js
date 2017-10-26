const tracer = require('tracer')
const colors = require('colors')

module.exports = tracer.colorConsole(
  {
    level: (process.env.LOG_LEVEL === 'info') ? 'info' : 'error',
    format: [
      '({{timestamp}})'.italic + ' [{{title}}]'.bold + ' {{message}}' + ''.white, // default format
      {
        error: '({{timestamp}})'.italic + ' [{{title}}]'.bold + ' {{message}}' + ''.white + ' (in {{file}}:{{line}})'.italic + '\nCall Stack:\n{{stack}}' // error format
      }
    ],
    filters: [
      colors.underline, colors.white,
      // the last item can be custom filter. here is "warn" and "error" filter
      {
        info: colors.blue,
        warn: colors.yellow,
        error: colors.red
      }
    ],
    dateformat: 'HH:MM:ss',
    preprocess: (data) => {
      data.title = data.title.toUpperCase()
    }
  }
)
