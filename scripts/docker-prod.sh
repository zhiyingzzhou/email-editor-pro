#!/bin/bash

# 生产环境 Docker 部署脚本

echo "🚀 部署邮件模板编辑器生产环境..."

# 检查环境变量文件
if [ ! -f ".env.production" ]; then
    echo "❌ 错误: 未找到 .env.production 文件"
    echo "请创建 .env.production 文件并配置生产环境变量"
    exit 1
fi

# 加载生产环境变量
source .env.production

# 停止现有服务
echo "🛑 停止现有服务..."
docker-compose -f docker-compose.prod.yml down

# 拉取最新代码（如果是在CI/CD环境中）
echo "📥 更新代码..."
git pull origin main

# 构建生产镜像
echo "🔨 构建生产镜像..."
docker-compose -f docker-compose.prod.yml build --no-cache

# 启动服务
echo "🌟 启动生产服务..."
docker-compose -f docker-compose.prod.yml up -d

echo "✅ 生产环境部署完成！"
echo "🔗 应用地址: ${NEXTAUTH_URL}"