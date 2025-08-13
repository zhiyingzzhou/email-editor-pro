import { PrismaClient, ProviderType } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // 创建默认邮件提供商
  await prisma.emailProvider.upsert({
    where: { name: 'SMTP默认配置' },
    update: {},
    create: {
      name: 'SMTP默认配置',
      type: ProviderType.SMTP,
      config: JSON.stringify({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: '',
          pass: ''
        }
      }),
      senderEmail: '',
      isActive: true,
    },
  })

  console.log('数据库种子数据已创建')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })