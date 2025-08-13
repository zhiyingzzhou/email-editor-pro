/**
 * 通用表单处理工具
 * 整合常见的表单验证和处理逻辑
 */

import { UseFormReturn, FieldValues } from 'react-hook-form'
import { useToast } from '@/components/ui/use-toast'

export interface FormSubmitOptions {
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
  successMessage?: string
  errorMessage?: string
}

/**
 * 通用表单提交处理器
 */
export function useFormSubmit<T extends FieldValues>(
  form: UseFormReturn<T>,
  submitFn: (data: T) => Promise<any>,
  options: FormSubmitOptions = {}
) {
  const { toast } = useToast()
  
  return async (data: T) => {
    try {
      const result = await submitFn(data)
      
      if (options.successMessage) {
        toast({
          title: options.successMessage,
          variant: 'success'
        })
      }
      
      options.onSuccess?.(result)
      return result
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : (options.errorMessage || '操作失败')
      
      toast({
        title: '操作失败',
        description: errorMsg,
        variant: 'destructive'
      })
      
      options.onError?.(error instanceof Error ? error : new Error(errorMsg))
      throw error
    }
  }
}

/**
 * 通用错误处理器
 */
export function createErrorHandler(componentName: string) {
  return (error: unknown, message?: string) => {
    console.error(`[${componentName}] Error:`, error)
    
    // 在hook之外使用toast需要不同的方式处理
    const errorMessage = error instanceof Error 
      ? error.message 
      : message || '发生未知错误'
    
    // 可以通过事件或其他方式触发toast，这里简化为console
    console.error(`操作失败: ${errorMessage}`)
  }
}