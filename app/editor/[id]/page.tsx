"use client"

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { EmailEditorPage } from '@/components/EmailEditorPage'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Email } from '@/types'
import { ApiAdapter } from '@/lib/api-adapter'
import { toast } from '@/components/ui/use-toast'

export default function EditEmailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [email, setEmail] = useState<Email | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  
  const fetchEmail = async () => {
    try {
      const data = await ApiAdapter.getEmail(resolvedParams.id)
      setEmail(data)
    } catch (error) {
      console.error('获取邮件模板失败:', error)
      toast({
        title: "获取邮件模板失败",
        variant: "destructive"
      })
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmail()
  }, [resolvedParams.id])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <EmailEditorPage
      email={email}
      isEditMode={true}
    />
  )
}