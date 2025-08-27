import { createRouter, createWebHistory } from 'vue-router'
import MerchantDashboard from '../components/MerchantDashboard.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: MerchantDashboard
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router