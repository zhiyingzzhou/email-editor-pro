"use client"

import { forwardRef } from 'react'
import dynamic from 'next/dynamic'
import type { EditorRef, Editor, UnlayerOptions } from 'react-email-editor'
import { DEFAULT_EMAIL_EDITOR_CONFIG, EMAIL_EDITOR_STYLE } from '@/lib/constants'

// 动态导入 EmailEditor 以避免 SSR 问题
const EmailEditor = dynamic(
  () => import('react-email-editor').then(mod => mod.default),
  { ssr: false }
)

interface EmailEditorWrapperProps {
  onReady?: (editor: Editor) => void
  onLoad?: (editor: Editor) => void
  options?: UnlayerOptions
}

export const EmailEditorWrapper = forwardRef<EditorRef, EmailEditorWrapperProps>(
  ({ onReady, onLoad, options }, ref) => {
    return (
      <div className="flex h-full w-full bg-background border border-border rounded-lg overflow-hidden">
        <EmailEditor
          ref={ref}
          onReady={onReady}
          onLoad={onLoad}
          options={{
            ...DEFAULT_EMAIL_EDITOR_CONFIG,
            ...options
          }}
          style={EMAIL_EDITOR_STYLE}
        />
      </div>
    )
  }
)

EmailEditorWrapper.displayName = 'EmailEditorWrapper'