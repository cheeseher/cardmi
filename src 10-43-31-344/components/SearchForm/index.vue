<template>
  <el-card shadow="never" class="search-form-container">
    <el-form
      ref="formRef"
      :model="formData"
      :inline="inline"
      :label-width="labelWidth"
      :label-position="labelPosition"
      :class="formClass"
    >
      <!-- 动态渲染表单项 -->
      <template v-for="(item, index) in formItems" :key="item.prop">
        <!-- 分组显示 -->
        <div v-if="item.type === 'group'" class="form-group">
          <div class="group-title">{{ item.label }}</div>
          <div class="group-content">
            <template v-for="groupItem in item.children" :key="groupItem.prop">
              <el-form-item
                :label="groupItem.label"
                :prop="groupItem.prop"
                :rules="groupItem.rules"
                :class="getFormItemClass(groupItem, index)"
              >
                <component
                  :is="getComponentType(groupItem.type)"
                  v-model="formData[groupItem.prop]"
                  v-bind="getComponentProps(groupItem)"
                  @change="handleChange(groupItem.prop, $event)"
                >
                  <!-- 选择器选项 -->
                  <template v-if="['select', 'checkbox-group', 'radio-group'].includes(groupItem.type)">
                    <component
                      :is="getOptionComponent(groupItem.type)"
                      v-for="option in groupItem.options"
                      :key="option.value"
                      :label="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </component>
                  </template>
                </component>
              </el-form-item>
            </template>
          </div>
        </div>
        
        <!-- 普通表单项 -->
        <el-form-item
          v-else
          :label="item.label"
          :prop="item.prop"
          :rules="item.rules"
          :class="getFormItemClass(item, index)"
        >
          <component
            :is="getComponentType(item.type)"
            v-model="formData[item.prop]"
            v-bind="getComponentProps(item)"
            @change="handleChange(item.prop, $event)"
          >
            <!-- 选择器选项 -->
            <template v-if="['select', 'checkbox-group', 'radio-group'].includes(item.type)">
              <component
                :is="getOptionComponent(item.type)"
                v-for="option in item.options"
                :key="option.value"
                :label="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </component>
            </template>
          </component>
        </el-form-item>
      </template>
      
      <!-- 操作按钮 -->
      <div :class="buttonContainerClass">
        <el-button type="primary" @click="handleSearch" :loading="searchLoading">
          <el-icon><Search /></el-icon>
          {{ searchText }}
        </el-button>
        <el-button @click="handleReset">
          <el-icon><Refresh /></el-icon>
          {{ resetText }}
        </el-button>
        <el-button v-if="showExpand && hasMoreItems" link @click="toggleExpand">
          <el-icon><component :is="expanded ? 'ArrowUp' : 'ArrowDown'" /></el-icon>
          {{ expanded ? '收起' : '展开' }}
        </el-button>
        <slot name="buttons" :formData="formData" :search="handleSearch" :reset="handleReset" />
      </div>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { Search, Refresh, ArrowUp, ArrowDown } from '@element-plus/icons-vue'

// Props 定义
const props = defineProps({
  // 表单配置
  formItems: {
    type: Array,
    default: () => []
  },
  // 表单数据
  modelValue: {
    type: Object,
    default: () => ({})
  },
  // 表单样式
  inline: {
    type: Boolean,
    default: true
  },
  labelWidth: {
    type: String,
    default: '100px'
  },
  labelPosition: {
    type: String,
    default: 'right'
  },
  // 布局配置
  layout: {
    type: String,
    default: 'multi-line', // single-line, multi-line, grid
    validator: (value) => ['single-line', 'multi-line', 'grid'].includes(value)
  },
  columns: {
    type: Number,
    default: 3
  },
  // 按钮配置
  searchText: {
    type: String,
    default: '查询'
  },
  resetText: {
    type: String,
    default: '重置'
  },
  searchLoading: {
    type: Boolean,
    default: false
  },
  // 展开收起
  showExpand: {
    type: Boolean,
    default: true
  },
  defaultExpanded: {
    type: Boolean,
    default: false
  },
  expandThreshold: {
    type: Number,
    default: 6
  },
  // 其他配置
  autoSearch: {
    type: Boolean,
    default: false
  },
  searchDelay: {
    type: Number,
    default: 300
  }
})

// Emits 定义
const emit = defineEmits([
  'update:modelValue',
  'search',
  'reset',
  'change'
])

// 响应式数据
const formRef = ref()
const expanded = ref(props.defaultExpanded)
const searchTimer = ref(null)

// 表单数据
const formData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 计算属性
const hasMoreItems = computed(() => {
  return props.formItems.length > props.expandThreshold
})

const visibleItems = computed(() => {
  if (!hasMoreItems.value || expanded.value) {
    return props.formItems
  }
  return props.formItems.slice(0, props.expandThreshold)
})

const formClass = computed(() => {
  const classes = ['search-form']
  if (props.layout === 'multi-line') {
    classes.push('multi-line-form')
  } else if (props.layout === 'grid') {
    classes.push('grid-form')
  }
  return classes.join(' ')
})

const buttonContainerClass = computed(() => {
  const classes = ['button-container']
  if (props.layout === 'multi-line') {
    classes.push('multi-line-buttons')
  } else if (props.layout === 'grid') {
    classes.push('grid-buttons')
  }
  return classes.join(' ')
})

// 获取组件类型
const getComponentType = (type) => {
  const componentMap = {
    'input': 'el-input',
    'select': 'el-select',
    'date-picker': 'el-date-picker',
    'datetime-picker': 'el-date-picker',
    'time-picker': 'el-time-picker',
    'input-number': 'el-input-number',
    'switch': 'el-switch',
    'slider': 'el-slider',
    'rate': 'el-rate',
    'color-picker': 'el-color-picker',
    'transfer': 'el-transfer',
    'cascader': 'el-cascader',
    'radio-group': 'el-radio-group',
    'checkbox-group': 'el-checkbox-group',
    'autocomplete': 'el-autocomplete'
  }
  return componentMap[type] || 'el-input'
}

// 获取选项组件类型
const getOptionComponent = (type) => {
  const optionMap = {
    'select': 'el-option',
    'radio-group': 'el-radio',
    'checkbox-group': 'el-checkbox'
  }
  return optionMap[type]
}

// 获取组件属性
const getComponentProps = (item) => {
  const baseProps = {
    placeholder: item.placeholder || `请${item.type === 'select' ? '选择' : '输入'}${item.label}`,
    clearable: item.clearable !== false,
    disabled: item.disabled || false,
    size: item.size || 'default'
  }
  
  // 合并自定义属性
  return { ...baseProps, ...(item.props || {}) }
}

// 获取表单项样式类
const getFormItemClass = (item, index) => {
  const classes = []
  
  if (props.layout === 'grid') {
    classes.push(`grid-item-${props.columns}`)
  }
  
  if (item.class) {
    classes.push(item.class)
  }
  
  return classes.join(' ')
}

// 事件处理
const handleSearch = async () => {
  try {
    const valid = await formRef.value?.validate()
    if (valid) {
      emit('search', formData.value)
    }
  } catch (error) {
    console.warn('表单验证失败:', error)
  }
}

const handleReset = () => {
  // 重置表单数据
  const resetData = {}
  props.formItems.forEach(item => {
    if (item.type === 'group' && item.children) {
      item.children.forEach(child => {
        resetData[child.prop] = child.defaultValue || ''
      })
    } else {
      resetData[item.prop] = item.defaultValue || ''
    }
  })
  
  emit('update:modelValue', resetData)
  formRef.value?.clearValidate()
  
  nextTick(() => {
    emit('reset', resetData)
    if (props.autoSearch) {
      handleSearch()
    }
  })
}

const handleChange = (prop, value) => {
  emit('change', prop, value, formData.value)
  
  // 自动搜索
  if (props.autoSearch) {
    clearTimeout(searchTimer.value)
    searchTimer.value = setTimeout(() => {
      handleSearch()
    }, props.searchDelay)
  }
}

const toggleExpand = () => {
  expanded.value = !expanded.value
}

// 公开方法
const validate = () => {
  return formRef.value?.validate()
}

const validateField = (prop) => {
  return formRef.value?.validateField(prop)
}

const clearValidate = (props) => {
  formRef.value?.clearValidate(props)
}

const resetFields = () => {
  formRef.value?.resetFields()
}

// 暴露方法给父组件
defineExpose({
  validate,
  validateField,
  clearValidate,
  resetFields,
  search: handleSearch,
  reset: handleReset
})

// 监听表单项变化，初始化默认值
watch(
  () => props.formItems,
  (newItems) => {
    const defaultData = {}
    newItems.forEach(item => {
      if (item.type === 'group' && item.children) {
        item.children.forEach(child => {
          if (child.defaultValue !== undefined && formData.value[child.prop] === undefined) {
            defaultData[child.prop] = child.defaultValue
          }
        })
      } else {
        if (item.defaultValue !== undefined && formData.value[item.prop] === undefined) {
          defaultData[item.prop] = item.defaultValue
        }
      }
    })
    
    if (Object.keys(defaultData).length > 0) {
      emit('update:modelValue', { ...formData.value, ...defaultData })
    }
  },
  { immediate: true, deep: true }
)
</script>

<style scoped>
.search-form-container {
  margin-bottom: 16px;
}

.search-form {
  width: 100%;
}

/* 多行布局 */
.multi-line-form {
  display: flex;
  flex-wrap: wrap;
  gap: 0 20px;
}

.multi-line-form .el-form-item {
  margin-bottom: 18px;
  margin-right: 0;
}

.multi-line-buttons {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 4px;
}

/* 网格布局 */
.grid-form {
  display: grid;
  gap: 18px 20px;
}

.grid-form.columns-2 {
  grid-template-columns: repeat(2, 1fr);
}

.grid-form.columns-3 {
  grid-template-columns: repeat(3, 1fr);
}

.grid-form.columns-4 {
  grid-template-columns: repeat(4, 1fr);
}

.grid-form .el-form-item {
  margin-bottom: 0;
}

.grid-buttons {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 分组样式 */
.form-group {
  width: 100%;
  margin-bottom: 20px;
}

.group-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--el-border-color-light);
}

.group-content {
  display: flex;
  flex-wrap: wrap;
  gap: 0 20px;
}

.group-content .el-form-item {
  margin-bottom: 18px;
  margin-right: 0;
}

/* 按钮容器 */
.button-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .grid-form.columns-4 {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 992px) {
  .grid-form.columns-3,
  .grid-form.columns-4 {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .multi-line-form {
    gap: 0 16px;
  }
  
  .group-content {
    gap: 0 16px;
  }
}

@media (max-width: 768px) {
  .grid-form {
    grid-template-columns: 1fr;
  }
  
  .multi-line-form {
    flex-direction: column;
    gap: 0;
  }
  
  .group-content {
    flex-direction: column;
    gap: 0;
  }
  
  .multi-line-buttons,
  .grid-buttons {
    justify-content: center;
    margin-top: 16px;
  }
  
  .button-container {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>