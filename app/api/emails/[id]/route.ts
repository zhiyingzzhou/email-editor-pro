import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取单个邮件模板
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const email = await prisma.email.findUnique({
      where: {
        id
      }
    })

    if (!email) {
      return NextResponse.json(
        { error: '邮件模板不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json(email)
  } catch (error) {
    console.error('获取邮件模板失败:', error)
    return NextResponse.json(
      { error: '获取邮件模板失败' },
      { status: 500 }
    )
  }
}

// 更新邮件
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, content, design, preview, status } = body

    const email = await prisma.email.update({
      where: {
        id
      },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(design && { design }),
        ...(preview !== undefined && { preview }),
        ...(status && { status })
      }
    })

    return NextResponse.json(email)
  } catch (error) {
    console.error('更新邮件模板失败:', error)
    return NextResponse.json(
      { error: '更新邮件模板失败' },
      { status: 500 }
    )
  }
}

// 删除邮件
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.email.delete({
      where: {
        id
      }
    })

    return NextResponse.json({ message: '邮件模板删除成功' })
  } catch (error) {
    console.error('删除邮件模板失败:', error)
    return NextResponse.json(
      { error: '删除邮件模板失败' },
      { status: 500 }
    )
  }
}