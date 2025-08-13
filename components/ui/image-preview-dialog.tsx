"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ImagePreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  imageSrc: string | null
  imageAlt?: string
  title?: string
  maxWidth?: string
  maxHeight?: string
}

export function ImagePreviewDialog({
  open,
  onOpenChange,
  imageSrc,
  imageAlt = "预览图片",
  title = "图片预览",
  maxWidth = "4xl",
  maxHeight = "80vh"
}: ImagePreviewDialogProps) {
  if (!imageSrc) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-${maxWidth} p-0`}>
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <img
          src={imageSrc}
          alt={imageAlt}
          className={`w-full h-auto max-h-[${maxHeight}] object-contain rounded-lg`}
        />
      </DialogContent>
    </Dialog>
  )
}