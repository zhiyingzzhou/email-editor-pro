"use client";

import { useEffect } from "react";
import { EmailEditorToolbar } from "@/components/EmailEditorToolbar";
import { TestSendDialog } from "@/components/TestSendDialog";
import { EmailEditorWrapper } from "@/components/EmailEditorWrapper";
import { SubmissionProgress } from "@/components/SubmissionProgress";
import { ImportDesignDialog } from "@/components/ImportDesignDialog";
import { useEmailEditor } from "@/hooks/useEmailEditor";
import { Email } from "@/types";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface EmailEditorPageProps {
  email?: Email | null;
  isEditMode?: boolean;
  onLoad?: (editor: any) => void;
}

export function EmailEditorPage({
  email,
  isEditMode = false,
  onLoad,
}: EmailEditorPageProps) {
  const {
    titleForm,
    testSendForm,
    saving,
    sendDialogOpen,
    providers,
    sending,
    submissionSteps,
    importDialogOpen,
    importing,
    emailEditorRef,
    setSendDialogOpen,
    setImportDialogOpen,
    fetchProviders,
    onReady,
    handleSave,
    handleTestSend,
    handleSendTest,
    handleSelectTemplate,
    handleImportDesign,
    handleImportDesignFromDialog,
    handleExportHtml,
  } = useEmailEditor({ email, isEditMode });

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* 提交进度显示 */}
      {saving && submissionSteps.length > 0 && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg p-6">
          <div className="w-full max-w-md">
            <SubmissionProgress steps={submissionSteps} className="w-full" />
          </div>
        </div>
      )}

      <EmailEditorToolbar
        titleForm={titleForm}
        onSave={isEditMode ? () => handleSave() : () => handleSave("DRAFT")}
        onPublish={() => handleSave("PUBLISHED")}
        onTestSend={handleTestSend}
        onSelectTemplate={handleSelectTemplate}
        onImportDesign={handleImportDesign}
        saving={saving}
        isEditMode={isEditMode}
      />

      <div className="flex-1 overflow-hidden relative">
        <EmailEditorWrapper
          ref={emailEditorRef}
          onReady={onReady}
          onLoad={onLoad}
        />
        
        {/* 导出HTML悬浮按钮 */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleExportHtml}
                size="sm"
                className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-shadow"
                disabled={saving}
              >
                <Download className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>导出HTML</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <TestSendDialog
        open={sendDialogOpen}
        onOpenChange={setSendDialogOpen}
        testSendForm={testSendForm}
        providers={providers}
        onSend={handleSendTest}
        sending={sending}
      />

      <ImportDesignDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onImport={handleImportDesignFromDialog}
        importing={importing}
      />
    </div>
  );
}
