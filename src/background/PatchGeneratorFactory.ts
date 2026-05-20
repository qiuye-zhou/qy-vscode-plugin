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

    return script
  }
}
