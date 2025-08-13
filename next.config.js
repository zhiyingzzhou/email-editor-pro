const storageType = process.env.NEXT_PUBLIC_STORAGE_TYPE || 'sqlite'
const isClientStorage = storageType === 'indexeddb'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3032',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.vercel.app',
        pathname: '/**',
      },
    ],
    ...(isClientStorage && { unoptimized: true })
  },
  // 在 Vercel 上使用默认输出模式，在本地开发使用 standalone
  output: process.env.VERCEL ? undefined : 'standalone',
  // React 19 优化
  reactStrictMode: true,
  // 启用 gzip 压缩
  compress: true,
  // Next.js 15 服务器外部包配置 (新位置)
  serverExternalPackages: isClientStorage ? [] : ['@prisma/client'],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
}

module.exports = nextConfig