[![Build Status](https://travis-ci.org/wmhb/wand.svg?branch=travis)](https://travis-ci.org/wmhb/wand)

# wand

> A Webmontag Bremen twitterwall

## First things first...
This project is a WIP and should be treated as such.
There are *many*, *maaaaaany* things that are not quite up to snuff, in terms of best, no, any practices, yet.
So, bear with me. :)

Nevertheless, any feedback is greatly appreciated. :)

## Build Setup

WAND consists of two parts / folders. ``server`` and ``frontend``.
The following steps are required for a dev & prod build.

### Server
``` bash
# switch to server directory
cd server

# install dependencies
npm install

# start nodejs server locally
npm run server

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

### Frontend
``` bash
# switch to frontend directory
cd frontend

# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

This frontend part of this project is build with the vue-cli webpack template.

For further explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
