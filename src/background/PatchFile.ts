import * as fs from 'fs'
import { ENCODING } from '../utils/constants'

export enum EFilePatchType {
  None = 'none',
  Latest = 'latest',
}

export abstract class AbsPatchFile {
  protected filePath: string

  constructor(filePath: string) {
    this.filePath = filePath
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
      await fs.promises.writeFile(this.filePath, content, ENCODING)
      return true
    } catch {
      return false
    }
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
      return false
    }
  }

  protected abstract cleanPatches(content: string): string
}
