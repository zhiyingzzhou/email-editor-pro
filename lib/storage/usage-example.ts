// 存储架构使用示例

import { useEffect, useState } from 'react'
import { ApiAdapter } from '../api-adapter'
import { storage, isClientStorage } from './index'
import { Email } from '@prisma/client'

// 示例1: 在React组件中使用
export const useEmailData = () => {
  const [emails, setEmails] = useState<Email[]>([])
  
  useEffect(() => {
    const loadEmails = async () => {
      try {
        const data = await ApiAdapter.getEmails()
        setEmails(data)
      } catch (error) {
        console.error('加载邮件失败:', error)
      }
    }
    
    loadEmails()
  }, [])
  
  const createEmail = async (emailData: any) => {
    try {
      const newEmail = await ApiAdapter.createEmail(emailData)
      setEmails(prev => [newEmail, ...prev])
      return newEmail
    } catch (error) {
      console.error('创建邮件失败:', error)
      throw error
    }
  }
  
  return { emails, createEmail }
}

// 示例2: 直接使用存储管理器 (仅客户端模式)
export const useDirectStorage = () => {
  useEffect(() => {
    if (isClientStorage()) {
      // 仅在客户端模式下初始化
      storage.initialize()
    }
  }, [])
  
  const saveEmail = async (data: any) => {
    if (isClientStorage()) {
      return await storage.emails.create(data)
    } else {
      // 服务器模式下使用API
      return await ApiAdapter.createEmail(data)
    }
  }
  
  return { saveEmail }
}

// 示例3: 数据迁移工具
export const migrateData = async () => {
  if (typeof window !== 'undefined') {
    // 从服务器获取数据
    const serverEmails = await ApiAdapter.getEmails()
    const serverDesigns = await ApiAdapter.getEmailDesigns()
    
    // 保存到IndexedDB
    await storage.initialize()
    for (const email of serverEmails) {
      await storage.emails.create(email)
    }
    for (const design of serverDesigns) {
      await storage.emailDesigns.create(design)
    }
    
    console.log('数据迁移完成')
  }
}