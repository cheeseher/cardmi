<template>
  <div class="page-container">
    <!-- 统计卡片 -->
    <div class="stats-container">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :lg="6" v-for="item in statsData" :key="item.title">
          <el-card class="stats-card" shadow="hover">
            <div class="stats-content">
              <div class="stats-info">
                <h3 class="stats-title">{{ item.title }}</h3>
                <p class="stats-value">{{ item.value }}</p>
                <p class="stats-desc" :class="item.trend">
                  <el-icon><component :is="item.icon" /></el-icon>
                  {{ item.desc }}
                </p>
              </div>
              <div class="stats-icon" :style="{ backgroundColor: item.color }">
                <el-icon size="24"><component :is="item.mainIcon" /></el-icon>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 图表区域 -->
    <el-row :gutter="20" class="charts-container">
      <!-- 访问量趋势 -->
      <el-col :xs="24" :lg="12">
        <el-card class="chart-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span>访问量趋势</span>
              <el-button type="text">更多</el-button>
            </div>
          </template>
          <div class="chart-placeholder">
            <el-icon size="48" color="#ddd"><TrendCharts /></el-icon>
            <p>图表区域 (可集成 ECharts)</p>
          </div>
        </el-card>
      </el-col>
      
      <!-- 用户分布 -->
      <el-col :xs="24" :lg="12">
        <el-card class="chart-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span>用户分布</span>
              <el-button type="text">更多</el-button>
            </div>
          </template>
          <div class="chart-placeholder">
            <el-icon size="48" color="#ddd"><PieChart /></el-icon>
            <p>图表区域 (可集成 ECharts)</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 快捷操作 -->
    <el-card class="quick-actions" shadow="never">
      <template #header>
        <span>快捷操作</span>
      </template>
      <el-row :gutter="16">
        <el-col :xs="12" :sm="8" :md="6" v-for="action in quickActions" :key="action.title">
          <div class="action-item" @click="handleQuickAction(action.action)">
            <el-icon size="32" :color="action.color">
              <component :is="action.icon" />
            </el-icon>
            <p>{{ action.title }}</p>
          </div>
        </el-col>
      </el-row>
    </el-card>
    
    <!-- 最新动态 -->
    <el-row :gutter="20">
      <el-col :xs="24" :lg="12">
        <el-card class="activity-card" shadow="never">
          <template #header>
            <span>最新动态</span>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="activity in activities"
              :key="activity.id"
              :timestamp="activity.time"
              :color="activity.color"
            >
              {{ activity.content }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :lg="12">
        <el-card class="notice-card" shadow="never">
          <template #header>
            <span>系统公告</span>
          </template>
          <div class="notice-list">
            <div
              v-for="notice in notices"
              :key="notice.id"
              class="notice-item"
            >
              <el-tag :type="notice.type" size="small">{{ notice.tag }}</el-tag>
              <span class="notice-title">{{ notice.title }}</span>
              <span class="notice-time">{{ notice.time }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  User,
  ShoppingCart,
  Money,
  DataAnalysis,
  TrendCharts,
  PieChart,
  Plus,
  Edit,
  View,
  Setting,
  ArrowUp,
  ArrowDown
} from '@element-plus/icons-vue'

const router = useRouter()

// 统计数据
const statsData = ref([
  {
    title: '总用户数',
    value: '12,345',
    desc: '较昨日 +12%',
    trend: 'up',
    color: '#409EFF',
    mainIcon: User,
    icon: ArrowUp
  },
  {
    title: '订单总数',
    value: '8,765',
    desc: '较昨日 +8%',
    trend: 'up',
    color: '#67C23A',
    mainIcon: ShoppingCart,
    icon: ArrowUp
  },
  {
    title: '销售额',
    value: '¥234,567',
    desc: '较昨日 -3%',
    trend: 'down',
    color: '#E6A23C',
    mainIcon: Money,
    icon: ArrowDown
  },
  {
    title: '访问量',
    value: '45,678',
    desc: '较昨日 +15%',
    trend: 'up',
    color: '#F56C6C',
    mainIcon: DataAnalysis,
    icon: ArrowUp
  }
])

// 快捷操作
const quickActions = ref([
  { title: '新增用户', icon: Plus, color: '#409EFF', action: 'addUser' },
  { title: '创建订单', icon: Plus, color: '#67C23A', action: 'addOrder' },
  { title: '查看报表', icon: View, color: '#E6A23C', action: 'viewReport' },
  { title: '系统设置', icon: Setting, color: '#F56C6C', action: 'settings' }
])

// 最新动态
const activities = ref([
  {
    id: 1,
    content: '用户 张三 注册了新账号',
    time: '2024-01-15 10:30',
    color: '#409EFF'
  },
  {
    id: 2,
    content: '订单 #12345 已完成支付',
    time: '2024-01-15 09:45',
    color: '#67C23A'
  },
  {
    id: 3,
    content: '系统进行了安全更新',
    time: '2024-01-15 08:20',
    color: '#E6A23C'
  },
  {
    id: 4,
    content: '新增了 5 个商品分类',
    time: '2024-01-14 16:30',
    color: '#F56C6C'
  }
])

// 系统公告
const notices = ref([
  {
    id: 1,
    title: '系统维护通知：将于本周六进行系统升级',
    tag: '重要',
    type: 'danger',
    time: '2024-01-15'
  },
  {
    id: 2,
    title: '新功能上线：支持批量导入用户数据',
    tag: '功能',
    type: 'success',
    time: '2024-01-14'
  },
  {
    id: 3,
    title: '优化：提升了系统响应速度',
    tag: '优化',
    type: 'info',
    time: '2024-01-13'
  }
])

// 处理快捷操作
const handleQuickAction = (action) => {
  switch (action) {
    case 'addUser':
      router.push('/user/list')
      break
    case 'addOrder':
      router.push('/order/list')
      break
    case 'viewReport':
      console.log('查看报表')
      break
    case 'settings':
      router.push('/system/menu')
      break
  }
}
</script>

<style lang="scss" scoped>
.stats-container {
  margin-bottom: $spacing-xl;
  
  .stats-card {
    .stats-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .stats-info {
        flex: 1;
        
        .stats-title {
          font-size: 14px;
          color: $text-color-secondary;
          margin: 0 0 $spacing-sm 0;
          font-weight: normal;
        }
        
        .stats-value {
          font-size: 24px;
          font-weight: bold;
          color: $text-color-primary;
          margin: 0 0 $spacing-xs 0;
        }
        
        .stats-desc {
          font-size: 12px;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 4px;
          
          &.up {
            color: $success-color;
          }
          
          &.down {
            color: $danger-color;
          }
        }
      }
      
      .stats-icon {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        opacity: 0.8;
      }
    }
  }
}

.charts-container {
  margin-bottom: $spacing-xl;
  
  .chart-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .chart-placeholder {
      height: 300px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: $text-color-placeholder;
      
      p {
        margin-top: $spacing-md;
        font-size: 14px;
      }
    }
  }
}

.quick-actions {
  margin-bottom: $spacing-xl;
  
  .action-item {
    text-align: center;
    padding: $spacing-lg;
    border-radius: $border-radius-base;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      background-color: $background-color-base;
      transform: translateY(-2px);
    }
    
    p {
      margin: $spacing-sm 0 0 0;
      font-size: 14px;
      color: $text-color-regular;
    }
  }
}

.activity-card,
.notice-card {
  height: 400px;
  
  :deep(.el-card__body) {
    height: calc(100% - 60px);
    overflow-y: auto;
  }
}

.notice-list {
  .notice-item {
    display: flex;
    align-items: center;
    padding: $spacing-md 0;
    border-bottom: 1px solid $border-color-lighter;
    
    &:last-child {
      border-bottom: none;
    }
    
    .notice-title {
      flex: 1;
      margin: 0 $spacing-md;
      font-size: 14px;
      color: $text-color-regular;
    }
    
    .notice-time {
      font-size: 12px;
      color: $text-color-placeholder;
    }
  }
}
</style>