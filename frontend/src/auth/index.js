import Store from '../store'
import Router from '../router'
import Axios from 'axios'

// Add a response interceptor
Axios.interceptors.response.use((response) => { // intercept the global error
  return response
}, function (error) {
  let originalRequest = error.config
  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true
    localStorage.removeItem('id_token')
    Router.push('/')
    return
  }
  // Do something with response error
  return Promise.reject(error)
})

export default {
  // Send a request to the login URL and save the returned JWT
  login (context, creds, redirect) {
    Axios.post(Store.getters.config.APILoginUrl, creds).then((res) => {
      localStorage.setItem('id_token', res.data.id_token)
      // Redirect to a specified route
      if (redirect) {
        context.$router.push({'name': redirect})
      }
    }, (err) => {
      context.error = err.response.data
    })
  },
  // To log out, we just need to remove the token
  logout () {
    localStorage.removeItem('id_token')
    Router.push('/')
  },
  checkAuth () {
    let localHeader = this.getAuthHeader()
    return new Promise(function (resolve, reject) {
      Axios.get(Store.getters.config.APIAuthUrl, {headers: localHeader})
        .then(
          res => {
            resolve(res.data)
          }
        )
        .catch(
          err => {
            reject(err.response.status)
          }
        )
    })
  },

  // The object to be passed as a header for authenticated requests
  getAuthHeader () {
    return {
      'Authorization': 'Bearer ' + localStorage.getItem('id_token')
    }
  }
}
