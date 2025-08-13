import { StorageConfig, StorageType } from './types'

export const getStorageConfig = (): StorageConfig => {
  const type = (process.env.NEXT_PUBLIC_STORAGE_TYPE as StorageType) || 'sqlite'
  switch (type) {
    case 'indexeddb':
      return {
        type: 'indexeddb',
        options: { dbName: 'EmailEditorDB', version: 1 }
      }
    case 'sqlite':
      return {
        type: 'sqlite',
        connectionString: process.env.DATABASE_URL || 'file:./dev.db'
      }
    case 'mysql':
    case 'postgresql':
      return {
        type,
        connectionString: process.env.DATABASE_URL!
      }
    default:
      throw new Error(`Unsupported storage type: ${type}`)
  }
}

export const isClientStorage = () => {
  return getStorageConfig().type === 'indexeddb'
}