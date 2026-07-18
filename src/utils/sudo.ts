import sudo from '@vscode/sudo-prompt'

import { vsc } from './vsc'

export namespace sudoUtils {
  export const isDesktop = vsc?.env.appHost === 'desktop'

  export function sudoExec(
    cmd: string,
    options: { name?: string } = {},
  ): Promise<[string | Buffer | undefined, string | Buffer | undefined]> {
    return new Promise((resolve, reject) => {
      sudo.exec(
        cmd,
        options,
        (error?: Error, stdout?: string | Buffer, stderr?: string | Buffer) => {
          if (error) {
            reject(error)
          }
          resolve([stdout, stderr])
        },
      )
    })
  }
}
