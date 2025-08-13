"use client";

import { EmailEditorPage } from "@/components/EmailEditorPage";

export default function NewEmailEditorPage() {
  const onLoad = (editor: any) => {
    console.log("邮件模板编辑器已加载", editor);
  };

  return (
    <EmailEditorPage
      isEditMode={false}
      onLoad={onLoad}
    />
  );
}
