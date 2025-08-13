"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Save, Send, Eye, Upload } from 'lucide-react'
import { DesignSelector } from '@/components/DesignSelector'
import { EmailDesign } from '@/types'
import { UseFormReturn } from 'react-hook-form'
import { EmailEditorForm } from '@/lib/validation'

interface EmailEditorToolbarProps {
  titleForm: UseFormReturn<EmailEditorForm>
  onSave?: () => void
  onPublish?: () => void
  onTestSend: () => void
  onSelectTemplate?: (template: EmailDesign) => void
  onImportDesign?: () => void
  saving: boolean
  publishing?: boolean
  isEditMode?: boolean
}

export function EmailEditorToolbar({
  titleForm,
  onSave,
  onPublish,
  onTestSend,
  onSelectTemplate,
  onImportDesign,
  saving,
  publishing = false,
  isEditMode = false
}: EmailEditorToolbarProps) {
  const { register, formState: { errors } } = titleForm
  return (
    <div className="bg-background border-b border-border px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative max-w-md flex-1">
            <Input
              type="text"
              placeholder="请输入邮件模板标题"
              {...register('title')}
              className={`w-full ${errors.title ? 'border-destructive focus:border-destructive focus:ring-destructive' : ''}`}
            />
            {errors.title && (
              <div className="absolute left-0 bottom-full mb-1 text-xs text-destructive z-10">
                {errors.title.message}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {onSelectTemplate && (
            <DesignSelector
              onSelectTemplate={onSelectTemplate}
              disabled={saving}
            />
          )}
          {onImportDesign && (
            <Button
              variant="outline"
              size="sm"
              onClick={onImportDesign}
              disabled={saving}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              导入JSON
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onTestSend}
            disabled={saving}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            测试发送
          </Button>
          {onSave && (
            <Button
              variant="outline"
              size="sm"
              onClick={onSave}
              disabled={saving}
              className="gap-2"
            >
              {saving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {isEditMode ? '保存中...' : '保存中...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {isEditMode ? '保存' : '保存草稿'}
                </>
              )}
            </Button>
          )}
          {onPublish && (
            <Button
              size="sm"
              onClick={onPublish}
              disabled={publishing}
              className="gap-2"
            >
              {publishing ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  发布中...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  发布
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}