import * as fs from 'fs'
import { AbsPatchFile } from './PatchFile'
import { BACKGROUND_VER, VERSION, ENCODING } from '../utils/constants'

export class JsPatchFile extends AbsPatchFile {
  private readonly PATCH_START = `// qy-vscode-plugin-start ${BACKGROUND_VER}.${VERSION}`
  private readonly PATCH_END = '// qy-vscode-plugin-end'

  public async applyPatches(patchContent: string): Promise<boolean> {
    try {
      const curContent = await this.getContent()

      if (!curContent || curContent.length === 0) {
        console.error('Empty file content, cannot apply patches')
        return false
      }

      await this.createBackup()

      const cleanedContent = this.cleanPatches(curContent)

      const newContent = this.buildNewContent(cleanedContent, patchContent)

      if (curContent === newContent) {
        return true
      }

      const success = await this.write(newContent)

      if (success && !this.verifyContent(newContent)) {
        console.error('Content verification failed, restoring from backup')
        await this.restoreFromBackup()
        return false
      }

      return success
    } catch (error) {
      console.error(`Failed to apply patches: ${error}`)
      await this.restoreFromBackup()
      return false
    }
  }

  private buildNewContent(baseContent: string, patchContent: string): string {
    const trimmed = baseContent.trimEnd()
    return `${trimmed}\n\n${this.PATCH_START}\n${patchContent}\n${this.PATCH_END}\n`
  }

  private verifyContent(content: string): boolean {
    const startIndex = content.indexOf(this.PATCH_START)
    const endIndex = content.lastIndexOf(this.PATCH_END)

    if (startIndex === -1 || endIndex === -1) {
      return false
    }

    if (startIndex > endIndex) {
      return false
    }

    const beforePatch = content.substring(0, startIndex).trim()
    if (
      !beforePatch.includes('Copyright') &&
      !beforePatch.includes('Microsoft')
    ) {
      return false
    }

    return true
  }

  protected cleanPatches(content: string): string {
    const startIndex = content.indexOf(this.PATCH_START)
    const endIndex = content.lastIndexOf(this.PATCH_END)

    if (startIndex === -1 || endIndex === -1) {
      return content
    }

    if (startIndex > endIndex) {
      return content
    }

    return content.substring(0, startIndex).trimEnd() + '\n'
  }

  private async createBackup(): Promise<void> {
    try {
      const timestamp = Date.now()
      const backupPathWithTimestamp = `${this.filePath}.backup.${timestamp}`
      const content = await this.getContent()
      await fs.promises.writeFile(backupPathWithTimestamp, content, ENCODING)

      if (!fs.existsSync(this.backupPath)) {
        await fs.promises.writeFile(this.backupPath, content, ENCODING)
      }

      console.log(`Created backup: ${backupPathWithTimestamp}`)
    } catch (error) {
      console.error(`Failed to create backup: ${error}`)
    }
  }
}
