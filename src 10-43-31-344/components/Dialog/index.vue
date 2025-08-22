<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    :width="width"
    :fullscreen="fullscreen"
    :top="top"
    :modal="modal"
    :modal-class="modalClass"
    :append-to-body="appendToBody"
    :lock-scroll="lockScroll"
    :custom-class="customClass"
    :open-delay="openDelay"
    :close-delay="closeDelay"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :show-close="showClose"
    :before-close="handleBeforeClose"
    :center="center"
    :align-center="alignCenter"
    :destroy-on-close="destroyOnClose"
    @open="handleOpen"
    @opened="handleOpened"
    @close="handleClose"
    @closed="handleClosed"
  >
    <!-- 自定义头部 -->
    <template v-if="$slots.header" #header="{ close, titleId, titleClass }">
      <slot name="header" :close="close" :title-id="titleId" :title-class="titleClass" />
    </template>

    <!-- 主要内容区域 -->
    <div :class="contentClass">
      <!-- 加载状态 -->
      <div v-if="loading" class="dialog-loading">
        <el-skeleton :rows="skeletonRows" animated />
      </div>
      
      <!-- 正常内容 -->
      <div v-else class="dialog-content">
        <!-- 表单内容 -->
        <el-form
          v-if="formConfig"
          ref="formRef"
          :model="formData"
          :rules="formRules"
          :label-width="formConfig.labelWidth || '100px'"
          :label-position="formConfig.labelPosition || 'right'"
          :inline="formConfig.inline || false"
          :size="formConfig.size || 'default'"
          :disabled="formConfig.disabled || false"
          :validate-on-rule-change="formConfig.validateOnRuleChange !== false"
          :hide-required-asterisk="formConfig.hideRequiredAsterisk || false"
          :show-message="formConfig.showMessage !== false"
          :inline-message="formConfig.inlineMessage || false"
          :status-icon="formConfig.statusIcon || false"
        >
          <template v-for="item in formItems" :key="item.prop">
            <!-- 分组显示 -->
            <div v-if="item.type === 'group'" class="form-group">
              <div class="group-title">{{ item.label }}</div>
              <div class="group-content">
                <template v-for="groupItem in item.children" :key="groupItem.prop">
                  <el-form-item
                    :label="groupItem.label"
                    :prop="groupItem.prop"
                    :rules="groupItem.rules"
                    :label-width="groupItem.labelWidth"
                    :required="groupItem.required"
                    :error="groupItem.error"
                    :show-message="groupItem.showMessage !== false"
                    :inline-message="groupItem.inlineMessage"
                    :size="groupItem.size"
                  >
                    <component
                      :is="getComponentType(groupItem.type)"
                      v-model="formData[groupItem.prop]"
                      v-bind="getComponentProps(groupItem)"
                      @change="handleFormChange(groupItem.prop, $event)"
                    >
                      <!-- 选择器选项 -->
                      <template v-if="['select', 'checkbox-group', 'radio-group'].includes(groupItem.type)">
                        <component
                          :is="getOptionComponent(groupItem.type)"
                          v-for="option in groupItem.options"
                          :key="option.value"
                          :label="option.value"
                          :value="option.value"
                          :disabled="option.disabled"
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
              :label-width="item.labelWidth"
              :required="item.required"
              :error="item.error"
              :show-message="item.showMessage !== false"
              :inline-message="item.inlineMessage"
              :size="item.size"
            >
              <component
                :is="getComponentType(item.type)"
                v-model="formData[item.prop]"
                v-bind="getComponentProps(item)"
                @change="handleFormChange(item.prop, $event)"
              >
                <!-- 选择器选项 -->
                <template v-if="['select', 'checkbox-group', 'radio-group'].includes(item.type)">
                  <component
                    :is="getOptionComponent(item.type)"
                    v-for="option in item.options"
                    :key="option.value"
                    :label="option.value"
                    :value="option.value"
                    :disabled="option.disabled"
                  >
                    {{ option.label }}
                  </component>
                </template>
              </component>
            </el-form-item>
          </template>
        </el-form>
        
        <!-- 自定义内容 -->
        <slot v-else :data="formData" :loading="loading" />
      </div>
    </div>

    <!-- 底部操作按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <!-- 自定义底部 -->
        <slot v-if="$slots.footer" name="footer" :data="formData" :loading="loading" :confirm="handleConfirm" :cancel="handleCancel" />
        
        <!-- 默认底部按钮 -->
        <template v-else>
          <el-button @click="handleCancel" :disabled="confirmLoading">
            {{ cancelText }}
          </el-button>
          <el-button
            v-if="showConfirm"
            type="primary"
            @click="handleConfirm"
            :loading="confirmLoading"
            :disabled="confirmDisabled"
          >
            {{ confirmText }}
          </el-button>
        </template>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick } from 'vue'

// Props 定义
const props = defineProps({
  // 基础配置
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  width: {
    type: [String, Number],
    default: '50%'
  },
  fullscreen: {
    type: Boolean,
    default: false
  },
  top: {
    type: String,
    default: '15vh'
  },
  modal: {
    type: Boolean,
    default: true
  },
  modalClass: {
    type: String,
    default: ''
  },
  appendToBody: {
    type: Boolean,
    default: false
  },
  lockScroll: {
    type: Boolean,
    default: true
  },
  customClass: {
    type: String,
    default: ''
  },
  openDelay: {
    type: Number,
    default: 0
  },
  closeDelay: {
    type: Number,
    default: 0
  },
  closeOnClickModal: {
    type: Boolean,
    default: true
  },
  closeOnPressEscape: {
    type: Boolean,
    default: true
  },
  showClose: {
    type: Boolean,
    default: true
  },
  center: {
    type: Boolean,
    default: false
  },
  alignCenter: {
    type: Boolean,
    default: false
  },
  destroyOnClose: {
    type: Boolean,
    default: false
  },
  
  // 内容配置
  loading: {
    type: Boolean,
    default: false
  },
  skeletonRows: {
    type: Number,
    default: 5
  },
  
  // 表单配置
  formConfig: {
    type: Object,
    default: null
  },
  formItems: {
    type: Array,
    default: () => []
  },
  formData: {
    type: Object,
    default: () => ({})
  },
  formRules: {
    type: Object,
    default: () => ({})
  },
  
  // 按钮配置
  showConfirm: {
    type: Boolean,
    default: true
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  confirmLoading: {
    type: Boolean,
    default: false
  },
  confirmDisabled: {
    type: Boolean,
    default: false
  },
  
  // 关闭前确认
  beforeClose: {
    type: Function,
    default: null
  },
  
  // 样式配置
  contentClass: {
    type: String,
    default: ''
  }
})

// Emits 定义
const emit = defineEmits([
  'update:modelValue',
  'update:formData',
  'open',
  'opened',
  'close',
  'closed',
  'confirm',
  'cancel',
  'form-change'
])

// 响应式数据
const formRef = ref()

// 计算属性
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 获取组件类型
const getComponentType = (type) => {
  const componentMap = {
    'input': 'el-input',
    'textarea': 'el-input',
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
    'autocomplete': 'el-autocomplete',
    'upload': 'el-upload'
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
  
  // 特殊类型的属性
  if (item.type === 'textarea') {
    baseProps.type = 'textarea'
    baseProps.rows = item.rows || 4
    baseProps.autosize = item.autosize || false
  }
  
  if (item.type === 'input-number') {
    baseProps.min = item.min
    baseProps.max = item.max
    baseProps.step = item.step || 1
    baseProps.precision = item.precision
  }
  
  if (['date-picker', 'datetime-picker'].includes(item.type)) {
    baseProps.type = item.pickerType || 'date'
    baseProps.format = item.format
    baseProps.valueFormat = item.valueFormat
  }
  
  // 合并自定义属性
  return { ...baseProps, ...(item.props || {}) }
}

// 事件处理
const handleOpen = () => {
  emit('open')
}

const handleOpened = () => {
  emit('opened')
  // 聚焦第一个表单项
  if (props.formConfig && formRef.value) {
    nextTick(() => {
      const firstInput = formRef.value.$el.querySelector('input, textarea, .el-select')
      if (firstInput && !firstInput.disabled) {
        firstInput.focus()
      }
    })
  }
}

const handleClose = () => {
  emit('close')
}

const handleClosed = () => {
  emit('closed')
  // 清除表单验证
  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

const handleBeforeClose = (done) => {
  if (props.beforeClose) {
    props.beforeClose(done)
  } else {
    done()
  }
}

const handleConfirm = async () => {
  if (props.formConfig && formRef.value) {
    try {
      const valid = await formRef.value.validate()
      if (valid) {
        emit('confirm', props.formData)
      }
    } catch (error) {
      console.warn('表单验证失败:', error)
    }
  } else {
    emit('confirm', props.formData)
  }
}

const handleCancel = () => {
  emit('cancel')
  dialogVisible.value = false
}

const handleFormChange = (prop, value) => {
  emit('update:formData', { ...props.formData, [prop]: value })
  emit('form-change', prop, value, props.formData)
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

const scrollToField = (prop) => {
  formRef.value?.scrollToField(prop)
}

// 暴露方法给父组件
defineExpose({
  validate,
  validateField,
  clearValidate,
  resetFields,
  scrollToField
})
</script>

<style scoped>
.dialog-loading {
  padding: 20px;
}

.dialog-content {
  min-height: 100px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 表单分组样式 */
.form-group {
  margin-bottom: 24px;
}

.group-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--el-border-color-light);
}

.group-content {
  padding-left: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  :deep(.el-dialog) {
    width: 95% !important;
    margin-top: 5vh !important;
  }
  
  .dialog-footer {
    flex-direction: column-reverse;
    gap: 8px;
  }
  
  .dialog-footer .el-button {
    width: 100%;
  }
}
</style>