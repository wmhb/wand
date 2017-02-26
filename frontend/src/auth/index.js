// URL and endpoint constants
const API_URL = 'http://localhost:8080/'
const AUTH_URL = API_URL + 'auth/check/'
const LOGIN_URL = API_URL + 'auth/login/'

import axios from 'axios'
import router from '../router'

export default {
  // Send a request to the login URL and save the returned JWT
  login (context, creds, redirect) {
    axios.post(LOGIN_URL, creds).then((res) => {
      console.log('LOGIN', res)
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
    router.push('/')
  },
  checkAuth () {
    let localHeader = this.getAuthHeader()
    return new Promise(function (resolve, reject) {
      axios.get(AUTH_URL, {headers: localHeader})
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
