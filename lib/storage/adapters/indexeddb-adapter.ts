import { StorageAdapter, QueryOptions } from '../types'

export class IndexedDBAdapter implements StorageAdapter {
  private db?: IDBDatabase
  private dbName = 'EmailEditorDB'
  private version = 1

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        this.createStores(db)
      }
    })
  }

  async disconnect(): Promise<void> {
    this.db?.close()
  }

  private generateId(): string {
    // 兼容的UUID生成方法
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID()
    }
    
    // 回退方案：生成简单的唯一ID
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  private createStores(db: IDBDatabase) {
    const tables = ['emails', 'emailDesigns', 'emailProviders']
    
    tables.forEach(table => {
      if (!db.objectStoreNames.contains(table)) {
        const store = db.createObjectStore(table, { keyPath: 'id' })
        store.createIndex('createdAt', 'createdAt', { unique: false })
        store.createIndex('updatedAt', 'updatedAt', { unique: false })
      }
    })
  }

  async findMany<T>(table: string, options?: QueryOptions): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([table], 'readonly')
      const store = transaction.objectStore(table)
      const request = store.getAll()
      
      request.onsuccess = () => {
        let results = request.result
        
        if (options?.where) {
          results = results.filter(item => 
            Object.entries(options.where!).every(([key, value]) => item[key] === value)
          )
        }
        
        if (options?.orderBy) {
          const [field, direction] = Object.entries(options.orderBy)[0]
          results.sort((a, b) => {
            const aVal = a[field]
            const bVal = b[field]
            const compare = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
            return direction === 'desc' ? -compare : compare
          })
        }
        
        if (options?.limit) {
          results = results.slice(options.offset || 0, (options.offset || 0) + options.limit)
        }
        
        resolve(results)
      }
      
      request.onerror = () => reject(request.error)
    })
  }

  async findById<T>(table: string, id: string): Promise<T | null> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([table], 'readonly')
      const store = transaction.objectStore(table)
      const request = store.get(id)
      
      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  }

  async create<T>(table: string, data: any): Promise<T> {
    const item = {
      ...data,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([table], 'readwrite')
      const store = transaction.objectStore(table)
      const request = store.add(item)
      
      request.onsuccess = () => resolve(item)
      request.onerror = () => reject(request.error)
    })
  }

  async update<T>(table: string, id: string, data: any): Promise<T> {
    const existing = await this.findById<any>(table, id)
    if (!existing) {
      throw new Error(`Record with id ${id} not found`)
    }
    
    const updated = {
      ...existing,
      ...data,
      updatedAt: new Date()
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([table], 'readwrite')
      const store = transaction.objectStore(table)
      const request = store.put(updated)
      
      request.onsuccess = () => resolve(updated)
      request.onerror = () => reject(request.error)
    })
  }

  async delete(table: string, id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([table], 'readwrite')
      const store = transaction.objectStore(table)
      const request = store.delete(id)
      
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }
}