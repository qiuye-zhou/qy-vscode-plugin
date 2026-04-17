import * as vscode from 'vscode'
import OpenAI from 'openai'
import { showError, showInfo } from '../utils'

// 定义 OpenAI 客户端单例，避免重复初始化
let openAIClient: OpenAI | null = null
// 缓存上次使用的配置，以便在配置变更时重新初始化客户端
let lastConfigHash: string = ''

/**
 * 获取 OpenAI 配置
 */
function getOpenAIConfig(): {
  apiKey: string
  baseUrl: string
  model: string
} {
  const config = vscode.workspace.getConfiguration('qy-vscode-plugin')
  const openaiConfig = config.get<{
    apiKey: string
    baseUrl: string
    model: string
  }>('openai') || { apiKey: '', baseUrl: '', model: '' }

  // 兼容环境变量 (仅当配置中未填写时使用)
  const apiKey = openaiConfig.apiKey || process.env.OPENAI_API_KEY || ''
  const baseUrl = openaiConfig.baseUrl || ''
  const model = openaiConfig.model

  return { apiKey, baseUrl, model }
}

/**
 * 获取 OpenAI 客户端实例
 */
function getOpenAIClient(): OpenAI {
  const { apiKey, baseUrl } = getOpenAIConfig()

  if (!baseUrl) {
    throw new Error(
      '未找到 baseUrl。请在 VS Code 设置中配置 "qy-vscode-plugin.openai"',
    )
  }

  if (!apiKey) {
    throw new Error(
      '未找到 OpenAI API Key。请在 VS Code 设置中配置 "qy-vscode-plugin.openai"',
    )
  }

  // 生成配置哈希以检测变化
  const currentHash = `${apiKey}-${baseUrl}`

  // 如果配置未变且客户端已存在，直接返回
  if (openAIClient && lastConfigHash === currentHash) {
    return openAIClient
  }

  // 创建新的客户端实例
  openAIClient = new OpenAI({
    apiKey: apiKey,
    baseURL: baseUrl,
  })

  // 更新缓存
  lastConfigHash = currentHash

  return openAIClient
}

/**
 * 获取当前配置的 Model 名称
 * 如果未配置，则抛出错误
 */
function getConfiguredModel(): string {
  const { model } = getOpenAIConfig()

  if (!model) {
    throw new Error(
      '未配置 OpenAI Model。请在 VS Code 设置中配置 "qy-vscode-plugin.openai" (deepseek-chat, gpt-3.5-turbo, gpt-4o, qwen-plus)',
    )
  }

  return model
}

export function activate(context: vscode.ExtensionContext): void {
  // 监听配置变化，当配置改变时，清空缓存的客户端
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('qy-vscode-plugin.openai')) {
        openAIClient = null
        lastConfigHash = ''
      }
    }),
  )

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'qy-vscode-plugin.aiVariableName',
      async () => {
        await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            cancellable: true,
          },
          async (progress, token) => {
            try {
              // 获取当前编辑器上下文
              const editor = vscode.window.activeTextEditor
              if (!editor) {
                showError('请先打开一个文件！')
                return
              }

              const document = editor.document
              const selection = editor.selection

              // 获取当前行或光标附近内容作为上下文参考
              const currentLine = document.lineAt(selection.active.line).text
              // 限制上下文长度，避免 Token 消耗过大
              const contextCode = currentLine.substring(0, 100)

              // 用户输入关键字/描述
              progress.report({ increment: 10, message: '等待用户输入...' })
              const userInput: string | undefined =
                await vscode.window.showInputBox({
                  prompt: '请输入变量描述或关键字',
                  placeHolder: '例如: 用户列表、是否加载中、最大重试次数',
                })

              if (!userInput || token.isCancellationRequested) {
                return
              }

              // 调用 AI 接口
              progress.report({
                increment: 30,
                message: '正在生成变量名...',
              })

              const variableNames = await callAiApiForVariables(
                userInput,
                contextCode,
              )

              if (!variableNames || variableNames.length === 0) {
                showError('未返回有效的变量名建议')
                return
              }

              // 让用户选择变量名
              progress.report({ increment: 60, message: '请选择变量名...' })
              const selectedVar = await vscode.window.showQuickPick(
                variableNames.map((name) => ({
                  label: name,
                  description: '点击插入',
                })),
                {
                  placeHolder: '选择要插入的变量名',
                },
              )

              if (!selectedVar) {
                return
              }

              // 直接编辑文档，将变量名插入到光标/选中区域
              progress.report({ increment: 90, message: '正在插入变量名...' })

              await editor.edit((editBuilder) => {
                // 如果用户之前有选中文本，replace 会替换选中文本；
                // 如果没选中，selection.start 和 selection.end 相同，即为插入操作
                editBuilder.replace(selection, selectedVar.label)
              })

              progress.report({ increment: 100, message: '完成！' })
              showInfo(`已插入变量名: ${selectedVar.label}`)
            } catch (err) {
              showError(
                `生成失败: ${err instanceof Error ? err.message : String(err)}`,
              )
            }
          },
        )
      },
    ),
  )
}

/**
 * 调用 OpenAI 接口获取变量名列表
 * @param description 用户输入的描述
 * @param codeContext 当前代码上下文
 * @returns 变量名数组
 */
async function callAiApiForVariables(
  description: string,
  codeContext: string,
): Promise<string[]> {
  const client = getOpenAIClient()

  // 获取配置的 Model，如果未配置则在此处抛出错误
  const model = getConfiguredModel()

  // 构建 Prompt
  const systemPrompt = `你是一个专业的编程助手。请根据用户的描述和代码上下文，生成 5-8 个符合 TypeScript/JavaScript 命名规范（camelCase）的变量名。
要求：
1. 只返回变量名列表，每行一个。
2. 不要包含任何解释、标点符号或其他文字。
3. 变量名应简洁且语义清晰。`

  const userPrompt = `描述: "${description}"
代码上下文: "${codeContext}"

请生成变量名:`

  try {
    const completion = await client.chat.completions.create({
      model: model, // 使用配置中的模型
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 10,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      return []
    }

    // 解析返回结果：按行分割，去除空行和空白字符
    const names = content
      .split('\n')
      .map((line) => line.trim())
      .filter(
        (line) => line.length > 0 && /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(line),
      ) // 简单的变量名正则校验

    // 去重
    return [...new Set(names)]
  } catch (error) {
    console.error('OpenAI API Error:', error)
    throw error
  }
}
