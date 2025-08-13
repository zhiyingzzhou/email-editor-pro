// 存储类型定义
export type StorageType = 'indexeddb' | 'sqlite' | 'mysql' | 'postgresql'

// 基础实体接口
export interface BaseEntity {
  id: string
  createdAt: Date
  updatedAt: Date
}

// 查询选项
export interface QueryOptions {
  where?: Record<string, any>
  orderBy?: Record<string, 'asc' | 'desc'>
  limit?: number
  offset?: number
}

// 统一存储接口
export interface StorageAdapter {
  connect(): Promise<void>
  disconnect(): Promise<void>
  
  findMany<T>(table: string, options?: QueryOptions): Promise<T[]>
  findById<T>(table: string, id: string): Promise<T | null>
  create<T>(table: string, data: Omit<T, keyof BaseEntity>): Promise<T>
  update<T>(table: string, id: string, data: Partial<T>): Promise<T>
  delete(table: string, id: string): Promise<void>
}

// 存储配置
export interface StorageConfig {
  type: StorageType
  connectionString?: string
  options?: Record<string, any>
}