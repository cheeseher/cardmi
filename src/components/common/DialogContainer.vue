<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :width="width"
    :before-close="handleClose"
    :destroy-on-close="destroyOnClose"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
  >
    <!-- 对话框内容 -->
    <div class="dialog-content">
      <slot />
    </div>
    
    <!-- 对话框底部按钮 -->
    <template #footer v-if="showFooter">
      <div class="dialog-footer">
        <slot name="footer">
          <el-button @click="handleCancel" :disabled="loading">
            {{ cancelText }}
          </el-button>
          <el-button 
            type="primary" 
            @click="handleConfirm" 
            :loading="loading"
            v-if="showConfirm"
          >
            {{ confirmText }}
          </el-button>
        </slot>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
// 对话框容器组件 - 提供标准的弹窗布局
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '600px'
  },
  destroyOnClose: {
    type: Boolean,
    default: true
  },
  closeOnClickModal: {
    type: Boolean,
    default: false
  },
  closeOnPressEscape: {
    type: Boolean,
    default: true
  },
  showFooter: {
    type: Boolean,
    default: true
  },
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
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel', 'close'])

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleClose = () => {
  emit('close')
  emit('update:modelValue', false)
}

const handleCancel = () => {
  emit('cancel')
  emit('update:modelValue', false)
}

const handleConfirm = () => {
  emit('confirm')
}
</script>

<script>
import { computed } from 'vue'
export default {
  name: 'DialogContainer'
}
</script>

<style scoped>
.dialog-content {
  padding: 16px 0;
  max-height: 60vh;
  overflow-y: auto;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dialog-content {
    padding: 12px 0;
    max-height: 50vh;
  }
}

@media (max-width: 576px) {
  .dialog-footer {
    flex-direction: column;
    gap: 8px;
  }
  
  .dialog-footer :deep(.el-button) {
    width: 100%;
  }
}
</style>