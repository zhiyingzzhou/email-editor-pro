/** @type {import('next').NextConfig} */
const storageType = process.env.NEXT_PUBLIC_STORAGE_TYPE || 'sqlite'
const isClientStorage = storageType === 'indexeddb'

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3032',
        pathname: '/**',
      },
    ],
    ...(isClientStorage && { unoptimized: true })
  },
  output: 'standalone',
  // React 19 优化
  reactStrictMode: true,
  // 启用 gzip 压缩
  compress: true,
  // Next.js 15 服务器外部包配置 (新位置)
  serverExternalPackages: isClientStorage ? [] : ['@prisma/client'],
}

module.exports = nextConfig