import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 复制文本到剪贴板的通用函数
 * @param text 要复制的文本
 * @param options 配置选项
 * @returns Promise<boolean> 复制是否成功
 */
export async function copyToClipboard(
  text: string,
  options?: {
    onSuccess?: () => void
    onError?: (error: Error) => void
  }
): Promise<boolean> {
  try {
    // 优先使用现代 Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      options?.onSuccess?.()
      return true
    } else {
      // 降级方案：使用传统的复制方法
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      try {
        const success = document.execCommand('copy')
        document.body.removeChild(textArea)
        
        if (success) {
          options?.onSuccess?.()
          return true
        } else {
          throw new Error('复制命令执行失败')
        }
      } catch (fallbackErr) {
        document.body.removeChild(textArea)
        throw new Error('浏览器不支持复制功能')
      }
    }
  } catch (err) {
    const error = err instanceof Error ? err : new Error('复制时发生未知错误')
    options?.onError?.(error)
    return false
  }
}