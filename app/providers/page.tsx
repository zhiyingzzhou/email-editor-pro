"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DeleteConfirmDialog } from '@/components/ui/delete-confirm-dialog'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Edit, Trash2, Plus, Mail, Settings, Power, PowerOff } from 'lucide-react'
import { ProviderType } from '@prisma/client'
import { useToast } from '@/components/ui/use-toast'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { ApiAdapter } from '@/lib/api-adapter'

interface Provider {
  id: string
  name: string
  type: ProviderType
  config: string
  senderEmail: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface SMTPConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

// Zod schema for form validation
const providerFormSchema = z.object({
  name: z.string().min(1, '请输入服务商名称'),
  type: z.enum(['SMTP', 'SENDGRID', 'MAILGUN', 'AWS_SES']),
  host: z.string().min(1, '请输入服务器地址'),
  port: z.number().min(1, '端口必须大于0').max(65535, '端口不能超过65535'),
  secure: z.boolean(),
  user: z.string().min(1, '请输入用户名'),
  pass: z.string().min(1, '请输入密码'),
  senderEmail: z.string().email('请输入有效的发送邮箱地址').min(1, '请输入发送邮箱地址'),
  isActive: z.boolean()
})

type ProviderFormData = z.infer<typeof providerFormSchema>

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null)
  const [testDialogOpen, setTestDialogOpen] = useState(false)
  const [testingProvider, setTestingProvider] = useState<Provider | null>(null)
  const [testEmail, setTestEmail] = useState('')
  const [testing, setTesting] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingProvider, setDeletingProvider] = useState<Provider | null>(null)
  const { toast } = useToast()

  // React Hook Form
  const form = useForm<ProviderFormData>({
    resolver: zodResolver(providerFormSchema),
    defaultValues: {
      name: '',
      type: 'SMTP',
      host: '',
      port: 587,
      secure: false,
      user: '',
      pass: '',
      senderEmail: '',
      isActive: true
    }
  })

  useEffect(() => {
    fetchProviders()
  }, [])

  const fetchProviders = async () => {
    try {
      const data = await ApiAdapter.getEmailProviders()
      setProviders(data)
    } catch (error) {
      console.error('获取服务商列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (provider?: Provider) => {
    if (provider) {
      setEditingProvider(provider)
      const config = JSON.parse(provider.config) as SMTPConfig
      form.reset({
        name: provider.name,
        type: provider.type as 'SMTP' | 'SENDGRID' | 'MAILGUN' | 'AWS_SES',
        host: config.host,
        port: config.port,
        secure: config.secure,
        user: config.auth.user,
        pass: config.auth.pass,
        senderEmail: provider.senderEmail,
        isActive: provider.isActive
      })
    } else {
      setEditingProvider(null)
      form.reset({
        name: '',
        type: 'SMTP',
        host: '',
        port: 587,
        secure: false,
        user: '',
        pass: '',
        senderEmail: '',
        isActive: true
      })
    }
    setDialogOpen(true)
  }

  const handleSave = async (data: ProviderFormData) => {
    const config = {
      host: data.host,
      port: data.port,
      secure: data.secure,
      auth: {
        user: data.user,
        pass: data.pass
      }
    }

    try {
      const providerData = {
        name: data.name,
        type: data.type,
        config: JSON.stringify(config),
        senderEmail: data.senderEmail,
        isActive: data.isActive
      }

      if (editingProvider) {
        await ApiAdapter.updateEmailProvider(editingProvider.id, providerData)
      } else {
        await ApiAdapter.createEmailProvider(providerData)
      }

      toast({
        description: `服务商${editingProvider ? '更新' : '创建'}成功`,
        variant: 'success'
      })
      setDialogOpen(false)
      fetchProviders()
    } catch (error) {
      console.error('保存失败:', error)
      toast({
        description: '保存失败',
        variant: 'destructive'
      })
    }
  }

  const handleDeleteClick = (provider: Provider) => {
    setDeletingProvider(provider)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deletingProvider) return

    try {
      await ApiAdapter.deleteEmailProvider(deletingProvider.id)
      setProviders(providers.filter(p => p.id !== deletingProvider.id))
      toast({
        description: '服务商删除成功',
        variant: 'default'
      })
    } catch (error) {
      console.error('删除失败:', error)
      toast({
        description: '删除失败',
        variant: 'destructive'
      })
    } finally {
      setDeleteDialogOpen(false)
      setDeletingProvider(null)
    }
  }

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await ApiAdapter.updateEmailProvider(id, { isActive: !isActive })
      setProviders(providers.map(p => 
        p.id === id ? { ...p, isActive: !isActive } : p
      ))
      toast({
        description: `服务商${!isActive ? '启用' : '禁用'}成功`,
        variant: 'success'
      })
    } catch (error) {
      console.error('状态更新失败:', error)
      toast({
        description: '状态更新失败',
        variant: 'destructive'
      })
    }
  }

  const handleTest = async () => {
    if (!testEmail || !testingProvider) {
      toast({
        description: '请输入测试邮箱地址',
        variant: 'destructive'
      })
      return
    }

    setTesting(true)
    try {
      await ApiAdapter.testEmailProvider(testingProvider.id, { to: testEmail })
      toast({
        description: '测试邮件发送成功',
        variant: 'success'
      })
      setTestDialogOpen(false)
      setTestEmail('')
    } catch (error) {
      console.error('测试失败:', error)
      toast({
        description: error instanceof Error ? error.message : '测试失败',
        variant: 'destructive'
      })
    } finally {
      setTesting(false)
    }
  }

  const getTypeLabel = (type: string) => {
    const labels = {
      SMTP: 'SMTP',
      SENDGRID: 'SendGrid',
      MAILGUN: 'Mailgun',
      AWS_SES: 'AWS SES'
    }
    return labels[type as keyof typeof labels] || type
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner message="加载服务商中..." />
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-3xl font-bold text-foreground">邮件服务商配置</h1>
            <p className="mt-2 text-muted-foreground">
              管理您的邮件发送服务商配置
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="h-4 w-4" />
              添加服务商
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    名称
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    类型
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    状态
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    创建时间
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {providers.map((provider) => (
                  <tr key={provider.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">
                        {provider.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 border-blue-200">
                        {getTypeLabel(provider.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                        provider.isActive 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {provider.isActive ? '启用' : '禁用'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(provider.createdAt).toLocaleString('zh-CN')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                setTestingProvider(provider)
                                setTestDialogOpen(true)
                              }}
                            >
                              <Mail className="h-4 w-4" />
                              <span className="sr-only">测试</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>发送测试邮件</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleOpenDialog(provider)}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">编辑</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>编辑服务商配置</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className={`h-8 w-8 p-0 ${
                                provider.isActive 
                                  ? 'text-orange-600 hover:text-orange-700' 
                                  : 'text-green-600 hover:text-green-700'
                              }`}
                              onClick={() => handleToggleActive(provider.id, provider.isActive)}
                            >
                              {provider.isActive ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                              <span className="sr-only">{provider.isActive ? '禁用' : '启用'}</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{provider.isActive ? '禁用服务商' : '启用服务商'}</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteClick(provider)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">删除</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>删除服务商</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {providers.length === 0 && (
              <div className="text-center py-12">
                <Settings className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  暂无服务商配置
                </h3>
                <p className="mt-2 text-muted-foreground">
                  开始添加您的第一个邮件服务商配置
                </p>
                <div className="mt-6">
                  <Button onClick={() => handleOpenDialog()} className="gap-2">
                    <Plus className="h-4 w-4" />
                    添加服务商
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 添加/编辑对话框 */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                {editingProvider ? '编辑服务商' : '添加服务商'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  服务商名称
                </label>
                <Input
                  {...form.register('name')}
                  placeholder="请输入服务商名称"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  服务器地址
                </label>
                <Input
                  {...form.register('host')}
                  placeholder="smtp.gmail.com"
                />
                {form.formState.errors.host && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.host.message}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  端口
                </label>
                <Input
                  type="number"
                  {...form.register('port', { valueAsNumber: true })}
                  placeholder="587"
                />
                {form.formState.errors.port && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.port.message}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  用户名
                </label>
                <Input
                  {...form.register('user')}
                  placeholder="your-email@gmail.com"
                />
                {form.formState.errors.user && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.user.message}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  密码
                </label>
                <Input
                  type="password"
                  {...form.register('pass')}
                  placeholder="应用专用密码"
                />
                {form.formState.errors.pass && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.pass.message}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  发送邮箱地址
                </label>
                <Input
                  type="email"
                  {...form.register('senderEmail')}
                  placeholder="请输入发送邮箱地址"
                />
                {form.formState.errors.senderEmail && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.senderEmail.message}
                  </p>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="secure"
                  {...form.register('secure')}
                  className="h-4 w-4 text-primary border-input rounded focus:ring-2 focus:ring-ring"
                />
                <label htmlFor="secure" className="text-sm text-foreground">
                  使用SSL/TLS
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  {...form.register('isActive')}
                  className="h-4 w-4 text-primary border-input rounded focus:ring-2 focus:ring-ring"
                />
                <label htmlFor="isActive" className="text-sm text-foreground">
                  启用此服务商
                </label>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  取消
                </Button>
                <Button type="submit">
                  {editingProvider ? '更新' : '添加'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* 测试对话框 */}
        <Dialog open={testDialogOpen} onOpenChange={setTestDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">测试邮件发送</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  测试邮箱地址
                </label>
                <Input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="请输入测试邮箱地址"
                  className="w-full"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setTestDialogOpen(false)}
                  disabled={testing}
                >
                  取消
                </Button>
                <Button
                  onClick={handleTest}
                  disabled={testing || !testEmail}
                  className="gap-2"
                >
                  {testing ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      发送中...
                    </>
                  ) : (
                    "发送测试"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 删除确认对话框 */}
        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          itemName={`服务商 "${deletingProvider?.name}"`}
        />
      </div>
    </TooltipProvider>
  )
}