/**
 * 简化的日志管理系统
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const isProd = process.env.NODE_ENV === 'production'
const minLevel: LogLevel = isProd ? 'warn' : 'debug'

const levels: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}

function shouldLog(level: LogLevel): boolean {
  return levels[level] >= levels[minLevel]
}

// 简化的日志函数
export const log = {
  debug: (message: string, ...args: any[]) => {
    if (shouldLog('debug')) console.log(`[DEBUG] ${message}`, ...args)
  },
  info: (message: string, ...args: any[]) => {
    if (shouldLog('info')) console.log(`[INFO] ${message}`, ...args)
  },
  warn: (message: string, ...args: any[]) => {
    if (shouldLog('warn')) console.warn(`[WARN] ${message}`, ...args)
  },
  error: (message: string, ...args: any[]) => {
    if (shouldLog('error')) console.error(`[ERROR] ${message}`, ...args)
  }
}