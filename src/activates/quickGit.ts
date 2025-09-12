import * as vscode from 'vscode'
import simpleGit, { SimpleGit } from 'simple-git'
import { getProjectRoot } from '../utils'

export function activate(context: vscode.ExtensionContext): void {
    // 打开远程仓库地址的命令
    context.subscriptions.push(vscode.commands.registerCommand('qy-vscode-plugin.openRepo', async () => {
        try {
            const activeEditor = vscode.window.activeTextEditor
            if (!activeEditor) {
                vscode.window.showErrorMessage('请先打开一个文件！')
                return
            }

            const filePath = activeEditor.document.uri.fsPath
            const projectRoot = getProjectRoot(filePath)

            if (!projectRoot) {
                vscode.window.showErrorMessage('未找到 Git 仓库！')
                return
            }

            const git: SimpleGit = simpleGit({
                baseDir: projectRoot,
                binary: 'git'
            })

            const remotes = await git.getRemotes(true)
            if (remotes.length === 0) {
                vscode.window.showErrorMessage('未找到 Git 远程仓库地址！')
                return
            }

            const repoUrl: string = remotes[0].refs.fetch
            vscode.env.openExternal(vscode.Uri.parse(repoUrl))
        } catch (err) {
            vscode.window.showErrorMessage(`获取 Git 远程仓库地址失败: ${err instanceof Error ? err.message : String(err)}`)
        }
    }))
}