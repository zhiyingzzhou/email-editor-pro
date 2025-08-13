'use client'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'

export default function DynamicLayout({ children }: { children: React.ReactNode }) {
  const [mainHeight, setMainHeight] = useState<string>('auto')
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const updateMainHeight = () => {
      if (navRef.current) {
        const navHeight = navRef.current.offsetHeight
        const viewportHeight = window.innerHeight
        const calculatedHeight = viewportHeight - navHeight
        setMainHeight(`${calculatedHeight}px`)
      }
    }

    // 页面加载完毕后计算高度
    updateMainHeight()

    // 监听窗口大小变化
    window.addEventListener('resize', updateMainHeight)

    return () => {
      window.removeEventListener('resize', updateMainHeight)
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <nav ref={navRef} className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <img 
                src="/logo.png" 
                alt="邮件模板编辑器" 
                className="h-10 w-auto max-w-none"
              />
            </div>
            <div className="flex items-center space-x-1">
              <Link 
                href="/" 
                className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                邮件模板列表
              </Link>
              <Link 
                href="/editor" 
                className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                创建邮件模板
              </Link>
              <Link 
                href="/providers" 
                className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                发送配置
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main 
        className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 overflow-auto flex flex-col"
        style={{ height: mainHeight }}
      >
        {children}
      </main>
    </div>
  )
}