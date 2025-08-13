import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ProviderType } from '@prisma/client'

// 获取单个服务商
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const provider = await prisma.emailProvider.findUnique({
      where: {
        id
      }
    })

    if (!provider) {
      return NextResponse.json(
        { error: '服务商不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json(provider)
  } catch (error) {
    console.error('获取服务商失败:', error)
    return NextResponse.json(
      { error: '获取服务商失败' },
      { status: 500 }
    )
  }
}

// 更新服务商
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, type, config, senderEmail, isActive } = body

    const updateData: {
      name?: string
      type?: ProviderType
      config?: string
      senderEmail?: string
      isActive?: boolean
    } = {}
    
    if (name) updateData.name = name
    if (type && Object.values(ProviderType).includes(type)) {
      updateData.type = type
    }
    if (config) updateData.config = JSON.stringify(config)
    if (senderEmail) updateData.senderEmail = senderEmail
    if (isActive !== undefined) updateData.isActive = isActive

    const provider = await prisma.emailProvider.update({
      where: {
        id
      },
      data: updateData
    })

    return NextResponse.json(provider)
  } catch (error) {
    console.error('更新服务商失败:', error)
    return NextResponse.json(
      { error: '更新服务商失败' },
      { status: 500 }
    )
  }
}

// 删除服务商
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.emailProvider.delete({
      where: {
        id
      }
    })

    return NextResponse.json({ message: '服务商删除成功' })
  } catch (error) {
    console.error('删除服务商失败:', error)
    return NextResponse.json(
      { error: '删除服务商失败' },
      { status: 500 }
    )
  }
}