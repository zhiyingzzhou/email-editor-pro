import { PrismaClient } from '@prisma/client'
import { StorageAdapter, QueryOptions } from '../types'

export class PrismaAdapter implements StorageAdapter {
  private client: PrismaClient

  constructor() {
    this.client = new PrismaClient()
  }

  async connect(): Promise<void> {
    await this.client.$connect()
  }

  async disconnect(): Promise<void> {
    await this.client.$disconnect()
  }

  async findMany<T>(table: string, options?: QueryOptions): Promise<T[]> {
    switch (table) {
      case 'emails':
        return await this.client.email.findMany({
          where: options?.where,
          orderBy: options?.orderBy,
          take: options?.limit,
          skip: options?.offset
        }) as T[]
      case 'emailDesigns':
        return await this.client.emailDesign.findMany({
          where: options?.where,
          orderBy: options?.orderBy,
          take: options?.limit,
          skip: options?.offset
        }) as T[]
      case 'emailProviders':
        return await this.client.emailProvider.findMany({
          where: options?.where,
          orderBy: options?.orderBy,
          take: options?.limit,
          skip: options?.offset
        }) as T[]
      default:
        throw new Error(`Unknown table: ${table}`)
    }
  }

  async findById<T>(table: string, id: string): Promise<T | null> {
    switch (table) {
      case 'emails':
        return await this.client.email.findUnique({ where: { id } }) as T | null
      case 'emailDesigns':
        return await this.client.emailDesign.findUnique({ where: { id } }) as T | null
      case 'emailProviders':
        return await this.client.emailProvider.findUnique({ where: { id } }) as T | null
      default:
        throw new Error(`Unknown table: ${table}`)
    }
  }

  async create<T>(table: string, data: any): Promise<T> {
    switch (table) {
      case 'emails':
        return await this.client.email.create({ data }) as T
      case 'emailDesigns':
        return await this.client.emailDesign.create({ data }) as T
      case 'emailProviders':
        return await this.client.emailProvider.create({ data }) as T
      default:
        throw new Error(`Unknown table: ${table}`)
    }
  }

  async update<T>(table: string, id: string, data: any): Promise<T> {
    switch (table) {
      case 'emails':
        return await this.client.email.update({ where: { id }, data }) as T
      case 'emailDesigns':
        return await this.client.emailDesign.update({ where: { id }, data }) as T
      case 'emailProviders':
        return await this.client.emailProvider.update({ where: { id }, data }) as T
      default:
        throw new Error(`Unknown table: ${table}`)
    }
  }

  async delete(table: string, id: string): Promise<void> {
    switch (table) {
      case 'emails':
        await this.client.email.delete({ where: { id } })
        break
      case 'emailDesigns':
        await this.client.emailDesign.delete({ where: { id } })
        break
      case 'emailProviders':
        await this.client.emailProvider.delete({ where: { id } })
        break
      default:
        throw new Error(`Unknown table: ${table}`)
    }
  }
}