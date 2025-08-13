# Vercel 部署指南

## 环境变量配置

在 Vercel 项目设置中配置以下环境变量：

### 必需的环境变量

```bash
# 存储类型 - 在 Vercel 上使用客户端存储
NEXT_PUBLIC_STORAGE_TYPE=indexeddb

# Next.js 认证密钥 (生产环境请使用强密码)
NEXTAUTH_SECRET=your-production-secret-key-change-this

# 应用域名 (替换为你的实际域名)
NEXTAUTH_URL=https://your-app-name.vercel.app

# 缓存重新验证令牌 (可选)
NEXT_CACHE_REVALIDATE_TOKEN=your-revalidate-token-change-this

# React 严格模式
REACT_STRICT_MODE=true

# Vercel 环境标识
VERCEL=1
```

### 可选的环境变量

```bash
# 如果将来需要使用服务器端数据库，可以配置
# DATABASE_URL=your-database-connection-string
```

## 部署步骤

### 1. 准备代码
确保所有更改已提交到 Git 仓库。

### 2. 连接到 Vercel
1. 访问 [Vercel Dashboard](https://vercel.com)
2. 点击 "New Project"
3. 导入你的 Git 仓库

### 3. 配置项目设置
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 4. 配置环境变量
在 Vercel 项目设置的 "Environment Variables" 部分添加上述环境变量。

### 5. 部署
点击 "Deploy" 开始部署。

## 重要说明

### 存储策略
- **Vercel 部署**: 使用 IndexedDB 客户端存储，所有数据存储在用户浏览器中
- **本地开发**: 可以继续使用 SQLite 或其他数据库

### 数据持久性
由于使用客户端存储（IndexedDB），用户数据将存储在浏览器中：
- 优点：无需数据库服务器，降低成本
- 注意：清除浏览器数据会丢失所有内容

### 如果需要服务器端数据库
如果将来需要服务器端数据库，可以：
1. 使用 Vercel Postgres 或其他云数据库
2. 修改环境变量 `NEXT_PUBLIC_STORAGE_TYPE=sqlite` 或 `mysql`
3. 配置相应的数据库连接字符串

## 构建优化

项目已针对 Vercel 部署进行优化：
- 使用 Next.js 15 和 React 19
- 启用压缩和优化
- 配置了适当的图片处理
- 忽略了不必要的构建文件

## 故障排除

### 构建失败
如果遇到构建错误：
1. 检查环境变量是否正确设置
2. 确保 `NEXT_PUBLIC_STORAGE_TYPE=indexeddb`
3. 查看 Vercel 构建日志

### 运行时错误
1. 检查浏览器控制台
2. 确认环境变量已正确配置
3. 验证 IndexedDB 是否可用

## 本地测试 Vercel 构建

你可以在本地模拟 Vercel 构建：

```bash
# 安装 Vercel CLI
npm i -g vercel

# 本地构建测试
NEXT_PUBLIC_STORAGE_TYPE=indexeddb npm run build

# 或使用 Vercel 专用构建命令
npm run build:vercel
```

## 快速部署步骤

### 1. 提交代码到 Git
```bash
git add .
git commit -m "Add Vercel deployment configuration"
git push origin main
```

### 2. 在 Vercel 部署
1. 访问 [vercel.com](https://vercel.com)
2. 登录并点击 "New Project"
3. 选择你的 Git 仓库
4. 设置环境变量：
   - `NEXT_PUBLIC_STORAGE_TYPE` = `indexeddb`
   - `NEXTAUTH_SECRET` = `your-secret-key`
   - `NEXTAUTH_URL` = `https://your-app.vercel.app`
5. 点击 "Deploy"

### 3. 验证部署
部署完成后：
- 访问你的应用 URL
- 测试邮件编辑器功能
- 确认数据能正常保存到浏览器 IndexedDB

## 功能对比

| 功能 | 本地开发 | Vercel 部署 |
|------|----------|-------------|
| 数据存储 | SQLite 文件 | 浏览器 IndexedDB |
| 数据持久性 | 服务器文件系统 | 用户浏览器 |
| 多用户支持 | 是 | 每个用户独立 |
| 服务器要求 | 需要 | 无需服务器数据库 |
| 部署成本 | 需要服务器 | 免费（静态托管）|

## 注意事项

1. **数据迁移**：由于使用不同的存储方式，本地开发的数据不会自动迁移到 Vercel 部署
2. **浏览器限制**：用户数据限制在特定浏览器中，清除浏览器数据会丢失内容
3. **备份建议**：重要设计建议导出 JSON 文件进行备份
4. **性能**：客户端存储在处理大量数据时可能比服务器数据库慢

## 后续优化

如果将来需要服务器端数据库：
1. 添加 Vercel Postgres 数据库
2. 修改环境变量为 `NEXT_PUBLIC_STORAGE_TYPE=postgresql`
3. 配置 `DATABASE_URL` 连接字符串
4. 运行数据库迁移