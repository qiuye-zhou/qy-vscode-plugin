// 'vscode' 模块包含 VS Code 扩展性 API
import * as vscode from 'vscode'

// 当您的扩展被激活时调用此方法
// 您的扩展在第一次执行命令时被激活
export function activate(context: vscode.ExtensionContext) {

	// 这行代码只会在您的扩展被激活时执行一次
	console.log('恭喜！您的扩展 "qy-vscode-plugin" 现在已经激活！')

	// 命令已在 package.json 文件中定义
	// 现在使用 registerCommand 提供命令的实现
	// commandId 参数必须与 package.json 中的 command 字段匹配
	let disposable = vscode.commands.registerCommand('qy-vscode-plugin.helloWorld', () => {
		// 您在此处放置的代码将在每次执行命令时运行
		vscode.window.showInformationMessage('你好！来自QY VSCode插件！')
	})

	context.subscriptions.push(disposable)
}

// 当您的扩展被停用时调用此方法
export function deactivate() {
	console.log('插件已经被释放')
}
