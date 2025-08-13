import { NextRequest, NextResponse } from 'next/server'
import { UpdateDesignRequest, EmailDesign } from '@/types'
import { prisma } from '@/lib/prisma'

// 获取单个设计
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // 在数据库中查找设计
    const design = await prisma.emailDesign.findUnique({
      where: { id }
    })

    if (!design) {
      return NextResponse.json(
        { error: '设计不存在' },
        { status: 404 }
      )
    }

    // 转换数据格式以匹配前端期望的 EmailTemplate 类型
    const formattedDesign: EmailDesign = {
      id: design.id,
      name: design.name,
      description: design.description,
      thumbnail: design.thumbnail,
      design: JSON.parse(design.design),
      isActive: design.isActive,
      isSystem: design.isSystem,
      createdAt: design.createdAt.toISOString(),
      updatedAt: design.updatedAt.toISOString()
    }

    return NextResponse.json({
      data: formattedDesign,
      message: '获取设计成功'
    })
  } catch (error) {
    console.error('获取设计失败:', error)
    return NextResponse.json(
      { error: '获取设计失败' },
      { status: 500 }
    )
  }
}

// 更新设计
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body: UpdateDesignRequest = await request.json()

    // 验证必填字段
    if (!body.name || !body.description || !body.design) {
      return NextResponse.json(
        { error: '设计名称、描述和设计内容为必填项' },
        { status: 400 }
      )
    }

    // 检查设计是否存在
    const existingDesign = await prisma.emailDesign.findUnique({
      where: { id }
    })
    
    if (!existingDesign) {
      return NextResponse.json(
        { error: '设计不存在' },
        { status: 404 }
      )
    }

    // 检查名称是否与其他设计冲突
    const duplicateTemplate = await prisma.emailDesign.findFirst({
      where: {
        name: body.name,
        id: { not: id }
      }
    })
    
    if (duplicateTemplate) {
      return NextResponse.json(
        { error: '设计名称已存在' },
        { status: 400 }
      )
    }

    // 更新设计
    const updatedTemplate = await prisma.emailDesign.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        thumbnail: body.thumbnail || existingDesign.thumbnail,
        design: JSON.stringify(body.design),
        isActive: body.isActive ?? existingDesign.isActive
      }
    })

    // 转换数据格式以匹配前端期望的 EmailDesign 类型
    const formattedTemplate: EmailDesign = {
      id: updatedTemplate.id,
      name: updatedTemplate.name,
      description: updatedTemplate.description,
      thumbnail: updatedTemplate.thumbnail,
      design: JSON.parse(updatedTemplate.design),
      isActive: updatedTemplate.isActive,
      isSystem: updatedTemplate.isSystem,
      createdAt: updatedTemplate.createdAt.toISOString(),
      updatedAt: updatedTemplate.updatedAt.toISOString()
    }

    return NextResponse.json({
      data: formattedTemplate,
      message: '设计更新成功'
    })
  } catch (error) {
    console.error('更新设计失败:', error)
    return NextResponse.json(
      { error: '更新设计失败' },
      { status: 500 }
    )
  }
}

// 删除设计
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // 检查设计是否存在
    const existingTemplate = await prisma.emailDesign.findUnique({
      where: { id }
    })
    
    if (!existingTemplate) {
      return NextResponse.json(
        { error: '设计不存在' },
        { status: 404 }
      )
    }

    // 删除设计
    await prisma.emailDesign.delete({
      where: { id }
    })

    return NextResponse.json({
      message: '设计删除成功'
    })
  } catch (error) {
    console.error('删除设计失败:', error)
    return NextResponse.json(
      { error: '删除设计失败' },
      { status: 500 }
    )
  }
}