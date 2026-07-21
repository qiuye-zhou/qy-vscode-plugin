import * as fs from 'fs'
import * as vscode from 'vscode'
import { Disposable } from 'vscode'
import { TOUCH_JSFILE_PATH, ENCODING, VERSION } from '../utils/constants'
import { vscodePath } from '../utils/vscodePath'
import { showError } from '../utils'
import { JsPatchFile } from './JsPatchFile'
import { PatchGenerator, TPatchGeneratorConfig } from './PatchGeneratorFactory'

export class Background implements Disposable {
  public jsFile = new JsPatchFile(vscodePath.jsPath)

  public get config() {
    const config = vscode.workspace.getConfiguration('qy-vscode-plugin')
    return {
      enabled: config.get('background.enabled', true),
      fullscreen: config.get('background.fullscreen', {
        images: [],
        opacity: 0.1,
        size: 'cover',
        position: 'center',
        interval: 0,
        random: false,
      }),
    } as TPatchGeneratorConfig
  }

  private disposables: Disposable[] = []

  private async checkFirstload(): Promise<boolean> {
    const firstLoad = !fs.existsSync(TOUCH_JSFILE_PATH)

    if (firstLoad) {
      vscode.window.showInformationMessage(`欢迎使用背景插件 v${VERSION}!`)

      await fs.promises.writeFile(
        TOUCH_JSFILE_PATH,
        vscodePath.jsPath,
        ENCODING,
      )
      return true
    }

    return false
  }

  private async onConfigChange() {
    const hasInstalled = await this.hasInstalled()
    const enabled = this.config.enabled

    if (!enabled) {
      if (hasInstalled) {
        await this.uninstall()
      }
      return
    }

    if (
      !this.config.fullscreen.images ||
      this.config.fullscreen.images.length === 0
    ) {
      return
    }

    await this.applyPatch()
  }

  public async applyPatch() {
    if (!this.config.enabled) {
      return false
    }

    if (!fs.existsSync(vscodePath.jsPath)) {
      showError(`未找到 VSCode 核心文件: ${vscodePath.jsPath}`)
      return false
    }

    try {
      const scriptContent = PatchGenerator.create(this.config)
      if (!scriptContent) {
        console.warn('No script content generated')
        return false
      }
      return await this.jsFile.applyPatches(scriptContent)
    } catch (error) {
      console.error('Failed to apply patch:', error)
      showError('应用背景补丁失败！')
      await this.jsFile.forceRestore()
      return false
    }
  }

  public async setup(): Promise<any> {
    await this.checkFirstload()

    if (!fs.existsSync(vscodePath.jsPath)) {
      console.warn(`VSCode core file not found: ${vscodePath.jsPath}`)
      return
    }

    const patchType = await this.jsFile.getPatchType()

    if (this.config.enabled && patchType === 'none') {
      await this.applyPatch()
    }

    this.disposables.push(
      vscode.workspace.onDidChangeConfiguration(async (ex) => {
        const hasChanged = ex.affectsConfiguration('qy-vscode-plugin')
        if (!hasChanged) {
          return
        }

        this.onConfigChange()
      }),
    )
  }

  public hasInstalled(): Promise<boolean> {
    return this.jsFile.hasPatched()
  }

  public async uninstall(): Promise<boolean> {
    return this.jsFile.restore()
  }

  public dispose(): void {
    this.disposables.forEach((n) => n.dispose())
  }
}
