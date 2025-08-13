# 邮件模板编辑器

基于 Next.js、Tailwind CSS、TypeScript 和 Unlayer 构建的专业邮件编辑与发送管理平台。

## 功能特性

### 📧 邮件模板管理
- **邮件模板列表展示**: 查看所有创建的邮件模板，支持预览图显示
- **状态管理**: 草稿、已发布、已下架状态管理
- **批量操作**: 编辑、删除、发布、下架等操作

### ✏️ 邮件模板编辑
- **可视化编辑**: 基于 Unlayer 的强大邮件模板编辑器
- **实时预览**: 所见即所得的编辑体验
- **模板保存**: 支持保存为草稿或直接发布
- **预览图生成**: 自动生成邮件模板内容预览图

### 📤 邮件模板发送
- **多服务商支持**: SMTP、SendGrid、Mailgun、AWS SES
- **测试发送**: 发送前可进行测试验证
- **配置管理**: 灵活的服务商配置管理

### ⚙️ 服务商配置
- **多服务商管理**: 支持添加多个邮件服务商
- **配置测试**: 验证服务商配置是否正确
- **状态控制**: 启用/禁用特定服务商

## 技术栈

- **前端框架**: Next.js 14 + TypeScript
- **样式框架**: Tailwind CSS
- **邮件模板编辑器**: Unlayer React Email Editor
- **数据库**: SQLite + Prisma ORM
- **UI组件**: Radix UI + Lucide Icons
- **部署**: Docker + Docker Compose

## 快速开始

### 环境要求

- Node.js 18+
- Docker 和 Docker Compose (推荐用于部署)

### 本地开发

1. **克隆项目**
```bash
git clone <repository-url>
cd email-template-editor
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
```bash
cp env.example .env
# 编辑 .env 文件，配置数据库连接等信息
```

4. **初始化数据库**
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

5. **启动开发服务器**
```bash
npm run dev
```

访问 http://localhost:3032 开始使用。

### Docker 部署

#### 开发环境
```bash
chmod +x scripts/docker-dev.sh
./scripts/docker-dev.sh
```

#### 生产环境
1. **创建生产环境配置**
```bash
cp env.example .env.production
# 编辑 .env.production，配置生产环境变量
```

2. **部署应用**
```bash
chmod +x scripts/docker-prod.sh
./scripts/docker-prod.sh
```

## 使用指南

### 1. 邮件服务商配置

首次使用前，需要先配置邮件发送服务商：

1. 访问 "发送配置" 页面
2. 点击 "添加服务商"
3. 填写服务商信息（以Gmail为例）：
   - 名称: Gmail SMTP
   - 服务器地址: smtp.gmail.com
   - 端口: 587
   - 用户名: your-email@gmail.com
   - 密码: 应用专用密码
   - 勾选 "使用SSL/TLS"
4. 点击测试按钮验证配置
5. 保存配置

### 2. 创建邮件模板

1. 访问首页，点击 "创建邮件模板"
2. 输入邮件模板标题
3. 使用可视化编辑器设计邮件模板内容
4. 点击 "测试发送" 可发送测试邮件模板
5. 点击 "保存草稿" 或 "发布" 保存邮件模板

### 3. 邮件模板管理

在邮件模板列表页面可以：
- 查看所有邮件模板及其状态
- 编辑现有邮件模板
- 发送测试邮件模板
- 发布/下架邮件模板
- 删除不需要的邮件模板

## API 接口

### 邮件模板管理
- `GET /api/emails` - 获取邮件模板列表
- `POST /api/emails` - 创建新邮件模板
- `GET /api/emails/[id]` - 获取单个邮件模板
- `PUT /api/emails/[id]` - 更新邮件模板
- `DELETE /api/emails/[id]` - 删除邮件模板

### 服务商管理
- `GET /api/providers` - 获取服务商列表
- `POST /api/providers` - 添加新服务商
- `GET /api/providers/[id]` - 获取单个服务商
- `PUT /api/providers/[id]` - 更新服务商
- `DELETE /api/providers/[id]` - 删除服务商
- `POST /api/providers/[id]/test` - 测试服务商配置

### 邮件发送
- `POST /api/send` - 发送邮件

## 数据库结构

### Email 表
```sql
- id: 邮件唯一标识
- title: 邮件标题
- content: HTML内容
- design: JSON设计数据
- preview: 预览图（Base64）
- status: 状态（DRAFT/PUBLISHED/UNPUBLISHED）
- createdAt: 创建时间
- updatedAt: 更新时间
```

### EmailProvider 表
```sql
- id: 服务商唯一标识
- name: 服务商名称
- type: 服务商类型
- config: JSON配置数据
- isActive: 是否启用
- createdAt: 创建时间
- updatedAt: 更新时间
```

## 安全考虑

1. **环境变量**: 敏感信息通过环境变量配置
2. **数据验证**: API接口包含完整的数据验证
3. **错误处理**: 完善的错误处理和日志记录
4. **访问控制**: 可根据需要添加身份验证

## 性能优化

1. **图片优化**: 预览图自动压缩
2. **缓存策略**: 静态资源缓存
3. **数据库索引**: 关键字段建立索引
4. **懒加载**: 组件按需加载

## 部署

### Vercel 部署 (推荐)

项目已针对 Vercel 部署进行优化，支持零配置部署：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/your-repo)

#### 快速部署步骤

1. **检查部署就绪状态**：
   ```bash
   npm run vercel:check
   ```

2. **推送代码到 Git**：
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

3. **在 Vercel 上部署**：
   - 访问 [vercel.com](https://vercel.com)
   - 导入 Git 仓库
   - 设置环境变量：`NEXT_PUBLIC_STORAGE_TYPE=indexeddb`
   - 部署

#### Vercel 部署特性

- **零服务器数据库**：使用浏览器 IndexedDB 存储
- **免费托管**：利用 Vercel 的免费计划
- **自动 HTTPS**：内置 SSL 证书
- **CDN 加速**：全球内容分发网络

详细部署指南请查看 [`VERCEL_DEPLOYMENT.md`](./VERCEL_DEPLOYMENT.md)

### Docker 部署

#### 开发环境

```bash
# 启动开发环境
./scripts/docker-dev.sh
```

#### 生产环境

```bash
# 构建和启动生产环境
./scripts/docker-prod.sh
```

## 故障排除

### 常见问题

1. **邮件发送失败**
   - 检查服务商配置是否正确
   - 确认网络连接正常
   - 查看服务商是否需要特殊设置（如Gmail的应用专用密码）

2. **预览图生成失败**
   - 检查浏览器是否支持Canvas API
   - 确认邮件内容格式正确

3. **数据库连接问题**
   - 检查DATABASE_URL环境变量
   - 确认数据库文件权限

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License
