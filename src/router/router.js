import { createWebHistory, createRouter } from 'vue-router'

import IndexView from '../App.vue'
import LoginView from '../Login.vue'

const routes = [
  {
    path: '/',
    component: () => import(IndexView),
    children: [
      {
        path: '/logindd',
        name: 'logindd',
        component: () => import(LoginView),
      },
    ],
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
