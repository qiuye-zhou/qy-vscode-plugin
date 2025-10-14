import * as fs from 'fs'
import * as vscode from 'vscode'
import { Disposable } from 'vscode'
import {
  vscodePath,
  TOUCH_JSFILE_PATH,
  ENCODING,
  VERSION,
} from '../utils/constants'
import { showInfo, showError } from '../utils/vsHelp'
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
      vscode.window
        .showInformationMessage(`欢迎使用背景插件 v${VERSION}!`, {
          title: '更多',
        })
        .then((confirm) => {
          if (!confirm) {
            return
          }
          this.showWelcome()
        })

      await fs.promises.writeFile(
        TOUCH_JSFILE_PATH,
        vscodePath.jsPath,
        ENCODING,
      )
      return true
    }

    return false
  }

  public async showWelcome() {
    const content = `
# 背景插件使用说明

## 配置方法

在VSCode设置中添加以下配置：

\`\`\`json
{
  "qy-vscode-plugin.background.enabled": true,
  "qy-vscode-plugin.background.fullscreen": {
    "images": [
      "https://example.com/image1.jpg",
      "file:///path/to/local/image.jpg"
    ],
    "opacity": 0.1,
    "size": "cover",
    "position": "center",
    "interval": 0,
    "random": false
  }
}
\`\`\`

## 参数说明

- \`images\`: 背景图片列表，支持https和file协议
- \`opacity\`: 透明度，建议0.1-0.3
- \`size\`: 图片大小，cover为自适应
- \`position\`: 图片位置
- \`interval\`: 轮播间隔（秒），0为禁用
- \`random\`: 是否随机显示

配置完成后重启VSCode即可生效。
        `

    const doc = await vscode.workspace.openTextDocument({
      content,
      language: 'markdown',
    })
    await vscode.window.showTextDocument(doc)
  }

  private async onConfigChange() {
    const hasInstalled = await this.hasInstalled()
    const enabled = this.config.enabled

    if (!enabled) {
      if (hasInstalled) {
        await this.uninstall()
        showInfo('背景已禁用！请重启VSCode。')
      }
      return
    }

    // 检查是否有配置的图片
    if (
      !this.config.fullscreen.images ||
      this.config.fullscreen.images.length === 0
    ) {
      vscode.window.showWarningMessage('请先配置背景图片！')
      return
    }

    const confirm = await vscode.window.showInformationMessage(
      '配置已更改，点击更新。',
      {
        title: '更新并重启',
      },
    )

    if (!confirm) {
      return
    }

    await this.applyPatch()
    vscode.commands.executeCommand('workbench.action.reloadWindow')
  }

  public async applyPatch() {
    if (!this.config.enabled) {
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
      return false
    }
  }

  public async setup(): Promise<any> {
    await this.checkFirstload()

    const patchType = await this.jsFile.getPatchType()

    // 如果启用且没有安装补丁，则应用补丁
    if (this.config.enabled && patchType === 'none') {
      if (await this.applyPatch()) {
        showInfo('背景已更改！请重启VSCode。')
      }
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
