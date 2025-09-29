"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImagePreviewDialog } from "@/components/ui/image-preview-dialog";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Edit,
  Trash2,
  Mail,
  Plus,
  Copy,
  Archive,
  CheckCircle,
  Settings,
  Power,
  PowerOff,
  Download,
} from "lucide-react";
import Link from "next/link";
import { ApiAdapter } from "@/lib/api-adapter";

interface Email {
  id: string;
  title: string;
  content: string;
  design: string;
  preview: string | null;
  status: "DRAFT" | "PUBLISHED" | "UNPUBLISHED";
  createdAt: string;
  updatedAt: string;
}

interface Provider {
  id: string;
  name: string;
  isActive: boolean;
}

export default function EmailListPage() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [sending, setSending] = useState(false);
  const [previewImageOpen, setPreviewImageOpen] = useState(false);
  const [previewImageSrc, setPreviewImageSrc] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [copyDialogOpen, setCopyDialogOpen] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState<string | null>(null);
  const [emailToCopy, setEmailToCopy] = useState<Email | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchEmails();
    fetchProviders();
  }, []);

  const fetchEmails = async () => {
    try {
      const data = await ApiAdapter.getEmails();
      setEmails(data);
    } catch (error) {
      console.error("获取邮件模板列表失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProviders = async () => {
    try {
      const data = await ApiAdapter.getEmailProviders();
      setProviders(data.filter((p: Provider) => p.isActive));
    } catch (error) {
      console.error("获取服务商列表失败:", error);
    }
  };

  const handleDelete = (id: string) => {
    setEmailToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!emailToDelete) return;

    try {
      await ApiAdapter.deleteEmail(emailToDelete);
      setEmails(emails.filter((email) => email.id !== emailToDelete));
      toast({
        title: "邮件模板删除成功",
        variant: "success"
      });
    } catch (error) {
      console.error("删除邮件模板失败:", error);
      toast({
        title: "删除邮件模板失败",
        variant: "destructive"
      });
    } finally {
      setDeleteDialogOpen(false);
      setEmailToDelete(null);
    }
  };

  const handleCopyEmail = (email: Email) => {
    setEmailToCopy(email);
    setCopyDialogOpen(true);
  };

  const confirmCopy = async () => {
    if (!emailToCopy) return;

    try {
      const newEmail = await ApiAdapter.createEmail({
        title: `${emailToCopy.title} - 副本`,
        content: emailToCopy.content,
        design: emailToCopy.design,
        preview: emailToCopy.preview,
        status: "DRAFT",
      });
      
      setEmails([newEmail, ...emails]);
      toast({
        title: "邮件模板复制成功",
        variant: "success"
      });
    } catch (error) {
      console.error("复制邮件模板失败:", error);
      toast({
        title: "邮件模板复制失败",
        variant: "destructive"
      });
    } finally {
      setCopyDialogOpen(false);
      setEmailToCopy(null);
    }
  };

  const handleStatusChange = async (
    id: string,
    newStatus: "PUBLISHED" | "UNPUBLISHED"
  ) => {
    try {
      await ApiAdapter.updateEmail(id, { status: newStatus });
      setEmails(
        emails.map((email) =>
          email.id === id ? { ...email, status: newStatus } : email
        )
      );
      toast({
        title: `邮件模板${newStatus === "PUBLISHED" ? "发布" : "下架"}成功`,
        variant: "success"
      });
    } catch (error) {
      console.error("状态更新失败:", error);
      toast({
        title: "状态更新失败",
        variant: "destructive"
      });
    }
  };

  const handleSendTest = async () => {
    if (!selectedEmail || !recipientEmail || !selectedProvider) {
      toast({
        title: "请填写完整的发送信息",
        variant: "destructive"
      });
      return;
    }

    setSending(true);
    try {
      await ApiAdapter.sendEmail({
        emailId: selectedEmail.id,
        to: recipientEmail,
        providerId: selectedProvider,
      });
      
      toast({
        title: "测试邮件模板发送成功",
        variant: "success"
      });
      setSendDialogOpen(false);
      setRecipientEmail("");
      setSelectedProvider("");
    } catch (error) {
      console.error("发送邮件模板失败:", error);
      toast({
        title: "发送邮件模板失败",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const handlePreviewImage = (imageSrc: string) => {
    setPreviewImageSrc(imageSrc);
    setPreviewImageOpen(true);
  };

  const handleDownloadEmail = (email: Email) => {
    try {
      // Create a blob with the HTML content
      const blob = new Blob([email.content], { type: 'text/html' });
      
      // Create a temporary URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `${email.title || 'email-template'}.html`;
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      URL.revokeObjectURL(url);
      
      toast({
        title: "邮件模板下载成功",
        variant: "success"
      });
    } catch (error) {
      console.error("下载邮件模板失败:", error);
      toast({
        title: "下载邮件模板失败",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      DRAFT: "bg-muted text-muted-foreground border-muted",
      PUBLISHED: "bg-green-50 text-green-700 border-green-200",
      UNPUBLISHED: "bg-red-50 text-red-700 border-red-200",
    };
    const labels = {
      DRAFT: "草稿",
      PUBLISHED: "已发布",
      UNPUBLISHED: "已下架",
    };

    return (
      <span
        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
          styles[status as keyof typeof styles]
        }`}
      >
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

    if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner message="加载邮件模板中..." />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-3xl font-bold text-foreground">邮件模板列表</h1>
            <p className="mt-2 text-muted-foreground">管理您的邮件模板和内容</p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex gap-3">
            <Link href="/design-manager">
              <Button variant="outline" className="gap-2">
                <Settings className="h-4 w-4" />
                设计管理
              </Button>
            </Link>
            <Link href="/editor">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                创建邮件模板
              </Button>
            </Link>
          </div>
        </div>

        <div className="rounded-lg border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    预览
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    标题
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    状态
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    更新时间
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {emails.map((email) => (
                  <tr
                    key={email.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      {email.preview ? (
                        <img
                          src={email.preview}
                          alt="邮件模板预览"
                          className="h-16 w-24 object-contain rounded-md border shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => handlePreviewImage(email.preview!)}
                        />
                      ) : (
                        <div className="h-16 w-24 bg-muted rounded-md border flex items-center justify-center">
                          <span className="text-muted-foreground text-xs">
                            无预览
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">
                        {email.title}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(email.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(email.updatedAt).toLocaleString("zh-CN")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={`/editor/${email.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">编辑</span>
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>编辑邮件模板</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleCopyEmail(email)}
                            >
                              <Copy className="h-4 w-4" />
                              <span className="sr-only">复制</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>复制邮件模板</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleDownloadEmail(email)}
                            >
                              <Download className="h-4 w-4" />
                              <span className="sr-only">下载</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>下载邮件模板</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                setSelectedEmail(email);
                                setSendDialogOpen(true);
                              }}
                            >
                              <Mail className="h-4 w-4" />
                              <span className="sr-only">发送</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>发送测试邮件</p>
                          </TooltipContent>
                        </Tooltip>

                        {email.status === "PUBLISHED" ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700"
                                onClick={() =>
                                  handleStatusChange(email.id, "UNPUBLISHED")
                                }
                              >
                                <PowerOff className="h-4 w-4" />
                                <span className="sr-only">下架</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>下架邮件模板</p>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                                onClick={() =>
                                  handleStatusChange(email.id, "PUBLISHED")
                                }
                              >
                                <Power className="h-4 w-4" />
                                <span className="sr-only">发布</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>发布邮件模板</p>
                            </TooltipContent>
                          </Tooltip>
                        )}

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              onClick={() => handleDelete(email.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">删除</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>删除邮件模板</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {emails.length === 0 && (
              <div className="text-center py-12">
                <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  暂无邮件模板
                </h3>
                <p className="mt-2 text-muted-foreground">
                  开始创建您的第一封邮件模板吧
                </p>
                <div className="mt-6">
                  <Link href="/editor">
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      创建邮件模板
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                发送测试邮件
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  收件人邮箱
                </label>
                <Input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="请输入收件人邮箱地址"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  邮件服务商
                </label>
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">请选择服务商</option>
                  {providers.map((provider) => (
                    <option key={provider.id} value={provider.id}>
                      {provider.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setSendDialogOpen(false)}
                  disabled={sending}
                >
                  取消
                </Button>
                <Button
                  onClick={handleSendTest}
                  disabled={sending || !recipientEmail || !selectedProvider}
                  className="gap-2"
                >
                  {sending ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      发送中...
                    </>
                  ) : (
                    "发送"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 图片预览对话框 */}
        <ImagePreviewDialog
          open={previewImageOpen}
          onOpenChange={setPreviewImageOpen}
          imageSrc={previewImageSrc}
          imageAlt="邮件预览放大图"
          title="邮件预览图片"
        />

        {/* 删除确认对话框 */}
        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={confirmDelete}
          itemName="这封邮件模板"
          description="确定要删除这封邮件模板吗？此操作无法撤销。"
        />

        {/* 复制确认对话框 */}
        <AlertDialog open={copyDialogOpen} onOpenChange={setCopyDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确认复制</AlertDialogTitle>
              <AlertDialogDescription>
                确定要复制这封邮件模板吗？将会创建一个标题为"{emailToCopy?.title} - 副本"的新邮件模板。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setCopyDialogOpen(false)}>
                取消
              </AlertDialogCancel>
              <AlertDialogAction onClick={confirmCopy}>
                复制
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>


      </div>
    </TooltipProvider>
  );
}
