import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ProviderType } from '@prisma/client'

// 获取邮件服务商列表
export async function GET() {
  try {
    const providers = await prisma.emailProvider.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(providers)
  } catch (error) {
    console.error('获取服务商列表失败:', error)
    return NextResponse.json(
      { error: '获取服务商列表失败' },
      { status: 500 }
    )
  }
}

// 创建新的邮件服务商
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, type, config, senderEmail, isActive = true } = body

    if (!name || !type || !config || !senderEmail) {
      return NextResponse.json(
        { error: '名称、类型、配置和发送邮箱都是必需的' },
        { status: 400 }
      )
    }

    // 验证类型是否有效
    if (!Object.values(ProviderType).includes(type)) {
      return NextResponse.json(
        { error: '无效的服务商类型' },
        { status: 400 }
      )
    }

    const provider = await prisma.emailProvider.create({
      data: {
        name,
        type,
        config: JSON.stringify(config),
        senderEmail,
        isActive
      }
    })

    return NextResponse.json(provider)
  } catch (error) {
    console.error('创建服务商失败:', error)
    return NextResponse.json(
      { error: '创建服务商失败' },
      { status: 500 }
    )
  }
}