import * as fs from 'fs'
import * as path from 'path'
import { ENCODING } from '../utils/constants'

export enum EFilePatchType {
  None = 'none',
  Latest = 'latest',
}

export abstract class AbsPatchFile {
  protected filePath: string
  protected backupPath: string

  constructor(filePath: string) {
    this.filePath = filePath
    this.backupPath = `${filePath}.backup`
  }

  protected async getContent(): Promise<string> {
    try {
      return await fs.promises.readFile(this.filePath, ENCODING)
    } catch {
      return ''
    }
  }

  protected async write(content: string): Promise<boolean> {
    try {
      if (!this.isValidFile()) {
        console.error(`Invalid file: ${this.filePath}`)
        return false
      }

      await this.createBackupIfNotExists()

      await fs.promises.writeFile(this.filePath, content, ENCODING)

      return true
    } catch (error) {
      console.error(`Failed to write file: ${error}`)
      await this.restoreFromBackup()
      return false
    }
  }

  protected isValidFile(): boolean {
    try {
      const stats = fs.statSync(this.filePath)
      return stats.isFile() && stats.size > 0
    } catch {
      return false
    }
  }

  protected async createBackupIfNotExists(): Promise<void> {
    try {
      if (!fs.existsSync(this.backupPath)) {
        const content = await this.getContent()
        await fs.promises.writeFile(this.backupPath, content, ENCODING)
        console.log(`Created backup: ${this.backupPath}`)
      }
    } catch (error) {
      console.error(`Failed to create backup: ${error}`)
    }
  }

  protected async restoreFromBackup(): Promise<boolean> {
    try {
      if (fs.existsSync(this.backupPath)) {
        const content = await fs.promises.readFile(this.backupPath, ENCODING)
        await fs.promises.writeFile(this.filePath, content, ENCODING)
        console.log(`Restored from backup: ${this.backupPath}`)
        return true
      }
    } catch (error) {
      console.error(`Failed to restore from backup: ${error}`)
    }
    return false
  }

  public async hasPatched(): Promise<boolean> {
    const content = await this.getContent()
    return content.includes('qy-vscode-plugin-start')
  }

  public async getPatchType(): Promise<EFilePatchType> {
    const content = await this.getContent()

    if (content.includes('qy-vscode-plugin-start')) {
      return EFilePatchType.Latest
    }

    return EFilePatchType.None
  }

  public async restore(): Promise<boolean> {
    try {
      const content = await this.getContent()
      const cleanedContent = this.cleanPatches(content)

      if (content === cleanedContent) {
        return true
      }

      return await this.write(cleanedContent)
    } catch {
      return this.restoreFromBackup()
    }
  }

  public async forceRestore(): Promise<boolean> {
    return this.restoreFromBackup()
  }

  protected abstract cleanPatches(content: string): string
}
