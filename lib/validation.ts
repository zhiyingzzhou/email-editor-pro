import { z } from 'zod'

// 邮件编辑器表单验证
export const emailEditorSchema = z.object({
  title: z.string().min(1, '请输入邮件模板标题').max(100, '邮件模板标题不能超过100个字符'),
})

// 测试发送表单验证
export const testSendSchema = z.object({
  recipientEmail: z.string().min(1, '请输入收件人邮箱').email('请输入有效的邮箱地址'),
  selectedProvider: z.string().min(1, '请选择邮件服务商'),
})

// 服务商配置表单验证
export const providerConfigSchema = z.object({
  name: z.string().min(1, '请输入服务商名称'),
  host: z.string().min(1, '请输入SMTP服务器地址'),
  port: z.number().min(1, '请输入端口号').max(65535, '端口号无效'),
  user: z.string().min(1, '请输入用户名'),
  pass: z.string().min(1, '请输入密码'),
  secure: z.boolean().optional(),
})

// 测试邮箱验证
export const testEmailSchema = z.object({
  testEmail: z.string().min(1, '请输入测试邮箱地址').email('请输入有效的邮箱地址'),
})

// 设计管理表单验证
export const designFormSchema = z.object({
  name: z.string().min(1, '请输入设计名称').max(50, '设计名称不能超过50个字符'),
  description: z.string().min(1, '请输入设计描述').max(200, '设计描述不能超过200个字符'),
})

// 导入设计JSON验证
export const importDesignSchema = z.object({
  jsonText: z.string().min(1, '请输入JSON内容'),
})

// 类型导出
export type EmailEditorForm = z.infer<typeof emailEditorSchema>
export type TestSendForm = z.infer<typeof testSendSchema>
export type ProviderConfigForm = z.infer<typeof providerConfigSchema>
export type TestEmailForm = z.infer<typeof testEmailSchema>
export type DesignForm = z.infer<typeof designFormSchema>
export type ImportDesignForm = z.infer<typeof importDesignSchema>