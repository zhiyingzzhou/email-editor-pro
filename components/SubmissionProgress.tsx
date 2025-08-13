"use client"

import { useEffect, useState } from 'react'
import { CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react'
import { SubmissionStep } from '@/lib/submission-manager'

interface SubmissionProgressProps {
  steps: SubmissionStep[]
  currentStep?: string
  className?: string
}

export function SubmissionProgress({ steps, currentStep, className = '' }: SubmissionProgressProps) {
  const [animatedSteps, setAnimatedSteps] = useState(steps)

  useEffect(() => {
    setAnimatedSteps(steps)
  }, [steps])

  const getStepIcon = (step: SubmissionStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'in_progress':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStepClass = (step: SubmissionStep) => {
    const baseClass = "flex items-start space-x-3 p-4 rounded-lg transition-all duration-300"
    
    switch (step.status) {
      case 'completed':
        return `${baseClass} bg-green-50 border border-green-200`
      case 'in_progress':
        return `${baseClass} bg-blue-50 border border-blue-200 shadow-sm`
      case 'error':
        return `${baseClass} bg-red-50 border border-red-200`
      default:
        return `${baseClass} bg-gray-50 border border-gray-200`
    }
  }

  const overallProgress = steps.reduce((acc, step) => {
    if (step.status === 'completed') return acc + 1
    if (step.status === 'in_progress' && step.progress) return acc + (step.progress / 100)
    return acc
  }, 0)

  const totalProgress = (overallProgress / steps.length) * 100

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 总体进度条 */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">提交进度</h3>
          <span className="text-sm font-medium text-gray-600">
            {Math.round(totalProgress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${totalProgress}%` }}
          />
        </div>
      </div>

      {/* 步骤列表 */}
      <div className="space-y-3">
        {animatedSteps.map((step, index) => (
          <div
            key={step.id}
            className={getStepClass(step)}
            style={{
              transform: step.status === 'in_progress' ? 'scale(1.02)' : 'scale(1)',
              animationDelay: `${index * 100}ms`
            }}
          >
            <div className="flex-shrink-0 mt-0.5">
              {getStepIcon(step)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900">
                  {step.title}
                </h4>
                {step.status === 'in_progress' && step.progress !== undefined && (
                  <span className="text-xs font-medium text-blue-600">
                    {step.progress}%
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mt-1">
                {step.description}
              </p>
              
              {step.status === 'in_progress' && step.progress !== undefined && (
                <div className="mt-2">
                  <div className="w-full bg-blue-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${step.progress}%` }}
                    />
                  </div>
                </div>
              )}
              
              {step.status === 'error' && step.error && (
                <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded text-xs text-red-700">
                  错误详情: {step.error}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}