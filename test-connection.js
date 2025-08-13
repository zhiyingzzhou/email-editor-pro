const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('正在测试数据库连接...')
    
    // 测试基本连接
    const providers = await prisma.emailProvider.findMany()
    console.log('✅ 数据库连接成功!')
    console.log(`找到 ${providers.length} 个邮件服务商`)
    
    if (providers.length > 0) {
      console.log('服务商列表:')
      providers.forEach(provider => {
        console.log(`- ${provider.name} (${provider.type})`)
      })
    }
    
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message)
    console.error('错误代码:', error.code)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()