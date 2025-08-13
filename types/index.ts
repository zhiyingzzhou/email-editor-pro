// 统一的类型定义文件

// 基础实体类型
export type EntityStatus = 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED'
export type ProviderType = 'SMTP' | 'SENDGRID' | 'MAILGUN' | 'AWS_SES'

export interface BaseEntity {
  id: string
  createdAt?: string
  updatedAt?: string
}

export interface Email extends BaseEntity {
  title: string
  content: string
  design: string
  preview: string | null
  status: EntityStatus
}

export interface Provider extends BaseEntity {
  name: string
  isActive: boolean
  type?: ProviderType
  config?: string
}

export interface EmailDesign extends BaseEntity {
  name: string
  description: string
  thumbnail: string
  design: Record<string, unknown>
  isActive?: boolean
  isSystem?: boolean
}

// Unlayer设计类型（保留用于向后兼容）
export interface UnlayerDesign {
  body: Record<string, unknown>
  counters?: Record<string, number>
}

// API 相关类型
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

// 请求类型
export interface SendEmailRequest {
  emailId: string
  to: string
  providerId: string
}

export interface CreateEmailRequest {
  title: string
  content: string
  design: string
  preview?: string | null
  status?: EntityStatus
}

export interface UpdateEmailRequest extends CreateEmailRequest {
  id: string
}

export interface CreateDesignRequest {
  name: string
  description: string
  thumbnail?: string
  design: Record<string, unknown>
  isActive?: boolean
}

export interface UpdateDesignRequest extends CreateDesignRequest {
  id: string
}
