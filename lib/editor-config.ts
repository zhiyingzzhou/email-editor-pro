/**
 * 邮件编辑器的统一配置和工具
 */

import { UnlayerOptions } from "react-email-editor"
import { log } from './logger'

// 编辑器配置
export const EDITOR_CONFIGS = {
  default: {
    displayMode: 'email',
    locale: 'zh-CN'
  } as UnlayerOptions,
  
  readOnly: {
    displayMode: 'email',
    locale: 'zh-CN',
    appearance: {
      theme: 'light',
      panels: {
        tools: {
          dock: 'left',
          collapsible: false,
          tabs: {
            body: {
              visible: false
            }
          }
        }
      }
    },
    features: {
      preview: true
    }
  } as UnlayerOptions
}

export type EditorMode = 'preview' | 'edit' | 'readonly'

// 统一的编辑器工具类
export class EditorUtils {
  /**
   * 安全加载设计到编辑器
   */
  static async loadDesign(editor: any, design: any): Promise<boolean> {
    try {
      if (!design || (typeof design === 'object' && Object.keys(design).length === 0)) {
        log.debug('设计内容为空，跳过加载')
        return false
      }
      
      editor.loadDesign(design)
      log.info('设计内容加载成功')
      return true
    } catch (error) {
      log.error('加载设计内容失败', error)
      return false
    }
  }

  /**
   * 切换编辑器模式
   */
  static async switchMode(editor: any, mode: EditorMode, delay: number = 500): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          switch (mode) {
            case 'preview':
              editor.setDisplayMode('email')
              if (typeof editor.showPreview === 'function') {
                editor.showPreview({ device: 'tablet' })
              }
              break
              
            case 'readonly':
              editor.setDisplayMode('email')
              if (typeof editor.showPreview === 'function') {
                editor.showPreview({ device: 'tablet' })
              }
              if (typeof editor.hideTools === 'function') {
                editor.hideTools()
              }
              break
              
            case 'edit':
              editor.setDisplayMode('email')
              if (typeof editor.showTools === 'function') {
                editor.showTools()
              }
              break
          }
          
          log.info(`已切换到${mode}模式`)
        } catch (error) {
          log.error(`切换${mode}模式失败`, error)
        }
        resolve()
      }, delay)
    })
  }

  /**
   * 导出HTML内容
   */
  static async exportHtml(editor: any): Promise<{ design: any; html: string } | null> {
    return new Promise((resolve) => {
      try {
        editor.exportHtml((data: any) => {
          resolve(data)
        })
      } catch (error) {
        log.error('导出HTML失败', error)
        resolve(null)
      }
    })
  }
}

// 向后兼容
export const getReadOnlyPreviewConfig = () => EDITOR_CONFIGS.readOnly