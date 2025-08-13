"use client";
import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "./use-toast";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ComponentRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed bottom-4 right-4 z-[100] flex max-h-screen w-full max-w-sm flex-col gap-2 p-0",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center gap-3 overflow-hidden rounded-xl border-0 p-4 shadow-lg backdrop-blur-md transition-all duration-300 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-right-full data-[state=closed]:slide-out-to-right-full data-[state=open]:duration-300 data-[state=closed]:duration-200",
  {
    variants: {
      variant: {
        default: "bg-white/95 shadow-xl ring-1 ring-gray-200/50 dark:bg-gray-900/95 dark:ring-gray-700/50",
        destructive:
          "destructive group bg-gradient-to-br from-red-500/95 to-red-600/95 text-white shadow-xl shadow-red-500/25",
        success:
          "success group bg-gradient-to-br from-emerald-500/95 to-green-500/95 text-white shadow-xl shadow-emerald-500/25",
        warning:
          "warning group bg-gradient-to-br from-amber-500/95 to-orange-500/95 text-white shadow-xl shadow-amber-500/25",
        info:
          "info group bg-gradient-to-br from-blue-500/95 to-cyan-500/95 text-white shadow-xl shadow-blue-500/25",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-9 shrink-0 items-center justify-center rounded-xl border-none bg-white/20 px-4 text-sm font-medium backdrop-blur-sm transition-all duration-200 hover:bg-white/30 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-3 top-3 rounded-full p-1.5 opacity-80 ring-offset-background transition-all duration-200 hover:opacity-100 hover:scale-110 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 group-[.destructive]:text-white/90 group-[.success]:text-white/90 group-[.warning]:text-white/90 group-[.info]:text-white/90 group-[.destructive]:hover:text-white group-[.success]:hover:text-white group-[.warning]:hover:text-white group-[.info]:hover:text-white",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-base font-bold leading-tight group-[.destructive]:text-white group-[.success]:text-white group-[.warning]:text-white group-[.info]:text-white dark:text-gray-100", className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ComponentRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm text-gray-600 leading-relaxed dark:text-gray-200 group-[.destructive]:text-white/95 group-[.success]:text-white/95 group-[.warning]:text-white/95 group-[.info]:text-white/95", className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

const Toaster = () => {
  const { toasts } = useToast();

  const getToastIcon = (variant?: "default" | "destructive" | "success" | "warning" | "info" | null) => {
    switch (variant) {
      case "success":
        return <CheckCircle className="h-5 w-5 shrink-0" />;
      case "destructive":
        return <AlertCircle className="h-5 w-5 shrink-0" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 shrink-0" />;
      case "info":
        return <Info className="h-5 w-5 shrink-0" />;
      default:
        return <Info className="h-5 w-5 shrink-0 text-blue-500" />;
    }
  };

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, duration, variant, ...props }) {
        return (
          <Toast key={id} duration={duration || 1000} variant={variant} {...props}>
            <div className="flex items-center gap-3 w-full">
              {getToastIcon(variant)}
              <div className="flex-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && <ToastDescription>{description}</ToastDescription>}
                {!description && !title && <ToastDescription>通知</ToastDescription>}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
};

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  Toaster,
}; 