import * as vscode from 'vscode'
import simpleGit, { SimpleGit } from 'simple-git'
import { getProjectRoot } from '../utils'

export function activate(context: vscode.ExtensionContext): void {
    // 快速提交代码的命令
    context.subscriptions.push(vscode.commands.registerCommand('qy-vscode-plugin.quickCommit', async () => {
        try {
            const gitContext = await getGitContext()
            if (!gitContext) {return}

            const { git } = gitContext

            // 检查是否是 Git 仓库
            const isGitRepo: boolean = await git.checkIsRepo()
            if (!isGitRepo) {
                await initializeGitRepo(git)
                return
            }

            // 添加所有更改的文件
            await git.add('.')

            // 提交更改
            await git.commit("chore: update")

            // 推送到远程仓库
            await git.push()

            vscode.window.showInformationMessage('代码提交成功！')
        } catch (err) {
            vscode.window.showErrorMessage(`提交代码失败: ${err instanceof Error ? err.message : String(err)}`)
        }
    }))

    // 打开远程仓库地址的命令
    context.subscriptions.push(vscode.commands.registerCommand('qy-vscode-plugin.openRepo', async () => {
        try {
            const gitContext = await getGitContext()
            if (!gitContext) {return}

            const { git } = gitContext

            const remotes = await git.getRemotes(true)
            if (remotes.length === 0) {
                vscode.window.showErrorMessage('未找到 Git 远程仓库地址！')
                return
            }

            let repoUrl: string
            if (remotes.length === 1) {
                repoUrl = remotes[0].refs.fetch
            } else {
                // 如果有多个远程仓库，让用户选择
                const remoteNames = remotes.map(remote => remote.name)
                const selectedRemote = await vscode.window.showQuickPick(remoteNames, {
                    placeHolder: '选择要打开的远程仓库'
                })

                if (!selectedRemote) {return}

                const selected = remotes.find(remote => remote.name === selectedRemote)
                repoUrl = selected?.refs.fetch || remotes[0].refs.fetch
            }

            vscode.env.openExternal(vscode.Uri.parse(repoUrl))
        } catch (err) {
            vscode.window.showErrorMessage(`获取 Git 远程仓库地址失败: ${err instanceof Error ? err.message : String(err)}`)
        }
    }))
}

// 获取 Git 上下文
async function getGitContext(): Promise<{ git: SimpleGit; projectRoot: string } | null> {
    const activeEditor = vscode.window.activeTextEditor
    if (!activeEditor) {
        vscode.window.showErrorMessage('请先打开一个文件！')
        return null
    }

    const filePath = activeEditor.document.uri.fsPath
    const projectRoot = getProjectRoot(filePath)

    if (!projectRoot) {
        vscode.window.showErrorMessage('未找到 Git 仓库！')
        return null
    }

    const git: SimpleGit = simpleGit({
        baseDir: projectRoot,
        binary: 'git'
    })

    return { git, projectRoot }
}

// 初始化 Git 仓库
async function initializeGitRepo(git: SimpleGit): Promise<void> {
    // 如果不是 Git 仓库，询问是否初始化
    const result: string | undefined = await vscode.window.showQuickPick(['是', '否'], {
        placeHolder: '当前目录不是 Git 仓库，是否初始化？'
    })

    if (result === '是') {
        // 初始化 Git 仓库
        await git.init()

        // 获取远程仓库地址
        const remoteUrl: string | undefined = await vscode.window.showInputBox({
            prompt: '请输入远程仓库地址',
            placeHolder: '例如: https://gitee.com/username/repo.git'
        })

        if (remoteUrl) {
            await git.addRemote('origin', remoteUrl)
        }

        vscode.window.showInformationMessage('Git 仓库初始化成功！')
    }
}