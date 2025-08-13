"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, Check, Copy, Download, Upload } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { copyToClipboard } from '@/lib/utils'

interface JsonEditorProps {
  value: object
  onChange: (value: object) => void
  height?: string
  readOnly?: boolean
}

export function JsonEditor({ 
  value, 
  onChange, 
  height = '400px', 
  readOnly = false 
}: JsonEditorProps) {
  const [jsonString, setJsonString] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isValid, setIsValid] = useState(true)
  const { toast } = useToast()

  // 初始化和同步外部值
  useEffect(() => {
    try {
      setJsonString(JSON.stringify(value, null, 2))
      setError(null)
      setIsValid(true)
    } catch (err) {
      setError('无效的JSON数据')
      setIsValid(false)
    }
  }, [value])

  // 处理JSON字符串变化
  const handleJsonChange = (newJsonString: string) => {
    setJsonString(newJsonString)
    
    if (!newJsonString.trim()) {
      setError('JSON内容不能为空')
      setIsValid(false)
      return
    }

    try {
      const parsedJson = JSON.parse(newJsonString)
      setError(null)
      setIsValid(true)
      onChange(parsedJson)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '无效的JSON格式'
      setError(`JSON格式错误: ${errorMessage}`)
      setIsValid(false)
    }
  }

  // 格式化JSON
  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonString)
      const formatted = JSON.stringify(parsed, null, 2)
      setJsonString(formatted)
      setError(null)
      setIsValid(true)
      onChange(parsed)
      toast({
        description: "JSON已格式化为易读格式",
        variant: "success"
      })
    } catch (err) {
      setError('无法格式化无效的JSON')
      toast({
        description: "请确保JSON格式正确",
        variant: "destructive",
      })
    }
  }

  // 压缩JSON
  const minifyJson = () => {
    try {
      const parsed = JSON.parse(jsonString)
      const minified = JSON.stringify(parsed)
      setJsonString(minified)
      setError(null)
      setIsValid(true)
      onChange(parsed)
      toast({
        description: "JSON已压缩为单行格式",
        variant: "success"
      })
    } catch (err) {
      setError('无法压缩无效的JSON')
      toast({
        description: "请确保JSON格式正确",
        variant: "destructive",
      })
    }
  }

  // 复制到剪贴板
  const handleCopyJson = async () => {
    await copyToClipboard(jsonString, {
      onSuccess: () => {
        toast({
          description: "JSON内容已复制到剪贴板",
          variant: "success"
        })
      },
      onError: (error) => {
        console.error('复制失败:', error)
        toast({
          description: error.message || "复制时发生错误，请手动选择文本复制",
          variant: "destructive",
        })
      }
    })
  }

  // 导出JSON文件
  const exportJson = () => {
    try {
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'template-design.json'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('导出失败:', err)
    }
  }

  // 导入JSON文件
  const importJson = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target?.result as string
          if (content) {
            handleJsonChange(content)
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  return (
    <div className="space-y-4">
      {/* 工具栏 */}
      {!readOnly && (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={formatJson}
            disabled={!isValid}
            className="gap-2"
          >
            <Check className="h-4 w-4" />
            格式化
          </Button>
          {/* <Button
            variant="outline"
            size="sm"
            onClick={minifyJson}
            disabled={!isValid}
            className="gap-2"
          >
            压缩
          </Button> */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopyJson}
            className="gap-2"
          >
            <Copy className="h-4 w-4" />
            复制
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={exportJson}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            导出
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={importJson}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            导入
          </Button>
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* JSON编辑器 */}
      <div className="relative h-[300px]">
        <textarea
          value={jsonString}
          onChange={(e) => handleJsonChange(e.target.value)}
          readOnly={readOnly}
          className={`
            w-full p-4 font-mono text-sm border rounded-lg resize-none
            ${readOnly ? 'bg-gray-50 text-gray-700' : 'bg-white'}
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}
            focus:outline-none focus:ring-2 focus:ring-opacity-50
          `}
          style={{ height }}
          placeholder={readOnly ? '' : '请输入有效的JSON格式数据...'}
          spellCheck={false}
        />
        
        {/* 状态指示器 */}
        <div className="absolute top-2 right-2">
          {isValid ? (
            <div className="flex items-center gap-1 text-green-600 text-xs">
              <Check className="h-3 w-3" />
              有效
            </div>
          ) : (
            <div className="flex items-center gap-1 text-red-600 text-xs">
              <AlertTriangle className="h-3 w-3" />
              无效
            </div>
          )}
        </div>
      </div>

      {/* 字符统计 */}
      <div className="text-xs text-gray-500 text-right">
        字符数: {jsonString.length} | 行数: {jsonString.split('\n').length}
      </div>
    </div>
  )
}