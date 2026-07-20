import * as vscode from 'vscode'
import { activate as quickGitActivate } from './activates/quickGit'
import { activate as backgroundActivate } from './activates/background'
import { activate as aiVariableNameActivate } from './activates/aiVariableName'

export function activate(context: vscode.ExtensionContext) {
  console.log('扩展 "qy-vscode-plugin" 已经启动！')

  quickGitActivate(context)
  backgroundActivate(context)
  aiVariableNameActivate(context)
}

export function deactivate() {
  console.log('扩展 "qy-vscode-plugin" 已经停用！')
}
