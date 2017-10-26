import Vue from 'vue'
import Router from 'vue-router'

import Auth from '../auth'

import Wand from 'components/Wand'
import Twitterwall from 'components/nested/Twitterwall'
import Sponsors from 'components/nested/Sponsors'
import Speakers from 'components/nested/Speakers'
import NextWmhb from 'components/nested/NextWmhb'
import NowPlaying from 'components/nested/NowPlaying'

import Admin from 'components/Admin'
import Login from 'components/Login'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'wand',
      component: Wand,
      redirect: '/twitter',
      children: [
        {
          path: 'twitter',
          component: Twitterwall
        },
        {
          path: 'speakers/:id',
          component: Speakers
        },
        {
          path: 'speakers',
          redirect: '/speakers/0'
        },
        {
          path: 'sponsors',
          component: Sponsors
        },
        {
          path: 'next',
          component: NextWmhb
        },
        {
          path: 'nowplaying',
          component: NowPlaying
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
        })
      }
    }
  ]
})

export default router
