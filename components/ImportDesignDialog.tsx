"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, FileText, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface ImportDesignDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (design: Record<string, unknown>) => void
  importing?: boolean
}

export function ImportDesignDialog({
  open,
  onOpenChange,
  onImport,
  importing = false
}: ImportDesignDialogProps) {
  const [jsonText, setJsonText] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'file' | 'text'>('file')

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const design = JSON.parse(content)
        
        if (!design || typeof design !== 'object') {
          setError('无效的design JSON格式')
          return
        }
        
        setError('')
        onImport(design)
      } catch (error) {
        console.error('解析JSON失败:', error)
        setError('无效的JSON文件格式')
      }
    }
    
    reader.onerror = () => {
      setError('读取文件失败')
    }
    
    reader.readAsText(file)
  }

  const handleTextImport = () => {
    if (!jsonText.trim()) {
      setError('请输入JSON内容')
      return
    }

    try {
      const design = JSON.parse(jsonText)
      
      if (!design || typeof design !== 'object') {
        setError('无效的design JSON格式')
        return
      }
      
      setError('')
      onImport(design)
    } catch (error) {
      console.error('解析JSON失败:', error)
      setError('无效的JSON格式')
    }
  }

  const handleClose = () => {
    setJsonText('')
    setError('')
    setActiveTab('file')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            导入Design JSON
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'file' | 'text')} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 flex-shrink-0">
              <TabsTrigger value="file" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                上传文件
              </TabsTrigger>
              <TabsTrigger value="text" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                粘贴JSON
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto mt-4 space-y-4 p-1">
              <TabsContent value="file" className="space-y-4 m-0">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">选择JSON文件</h3>
                    <p className="text-sm text-muted-foreground">
                      选择包含邮件设计的JSON文件进行导入
                    </p>
                  </div>
                  <Button 
                    className="mt-4" 
                    disabled={importing}
                    onClick={() => document.getElementById('file-input')?.click()}
                  >
                    {importing ? '导入中...' : '选择文件'}
                  </Button>
                  <input
                    id="file-input"
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </TabsContent>

              <TabsContent value="text" className="space-y-4 m-0 h-full flex flex-col">
                <div className="space-y-3 flex-1 flex flex-col p-1">
                  <label className="text-sm font-medium flex-shrink-0">JSON内容</label>
                  <Textarea
                    placeholder="请粘贴或输入design JSON内容..."
                    value={jsonText}
                    onChange={(e) => setJsonText(e.target.value)}
                    className="flex-1 min-h-[200px] max-h-[400px] font-mono text-sm resize-none focus-visible:ring-offset-0 focus-visible:ring-2 border-2"
                    disabled={importing}
                  />
                </div>
                <Button 
                  onClick={handleTextImport} 
                  disabled={importing || !jsonText.trim()}
                  className="w-full flex-shrink-0"
                >
                  {importing ? '导入中...' : '导入JSON'}
                </Button>
              </TabsContent>

              {error && (
                <Alert variant="destructive" className="mx-1 mt-5">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          </Tabs>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t flex-shrink-0">
          <Button variant="outline" onClick={handleClose} disabled={importing}>
            取消
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}