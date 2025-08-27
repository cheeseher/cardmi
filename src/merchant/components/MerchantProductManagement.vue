<template>
  <div class="merchant-product-management">
    <!-- 商户信息卡片 -->
    <el-card shadow="never" class="merchant-info-card">
      <div class="merchant-info">
        <div class="info-row">
          <div class="info-item">
            <span class="label">商户号</span>
            <span class="value">{{ merchantInfo.merchantNo }}</span>
            <el-icon class="copy-icon" @click="copyToClipboard(merchantInfo.merchantNo, '商户号')">
              <CopyDocument />
            </el-icon>
          </div>
        </div>
        
        <div class="info-row">
          <div class="info-item">
            <span class="label">签名密钥</span>
            <span class="value">{{ merchantInfo.signPassword }}</span>
            <el-icon class="copy-icon" @click="copyToClipboard(merchantInfo.signPassword, '签名密钥')">
              <CopyDocument />
            </el-icon>
          </div>
        </div>
        
        <div class="info-row">
          <div class="info-item">
            <span class="label">AES密钥</span>
            <span class="value">{{ merchantInfo.aesPassword }}</span>
            <el-icon class="copy-icon" @click="copyToClipboard(merchantInfo.aesPassword, 'AES密钥')">
              <CopyDocument />
            </el-icon>
          </div>
        </div>
        
        <div class="info-row">
          <div class="info-item">
            <span class="label">IP白名单</span>
            <span class="value ip-list">{{ merchantInfo.ipWhitelist }}</span>
          </div>
        </div>
      </div>
      

      
      <!-- 操作按钮 -->
      <div class="action-buttons">

        <el-button type="warning" @click="handleSettings">设置IP白名单</el-button>
      </div>
    </el-card>

    <!-- 产品费率表格 -->
    <el-card shadow="never" class="product-rate-card">
      <div class="card-header">
        <h3>产品费率：</h3>
      </div>
      
      <el-table
        :data="productRateData"
        border
        stripe
        style="width: 100%"
        height="400"
      >
        <el-table-column prop="productName" label="产品" min-width="200">
          <template #default="{ row }">
            <span class="product-name">{{ row.productName }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="productCode" label="产品代码" min-width="150" />
        
        <el-table-column prop="rate" label="费率" min-width="120" align="center">
          <template #default="{ row }">
            <span class="rate-value">{{ row.rate }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="status" label="状态" min-width="120" align="center">
          <template #default="{ row }">
            <el-tag type="success" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { CopyDocument } from '@element-plus/icons-vue'

// 接收商户信息
const props = defineProps({
  merchantInfo: {
    type: Object,
    default: () => null
  }
})

// 商户信息
const merchantInfo = computed(() => {
  if (props.merchantInfo) {
    return {
      merchantId: props.merchantInfo.customerId,
      merchantNo: props.merchantInfo.merchantNo,
      signPassword: props.merchantInfo.signKey || 'YOUR_SIGN_KEY_HERE',
      aesPassword: props.merchantInfo.merchantKey || 'YOUR_AES_KEY_HERE',
      ipWhitelist: '39.98.76.22,39.98.76.22'
    }
  }
  return {
    merchantId: '10',
    merchantNo: 'M17408123456',
    signPassword: 'YOUR_SIGN_KEY_HERE',
    aesPassword: 'YOUR_AES_KEY_HERE',
    ipWhitelist: '39.98.76.22,39.98.76.22'
  }
})

// 产品费率数据
const productRateData = ref([
  {
    productName: '星话卡-[10]',
    productCode: 'xingyk',
    rate: '0.9760',
    status: '已开启'
  },
  {
    productName: '星话卡-[20]',
    productCode: 'xingyk',
    rate: '0.9760',
    status: '已开启'
  },
  {
    productName: '星话卡-[30]',
    productCode: 'xingyk',
    rate: '0.9760',
    status: '已开启'
  },
  {
    productName: '星话卡-[50]',
    productCode: 'xingyk',
    rate: '0.9760',
    status: '已开启'
  },
  {
    productName: '星话卡-[100]',
    productCode: 'xingyk',
    rate: '0.9760',
    status: '已开启'
  },
  {
    productName: '星话卡-[200]',
    productCode: 'xingyk',
    rate: '0.9760',
    status: '已开启'
  },
  {
    productName: '购物卡-[200]',
    productCode: 'scard',
    rate: '0.9760',
    status: '已开启'
  },
  {
    productName: '购物卡-[100]',
    productCode: 'scard',
    rate: '0.9760',
    status: '已开启'
  }
])

// 下载API文档
const handleDownloadApi = () => {
  ElMessage.success('API文档下载中...')
}

// 设置IP白名单
const handleSettings = () => {
  ElMessage.info('IP白名单设置功能开发中...')
}

// 复制到剪贴板
const copyToClipboard = async (text, fieldName) => {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success(`${fieldName}已复制到剪贴板`)
  } catch (err) {
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    ElMessage.success(`${fieldName}已复制到剪贴板`)
  }
}

onMounted(() => {
  // 商户产品管理页面已加载
})
</script>

<style scoped>
.merchant-product-management {
  padding: var(--el-main-padding);
  background-color: var(--el-bg-color-page);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.merchant-info-card {
  margin-bottom: 16px;
}

.merchant-info {
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.label {
  font-weight: 500;
  color: var(--el-text-color-primary);
  min-width: 80px;
}

.value {
  color: var(--el-text-color-regular);
  font-weight: 600;
  margin-right: 8px;
}

.merchant-no {
  color: #909399;
  font-size: 12px;
  margin-right: 12px;
}

.value.masked {
  font-family: monospace;
  letter-spacing: 2px;
}

.value.ip-list {
  color: var(--el-color-warning);
  font-weight: 500;
}

.copy-icon {
  margin-left: 8px;
  cursor: pointer;
  color: var(--el-color-primary);
  font-size: 16px;
  transition: color 0.3s;
}

.copy-icon:hover {
  color: var(--el-color-primary-light-3);
}

.el-tag {
  margin-left: 8px;
}

.notice-section {
  background-color: var(--el-fill-color-lighter);
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.notice-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.notice-item:last-child {
  margin-bottom: 0;
}

.notice-number {
  color: var(--el-color-danger);
  margin-right: 8px;
  font-weight: 500;
}

.notice-text {
  line-height: 1.5;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.product-rate-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.product-rate-card .el-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.product-rate-card .el-table {
  flex: 1;
}

.card-header {
  margin-bottom: 16px;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.product-name {
  color: var(--el-color-danger);
  font-weight: 500;
}

.rate-value {
  color: var(--el-color-danger);
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .info-row {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>