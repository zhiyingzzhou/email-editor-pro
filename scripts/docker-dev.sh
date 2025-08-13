#!/bin/bash

# 开发环境 Docker 启动脚本

echo "🚀 启动邮件模板编辑器开发环境..."

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ 错误: Docker 未安装，请先安装 Docker"
    exit 1
fi

# 检查 Docker Compose 是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "❌ 错误: Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

# 停止并删除现有容器
echo "🧹 清理现有容器..."
docker-compose down

# 构建并启动服务
echo "🔨 构建应用镜像..."
docker-compose build

echo "📊 初始化数据库..."
docker-compose up db-init

echo "🌟 启动应用服务..."
docker-compose up app

echo "✅ 应用已启动！访问 http://localhost:3000"