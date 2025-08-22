import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'

// 样式
import 'element-plus/dist/index.css'
import '@/styles/index.scss'

// 权限指令
import { permissionDirective } from '@/utils/permission'

// 创建应用实例
const app = createApp(App)

// 注册全局指令
app.directive('permission', permissionDirective)

// 使用插件
app.use(pinia)
app.use(router)

// 挂载应用
app.mount('#app')