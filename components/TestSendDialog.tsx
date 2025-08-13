"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { SimpleSelect as Select, SelectOption } from '@/components/ui/select'
import { Provider } from '@/types'
import { UseFormReturn } from 'react-hook-form'
import { TestSendForm } from '@/lib/validation'

interface TestSendDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  testSendForm: UseFormReturn<TestSendForm>
  providers: Provider[]
  onSend: () => void
  sending: boolean
}

export function TestSendDialog({
  open,
  onOpenChange,
  testSendForm,
  providers,
  onSend,
  sending
}: TestSendDialogProps) {
  const { register, watch, formState: { errors, isValid } } = testSendForm
  const recipientEmail = watch('recipientEmail')
  const selectedProvider = watch('selectedProvider')
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">发送测试邮件</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              收件人邮箱
            </label>
            <div className="relative">
              <Input
                type="email"
                {...register('recipientEmail')}
                placeholder="请输入收件人邮箱地址"
                className={`w-full ${errors.recipientEmail ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.recipientEmail && (
                <p className="absolute left-0 top-full mt-1 text-sm text-red-600">
                  {errors.recipientEmail.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <Select
                value={selectedProvider}
                onChange={(e) => testSendForm.setValue('selectedProvider', e.target.value, { shouldValidate: true })}
                label="邮件服务商"
                className={errors.selectedProvider ? 'border-red-500' : ''}
              >
                <SelectOption value="">请选择服务商</SelectOption>
                {providers.filter(provider => provider.isActive).map((provider) => (
                  <SelectOption key={provider.id} value={provider.id}>
                    {provider.name}
                  </SelectOption>
                ))}
              </Select>
              {errors.selectedProvider && (
                <p className="absolute left-0 top-full mt-1 text-sm text-red-600">
                  {errors.selectedProvider.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={sending}
            >
              取消
            </Button>
            <Button
              onClick={onSend}
              disabled={sending || !isValid}
              className="gap-2"
              type="button"
            >
              {sending ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  发送中...
                </>
              ) : (
                '发送'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}