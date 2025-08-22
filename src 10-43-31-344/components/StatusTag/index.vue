<template>
  <el-tag
    :type="tagType"
    :size="size"
    :effect="effect"
    :round="round"
    :closable="closable"
    :disable-transitions="disableTransitions"
    :hit="hit"
    :color="customColor"
    :class="tagClass"
    @close="handleClose"
    @click="handleClick"
  >
    <el-icon v-if="icon" class="status-icon">
      <component :is="icon" />
    </el-icon>
    <span class="status-text">{{ displayText }}</span>
    <el-icon v-if="suffixIcon" class="suffix-icon">
      <component :is="suffixIcon" />
    </el-icon>
  </el-tag>
</template>

<script setup>
import { computed } from 'vue'
import {
  CircleCheck,
  CircleClose,
  Warning,
  InfoFilled,
  Clock,
  Loading,
  Lock,
  Unlock,
  View,
  Hide
} from '@element-plus/icons-vue'

// Props 定义
const props = defineProps({
  // 基础配置
  status: {
    type: [String, Number],
    default: ''
  },
  text: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: '',
    validator: (value) => ['', 'success', 'info', 'warning', 'danger'].includes(value)
  },
  
  // 状态映射配置
  statusMap: {
    type: Object,
    default: () => ({})
  },
  
  // 样式配置
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['large', 'default', 'small'].includes(value)
  },
  effect: {
    type: String,
    default: 'light',
    validator: (value) => ['dark', 'light', 'plain'].includes(value)
  },
  round: {
    type: Boolean,
    default: false
  },
  closable: {
    type: Boolean,
    default: false
  },
  disableTransitions: {
    type: Boolean,
    default: false
  },
  hit: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: ''
  },
  
  // 图标配置
  icon: {
    type: [String, Object],
    default: null
  },
  suffixIcon: {
    type: [String, Object],
    default: null
  },
  showIcon: {
    type: Boolean,
    default: true
  },
  
  // 自定义样式
  customClass: {
    type: String,
    default: ''
  },
  
  // 点击事件
  clickable: {
    type: Boolean,
    default: false
  }
})

// Emits 定义
const emit = defineEmits([
  'close',
  'click'
])

// 默认状态映射
const defaultStatusMap = {
  // 通用状态
  '1': { text: '启用', type: 'success', icon: CircleCheck },
  '0': { text: '禁用', type: 'danger', icon: CircleClose },
  'active': { text: '激活', type: 'success', icon: CircleCheck },
  'inactive': { text: '未激活', type: 'info', icon: CircleClose },
  'enabled': { text: '启用', type: 'success', icon: CircleCheck },
  'disabled': { text: '禁用', type: 'danger', icon: CircleClose },
  
  // 审核状态
  'pending': { text: '待审核', type: 'warning', icon: Clock },
  'approved': { text: '已通过', type: 'success', icon: CircleCheck },
  'rejected': { text: '已拒绝', type: 'danger', icon: CircleClose },
  'reviewing': { text: '审核中', type: 'warning', icon: Loading },
  
  // 订单状态
  'unpaid': { text: '待支付', type: 'warning', icon: Clock },
  'paid': { text: '已支付', type: 'success', icon: CircleCheck },
  'shipped': { text: '已发货', type: 'info', icon: InfoFilled },
  'delivered': { text: '已送达', type: 'success', icon: CircleCheck },
  'cancelled': { text: '已取消', type: 'danger', icon: CircleClose },
  'refunded': { text: '已退款', type: 'warning', icon: Warning },
  
  // 用户状态
  'online': { text: '在线', type: 'success', icon: CircleCheck },
  'offline': { text: '离线', type: 'info', icon: CircleClose },
  'banned': { text: '已封禁', type: 'danger', icon: Lock },
  'normal': { text: '正常', type: 'success', icon: CircleCheck },
  
  // 任务状态
  'todo': { text: '待处理', type: 'info', icon: Clock },
  'doing': { text: '进行中', type: 'warning', icon: Loading },
  'done': { text: '已完成', type: 'success', icon: CircleCheck },
  'failed': { text: '失败', type: 'danger', icon: CircleClose },
  
  // 可见性状态
  'visible': { text: '显示', type: 'success', icon: View },
  'hidden': { text: '隐藏', type: 'info', icon: Hide },
  
  // 锁定状态
  'locked': { text: '锁定', type: 'warning', icon: Lock },
  'unlocked': { text: '解锁', type: 'success', icon: Unlock }
}

// 计算属性
const statusConfig = computed(() => {
  const mergedMap = { ...defaultStatusMap, ...props.statusMap }
  return mergedMap[props.status] || {}
})

const displayText = computed(() => {
  if (props.text) {
    return props.text
  }
  return statusConfig.value.text || props.status
})

const tagType = computed(() => {
  if (props.type) {
    return props.type
  }
  return statusConfig.value.type || 'info'
})

const displayIcon = computed(() => {
  if (props.icon) {
    return props.icon
  }
  if (props.showIcon && statusConfig.value.icon) {
    return statusConfig.value.icon
  }
  return null
})

const customColor = computed(() => {
  if (props.color) {
    return props.color
  }
  return statusConfig.value.color || ''
})

const tagClass = computed(() => {
  const classes = ['status-tag']
  
  if (props.customClass) {
    classes.push(props.customClass)
  }
  
  if (props.clickable) {
    classes.push('clickable')
  }
  
  if (displayIcon.value) {
    classes.push('has-icon')
  }
  
  return classes.join(' ')
})

// 事件处理
const handleClose = (event) => {
  emit('close', event)
}

const handleClick = (event) => {
  if (props.clickable) {
    emit('click', event, props.status)
  }
}

// 暴露配置给父组件
defineExpose({
  statusConfig,
  defaultStatusMap
})
</script>

<style scoped>
.status-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  vertical-align: middle;
}

.status-tag.clickable {
  cursor: pointer;
  transition: all 0.2s;
}

.status-tag.clickable:hover {
  opacity: 0.8;
  transform: translateY(-1px);
}

.status-icon,
.suffix-icon {
  font-size: 12px;
}

.status-text {
  font-weight: 500;
}

/* 不同尺寸的图标调整 */
.status-tag.el-tag--large .status-icon,
.status-tag.el-tag--large .suffix-icon {
  font-size: 14px;
}

.status-tag.el-tag--small .status-icon,
.status-tag.el-tag--small .suffix-icon {
  font-size: 10px;
}

/* 圆形标签的图标调整 */
.status-tag.el-tag--round.has-icon {
  padding-left: 8px;
  padding-right: 12px;
}

/* 深色效果的图标颜色调整 */
.status-tag.el-tag--dark .status-icon,
.status-tag.el-tag--dark .suffix-icon {
  color: currentColor;
}

/* 动画效果 */
.status-tag {
  transition: all 0.2s ease-in-out;
}

.status-tag:not(.el-tag--disable-transitions):hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 自定义状态颜色 */
.status-tag.custom-success {
  --el-tag-bg-color: #f0f9ff;
  --el-tag-border-color: #67c23a;
  --el-tag-text-color: #67c23a;
}

.status-tag.custom-warning {
  --el-tag-bg-color: #fdf6ec;
  --el-tag-border-color: #e6a23c;
  --el-tag-text-color: #e6a23c;
}

.status-tag.custom-danger {
  --el-tag-bg-color: #fef0f0;
  --el-tag-border-color: #f56c6c;
  --el-tag-text-color: #f56c6c;
}

.status-tag.custom-info {
  --el-tag-bg-color: #f4f4f5;
  --el-tag-border-color: #909399;
  --el-tag-text-color: #909399;
}
</style>