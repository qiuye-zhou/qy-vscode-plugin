import { AbsPatchFile } from './PatchFile'
import { BACKGROUND_VER, VERSION } from '../utils/constants'

export class JsPatchFile extends AbsPatchFile {
  public async applyPatches(patchContent: string): Promise<boolean> {
    try {
      const curContent = await this.getContent()
      let content = this.cleanPatches(curContent)
      content += [
        `\n// qy-vscode-plugin-start ${BACKGROUND_VER}.${VERSION}`,
        patchContent,
        '// qy-vscode-plugin-end',
      ].join('\n')

      // file unchanged
      if (curContent === content) {
        return true
      }

      return await this.write(content)
    } catch {
      return false
    }
  }

  protected cleanPatches(content: string): string {
    content = content.replace(
      /\n\/\/ qy-vscode-plugin-start[\s\S]*\/\/ qy-vscode-plugin-end/,
      '',
    )
    return content
  }
}
