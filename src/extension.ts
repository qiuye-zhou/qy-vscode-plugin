import * as vscode from 'vscode'
import { activate as quickGitActivate } from './activates/quickGit'

// 扩展被激活时调用此方法
export function activate(context: vscode.ExtensionContext) {

	// 扩展被激活时执行一次
	console.log('扩展 "qy-vscode-plugin" 已经激活！')

	quickGitActivate(context)
}

// 扩展被停用时调用此方法
export function deactivate() {
	console.log('插件已经被释放')
}
