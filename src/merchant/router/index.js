import { createRouter, createWebHistory } from 'vue-router'
import MerchantDashboard from '../components/MerchantDashboard.vue'
import ResetPassword from '../components/ResetPassword.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: MerchantDashboard
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router