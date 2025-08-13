import { StorageAdapter, StorageType } from './types'
import { getStorageConfig } from './config'
import { PrismaAdapter } from './adapters/prisma-adapter'
import { IndexedDBAdapter } from './adapters/indexeddb-adapter'

export class StorageFactory {
  private static instance: StorageAdapter

  static create(): StorageAdapter {
    if (this.instance) {
      return this.instance
    }

    const config = getStorageConfig()
    
    switch (config.type) {
      case 'indexeddb':
        this.instance = new IndexedDBAdapter()
        break
      case 'sqlite':
      case 'mysql':
      case 'postgresql':
        this.instance = new PrismaAdapter()
        break
      default:
        throw new Error(`Unsupported storage type: ${config.type}`)
    }
    
    return this.instance
  }
}