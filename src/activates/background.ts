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
        // 等待配置更新后再应用补丁
        setTimeout(async () => {
          await background.applyPatch()
          await vscode.commands.executeCommand('workbench.action.reloadWindow')
        }, 100)
      },
    ),
  )

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'qy-vscode-plugin.background.disable',
      async () => {
        const config = vscode.workspace.getConfiguration('qy-vscode-plugin')
        await config.update('background.enabled', false, true)
        await background.uninstall()
        await vscode.commands.executeCommand('workbench.action.reloadWindow')
      },
    ),
  )

  return setupPromise
}
