import * as vscode from 'vscode'
import { Background } from '../background/Background'

export function activate(context: vscode.ExtensionContext) {
  const background = new Background()

  context.subscriptions.push(background)

  const setupPromise = background.setup()

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'qy-vscode-plugin.background.install',
      async () => {
        const config = vscode.workspace.getConfiguration('qy-vscode-plugin')
        await config.update('background.enabled', true, true)

        const success = await background.applyPatch()
        if (success) {
          vscode.window.showInformationMessage('背景已启用，请重启 VSCode 生效')
        } else {
          vscode.window.showErrorMessage('启动背景失败！')
        }
      },
    ),
  )

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'qy-vscode-plugin.background.disable',
      async () => {
        const config = vscode.workspace.getConfiguration('qy-vscode-plugin')
        await config.update('background.enabled', false, true)

        const success = await background.uninstall()
        if (success) {
          vscode.window.showInformationMessage('背景已禁用，请重启 VSCode 生效')
        } else {
          vscode.window.showErrorMessage('禁用背景失败！')
        }
      },
    ),
  )

  return setupPromise
}
