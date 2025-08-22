<template>
  <div v-if="!item.meta?.hidden">
    <!-- 有子菜单的情况 -->
    <el-sub-menu
      v-if="hasChildren"
      :index="item.path"
      :popper-append-to-body="true"
    >
      <template #title>
        <el-icon v-if="item.meta?.icon">
          <component :is="item.meta.icon" />
        </el-icon>
        <span>{{ item.meta?.title }}</span>
      </template>
      
      <sidebar-item
        v-for="child in visibleChildren"
        :key="child.path"
        :item="child"
        :base-path="resolvePath(child.path)"
      />
    </el-sub-menu>
    
    <!-- 单个菜单项 -->
    <el-menu-item
      v-else
      :index="resolvePath(item.path)"
    >
      <el-icon v-if="item.meta?.icon">
        <component :is="item.meta.icon" />
      </el-icon>
      <template #title>
        <span>{{ item.meta?.title }}</span>
      </template>
    </el-menu-item>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  basePath: {
    type: String,
    default: ''
  }
})

const userStore = useUserStore()

// 计算可见的子菜单
const visibleChildren = computed(() => {
  if (!props.item.children) return []
  
  return props.item.children.filter(child => {
    // 过滤隐藏的菜单
    if (child.meta?.hidden) return false
    
    // 检查权限
    if (child.meta?.permissions) {
      return child.meta.permissions.some(permission => 
        userStore.hasPermission(permission)
      )
    }
    
    return true
  })
})

// 是否有子菜单
const hasChildren = computed(() => {
  return visibleChildren.value.length > 0
})

// 解析路径
const resolvePath = (routePath) => {
  if (routePath.startsWith('/')) {
    return routePath
  }
  // 简单的路径拼接逻辑
  const basePath = props.basePath.endsWith('/') ? props.basePath.slice(0, -1) : props.basePath
  const route = routePath.startsWith('/') ? routePath : '/' + routePath
  return basePath + route
}
</script>