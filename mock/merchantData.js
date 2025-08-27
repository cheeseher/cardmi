// 商户后台模拟数据

// 商户信息数据
export const merchantInfo = {
  merchantId: '10',
  merchantNo: 'M17408123456',
  signPassword: '••••••••••',
  aesPassword: '••••••••••',
  ipWhitelist: '39.98.76.22,39.98.76.22'
}

// 产品费率数据
export const productRateData = [
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
]

// 提卡记录数据
export const withdrawalRecordsData = [
  {
    id: 1,
    orderNo: 'B1720300348648058428',
    systemId: '2024073651326773609',
    productName: '联通充值卡 【10元】',
    cardNumber: '626816800002319902',
    cardPassword: '••••••••1020',
    transactionAmount: '29.28',
    transactionQuantity: 1,
    transactionStatus: 'success',
    withdrawalTime: '2025-06-27 21:16:26',
    verificationStatus: 'verified'
  },
  {
    id: 2,
    orderNo: 'B1720300379060721406',
    systemId: '2024073651326907464',
    productName: '移动充值卡 【20元】',
    cardNumber: '654688700000616170',
    cardPassword: '••••••••9934',
    transactionAmount: '19.52',
    transactionQuantity: 1,
    transactionStatus: 'success',
    withdrawalTime: '2025-06-27 21:16:19',
    verificationStatus: 'unverified'
  },
  {
    id: 3,
    orderNo: 'B1720300352624312456',
    systemId: '2024073651327704814',
    productName: '电信充值卡 【30元】',
    cardNumber: '654683000137951548',
    cardPassword: '••••••••7823',
    transactionAmount: '29.28',
    transactionQuantity: 1,
    transactionStatus: 'processing',
    withdrawalTime: '2025-06-27 21:15:52',
    verificationStatus: 'locked'
  }
]