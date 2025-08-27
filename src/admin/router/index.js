import { createRouter, createWebHistory } from 'vue-router'
import AdminLayout from '../components/AdminLayout.vue'

const routes = [
  {
    path: '/',
    name: 'AdminLayout',
    component: AdminLayout
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router