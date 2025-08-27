import { createRouter, createWebHistory } from 'vue-router'
import AdminLayout from '../admin/components/AdminLayout.vue'
import MerchantDashboard from '../merchant/components/MerchantDashboard.vue'

const routes = [
  {
    path: '/',
    redirect: '/admin'
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminLayout,
    meta: { title: '管理员后台' }
  },
  {
    path: '/merchant',
    name: 'Merchant', 
    component: MerchantDashboard,
    meta: { title: '商户后台' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫，设置页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router