var webpack = require('webpack')
var path = require('path')
var fs = require('fs')

var nodeModules = {
  './config': 'require("./config")'
}

fs.readdirSync('node_modules')
  .filter(function (x) {
    return ['.bin'].indexOf(x) === -1
  })
  .forEach(function (mod) {
    nodeModules[mod] = 'commonjs ' + mod
  })

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

function assetsPath (_path) {
  var assetsSubDirectory = ''
  return path.posix.join(assetsSubDirectory, _path)
}

var webpackConfig = {
  entry: './src/main.js',
  target: 'node',
  externals: nodeModules,

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      mangle: false,
      compress: false
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          configFile: './.eslintrc',
          failOnError: true,
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      }
    ]
  },
  devtool: '#source-map',
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].js',
    chunkFilename: '[id].js'
  }
}

module.exports = webpackConfig
