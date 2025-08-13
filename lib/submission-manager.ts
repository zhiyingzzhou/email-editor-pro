/**
 * 统一的提交步骤管理器
 * 整合所有提交相关的逻辑，避免重复代码
 */

export interface SubmissionStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'error'
  progress?: number
  error?: string
}

export type SubmissionType = 'email_save' | 'email_publish' | 'email_update' | 'design_create' | 'design_update'

export class SubmissionManager {
  private static stepTemplates: Record<SubmissionType, (context?: any) => SubmissionStep[]> = {
    email_save: () => [
      { id: 'validation', title: '表单验证', description: '验证邮件标题和编辑器状态', status: 'pending' },
      { id: 'export', title: '导出内容', description: '导出邮件设计和HTML内容', status: 'pending' },
      { id: 'preview', title: '生成预览', description: '生成邮件预览图', status: 'pending' },
      { id: 'submission', title: '保存邮件', description: '将邮件保存到数据库', status: 'pending' },
      { id: 'completion', title: '完成', description: '邮件处理完成，准备返回', status: 'pending' }
    ],
    email_publish: () => [
      { id: 'validation', title: '表单验证', description: '验证邮件标题和编辑器状态', status: 'pending' },
      { id: 'export', title: '导出内容', description: '导出邮件设计和HTML内容', status: 'pending' },
      { id: 'preview', title: '生成预览', description: '生成邮件预览图', status: 'pending' },
      { id: 'submission', title: '发布邮件', description: '发布邮件到数据库', status: 'pending' },
      { id: 'completion', title: '完成', description: '邮件处理完成，准备返回', status: 'pending' }
    ],
    email_update: () => [
      { id: 'validation', title: '表单验证', description: '验证邮件标题和编辑器状态', status: 'pending' },
      { id: 'export', title: '导出内容', description: '导出邮件设计和HTML内容', status: 'pending' },
      { id: 'preview', title: '生成预览', description: '生成邮件预览图', status: 'pending' },
      { id: 'submission', title: '更新邮件', description: '保存邮件更新到数据库', status: 'pending' },
      { id: 'completion', title: '完成', description: '邮件处理完成，准备返回', status: 'pending' }
    ],
    design_create: () => [
      { id: 'validation', title: '表单验证', description: '验证表单数据的完整性和有效性', status: 'pending' },
      { id: 'thumbnail', title: '生成缩略图', description: '生成设计预览缩略图', status: 'pending' },
      { id: 'submission', title: '创建设计', description: '将新设计保存到数据库', status: 'pending' },
      { id: 'completion', title: '完成', description: '设计处理完成，准备返回', status: 'pending' }
    ],
    design_update: () => [
      { id: 'validation', title: '表单验证', description: '验证表单数据的完整性和有效性', status: 'pending' },
      { id: 'thumbnail', title: '生成缩略图', description: '更新设计预览缩略图', status: 'pending' },
      { id: 'submission', title: '更新设计', description: '保存设计更新到数据库', status: 'pending' },
      { id: 'completion', title: '完成', description: '设计处理完成，准备返回', status: 'pending' }
    ]
  }

  static getSteps(type: SubmissionType, context?: any): SubmissionStep[] {
    return this.stepTemplates[type](context)
  }

  static updateSteps(
    steps: SubmissionStep[],
    stepId: string,
    status: SubmissionStep['status'],
    progress?: number,
    error?: string
  ): SubmissionStep[] {
    return steps.map(step => 
      step.id === stepId 
        ? { ...step, status, progress, error }
        : step
    )
  }

  static getCurrentStep(steps: SubmissionStep[]): SubmissionStep | null {
    return steps.find(step => step.status === 'in_progress') || null
  }

  static isCompleted(steps: SubmissionStep[]): boolean {
    return steps.every(step => step.status === 'completed')
  }

  static hasError(steps: SubmissionStep[]): boolean {
    return steps.some(step => step.status === 'error')
  }
}