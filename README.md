# 卡密管理系统仪表板

一个基于 Vue 3 + Element Plus 的卡密管理系统仪表板原型页面。

## 功能特性

- 📊 **数据统计展示** - 今日充值、总充值、今日扣除、累计扣除、续期金额等关键指标
- 📅 **日期筛选** - 支持自定义日期范围查询
- 📱 **响应式设计** - 适配桌面端和移动端
- 🎨 **现代化UI** - 基于 Element Plus 组件库，界面美观
- ⚡ **高性能** - 使用 Vue 3 Composition API 和 Vite 构建

## 技术栈

- **前端框架**: Vue 3
- **UI组件库**: Element Plus
- **构建工具**: Vite
- **开发语言**: JavaScript
- **样式**: CSS3

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看页面效果。

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
cardmi/
├── public/                 # 静态资源
├── src/
│   ├── components/         # 组件目录
│   │   └── Dashboard.vue   # 仪表板组件
│   ├── App.vue            # 根组件
│   ├── main.js            # 入口文件
│   └── style.css          # 全局样式
├── index.html             # HTML模板
├── package.json           # 项目配置
├── vite.config.js         # Vite配置
└── README.md              # 项目说明
```

## 页面功能

### 仪表板页面

- **顶部统计卡片**: 显示今日充值、总充值、今日扣除、累计扣除、今日续期金额、累计续期金额
- **日期筛选器**: 支持选择开始日期和结束日期进行数据筛选
- **底部统计卡片**: 显示续期金额、充值金额、扣除金额的汇总信息
- **左侧导航菜单**: 包含仪表板、卡密管理、订单管理、用户管理、设置等功能入口

### 响应式特性

- 桌面端: 6列网格布局展示统计卡片
- 平板端: 自适应列数，保持良好的视觉效果
- 移动端: 单列布局，优化触摸操作体验

## 自定义配置

### 修改数据

在 `src/components/Dashboard.vue` 文件中修改响应式数据：

```javascript
const todayRecharge = ref(0)      // 今日充值
const totalRecharge = ref(2010)   // 总充值
const todayDeduction = ref(0)     // 今日扣除
// ... 其他数据
```

### 修改样式

- 全局样式: 编辑 `src/style.css`
- 组件样式: 在对应的 `.vue` 文件中修改 `<style>` 部分

## 注意事项

- 本项目为原型演示，不包含真实的后端数据交互
- 所有数据均为模拟数据，用于展示界面效果
- 适合用于产品演示、需求评审、开发参考等场景

## 许可证

MIT License