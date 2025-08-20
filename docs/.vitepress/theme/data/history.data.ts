import { normalizePath } from 'vite'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

import type { SiteConfig } from 'vitepress'

export default {
  watch: ['**/*.md'],

  load(watchFiles: string[]) {
    const config: SiteConfig = (global as any).VITEPRESS_CONFIG
    if (!config) {
      throw new Error(
        'content loader invoked without an active vitepress process, or before vitepress config is resolved.'
      )
    }

    return watchFiles.map((file) => {
      // 生成 URL
      const url =
        '/' +
        normalizePath(path.relative(config.srcDir, file))
          .replace(/(^|\/)index\.md$/, '$1')
          .replace(/\.md$/, config.cleanUrls ? '' : '.html')

      // 获取 Git 全部更新时间戳（毫秒）
      let history: number[] | undefined
      try {
        const timestamps = execFileSync(
          'git',
          ['log', '--format=%ct', '--', file], // 所有提交时间
          { encoding: 'utf8' }
        )
          .trim()
          .split('\n')
          .filter(Boolean)
          .map((ts) => Number(ts) * 1000)

        history = timestamps.length > 0 ? timestamps : undefined
      } catch {
        history = []
      }

      return {
        url,
        history
      }
    })
  }
}
