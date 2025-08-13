import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  message?: string
  className?: string
  size?: "sm" | "md" | "lg"
  showMessage?: boolean
}

export function LoadingSpinner({ 
  message = '加载中...', 
  className,
  size = "md",
  showMessage = true
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  }

  return (
    <div className={cn(
      "flex items-center justify-center gap-3",
      !className && "min-h-[200px]",
      className
    )}>
      <Loader2 className={cn(
        "animate-spin text-muted-foreground",
        sizeClasses[size]
      )} />
      {showMessage && (
        <div className="text-sm text-muted-foreground font-medium">
          {message}
        </div>
      )}
    </div>
  )
}