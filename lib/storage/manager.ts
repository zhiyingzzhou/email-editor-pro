import { StorageFactory } from './factory'
import { StorageAdapter } from './types'

// 引入现有类型
import { Email, EmailDesign, EmailProvider, EmailStatus } from '@prisma/client'

export class StorageManager {
  private adapter: StorageAdapter
  private static instance: StorageManager

  constructor() {
    this.adapter = StorageFactory.create()
  }

  static getInstance(): StorageManager {
    if (!this.instance) {
      this.instance = new StorageManager()
    }
    return this.instance
  }

  async initialize() {
    await this.adapter.connect()
  }

  // 邮件操作
  get emails() {
    return {
      findMany: () => this.adapter.findMany<Email>('emails', { 
        orderBy: { updatedAt: 'desc' } 
      }),
      findById: (id: string) => this.adapter.findById<Email>('emails', id),
      create: (data: { title: string; content: string; design: string; preview: string; status: EmailStatus }) => 
        this.adapter.create<Email>('emails', data),
      update: (id: string, data: Partial<Email>) => 
        this.adapter.update<Email>('emails', id, data),
      delete: (id: string) => this.adapter.delete('emails', id)
    }
  }

  // 邮件设计模板操作
  get emailDesigns() {
    return {
      findMany: () => this.adapter.findMany<EmailDesign>('emailDesigns'),
      findById: (id: string) => this.adapter.findById<EmailDesign>('emailDesigns', id),
      create: (data: { name: string; description: string; thumbnail: string; design: string; isActive: boolean; isSystem: boolean }) => 
        this.adapter.create<EmailDesign>('emailDesigns', data),
      update: (id: string, data: Partial<EmailDesign>) => 
        this.adapter.update<EmailDesign>('emailDesigns', id, data),
      delete: (id: string) => this.adapter.delete('emailDesigns', id)
    }
  }

  // 邮件服务商操作
  get emailProviders() {
    return {
      findMany: () => this.adapter.findMany<EmailProvider>('emailProviders'),
      findById: (id: string) => this.adapter.findById<EmailProvider>('emailProviders', id),
      create: (data: { name: string; type: any; config: string; senderEmail: string; isActive: boolean }) => 
        this.adapter.create<EmailProvider>('emailProviders', data),
      update: (id: string, data: Partial<EmailProvider>) => 
        this.adapter.update<EmailProvider>('emailProviders', id, data),
      delete: (id: string) => this.adapter.delete('emailProviders', id)
    }
  }
}