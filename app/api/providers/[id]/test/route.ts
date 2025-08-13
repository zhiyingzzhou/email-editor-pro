import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import nodemailer from 'nodemailer'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { to } = body

    if (!to) {
      return NextResponse.json(
        { error: '收件人邮箱地址是必需的' },
        { status: 400 }
      )
    }

    // 获取邮件服务商配置
    const provider = await prisma.emailProvider.findUnique({
      where: { id }
    })

    if (!provider) {
      return NextResponse.json(
        { error: '邮件服务商不存在' },
        { status: 404 }
      )
    }

    // 解析服务商配置
    const config = JSON.parse(provider.config)

    // 创建邮件传输器
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure || false,
      auth: {
        user: config.auth.user,
        pass: config.auth.pass
      }
    })

    // 验证连接
    await transporter.verify()

    // 发送测试邮件
    const result = await transporter.sendMail({
      from: provider.senderEmail,
      to: to,
      subject: '邮件服务测试',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #333;">邮件服务测试</h2>
          <p>这是来自 <strong>${provider.name}</strong> 的测试邮件。</p>
          <p>如果您收到这封邮件，说明邮件服务配置正确。</p>
          <p style="color: #666; font-size: 12px;">发送时间: ${new Date().toLocaleString('zh-CN')}</p>
        </div>
      `
    })

    return NextResponse.json({
      message: '测试邮件发送成功',
      messageId: result.messageId
    })
  } catch (error) {
    console.error('测试邮件发送失败:', error)
    return NextResponse.json(
      { error: '测试邮件发送失败: ' + (error as Error).message },
      { status: 500 }
    )
  }
}