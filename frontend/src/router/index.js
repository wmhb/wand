import Vue from 'vue'
import Router from 'vue-router'

import Auth from '../auth'

const AdminView = () => import(/* webpackChunkName: "group-admin" */ 'components/AdminView')
const LoginView = () => import(/* webpackChunkName: "group-admin" */ 'components/LoginView')
const WandView = () => import('components/WandView')

const TwitterSubview = () => import('components/wandSubviews/TwitterSubview')
const SupporterSubview = () => import('components/wandSubviews/SupporterSubview')
const SpeakersSubview = () => import('components/wandSubviews/SpeakersSubview')
const NextSubview = () => import('components/wandSubviews/NextSubview')
const PlayingSubview = () => import('components/wandSubviews/PlayingSubview')

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'wand',
      component: WandView,
      redirect: '/twitter',
      children: [
        {
          path: 'twitter',
          component: TwitterSubview
        },
        {
          path: 'speakers/:id',
          component: SpeakersSubview
        },
        {
          path: 'speakers',
          redirect: '/speakers/0'
        },
        {
          path: 'supporter',
          component: SupporterSubview
        },
        {
          path: 'next',
          component: NextSubview
        },
        {
          path: 'playing',
          component: PlayingSubview
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
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
