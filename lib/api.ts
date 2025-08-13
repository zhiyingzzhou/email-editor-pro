import { Email, Provider, ApiResponse, SendEmailRequest, CreateEmailRequest } from '@/types'
import { API_ENDPOINTS } from './constants'
import { log } from './logger'

// API 工具函数
export class ApiClient {

  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json()
      log.error('API请求失败', { status: response.status, error })
      throw new Error(error.error || '请求失败')
    }
    return response.json()
  }

  // 邮件相关 API
  static async getEmails(): Promise<Email[]> {
    const response = await fetch(API_ENDPOINTS.EMAILS)
    return this.handleResponse<Email[]>(response)
  }

  static async getEmail(id: string): Promise<Email> {
    const response = await fetch(`${API_ENDPOINTS.EMAILS}/${id}`)
    return this.handleResponse<Email>(response)
  }

  static async createEmail(data: CreateEmailRequest): Promise<Email> {
    const response = await fetch(API_ENDPOINTS.EMAILS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    return this.handleResponse<Email>(response)
  }

  static async updateEmail(id: string, data: CreateEmailRequest): Promise<Email> {
    const response = await fetch(`${API_ENDPOINTS.EMAILS}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    return this.handleResponse<Email>(response)
  }

  static async deleteEmail(id: string): Promise<void> {
    const response = await fetch(`${API_ENDPOINTS.EMAILS}/${id}`, {
      method: 'DELETE'
    })
    await this.handleResponse<void>(response)
  }

  // 服务商相关 API
  static async getProviders(): Promise<Provider[]> {
    log.debug('从API获取服务商数据')
    const response = await fetch(API_ENDPOINTS.PROVIDERS)
    return this.handleResponse<Provider[]>(response)
  }

  static async getActiveProviders(): Promise<Provider[]> {
    log.debug('从API获取活跃服务商数据')
    const response = await fetch(`${API_ENDPOINTS.PROVIDERS}?active=true`)
    
    // 如果API不支持过滤，回退到原来的方式
    if (!response.ok) {
      const providers = await this.getProviders()
      return providers.filter(p => p.isActive)
    }

    return this.handleResponse<Provider[]>(response)
  }

  // 发送邮件 API
  static async sendEmail(data: SendEmailRequest): Promise<ApiResponse> {
    const response = await fetch(API_ENDPOINTS.SEND, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    return this.handleResponse<ApiResponse>(response)
  }
}
