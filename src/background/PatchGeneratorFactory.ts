import {
  FullscreenPatchGenerator,
  FullscreenPatchGeneratorConfig,
} from './FullscreenPatchGenerator'

export type TPatchGeneratorConfig = {
  enabled: boolean
  fullscreen: FullscreenPatchGeneratorConfig
}

export class PatchGenerator {
  public static create(options: TPatchGeneratorConfig) {
    const script = [new FullscreenPatchGenerator(options.fullscreen).create()]
      .filter((n) => n.length > 0)
      .join(';')

    // 简单的代码压缩 - 移除多余空格和换行
    return script
      .replace(/\s+/g, ' ')
      .replace(/;\s*/g, ';')
      .replace(/{\s*/g, '{')
      .replace(/}\s*/g, '}')
      .trim()
  }
}
