"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DesignManagerForm } from "@/components/DesignManagerForm";
import { JsonEditor } from "@/components/JsonEditor";
import { ApiAdapter } from "@/lib/api-adapter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Filter,
  RefreshCw,
  Copy,
} from "lucide-react";
import { EmailDesign, CreateDesignRequest, UpdateDesignRequest } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { copyToClipboard } from "@/lib/utils";
import { ImagePreviewDialog } from "@/components/ui/image-preview-dialog";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";

export default function DesignManagerPage() {
  const [designs, setDesigns] = useState<EmailDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterActive, setFilterActive] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [selectedDesign, setSelectedDesign] = useState<EmailDesign | null>(
    null
  );
  const [formOpen, setFormOpen] = useState(false);
  const [viewJsonOpen, setViewJsonOpen] = useState(false);
  const [imageZoomOpen, setImageZoomOpen] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingDesign, setDeletingDesign] = useState<EmailDesign | null>(
    null
  );
  const { toast } = useToast();

  // 处理复制操作
  const handleCopyId = async (id: string) => {
    await copyToClipboard(id, {
      onSuccess: () => {
        toast({
          description: "ID已复制到剪贴板",
          variant: "success",
        });
      },
      onError: (error) => {
        toast({
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  // 获取设计列表
  const fetchDesigns = async () => {
    try {
      setLoading(true);
      const data = await ApiAdapter.getEmailDesigns();
      setDesigns(data || []);
    } catch (error) {
      console.error("获取设计列表失败:", error);
      toast({
        description: "获取设计列表失败",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // 创建或更新设计
  const handleSubmitDesign = async (
    data: CreateDesignRequest | UpdateDesignRequest
  ) => {
    try {
      setSubmitting(true);

      const isUpdate = "id" in data;
      
      if (isUpdate) {
        const { id, ...updateData } = data as UpdateDesignRequest;
        await ApiAdapter.updateEmailDesign(id, updateData);
      } else {
        await ApiAdapter.createEmailDesign(data as CreateDesignRequest);
      }

      toast({
        description: isUpdate ? "设计更新成功" : "设计创建成功",
        variant: "success",
      });
      await fetchDesigns();
      setSelectedDesign(null);
    } catch (error) {
      console.error("操作失败:", error);
      toast({
        description: error instanceof Error ? error.message : "操作失败",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // 打开删除确认对话框
  const handleDeleteClick = (design: EmailDesign) => {
    setDeletingDesign(design);
    setDeleteDialogOpen(true);
  };

  // 确认删除设计
  const handleConfirmDelete = async () => {
    if (!deletingDesign) return;

    try {
      await ApiAdapter.deleteEmailDesign(deletingDesign.id);
      toast({
        description: "设计删除成功",
        variant: "success",
      });
      await fetchDesigns();
    } catch (error) {
      console.error("删除失败:", error);
      toast({
        description: error instanceof Error ? error.message : "删除失败",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setDeletingDesign(null);
    }
  };

  // 切换设计状态
  const handleToggleDesign = async (design: EmailDesign) => {
    try {
      const updatedData = {
        isActive: !design.isActive,
      };

      await ApiAdapter.updateEmailDesign(design.id, updatedData);
      toast({
        description: `设计已${!design.isActive ? "启用" : "禁用"}`,
        variant: "success",
      });
      await fetchDesigns();
    } catch (error) {
      console.error("操作失败:", error);
      toast({
        description: error instanceof Error ? error.message : "操作失败",
        variant: "destructive",
      });
    }
  };

  // 过滤设计
  const filteredDesigns = designs.filter((design) => {
    const matchesSearch =
      design.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      design.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterActive === "all" ||
      (filterActive === "active" && design.isActive) ||
      (filterActive === "inactive" && !design.isActive);

    return matchesSearch && matchesFilter;
  });

  // 初始化加载
  useEffect(() => {
    fetchDesigns();
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        {/* 页面标题和操作 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">设计管理</h1>
            <p className="text-gray-600 mt-1">
              管理您的邮件设计JSON数据，包括系统设计和自定义设计
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={fetchDesigns}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              刷新
            </Button>
            <Button
              onClick={() => {
                setSelectedDesign(null);
                setFormOpen(true);
              }}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              创建设计
            </Button>
          </div>
        </div>

        {/* 搜索和过滤 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索设计名称或描述..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterActive === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterActive("all")}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              全部
            </Button>
            <Button
              variant={filterActive === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterActive("active")}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              已启用
            </Button>
            <Button
              variant={filterActive === "inactive" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterActive("inactive")}
              className="gap-2"
            >
              <EyeOff className="h-4 w-4" />
              已禁用
            </Button>
          </div>
        </div>

        {/* 设计列表 */}
        {loading ? (
          <div className="flex justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : filteredDesigns.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">
              {searchQuery || filterActive !== "all"
                ? "未找到匹配的设计"
                : "暂无设计"}
            </div>
            <p className="text-gray-500 text-sm">
              {searchQuery || filterActive !== "all"
                ? "尝试调整搜索条件或过滤器"
                : '点击"创建设计"按钮来添加您的第一个设计'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDesigns.map((design) => (
              <div
                key={design.id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                {/* 设计预览 */}
                <div
                  className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-lg p-4 flex items-center justify-center relative overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => {
                    if (design.thumbnail) {
                      setZoomedImage(design.thumbnail);
                      setImageZoomOpen(true);
                    }
                  }}
                >
                  {design.thumbnail ? (
                    <img
                      src={design.thumbnail}
                      alt={`${design.name}预览`}
                      className="w-full h-full object-cover rounded"
                      onError={(e) => {
                        // 如果图片加载失败，显示默认预览
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = "none";
                        const nextElement =
                          target.nextElementSibling as HTMLElement;
                        if (nextElement) {
                          nextElement.style.display = "flex";
                        }
                      }}
                    />
                  ) : null}
                  <div
                    className={`${
                      design.thumbnail ? "hidden" : "flex"
                    } w-full h-full items-center justify-center bg-white border-2 border-dashed border-gray-200 rounded`}
                    style={{ display: design.thumbnail ? "none" : "flex" }}
                  >
                    <div className="text-center">
                      <div className="text-gray-400 text-2xl mb-2">📧</div>
                      <div className="text-gray-500 text-sm font-medium">
                        {design.name}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">邮件设计</div>
                    </div>
                  </div>
                </div>

                {/* 设计信息 */}
                <div className="p-4 flex flex-col">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {design.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                      {design.isActive ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          已启用
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          已禁用
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 my-2">
                    <span className="text-xs text-gray-500">ID:</span>
                    <div className="flex items-center gap-1 flex-1 min-w-0">
                      <span
                        className="text-xs text-gray-500 truncate flex-1 font-mono"
                        title={design.id}
                      >
                        {design.id}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyId(design.id);
                        }}
                        className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200 flex-shrink-0 group"
                        title="复制ID"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {design.description}
                  </p>

                  {/* 时间信息 - 保持固定高度 */}
                  <div className="text-xs text-gray-400 mb-3 space-y-1 min-h-[2.5rem]">
                    {design.createdAt && (
                      <div>
                        创建:{" "}
                        {new Date(design.createdAt).toLocaleString("zh-CN")}
                      </div>
                    )}
                    {design.updatedAt &&
                      design.updatedAt !== design.createdAt && (
                        <div>
                          更新:{" "}
                          {new Date(design.updatedAt).toLocaleString("zh-CN")}
                        </div>
                      )}
                  </div>

                  {/* 操作按钮 - 放在底部 */}
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedDesign(design);
                        setFormOpen(true);
                      }}
                      className="gap-1 flex-1"
                    >
                      <Edit className="h-3 w-3" />
                      编辑
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleDesign(design)}
                      className="gap-1"
                    >
                      {design.isActive ? (
                        <>
                          <EyeOff className="h-3 w-3" />
                          禁用
                        </>
                      ) : (
                        <>
                          <Eye className="h-3 w-3" />
                          启用
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(design)}
                      className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                      删除
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 设计表单对话框 */}
      <DesignManagerForm
        open={formOpen}
        onOpenChange={setFormOpen}
        design={selectedDesign}
        onSubmit={handleSubmitDesign}
        loading={submitting}
      />

      {/* JSON查看对话框 */}
      <Dialog open={viewJsonOpen} onOpenChange={setViewJsonOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>查看设计数据 - {selectedDesign?.name}</DialogTitle>
            <DialogDescription>
              完整的设计JSON数据，您可以复制此数据用于其他地方
            </DialogDescription>
          </DialogHeader>

          {selectedDesign && (
            <div className="max-h-[70vh] overflow-hidden">
              <JsonEditor
                value={selectedDesign.design}
                onChange={() => {}} // 只读模式
                readOnly
                height="60vh"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 图片放大预览对话框 */}
      <ImagePreviewDialog
        open={imageZoomOpen}
        onOpenChange={setImageZoomOpen}
        imageSrc={zoomedImage}
        imageAlt="设计预览放大图"
        title="设计预览图片"
        maxHeight="85vh"
      />

      {/* 删除确认对话框 */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        itemName={`设计 "${deletingDesign?.name}"`}
      />
    </div>
  );
}
