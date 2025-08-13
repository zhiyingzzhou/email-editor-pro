import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { log } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const { title, content, to, providerId } = await request.json()

    // 验证必需字段
    if (!title || !content || !to || !providerId) {
      return NextResponse.json(
        { error: '缺少必需字段: title, content, to, providerId' },
        { status: 400 }
      )
    }

    // 获取邮件服务商配置
    const provider = await prisma.emailProvider.findUnique({
      where: { id: providerId }
    })

    if (!provider || !provider.isActive) {
      return NextResponse.json(
        { error: '邮件服务商不存在或未激活' },
        { status: 404 }
      )
    }

    // 根据服务商类型发送邮件
    let result
    const config = provider.config as any
    const emailData = {
      to,
      subject: title,
      html: content,
      from: config.from || 'noreply@example.com'
    }

    switch (provider.type as string) {
      case 'SMTP':
        result = await sendWithSMTP(config, emailData)
        break
      case 'RESEND':
        result = await sendWithResend(config, emailData)
        break
      case 'SENDGRID':
        result = await sendWithSendGrid(config, emailData)
        break
      default:
        return NextResponse.json(
          { error: '不支持的邮件服务商类型' },
          { status: 400 }
        )
    }

    log.info('测试邮件发送成功', {
      provider: provider.name,
      to,
      subject: title
    })

    return NextResponse.json({
      success: true,
      message: '测试邮件发送成功',
      result
    })

  } catch (error) {
    log.error('发送测试邮件失败', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '发送邮件失败' },
      { status: 500 }
    )
  }
}

// SMTP 发送函数
async function sendWithSMTP(config: any, emailData: any) {
  const nodemailer = require('nodemailer')
  
  const transporter = nodemailer.createTransporter({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.username,
      pass: config.password
    }
  })

  return await transporter.sendMail({
    from: emailData.from,
    to: emailData.to,
    subject: emailData.subject,
    html: emailData.html
  })
}

// Resend 发送函数
async function sendWithResend(config: any, emailData: any) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: emailData.from,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Resend API 错误: ${error}`)
  }

  return await response.json()
}

// SendGrid 发送函数
async function sendWithSendGrid(config: any, emailData: any) {
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      personalizations: [{
        to: [{ email: emailData.to }]
      }],
      from: { email: emailData.from },
      subject: emailData.subject,
      content: [{
        type: 'text/html',
        value: emailData.html
      }]
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`SendGrid API 错误: ${error}`)
  }

  return { message: 'Email sent successfully' }
}