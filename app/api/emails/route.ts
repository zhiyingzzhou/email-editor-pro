import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { EmailStatus } from '@prisma/client'

// 获取邮件模板列表
export async function GET() {
  try {
    const emails = await prisma.email.findMany({
      orderBy: {
        updatedAt: 'desc'
      }
    })
    
    return NextResponse.json(emails)
  } catch (error) {
    console.error('获取邮件模板列表失败:', error)
    return NextResponse.json(
      { error: '获取邮件模板列表失败' },
      { status: 500 }
    )
  }
}

// 创建新邮件模板
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, design, preview, status = EmailStatus.DRAFT } = body

    if (!title || !content || !design) {
      return NextResponse.json(
        { error: '标题、内容和设计数据都是必需的' },
        { status: 400 }
      )
    }

    const email = await prisma.email.create({
      data: {
        title,
        content,
        design,
        preview,
        status
      }
    })

    return NextResponse.json(email)
  } catch (error) {
    console.error('创建邮件模板失败:', error)
    return NextResponse.json(
      { error: '创建邮件模板失败' },
      { status: 500 }
    )
  }
}