import { storage, isClientStorage } from './storage'

// 统一的API适配器，在客户端模式下直接调用存储层，在服务器模式下调用API
export class ApiAdapter {
  
  // 邮件操作
  static async getEmails() {
    if (isClientStorage()) {
      await storage.initialize()
      return await storage.emails.findMany()
    }
    
    const response = await fetch('/api/emails')
    if (!response.ok) throw new Error('Failed to fetch emails')
    return await response.json()
  }

  static async getEmail(id: string) {
    if (isClientStorage()) {
      await storage.initialize()
      return await storage.emails.findById(id)
    }
    
    const response = await fetch(`/api/emails/${id}`)
    if (!response.ok) throw new Error('Failed to fetch email')
    return await response.json()
  }

  static async createEmail(data: any) {
    if (isClientStorage()) {
      await storage.initialize()
      return await storage.emails.create(data)
    }
    
    const response = await fetch('/api/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to create email')
    return await response.json()
  }

  static async updateEmail(id: string, data: any) {
    if (isClientStorage()) {
      await storage.initialize()
      return await storage.emails.update(id, data)
    }
    
    const response = await fetch(`/api/emails/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to update email')
    return await response.json()
  }

  static async deleteEmail(id: string) {
    if (isClientStorage()) {
      await storage.initialize()
      return await storage.emails.delete(id)
    }
    
    const response = await fetch(`/api/emails/${id}`, { method: 'DELETE' })
    if (!response.ok) throw new Error('Failed to delete email')
  }

  // 邮件设计模板操作
  static async getEmailDesigns() {
    if (isClientStorage()) {
      await storage.initialize()
      return await storage.emailDesigns.findMany()
    }
    
    const response = await fetch('/api/design-manager')
    if (!response.ok) throw new Error('Failed to fetch designs')
    return await response.json()
  }

  static async getEmailDesign(id: string) {
    if (isClientStorage()) {
      await storage.initialize()
      return await storage.emailDesigns.findById(id)
    }
    
    const response = await fetch(`/api/design-manager/${id}`)
    if (!response.ok) throw new Error('Failed to fetch design')
    return await response.json()
  }

  static async createEmailDesign(data: any) {
    if (isClientStorage()) {
      await storage.initialize()
      return await storage.emailDesigns.create(data)
    }
    
    const response = await fetch('/api/design-manager', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to create design')
    return await response.json()
  }

  static async updateEmailDesign(id: string, data: any) {
    if (isClientStorage()) {
      await storage.initialize()
      return await storage.emailDesigns.update(id, data)
    }
    
    const response = await fetch(`/api/design-manager/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to update design')
    return await response.json()
  }

  static async deleteEmailDesign(id: string) {
    if (isClientStorage()) {
      await storage.initialize()
      return await storage.emailDesigns.delete(id)
    }
    
    const response = await fetch(`/api/design-manager/${id}`, { method: 'DELETE' })
    if (!response.ok) throw new Error('Failed to delete design')
  }

  // 邮件服务商操作
  static async getEmailProviders() {
    if (isClientStorage()) {
      await storage.initialize()
      return await storage.emailProviders.findMany()
    }
    
    const response = await fetch('/api/providers')
    if (!response.ok) throw new Error('Failed to fetch providers')
    return await response.json()
  }

  static async getActiveProviders(id: string) {
    if (isClientStorage()) {
      await storage.initialize()
      const providers = await storage.emailProviders.findMany()
      return providers.filter(p => p.isActive)
    }
    
    const response = await fetch('/api/providers?active=true')
    if (!response.ok) throw new Error('Failed to fetch active providers')
    return await response.json()
  }

  static async getEmailProvider(id: string) {
    if (isClientStorage()) {
      await storage.initialize()
      return await storage.emailProviders.findById(id)
    }
    
    const response = await fetch(`/api/providers/${id}`)
    if (!response.ok) throw new Error('Failed to fetch provider')
    return await response.json()
  }

  static async createEmailProvider(data: any) {
    if (isClientStorage()) {
      await storage.initialize()
      return await storage.emailProviders.create(data)
    }
    
    const response = await fetch('/api/providers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to create provider')
    return await response.json()
  }

  static async updateEmailProvider(id: string, data: any) {
    if (isClientStorage()) {
      await storage.initialize()
      return await storage.emailProviders.update(id, data)
    }
    
    const response = await fetch(`/api/providers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to update provider')
    return await response.json()
  }

  static async deleteEmailProvider(id: string) {
    if (isClientStorage()) {
      await storage.initialize()
      return await storage.emailProviders.delete(id)
    }
    
    const response = await fetch(`/api/providers/${id}`, { method: 'DELETE' })
    if (!response.ok) throw new Error('Failed to delete provider')
  }

  static async testEmailProvider(id: string, data: any) {
    // 测试功能在客户端模式下不可用
    if (isClientStorage()) {
      throw new Error('客户端模式下邮件测试功能不可用，请使用服务器模式')
    }
    
    const response = await fetch(`/api/providers/${id}/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to test provider')
    return await response.json()
  }

  static async sendEmail(data: any) {
    // 发送邮件功能在客户端模式下不可用
    if (isClientStorage()) {
      throw new Error('客户端模式下邮件发送功能不可用，请使用服务器模式')
    }

    const response = await fetch('/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to send email')
    return await response.json()
  }

  static async sendTestEmail(data: any) {
    // 直接发送测试邮件，不创建数据库记录
    if (isClientStorage()) {
      throw new Error('客户端模式下邮件发送功能不可用，请使用服务器模式')
    }

    const response = await fetch('/api/send/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to send test email')
    return await response.json()
  }
}