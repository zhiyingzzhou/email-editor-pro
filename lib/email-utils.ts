import domtoimage from 'dom-to-image'
import { log } from './logger'

export interface PreviewProgress {
  step: 'creating_element' | 'rendering' | 'generating_image' | 'completed'
  message: string
  progress: number // 0-100
}

export type PreviewProgressCallback = (progress: PreviewProgress) => void

/**
 * 统一的高质量预览图生成函数
 * @param options 生成选项
 * @returns 预览图的base64数据URL或null
 */
export async function generateHighQualityPreview(options: {
  htmlContent: string
  onProgress?: PreviewProgressCallback
  targetWidth?: number
  pixelRatio?: number
}): Promise<string | null> {
  const {
    htmlContent,
    onProgress,
    targetWidth = 600, // 默认宽度，匹配邮件标准宽度
    pixelRatio = 1 // 提高像素比例，获得更清晰的图片
  } = options

  const updateProgress = (step: PreviewProgress['step'], message: string, progress: number) => {
    if (onProgress) {
      onProgress({ step, message, progress })
    }
  }

  try {
    if (!htmlContent) {
      throw new Error('没有HTML内容可以生成预览')
    }

    updateProgress('creating_element', '正在创建HTML元素...', 20)

    // 创建临时容器元素
    const container = createHtmlContainer(htmlContent, targetWidth)

    updateProgress('rendering', '正在渲染内容...', 50)

    // 等待所有资源加载
    await waitForResources(container)

    updateProgress('generating_image', '正在生成预览图...', 80)

    // 直接使用dom-to-image转换
    const dataUrl = await domtoimage.toPng(container, {
      width: targetWidth * pixelRatio,
      height: container.scrollHeight * pixelRatio,
      bgcolor: '#ffffff',
      quality: pixelRatio,
      cacheBust: true,
      style: {
        // transform: `scale(${pixelRatio})`,
        // transformOrigin: '0 0',
        width: `${targetWidth}px`,
        height: `${container.scrollHeight}px`
      },
      filter: (node: any) => {
        // 过滤掉可能影响渲染的元素
        if (node.tagName === 'SCRIPT' || node.tagName === 'NOSCRIPT') {
          return false
        }
        return true
      }
    })

    updateProgress('completed', '预览图生成完成', 100)

    // 清理临时元素
    if (container.parentNode) {
      document.body.removeChild(container)
    }

    return dataUrl
  } catch (error) {
    log.error('生成预览图失败', error)
    updateProgress('completed', '预览图生成失败', 100)
    return null
  }
}

/**
 * 创建HTML容器元素
 * @param htmlContent HTML内容
 * @param targetWidth 目标宽度
 * @returns 容器元素
 */
function createHtmlContainer(htmlContent: string, targetWidth: number): HTMLElement {
  const container = document.createElement('div')

  // 设置容器样式
  container.style.position = 'absolute'
  container.style.left = '0'
  container.style.top = '0px'
  container.style.width = `${targetWidth}px`
  container.style.zIndex = '-999'
  // container.style.visibility = 'hidden'
  container.style.backgroundColor = '#ffffff'
  container.style.overflow = 'visible'
  container.style.margin = '0'
  container.style.padding = '0'

  // 插入HTML内容
  container.innerHTML = htmlContent

  // 添加到DOM
  document.body.appendChild(container)

  return container
}

/**
 * 等待容器中的所有资源加载完成
 * @param container 容器元素
 */
async function waitForResources(container: HTMLElement): Promise<void> {
  // 等待图片加载
  await waitForImages(container)

  // 等待字体加载
  if ('fonts' in document) {
    await document.fonts.ready
  }

  // 简单等待，确保渲染完成
  await new Promise(resolve => setTimeout(resolve, 200))
}

/**
 * 等待容器内所有图片加载完成
 * @param container 容器元素
 */
async function waitForImages(container: Element): Promise<void> {
  const images = container.querySelectorAll('img')
  if (images.length === 0) return

  log.debug(`等待 ${images.length} 张图片加载完成`)

  const imagePromises = Array.from(images).map((img, index) => {
    return new Promise<void>((resolve) => {
      if (img.complete && img.naturalHeight > 0) {
        log.debug(`图片 ${index + 1} 已加载`)
        resolve()
      } else {
        img.onload = () => {
          log.debug(`图片 ${index + 1} 加载完成`)
          resolve()
        }
        img.onerror = () => {
          log.debug(`图片 ${index + 1} 加载失败`)
          resolve() // 即使加载失败也继续
        }
        // 设置超时，避免卡住
        setTimeout(() => {
          log.debug(`图片 ${index + 1} 加载超时`)
          resolve()
        }, 5000) // 增加超时时间
      }
    })
  })

  await Promise.all(imagePromises)
  log.debug('所有图片加载完成')
}
