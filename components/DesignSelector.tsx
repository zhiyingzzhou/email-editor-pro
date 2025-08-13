"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Layout, Search, X, RefreshCw } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { EMAIL_DESIGNS } from '@/lib/email-designs'
import { EmailDesign } from '@/types'
import { log } from '@/lib/logger'
import { ApiAdapter } from '@/lib/api-adapter'

interface DesignSelectorProps {
  onSelectTemplate: (design: EmailDesign) => void
  disabled?: boolean
}

export function DesignSelector({ onSelectTemplate, disabled = false }: DesignSelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [designs, setDesigns] = useState<EmailDesign[]>(EMAIL_DESIGNS)
  const [loading, setLoading] = useState(false)

  // 获取所有设计（包括自定义设计）
  const fetchDesigns = async () => {
    try {
      setLoading(true)
      const data = await ApiAdapter.getEmailDesigns()
      // 只显示启用的设计
      const activeDesigns = (data || []).filter((design: EmailDesign) => design.isActive)
      setDesigns(activeDesigns)
    } catch (error) {
      log.error('获取设计失败', error)
      // 回退到静态设计
      setDesigns(EMAIL_DESIGNS)
    } finally {
      setLoading(false)
    }
  }

  // 当对话框打开时获取最新设计
  useEffect(() => {
    if (open) {
      fetchDesigns()
    }
  }, [open])

  const filteredDesigns = designs.filter(design =>
    design.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    design.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectDesign = (design: EmailDesign) => {
    onSelectTemplate(design)
    setOpen(false)
    setSearchQuery('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className="gap-2"
        >
          <Layout className="h-4 w-4" />
          选择设计
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>选择邮件设计</DialogTitle>
          <DialogDescription>
            选择一个预设设计来快速开始您的邮件编辑
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* 搜索框和刷新按钮 */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索设计..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchDesigns}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              刷新
            </Button>
          </div>

          {/* 设计网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto">
            {filteredDesigns.map((design) => (
              <div
                key={design.id}
                className="group relative bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
                onClick={() => handleSelectDesign(design)}
              >
                {/* 设计预览图 */}
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200 relative overflow-hidden">
                  {design.thumbnail ? (
                    <img
                      src={design.thumbnail}
                      alt={`${design.name}预览`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // 如果图片加载失败，显示默认预览
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = "none";
                        const nextElement = target.nextElementSibling as HTMLElement;
                        if (nextElement) {
                          nextElement.style.display = "flex";
                        }
                      }}
                    />
                  ) : null}
                  
                  {/* 回退预览 */}
                  <div
                    className={`${
                      design.thumbnail ? "hidden" : "flex"
                    } absolute inset-2 bg-white rounded shadow-sm border border-gray-200`}
                    style={{ display: design.thumbnail ? "none" : "flex" }}
                  >
                    <div className="w-full p-3 space-y-2">
                      {/* 模拟头部 */}
                      <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-1.5 bg-gray-100 rounded w-1/2"></div>
                      
                      {/* 通用设计预览 */}
                      <div className="flex items-center justify-center h-16">
                        <div className="text-center">
                          <div className="text-gray-400 text-2xl mb-1">📧</div>
                          <div className="text-gray-500 text-xs font-medium truncate max-w-20">
                            {design.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 悬停覆盖层 */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <div className="bg-white text-gray-900 px-4 py-2 rounded text-sm font-medium shadow-lg border border-gray-200">
                      选择此设计
                    </div>
                  </div>
                </div>

                {/* 设计信息 */}
                <div className="p-4">
                  <h3 className="font-medium text-sm mb-1 text-foreground">
                    {design.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {design.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 空状态 */}
          {filteredDesigns.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Layout className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                未找到匹配的设计
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                尝试使用不同的关键词搜索，或者清空搜索条件查看所有设计
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}