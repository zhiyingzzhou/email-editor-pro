import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { emailId, to, providerId } = body

    if (!emailId || !to || !providerId) {
      return NextResponse.json(
        { error: '邮件模板ID、收件人和服务商ID都是必需的' },
        { status: 400 }
      )
    }

    // 获取邮件模板内容
    const email = await prisma.email.findUnique({
      where: { id: emailId }
    })

    if (!email) {
      return NextResponse.json(
        { error: '邮件模板不存在' },
        { status: 404 }
      )
    }

    // 获取邮件服务商配置
    const provider = await prisma.emailProvider.findUnique({
      where: { id: providerId }
    })

    if (!provider) {
      return NextResponse.json(
        { error: '邮件服务商不存在' },
        { status: 404 }
      )
    }

    if (!provider.isActive) {
      return NextResponse.json(
        { error: '邮件服务商未启用' },
        { status: 400 }
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

    // 发送邮件模板
    const result = await transporter.sendMail({
      from: provider.senderEmail,
      to: to,
      subject: email.title,
      html: email.content
    })

    return NextResponse.json({
      message: '邮件模板发送成功',
      messageId: result.messageId
    })
  } catch (error) {
    console.error('邮件模板发送失败:', error)
    return NextResponse.json(
      { error: '邮件模板发送失败' },
      { status: 500 }
    )
  }
}