import { NextRequest, NextResponse } from 'next/server'
import { StorageManager } from '@/lib/storage/manager'
import { isClientStorage } from '@/lib/storage/config'
import { EmailStatus } from '@prisma/client'

// 获取邮件模板列表
export async function GET() {
  try {
    // 如果是客户端存储，返回空数组，数据由前端 IndexedDB 处理
    if (isClientStorage()) {
      return NextResponse.json([])
    }

    const storageManager = StorageManager.getInstance()
    await storageManager.initialize()
    const emails = await storageManager.emails.findMany()
    
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
    // 如果是客户端存储，返回成功响应，数据由前端 IndexedDB 处理
    if (isClientStorage()) {
      const body = await request.json()
      const { title, content, design, preview, status = EmailStatus.DRAFT } = body
      
      if (!title || !content || !design) {
        return NextResponse.json(
          { error: '标题、内容和设计数据都是必需的' },
          { status: 400 }
        )
      }

      // 返回模拟的成功响应，实际存储由前端处理
      return NextResponse.json({ 
        success: true, 
        message: '客户端存储模式，数据已由前端处理' 
      })
    }

    const body = await request.json()
    const { title, content, design, preview, status = EmailStatus.DRAFT } = body

    if (!title || !content || !design) {
      return NextResponse.json(
        { error: '标题、内容和设计数据都是必需的' },
        { status: 400 }
      )
    }

    const storageManager = StorageManager.getInstance()
    await storageManager.initialize()
    const email = await storageManager.emails.create({
      title,
      content,
      design,
      preview,
      status
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