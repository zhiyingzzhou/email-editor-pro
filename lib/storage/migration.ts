import { StorageManager } from './manager'
import { ApiAdapter } from '../api-adapter'

export class DataMigrator {
  
  // 从服务器API导出数据到IndexedDB
  static async exportToIndexedDB() {
    if (typeof window === 'undefined') {
      throw new Error('IndexedDB only available in browser')
    }
    
    try {
      // 获取服务器数据
      const [emails, designs, providers] = await Promise.all([
        ApiAdapter.getEmails(),
        ApiAdapter.getEmailDesigns(),
        ApiAdapter.getEmailProviders()
      ])
      
      // 初始化IndexedDB存储
      const storage = StorageManager.getInstance()
      await storage.initialize()
      
      // 导入数据
      for (const item of emails) {
        const { id, createdAt, updatedAt, ...data } = item
        await storage.emails.create(data)
      }
      
      for (const item of designs) {
        const { id, createdAt, updatedAt, ...data } = item
        await storage.emailDesigns.create(data)
      }
      
      for (const item of providers) {
        const { id, createdAt, updatedAt, ...data } = item
        await storage.emailProviders.create(data)
      }
      
      console.log('数据导出到IndexedDB完成')
      return {
        emails: emails.length,
        designs: designs.length, 
        providers: providers.length
      }
    } catch (error) {
      console.error('数据导出失败:', error)
      throw error
    }
  }
  
  // 清空IndexedDB数据
  static async clearIndexedDB() {
    if (typeof window === 'undefined') return
    
    return new Promise<void>((resolve, reject) => {
      const deleteReq = indexedDB.deleteDatabase('EmailEditorDB')
      deleteReq.onsuccess = () => resolve()
      deleteReq.onerror = () => reject(deleteReq.error)
    })
  }
  
  // 检查IndexedDB中的数据数量
  static async getIndexedDBStats() {
    if (typeof window === 'undefined') return null
    
    const storage = StorageManager.getInstance()
    await storage.initialize()
    
    const [emails, designs, providers] = await Promise.all([
      storage.emails.findMany(),
      storage.emailDesigns.findMany(),
      storage.emailProviders.findMany()
    ])
    
    return {
      emails: emails.length,
      designs: designs.length,
      providers: providers.length
    }
  }
}