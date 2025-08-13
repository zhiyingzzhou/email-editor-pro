"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { JsonEditor } from "@/components/JsonEditor";
import { EmailDesign, CreateDesignRequest, UpdateDesignRequest } from "@/types";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { EmailEditorWrapper } from "@/components/EmailEditorWrapper";
import { ImportDesignDialog } from "@/components/ImportDesignDialog";
import { SubmissionProgress } from "@/components/SubmissionProgress";
import { SubmissionStep, SubmissionManager } from "@/lib/submission-manager";
import {
  generateHighQualityPreview,
  type PreviewProgress,
  type PreviewProgressCallback,
} from "@/lib/email-utils";
import { EditorUtils, getReadOnlyPreviewConfig } from "@/lib/editor-config";
import { DEFAULT_EMAIL_EDITOR_CONFIG } from "@/lib/constants";
import { useToast } from "@/components/ui/use-toast";
import type { EditorRef, Editor } from "react-email-editor";

interface DesignManagerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  design?: EmailDesign | null;
  onSubmit: (data: CreateDesignRequest | UpdateDesignRequest) => Promise<void>;
  loading?: boolean;
}

export function DesignManagerForm({
  open,
  onOpenChange,
  design,
  onSubmit,
  loading = false,
}: DesignManagerFormProps) {
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    design: object;
    isActive: boolean;
    thumbnail?: string;
  }>({
    name: "",
    description: "",
    design: {},
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSteps, setSubmissionSteps] = useState<SubmissionStep[]>([]);
  const [originalDesign, setOriginalDesign] = useState<any>(null);
  const [importing, setImporting] = useState(false);
  const emailEditorRef = useRef<EditorRef>(null);
  const { toast } = useToast();

  // 重置表单
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      design: {},
      isActive: true,
    });
    setErrors({});
    setImportDialogOpen(false);
    setIsSubmitting(false);
    setSubmissionSteps([]);
    setOriginalDesign(null);
    setImporting(false);
  };

  // 当设计数据变化时更新表单
  useEffect(() => {
    if (design) {
      setFormData({
        name: design.name,
        description: design.description,
        design: design.design,
        isActive: design.isActive ?? true,
        thumbnail: design.thumbnail,
      });
      // 保存原始设计内容用于比较
      setOriginalDesign(design.design);
    } else {
      resetForm();
    }
  }, [design]);

  // 验证表单
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "设计名称不能为空";
    } else if (formData.name.length < 2) {
      newErrors.name = "设计名称至少需要2个字符";
    } else if (formData.name.length > 50) {
      newErrors.name = "设计名称不能超过50个字符";
    }

    if (!formData.description.trim()) {
      newErrors.description = "设计描述不能为空";
    } else if (formData.description.length < 5) {
      newErrors.description = "设计描述至少需要5个字符";
    } else if (formData.description.length > 200) {
      newErrors.description = "设计描述不能超过200个字符";
    }

    if (!formData.design || Object.keys(formData.design).length === 0) {
      newErrors.design = "设计内容不能为空";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 更新步骤状态
  const updateStepStatus = (
    stepId: string,
    status: SubmissionStep["status"],
    progress?: number,
    error?: string
  ) => {
    setSubmissionSteps((prev) =>
      SubmissionManager.updateSteps(prev, stepId, status, progress, error)
    );
  };

  // 处理缩略图生成进度
  const handleThumbnailProgress: PreviewProgressCallback = (
    progress: PreviewProgress
  ) => {
    updateStepStatus("thumbnail", "in_progress", progress.progress);
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEditing = !!design;

    try {
      // 先进行表单验证，验证通过后才显示进度
      if (!validateForm()) {
        return;
      }

      // 验证通过后才开始显示进度
      setIsSubmitting(true);
      const submissionType = isEditing ? 'design_update' : 'design_create';
      setSubmissionSteps(SubmissionManager.getSteps(submissionType));

      // 步骤1: 表单验证（已完成）
      updateStepStatus("validation", "in_progress");
      await new Promise((resolve) => setTimeout(resolve, 300)); // 模拟验证时间
      updateStepStatus("validation", "completed");

      let finalFormData = { ...formData };

      // 步骤2: 生成缩略图和保存设计内容
      updateStepStatus("thumbnail", "in_progress");

      try {
        // 在只读模式下，使用表单中的设计内容而不是从编辑器获取
        // 因为编辑器是只读的，设计内容已经在表单状态中
        
        // 生成缩略图
        if (emailEditorRef.current?.editor && formData.design && Object.keys(formData.design).length > 0) {
          const htmlContent = await new Promise<string>((resolve, reject) => {
            const editor = emailEditorRef.current?.editor;
            if (!editor) {
              reject(new Error("编辑器未准备就绪"));
              return;
            }

            editor.exportHtml((data: any) => {
              resolve(data.html);
            });
          });

          const thumbnailUrl = await generateHighQualityPreview({
            htmlContent,
            onProgress: handleThumbnailProgress,
          });

          if (thumbnailUrl) {
            finalFormData = { ...finalFormData, thumbnail: thumbnailUrl };
          }
        }

        updateStepStatus("thumbnail", "completed");
      } catch (error) {
        console.error("生成缩略图失败:", error);
        // 如果生成失败，使用降级方案
        if (design && design.thumbnail) {
          // 编辑模式：保持原有缩略图
          finalFormData = { ...finalFormData, thumbnail: design.thumbnail };
          updateStepStatus("thumbnail", "completed");
          toast({
            description: "缩略图生成失败，将保持原有缩略图",
            variant: "default",
          });
        } else {
          // 新建模式或无原有缩略图：使用默认处理
          updateStepStatus("thumbnail", "completed");
          toast({
            description: "缩略图生成失败，设计将使用默认预览图",
            variant: "default",
          });
          // 不抛出错误，继续执行后续步骤
        }
      }

      // 步骤3: 提交数据
      updateStepStatus("submission", "in_progress");
      const submitData = design
        ? ({ ...finalFormData, id: design.id } as UpdateDesignRequest)
        : (finalFormData as CreateDesignRequest);

      await onSubmit(submitData);
      updateStepStatus("submission", "completed");

      // 步骤4: 完成
      updateStepStatus("completion", "in_progress");
      await new Promise((resolve) => setTimeout(resolve, 500)); // 延迟显示完成状态
      updateStepStatus("completion", "completed");

      // 显示成功提示
      toast({
        description: isEditing
          ? "设计已成功更新并保存"
          : "新设计已成功创建并保存",
        variant: "success",
      });

      // 等待一下让用户看到完成状态，然后关闭对话框
      setTimeout(() => {
        onOpenChange(false);
        resetForm();
      }, 1000);
    } catch (error) {
      console.error("提交失败:", error);

      // 显示错误提示
      toast({
        description:
          error instanceof Error ? error.message : "发生了未知错误，请重试",
        variant: "destructive",
      });

      // 更新当前失败的步骤状态
      const currentStep = submissionSteps.find(
        (step) => step.status === "in_progress"
      );
      if (currentStep) {
        updateStepStatus(
          currentStep.id,
          "error",
          undefined,
          error instanceof Error ? error.message : "未知错误"
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 处理输入变化
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // 清除对应字段的错误
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // 处理编辑器内容变化（定期保存设计内容到表单）
  const handleEditorChange = useCallback(() => {
    if (emailEditorRef.current?.editor) {
      emailEditorRef.current.editor.saveDesign((design: any) => {
        handleInputChange("design", design);
      });
    }
  }, []);

  // 当编辑器准备就绪时的回调
  const handleEditorReady = useCallback(
    async (editor: Editor) => {
      console.log("只读预览编辑器已准备就绪");
      
      // 如果有设计内容，加载到编辑器
      if (formData.design && Object.keys(formData.design).length > 0) {
        const loaded = await EditorUtils.loadDesign(editor, formData.design);
        if (loaded) {
          // 加载完成后切换到只读平板预览模式
          await EditorUtils.switchMode(editor, 'readonly');
        }
      } else {
        // 即使没有设计内容，也要切换到只读预览模式
        await EditorUtils.switchMode(editor, 'readonly');
      }

      // 注意：在只读模式下不监听设计变化，因为用户不能编辑
    },
    [formData.design]
  );

  // 处理导入设计
  const handleImportDesign = () => {
    setImportDialogOpen(true);
  };

  // 处理从对话框导入设计
  const handleImportDesignFromDialog = async (design: Record<string, unknown>) => {
    try {
      setImporting(true);
      
      // 更新表单数据中的设计内容
      handleInputChange("design", design);
      
      // 如果编辑器已准备就绪，加载设计内容并切换到只读预览模式
      if (emailEditorRef.current?.editor) {
        const loaded = await EditorUtils.loadDesign(emailEditorRef.current.editor, design);
        if (loaded) {
          await EditorUtils.switchMode(emailEditorRef.current.editor, 'readonly');
        }
      }
      
      // 关闭导入对话框
      setImportDialogOpen(false);
      
      toast({
        description: "设计内容已成功导入",
        variant: "success",
      });
    } catch (error) {
      console.error("导入设计失败:", error);
      toast({
        description: "导入设计失败，请检查JSON格式是否正确",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  const isEditing = !!design;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{isEditing ? "编辑设计" : "创建新设计"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "修改设计的基本信息和设计内容"
              : "创建一个新的邮件设计，包括基本信息和设计内容"}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-hidden flex flex-col relative"
        >
          {/* 提交进度显示 */}
          {isSubmitting && submissionSteps.length > 0 && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg p-6">
              <div className="w-full max-w-md">
                <SubmissionProgress
                  steps={submissionSteps}
                  className="w-full"
                />
              </div>
            </div>
          )}

          <div className="flex-1 overflow-hidden flex flex-col space-y-4 pr-2">
            {/* 基本信息 */}
            <div className="flex-shrink-0">
              <div>
                <Label htmlFor="name">设计名称 *</Label>
                <div className="px-1 mt-2">
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="请输入设计名称"
                    className={errors.name ? "border-red-500" : ""}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-600 mt-2">{errors.name}</p>
                )}
              </div>
            </div>

            <div className="flex-shrink-0">
              <Label htmlFor="description">设计描述 *</Label>
              <div className="px-1 mt-3">
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="请输入设计描述"
                  rows={2}
                  className={errors.description ? "border-red-500" : ""}
                />
              </div>
              {errors.description && (
                <p className="text-sm text-red-600 mt-2">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2 flex-shrink-0">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  handleInputChange("isActive", checked)
                }
              />
              <Label htmlFor="isActive">启用设计</Label>
            </div>

            {/* 设计内容编辑器 */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-2">
                <Label>设计内容 *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleImportDesign}
                  disabled={importing}
                >
                  {importing ? "导入中..." : "导入 Design JSON"}
                </Button>
              </div>

              <div className="flex-1 border rounded-lg overflow-hidden min-h-0" style={{ height: "400px" }}>
                <EmailEditorWrapper
                  ref={emailEditorRef}
                  onReady={handleEditorReady}
                  options={getReadOnlyPreviewConfig()}
                />
              </div>
              {errors.design && (
                <p className="text-sm text-red-600 mt-2">{errors.design}</p>
              )}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-end gap-3 pt-3 border-t mt-3 flex-shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading || isSubmitting}
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={loading || isSubmitting}
              className="relative"
            >
              {(loading || isSubmitting) && (
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                </div>
              )}
              <span className={loading || isSubmitting ? "ml-6" : ""}>
                {isSubmitting
                  ? "处理中..."
                  : loading
                  ? "保存中..."
                  : isEditing
                  ? "更新设计"
                  : "创建设计"}
              </span>
            </Button>
          </div>
        </form>
      </DialogContent>

      {/* 导入设计弹窗 */}
      <ImportDesignDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onImport={handleImportDesignFromDialog}
        importing={importing}
      />
    </Dialog>
  );
}
