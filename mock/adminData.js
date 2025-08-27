// 管理员后台模拟数据

// 仪表板统计数据
export const dashboardStats = {
  totalUsers: 1234,
  totalCards: 5678,
  totalOrders: 890,
  totalRevenue: 123456
}

// 客户管理数据
export const customerData = [
  {
    customerId: '1001',
    merchantNo: 'M17408123456',
    merchantKey: 'test_key_1234567890abcdef1234567890abcdef',
    customerName: 'asd',
    customerEmail: '123@qq.com',
    balance: '9.900',
    status: 'active',
    registerTime: '2025-02-25 00:28:27'
  },
  {
    customerId: '1002',
    merchantNo: 'M17408234567',
    merchantKey: 'test_key_abcdef1234567890abcdef1234567890',
    customerName: 'aaa',
    customerEmail: '888@gmail.com',
    balance: '0.000',
    status: 'active',
    registerTime: '2025-02-25 17:55:35'
  },
  {
    customerId: '1003',
    merchantNo: 'M17408345678',
    merchantKey: 'test_key_9876543210fedcba9876543210fedcba',
    customerName: 'bbb',
    customerEmail: '999@gmail.com',
    balance: '0.000',
    status: 'disabled',
    registerTime: '2025-02-25 18:09:00'
  }
]

// 产品管理数据
export const productData = [
  {
    productId: 'PD1001',
    productName: '电话卡套餐A',
    faceValue: '10',
    productLink: 'xxxxxx',
    soldCount: '1 / 1',
    createTime: '2025-02-25 14:32:33'
  },
  {
    productId: 'PD1002',
    productName: '流量卡套餐B',
    faceValue: '10',
    productLink: 'www.baidu.com',
    soldCount: '0 / 100',
    createTime: '2025-02-25 18:08:34'
  },
  {
    productId: 'PD1003',
    productName: '游戏卡套餐C',
    faceValue: '10',
    productLink: 'www',
    soldCount: '0 / 100',
    createTime: '2025-02-25 18:09:54'
  }
]

// 订单管理数据
export const orderData = [
  {
    orderId: '1001',
    orderNumber: 'ORD202502251001',
    customerId: '1001',
    customerEmail: 'user1@example.com',
    productName: '电话卡',
    orderAmount: '10.00',
    orderStatus: 'completed',
    cardPackage: 'test',
    createTime: '2025-02-25 18:30:15'
  },
  {
    orderId: '1002',
    orderNumber: 'ORD202502251002',
    customerId: '1002',
    customerEmail: 'user2@example.com',
    productName: '电话卡',
    orderAmount: '20.00',
    orderStatus: 'paid',
    cardPackage: 'test2',
    createTime: '2025-02-25 18:25:30'
  },
  {
    orderId: '1003',
    orderNumber: 'ORD202502251003',
    customerId: '1003',
    customerEmail: 'user3@example.com',
    productName: '电话卡',
    orderAmount: '50.00',
    orderStatus: 'pending',
    cardPackage: 'test3',
    createTime: '2025-02-25 18:20:45'
  }
]

// 卡密查询数据
export const cardQueryData = [
  {
    cardNumber: '939684006576672442',
    password: 'p60wXO8T',
    orderNumber: 'sf174047748858929',
    customerId: '1001',
    status: '已使用',
    verificationStatus: '已核销',
    lockStatus: '正常',
    productValue: '10',
    createTime: '2025-02-25 17:59:20'
  },
  {
    cardNumber: '736779794793920531',
    password: 'pXSi3Y20',
    orderNumber: '',
    customerId: '1002',
    status: '未使用',
    verificationStatus: '未核销',
    lockStatus: '正常',
    productValue: '10',
    createTime: '2025-02-25 17:58:15'
  },
  {
    cardNumber: '679706886397601293',
    password: 'ASXKK8D7',
    orderNumber: '',
    customerId: '1002',
    status: '未使用',
    verificationStatus: '未核销',
    lockStatus: '已锁定',
    productValue: '10',
    createTime: '2025-02-25 17:57:42'
  }
]

// 子账户管理数据
export const subAccountData = [
  {
    accountId: 1,
    username: 'admin',
    status: 'enabled',
    createTime: '1970-01-01 00:00:00'
  },
  {
    accountId: 2,
    username: 'user001',
    status: 'disabled',
    createTime: '2024-01-15 10:30:00'
  },
  {
    accountId: 3,
    username: 'manager',
    status: 'enabled',
    createTime: '2024-02-20 14:20:00'
  }
]

// 操作日志数据
export const operationLogData = [
  {
    accountId: 1,
    username: 'admin',
    operationType: '登录系统',
    operationTime: '2025-08-21 09:30:15',
    ipAddress: '192.168.1.100',
    description: '管理员登录后台管理系统'
  },
  {
    accountId: 2,
    username: 'user001',
    operationType: '查看订单',
    operationTime: '2025-08-21 10:15:22',
    ipAddress: '192.168.1.101',
    description: '查看订单列表，筛选条件：状态为已完成'
  },
  {
    accountId: 1,
    username: 'admin',
    operationType: '创建卡密',
    operationTime: '2025-08-21 11:20:45',
    ipAddress: '192.168.1.100',
    description: '批量创建卡密，数量：100张'
  }
]