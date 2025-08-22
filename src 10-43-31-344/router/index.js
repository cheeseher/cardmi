import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 配置 NProgress
NProgress.configure({ showSpinner: false })

// 布局组件
const Layout = () => import('@/layout/index.vue')

// 路由配置
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      hidden: true
    }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          title: '首页',
          icon: 'House',
          affix: true
        }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/list',
    meta: {
      title: '用户管理',
      icon: 'User'
    },
    children: [
      {
        path: 'list',
        name: 'UserList',
        component: () => import('@/views/user/index.vue'),
        meta: {
          title: '用户列表',
          icon: 'UserFilled',
          permissions: ['user:view']
        }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/list',
    meta: {
      title: '订单管理',
      icon: 'ShoppingCart'
    },
    children: [
      {
        path: 'list',
        name: 'OrderList',
        component: () => import('@/views/order/index.vue'),
        meta: {
          title: '订单列表',
          icon: 'List',
          permissions: ['order:view']
        }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/menu',
    meta: {
      title: '系统管理',
      icon: 'Setting'
    },
    children: [
      {
        path: 'menu',
        name: 'MenuManagement',
        component: () => import('@/views/system/menu.vue'),
        meta: {
          title: '菜单管理',
          icon: 'Menu',
          permissions: ['system:menu']
        }
      },
      {
        path: 'role',
        name: 'RoleManagement',
        component: () => import('@/views/system/role.vue'),
        meta: {
          title: '角色管理',
          icon: 'Avatar',
          permissions: ['system:role']
        }
      }
    ]
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '404',
      hidden: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    meta: {
      hidden: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  
  const userStore = useUserStore()
  const appStore = useAppStore()
  
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - CardMi 管理系统` : 'CardMi 管理系统'
  
  // 生成面包屑
  const breadcrumbs = generateBreadcrumbs(to)
  appStore.setBreadcrumbs(breadcrumbs)
  
  // 白名单路由
  const whiteList = ['/login', '/404']
  
  if (whiteList.includes(to.path)) {
    next()
    return
  }
  
  // 检查登录状态
  if (!userStore.isLoggedIn) {
    next('/login')
    return
  }
  
  // 检查权限
  if (to.meta.permissions && !hasRoutePermission(to, userStore)) {
    next('/404')
    return
  }
  
  next()
})

router.afterEach(() => {
  NProgress.done()
})

// 生成面包屑导航
function generateBreadcrumbs(route) {
  const breadcrumbs = []
  const matched = route.matched.filter(item => item.meta && item.meta.title)
  
  matched.forEach(item => {
    breadcrumbs.push({
      title: item.meta.title,
      path: item.path
    })
  })
  
  return breadcrumbs
}

// 检查路由权限
function hasRoutePermission(route, userStore) {
  const permissions = route.meta.permissions
  if (!permissions || permissions.length === 0) return true
  
  return permissions.some(permission => userStore.hasPermission(permission))
}

export default router