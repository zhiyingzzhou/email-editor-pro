import { NextRequest, NextResponse } from 'next/server'
import { CreateDesignRequest, EmailDesign } from '@/types'
import { prisma } from '@/lib/prisma'

// 获取所有设计
export async function GET() {
  try {
    const designs = await prisma.emailDesign.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    // 转换数据格式以匹配前端期望的 EmailTemplate 类型
    const formattedDesigns: EmailDesign[] = designs.map(design => ({
      id: design.id,
      name: design.name,
      description: design.description,
      thumbnail: design.thumbnail,
      design: JSON.parse(design.design),
      isActive: design.isActive,
      isSystem: design.isSystem,
      createdAt: design.createdAt.toISOString(),
      updatedAt: design.updatedAt.toISOString()
    }))

    return NextResponse.json({
      data: formattedDesigns,
      message: '获取设计列表成功'
    })
  } catch (error) {
    console.error('获取设计列表失败:', error)
    return NextResponse.json(
      { error: '获取设计列表失败' },
      { status: 500 }
    )
  }
}

// 创建新设计
export async function POST(request: NextRequest) {
  try {
    const body: CreateDesignRequest = await request.json()
    
    // 验证必填字段
    if (!body.name || !body.description || !body.design) {
      return NextResponse.json(
        { error: '设计名称、描述和设计内容为必填项' },
        { status: 400 }
      )
    }

    // 检查设计名称是否已存在
    const existingDesign = await prisma.emailDesign.findUnique({
      where: { name: body.name }
    })
    if (existingDesign) {
      return NextResponse.json(
        { error: '设计名称已存在' },
        { status: 400 }
      )
    }

    // 创建新设计
    const newDesign = await prisma.emailDesign.create({
      data: {
        name: body.name,
        description: body.description,
        thumbnail: body.thumbnail || '/designs/custom-thumb.png',
        design: JSON.stringify(body.design),
        isActive: body.isActive ?? true,
        isSystem: false
      }
    })

    // 转换数据格式以匹配前端期望的 EmailTemplate 类型
    const formattedDesign: EmailDesign = {
      id: newDesign.id,
      name: newDesign.name,
      description: newDesign.description,
      thumbnail: newDesign.thumbnail,
      design: JSON.parse(newDesign.design),
      isActive: newDesign.isActive,
      isSystem: newDesign.isSystem,
      createdAt: newDesign.createdAt.toISOString(),
      updatedAt: newDesign.updatedAt.toISOString()
    }

    return NextResponse.json({
      data: formattedDesign,
      message: '设计创建成功'
    }, { status: 201 })
  } catch (error) {
    console.error('创建设计失败:', error)
    return NextResponse.json(
      { error: '创建设计失败' },
      { status: 500 }
    )
  }
}