"use client"

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Editor } from 'react-email-editor'
import { Email, EmailDesign } from '@/types'
import { ApiAdapter } from '@/lib/api-adapter'
import { generateHighQualityPreview } from '@/lib/email-utils'
import { emailEditorSchema, testSendSchema, type EmailEditorForm, type TestSendForm } from '@/lib/validation'
import { useEmailEditorState } from './useEmailEditorState'
import { useToast } from '@/components/ui/use-toast'
import { log } from '@/lib/logger'

type ExportHtmlResult = Parameters<Parameters<Editor['exportHtml']>[0]>[0]

interface UseEmailEditorProps {
  email?: Email | null
  isEditMode?: boolean
}

export function useEmailEditor({ email, isEditMode = false }: UseEmailEditorProps = {}) {
  // 使用分离的状态管理
  const {
    saving,
    setSaving,
    sendDialogOpen,
    setSendDialogOpen,
    providers,
    setProviders,
    sending,
    setSending,
    submissionSteps,
    setSubmissionSteps,
    importDialogOpen,
    setImportDialogOpen,
    importing,
    setImporting,
    emailEditorRef,
    updateStepStatus,
    initializeSubmissionSteps
  } = useEmailEditorState()
  
  const router = useRouter()
  const { toast } = useToast()

  // 邮件标题表单
  const titleForm = useForm<EmailEditorForm>({
    resolver: zodResolver(emailEditorSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      title: email?.title || ''
    }
  })

  // 测试发送表单
  const testSendForm = useForm<TestSendForm>({
    resolver: zodResolver(testSendSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      recipientEmail: '',
      selectedProvider: ''
    }
  })

  const fetchProviders = useCallback(async () => {
    try {
      const activeProviders = await ApiAdapter.getEmailProviders()
      setProviders(activeProviders)
    } catch (error) {
      log.error('获取服务商列表失败', error)
      toast({
        title: '获取服务商列表失败',
        description: error instanceof Error ? error.message : '未知错误',
        variant: 'destructive'
      })
    }
  }, [setProviders, toast])

  const onReady = useCallback((editor: Editor) => {
    log.info('邮件编辑器已准备就绪')
    // 加载已有的设计（仅在编辑模式下）
    if (email && editor && isEditMode) {
      try {
        const design = JSON.parse(email.design)
        editor.loadDesign(design)
        log.info('设计加载成功')
      } catch (error) {
        log.error('加载设计失败', error)
      }
    }
  }, [email, isEditMode])

  const handleSave = useCallback(async (status?: 'DRAFT' | 'PUBLISHED') => {
    try {
      // 先进行表单验证，验证通过后才显示进度
      const isValid = await titleForm.trigger()
      if (!isValid) {
        return
      }

      if (!emailEditorRef.current?.editor) {
        toast({
          title: '邮件编辑器未准备就绪',
          variant: 'destructive'
        })
        return
      }

      // 验证通过后才开始显示进度
      setSaving(true)
      setSubmissionSteps(initializeSubmissionSteps(status, isEditMode))

      // 步骤1: 表单验证（已完成）
      updateStepStatus('validation', 'in_progress')
      await new Promise(resolve => setTimeout(resolve, 300)) // 模拟验证时间
      updateStepStatus('validation', 'completed')

      // 步骤2: 导出内容
      updateStepStatus('export', 'in_progress')
      await new Promise(resolve => setTimeout(resolve, 200)) // 模拟导出时间

      emailEditorRef.current.editor?.exportHtml(async (data: ExportHtmlResult) => {
        try {
          const { design, html } = data
          const targetWidth = (design.body?.values as any)['contentWidth']
          updateStepStatus('export', 'completed')
          // 步骤3: 生成预览
          updateStepStatus('preview', 'in_progress')
          const preview = await generateHighQualityPreview({ htmlContent: html, targetWidth: targetWidth ? Number(targetWidth.replace('px', '')) : void 0 })
          updateStepStatus('preview', 'completed')

          // 步骤4: 提交数据
          updateStepStatus('submission', 'in_progress')
          const { title } = titleForm.getValues()
          const emailData = {
            title,
            content: html,
            design: JSON.stringify(design),
            preview,
            ...(status && { status })
          }

          if (isEditMode && email) {
            await ApiAdapter.updateEmail(email.id, emailData)
          } else {
            await ApiAdapter.createEmail(emailData)
          }
          updateStepStatus('submission', 'completed')

          // 步骤5: 完成
          updateStepStatus('completion', 'in_progress')
          await new Promise(resolve => setTimeout(resolve, 500)) // 模拟完成时间
          updateStepStatus('completion', 'completed')

          const actionText = status === 'PUBLISHED' ? '发布' : '保存'
          toast({
            title: `邮件${actionText}成功`,
            variant: 'success'
          })

          // 延迟跳转，让用户看到完成状态
          setTimeout(() => {
            router.push('/')
          }, 1000)
        } catch (error) {
          log.error('保存邮件失败', error)
          updateStepStatus('submission', 'error', undefined, '保存失败')
          toast({
            description: error instanceof Error ? error.message : '保存邮件失败',
            variant: 'destructive'
          })
        } finally {
          setSaving(false)
        }
      })
    } catch (error) {
      log.error('导出邮件失败', error)
      updateStepStatus('export', 'error', undefined, '导出失败')
      toast({
        description: error instanceof Error ? error.message : '导出邮件失败',
        variant: 'destructive'
      })
      setSaving(false)
    }
  }, [titleForm, email, isEditMode, router])

  const handleTestSend = useCallback(async () => {
    // 验证标题
    const isTitleValid = await titleForm.trigger()
    if (!isTitleValid) {
      return
    }
    setSendDialogOpen(true)
  }, [titleForm])

  const handleSendTest = useCallback(async () => {
    // 防止重复点击 - 如果已在发送中则直接返回
    if (sending) {
      return
    }

    // 验证测试发送表单
    const isFormValid = await testSendForm.trigger()
    if (!isFormValid) {
      return
    }

    if (!emailEditorRef.current?.editor) {
      toast({
        title: '邮件编辑器未准备就绪',
        variant: 'destructive'
      })
      return
    }

    setSending(true)

    try {
      const { recipientEmail, selectedProvider } = testSendForm.getValues()

      if (isEditMode && email) {
        // 编辑模式：直接发送现有邮件
        await ApiAdapter.sendEmail({
          emailId: email.id,
          to: recipientEmail,
          providerId: selectedProvider
        })

        toast({
          title: '测试邮件发送成功',
          variant: 'success'
        })
        setSendDialogOpen(false)
        testSendForm.reset()
      } else {
        // 新建模式：直接发送测试邮件，不创建数据库记录
        await new Promise<void>((resolve, reject) => {
          emailEditorRef.current?.editor?.exportHtml(async (data: ExportHtmlResult) => {
            const { html } = data

            try {
              const { title } = titleForm.getValues()

              // 直接发送测试邮件，不创建临时记录
              await ApiAdapter.sendTestEmail({
                title,
                content: html,
                to: recipientEmail,
                providerId: selectedProvider
              })

              toast({
                title: '测试邮件发送成功',
                variant: 'success'
              })
              setSendDialogOpen(false)
              testSendForm.reset()
              resolve()
            } catch (error) {
              reject(error)
            }
          })
        })
      }
    } catch (error) {
      log.error('发送邮件失败', error)
      toast({
        description: error instanceof Error ? error.message : '发送邮件失败',
        variant: 'destructive'
      })
    } finally {
      setSending(false)
    }
  }, [sending, testSendForm, titleForm, email, isEditMode])

  const handleSelectTemplate = useCallback((template: EmailDesign) => {
    if (!emailEditorRef.current?.editor) {
      toast({
        title: '邮件编辑器未准备就绪',
        variant: 'destructive'
      })
      return
    }

    try {
      // 加载模板设计到编辑器
      emailEditorRef.current.editor.loadDesign(template.design as any)

      // 如果模板有默认标题，可以设置标题
      const currentTitle = titleForm.getValues('title')
      if (!currentTitle && template.name !== '空白模板') {
        titleForm.setValue('title', `基于${template.name}的邮件`)
      }

      toast({
        title: `已加载${template.name}模板`,
        variant: 'success'
      })
    } catch (error) {
      log.error('加载模板失败', error)
      toast({
        description: error instanceof Error ? error.message : '加载模板失败',
        variant: 'destructive'
      })
    }
  }, [titleForm])

  const handleImportDesign = useCallback(() => {
    setImportDialogOpen(true)
  }, [])

  const handleImportDesignFromDialog = useCallback(async (design: Record<string, unknown>) => {
    if (!emailEditorRef.current?.editor) {
      toast({
        title: '邮件编辑器未准备就绪',
        variant: 'destructive'
      })
      return
    }

    setImporting(true)

    try {
      // 加载设计到编辑器
      emailEditorRef.current.editor.loadDesign(design as any)
      toast({
        title: 'Design JSON导入成功',
        variant: 'success'
      })
      setImportDialogOpen(false)
    } catch (error) {
      log.error('加载设计失败', error)
      toast({
        description: error instanceof Error ? error.message : '加载设计失败',
        variant: 'destructive'
      })
    } finally {
      setImporting(false)
    }
  }, [setImporting, setImportDialogOpen])

  return {
    // 表单控制器
    titleForm,
    testSendForm,

    // 状态
    saving,
    sendDialogOpen,
    providers,
    sending,
    submissionSteps,
    importDialogOpen,
    importing,
    emailEditorRef,

    // 状态更新函数
    setSendDialogOpen,
    setImportDialogOpen,

    // 业务逻辑函数
    fetchProviders,
    onReady,
    handleSave,
    handleTestSend,
    handleSendTest,
    handleSelectTemplate,
    handleImportDesign,
    handleImportDesignFromDialog
  }
}