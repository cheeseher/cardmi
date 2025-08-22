<template>
  <el-card class="stat-card" shadow="hover">
    <div class="stat-content">
      <div class="stat-icon">
        <el-icon :size="iconSize" :color="iconColor">
          <component :is="icon" />
        </el-icon>
      </div>
      <div class="stat-info">
        <div class="stat-title">{{ title }}</div>
        <div class="stat-value" :style="{ color: valueColor }">
          {{ formattedValue }}
        </div>
        <div class="stat-trend" v-if="trend">
          <el-icon :color="trendColor">
            <ArrowUp v-if="trend > 0" />
            <ArrowDown v-if="trend < 0" />
            <Minus v-if="trend === 0" />
          </el-icon>
          <span :style="{ color: trendColor }">
            {{ Math.abs(trend) }}%
          </span>
          <span class="trend-text">{{ trendText }}</span>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { computed } from 'vue'
import { ArrowUp, ArrowDown, Minus } from '@element-plus/icons-vue'

// 统计卡片组件 - 用于展示关键数据指标
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    required: true
  },
  icon: {
    type: [String, Object],
    required: true
  },
  iconColor: {
    type: String,
    default: 'var(--el-color-primary)'
  },
  iconSize: {
    type: Number,
    default: 32
  },
  valueColor: {
    type: String,
    default: 'var(--el-text-color-primary)'
  },
  trend: {
    type: Number,
    default: null
  },
  trendText: {
    type: String,
    default: '较上期'
  },
  formatter: {
    type: Function,
    default: null
  }
})

const formattedValue = computed(() => {
  if (props.formatter) {
    return props.formatter(props.value)
  }
  
  if (typeof props.value === 'number') {
    return props.value.toLocaleString()
  }
  
  return props.value
})

const trendColor = computed(() => {
  if (props.trend > 0) return 'var(--el-color-success)'
  if (props.trend < 0) return 'var(--el-color-danger)'
  return 'var(--el-text-color-regular)'
})
</script>

<style scoped>
.stat-card {
  height: 120px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-content {
  display: flex;
  align-items: center;
  height: 100%;
  gap: 16px;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background-color: var(--el-fill-color-extra-light);
  border-radius: 12px;
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
}

.stat-title {
  font-size: 14px;
  color: var(--el-text-color-regular);
  font-weight: 500;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.2;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}

.trend-text {
  color: var(--el-text-color-secondary);
  margin-left: 4px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stat-card {
    height: 100px;
  }
  
  .stat-content {
    gap: 12px;
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
  }
  
  .stat-value {
    font-size: 20px;
  }
}

@media (max-width: 576px) {
  .stat-card {
    height: 80px;
  }
  
  .stat-content {
    gap: 8px;
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
  }
  
  .stat-value {
    font-size: 18px;
  }
  
  .stat-title {
    font-size: 12px;
  }
}
</style>