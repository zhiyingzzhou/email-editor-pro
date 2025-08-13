import { StorageManager } from './manager'
export { StorageManager } from './manager'
export { getStorageConfig, isClientStorage } from './config'
export type { StorageType, StorageAdapter, QueryOptions } from './types'

// 便捷访问
export const storage = StorageManager.getInstance()