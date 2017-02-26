import Vue from 'vue'
import Router from 'vue-router'

import Auth from '../auth'

import Wand from 'components/Wand'
import Twitterwall from 'components/nested/Twitterwall'
import Sponsors from 'components/nested/Sponsors'
import Admin from 'components/Admin'
import Login from 'components/Login'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'wand',
      component: Wand,
      children: [
        {
          path: '',
          component: Twitterwall
        },
        {
          path: 'sponsors',
          component: Sponsors
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
      beforeEnter: (to, from, next) => {
        Auth.checkAuth().then(res => {
          next()
        }).catch(reason => {
          next({ path: '/login' })
          return
        })
      }
    }
  ]
})

export default router
