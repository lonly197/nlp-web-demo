import Vue from 'vue'
import Router from 'vue-router'
import Home from './pages/home'
import Seg from './pages/seg'
import Ner from './pages/ner'
import Tag from './pages/tag'
import Summary from './pages/summary'
import Parser from './pages/parser'

Vue.use(Router)

export default new Router({
  routes: [
    {
    path: '/',
    component: Home,
    children: [
      {
        path: '/home',
        redirect: '/'
      },
      {
        path: '/seg',
        name: 'seg',
        component: Seg
      },
      {
        path: '/tag',
        name: 'tag',
        component: Tag
      },
      {
        path: '/ner',
        name: 'ner',
        component: Ner
      },
      {
        path: '/summary',
        name: 'summary',
        component: Summary
      },
      {
        path: '/parser',
        name: 'parser',
        component: Parser
      }
    ]
  }]
})
