/**
 * 邮件编辑器状态管理 Hook
 * 使用统一的提交管理器
 */
"use client"

import { useState, useRef } from 'react'
import type { EditorRef } from 'react-email-editor'
import { Provider, EntityStatus } from '@/types'
import { SubmissionStep, SubmissionManager, SubmissionType } from '@/lib/submission-manager'

export function useEmailEditorState() {
  // 基础状态
  const [saving, setSaving] = useState(false)
  const [sendDialogOpen, setSendDialogOpen] = useState(false)
  const [providers, setProviders] = useState<Provider[]>([])
  const [sending, setSending] = useState(false)
  const [submissionSteps, setSubmissionSteps] = useState<SubmissionStep[]>([])
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [importing, setImporting] = useState(false)
  
  // 编辑器引用
  const emailEditorRef = useRef<EditorRef>(null)

  // 使用统一的步骤管理
  const updateStepStatus = (stepId: string, status: SubmissionStep['status'], progress?: number, error?: string) => {
    setSubmissionSteps(prev => SubmissionManager.updateSteps(prev, stepId, status, progress, error))
  }

  const initializeSubmissionSteps = (status?: EntityStatus, isEditMode?: boolean): SubmissionStep[] => {
    let type: SubmissionType = 'email_save'
    
    if (status === 'PUBLISHED') {
      type = 'email_publish'
    } else if (isEditMode) {
      type = 'email_update'
    }
    
    return SubmissionManager.getSteps(type)
  }

  return {
    // 状态
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
    
    // 步骤管理函数
    updateStepStatus,
    initializeSubmissionSteps
  }
}