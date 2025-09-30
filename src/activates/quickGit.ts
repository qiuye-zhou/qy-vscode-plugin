import * as vscode from 'vscode'
import simpleGit, { SimpleGit } from 'simple-git'
import { getProjectRoot } from '../utils'

export function activate(context: vscode.ExtensionContext): void {
  // 快速提交代码的命令
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'qy-vscode-plugin.quickCommit',
      async () => {
        await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            cancellable: false,
          },
          async (progress) => {
            try {
              progress.report({ increment: 10, message: '获取Git上下文...' })
              const gitContext = await getGitContext()
              if (!gitContext) {
                return
              }

              const { git } = gitContext

              progress.report({ increment: 20, message: '检查Git仓库...' })
              // 检查是否是 Git 仓库
              const isGitRepo: boolean = await git.checkIsRepo()
              if (!isGitRepo) {
                await initializeGitRepo(git)
                return
              }

              progress.report({ increment: 30, message: '添加文件到暂存区...' })
              // 添加所有更改的文件
              await git.add('.')

              progress.report({ increment: 40, message: '提交更改...' })
              // 提交更改
              await git.commit('chore: update')

              progress.report({ increment: 50, message: '推送到远程仓库...' })
              // 推送到远程仓库
              await git.push()

              progress.report({ increment: 100, message: '完成！' })
              vscode.window.showInformationMessage('代码提交成功！')
            } catch (err) {
              vscode.window.showErrorMessage(
                `提交代码失败: ${err instanceof Error ? err.message : String(err)}`,
              )
            }
          },
        )
      },
    ),
  )

  // 自定义提交代码的命令
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'qy-vscode-plugin.customCommit',
      async () => {
        await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            cancellable: false,
          },
          async (progress) => {
            try {
              progress.report({ increment: 10, message: '获取Git上下文...' })
              const gitContext = await getGitContext()
              if (!gitContext) {
                return
              }

              const { git } = gitContext

              progress.report({ increment: 20, message: '检查Git仓库...' })
              // 检查是否是 Git 仓库
              const isGitRepo: boolean = await git.checkIsRepo()
              if (!isGitRepo) {
                await initializeGitRepo(git)
                return
              }

              progress.report({ increment: 30, message: '获取提交信息...' })
              // 获取提交信息
              const commitMessage: string | undefined =
                await vscode.window.showInputBox({
                  prompt: '请输入提交信息',
                  placeHolder: '例如: 更新代码',
                })

              if (!commitMessage) {
                return
              }

              progress.report({ increment: 40, message: '添加文件到暂存区...' })
              // 添加所有更改的文件
              await git.add('.')

              progress.report({ increment: 50, message: '提交更改...' })
              // 提交更改
              await git.commit(commitMessage)

              progress.report({ increment: 60, message: '推送到远程仓库...' })
              // 推送到远程仓库
              await git.push()

              progress.report({ increment: 100, message: '完成！' })
              vscode.window.showInformationMessage('代码提交成功！')
            } catch (err) {
              vscode.window.showErrorMessage(
                `提交代码失败: ${err instanceof Error ? err.message : String(err)}`,
              )
            }
          },
        )
      },
    ),
  )

  // 打开远程仓库地址的命令
  context.subscriptions.push(
    vscode.commands.registerCommand('qy-vscode-plugin.openRepo', async () => {
      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          cancellable: false,
        },
        async (progress) => {
          try {
            progress.report({ increment: 20, message: '获取Git上下文...' })
            const gitContext = await getGitContext()
            if (!gitContext) {
              return
            }

            const { git } = gitContext

            progress.report({ increment: 40, message: '获取远程仓库信息...' })
            const remotes = await git.getRemotes(true)
            if (remotes.length === 0) {
              vscode.window.showErrorMessage('未找到 Git 远程仓库地址！')
              return
            }

            progress.report({ increment: 60, message: '处理远程仓库地址...' })
            let repoUrl: string
            if (remotes.length === 1) {
              repoUrl = remotes[0].refs.fetch
            } else {
              // 如果有多个远程仓库，让用户选择
              const remoteNames = remotes.map((remote) => remote.name)
              const selectedRemote = await vscode.window.showQuickPick(
                remoteNames,
                {
                  placeHolder: '选择要打开的远程仓库',
                },
              )

              if (!selectedRemote) {
                return
              }

              const selected = remotes.find(
                (remote) => remote.name === selectedRemote,
              )
              repoUrl = selected?.refs.fetch || remotes[0].refs.fetch
            }

            progress.report({ increment: 80, message: '打开浏览器...' })
            vscode.env.openExternal(vscode.Uri.parse(repoUrl))

            progress.report({ increment: 100, message: '完成！' })
          } catch (err) {
            vscode.window.showErrorMessage(
              `获取 Git 远程仓库地址失败: ${err instanceof Error ? err.message : String(err)}`,
            )
          }
        },
      )
    }),
  )
}

// 获取 Git 上下文
async function getGitContext(): Promise<{
  git: SimpleGit
  projectRoot: string
} | null> {
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
    binary: 'git',
  })

  return { git, projectRoot }
}

// 初始化 Git 仓库
async function initializeGitRepo(git: SimpleGit): Promise<void> {
  // 如果不是 Git 仓库，询问是否初始化
  const result: string | undefined = await vscode.window.showQuickPick(
    ['是', '否'],
    {
      placeHolder: '当前目录不是 Git 仓库，是否初始化？',
    },
  )

  if (result === '是') {
    // 初始化 Git 仓库
    await git.init()

    // 获取远程仓库地址
    const remoteUrl: string | undefined = await vscode.window.showInputBox({
      prompt: '请输入远程仓库地址',
      placeHolder: '例如: https://gitee.com/username/repo.git',
    })

    if (remoteUrl) {
      await git.addRemote('origin', remoteUrl)
    }

    vscode.window.showInformationMessage('Git 仓库初始化成功！')
  }
}
