import { EDITOR_CONFIGS } from './editor-config'

// 邮件编辑器默认配置
export const DEFAULT_EMAIL_EDITOR_CONFIG = EDITOR_CONFIGS.default

// 编辑器样式配置
export const EMAIL_EDITOR_STYLE = {
  height: '100%'
}

// API 端点
export const API_ENDPOINTS = {
  EMAILS: '/api/emails',
  PROVIDERS: '/api/providers',
  SEND: '/api/send'
} as const

// 状态文本映射
export const STATUS_TEXT = {
  DRAFT: '草稿',
  PUBLISHED: '已发布',
  UNPUBLISHED: '已下线'
} as const

