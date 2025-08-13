# 多存储架构使用说明

## 概述

这个存储架构支持多种数据库无缝切换，目前支持：
- **IndexedDB**: 浏览器端本地存储，无需服务器
- **SQLite**: 服务器端文件数据库（默认）
- **MySQL**: 服务器端关系型数据库
- **PostgreSQL**: 服务器端关系型数据库

## 使用方式

### 1. 设置存储模式

通过环境变量 `NEXT_PUBLIC_STORAGE_TYPE` 控制存储模式：

```bash
# 默认服务器模式 (SQLite)
npm run build

# 浏览器模式 (IndexedDB)
npm run build:client

# MySQL模式
npm run build:mysql

# 自定义模式
NEXT_PUBLIC_STORAGE_TYPE=postgresql npm run build
```

### 2. 在代码中使用

#### 使用API适配器（推荐）
```typescript
import { ApiAdapter } from '@/lib/api-adapter'

// 自动根据存储模式选择调用方式
const emails = await ApiAdapter.getEmails()
const newEmail = await ApiAdapter.createEmail(data)
```

#### 直接使用存储管理器
```typescript
import { storage } from '@/lib/storage'

// 初始化（客户端模式需要）
await storage.initialize()

// 操作数据
const emails = await storage.emails.findMany()
const email = await storage.emails.create(data)
```

### 3. 数据迁移

```typescript
import { DataMigrator } from '@/lib/storage/migration'

// 将服务器数据导出到IndexedDB
await DataMigrator.exportToIndexedDB()

// 查看IndexedDB数据统计
const stats = await DataMigrator.getIndexedDBStats()
```

## 部署模式

### 服务器模式
- 需要Node.js服务器
- 支持SQLite/MySQL/PostgreSQL
- 数据集中存储

### 客户端模式  
- 可静态部署到CDN
- 数据存储在用户浏览器
- 完全离线工作

## 扩展新数据库

1. 创建适配器类实现 `StorageAdapter` 接口
2. 在 `StorageFactory` 中注册适配器
3. 在 `StorageType` 中添加类型定义

```typescript
// 示例：添加Redis支持
export class RedisAdapter implements StorageAdapter {
  // 实现接口方法...
}

StorageFactory.register('redis', () => new RedisAdapter())
```

## 注意事项

- 客户端模式下，发送邮件功能需要使用第三方服务
- 数据迁移时注意备份原始数据
- IndexedDB数据存储在用户浏览器，清除浏览器数据会丢失