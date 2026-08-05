# QY VSCode Plugin

一个提升开发体验的 VSCode 辅助插件，集成 Git 快速提交、远程仓库跳转、自定义背景及 AI 智能变量命名等功能。

## 功能特性

- **Git 快速提交**：一键执行 `add → commit → push`，支持默认与自定义提交信息
- **远程仓库跳转**：快速打开当前项目的远程仓库地址
- **自定义背景**：支持本地/远程图片、轮播、透明度调节
- **AI 变量命名**：根据中文描述结合代码上下文生成符合规范的变量名，兼容 OpenAI、DeepSeek、通义千问等

## 安装

1. 克隆仓库：`git clone https://github.com/qiuye-zhou/qy-vscode-plugin.git`
2. 安装依赖：`npm install`
3. 安装 vsce：`npm install -g @vscode/vsce`
4. 打包：`npm run package`
5. 在 VSCode 中「扩展 → 从 VSIX 安装」生成的 `.vsix` 文件

## 命令

按 `Ctrl+Shift+P` 打开命令面板（也可通过编辑器右键菜单调用）：

| 命令 | 说明 |
|------|------|
| `qiuye: Push: chore update` | 快速提交（默认信息） |
| `qiuye: Push: custom message` | 自定义提交信息 |
| `qiuye: 打开远程仓库地址` | 打开远程仓库 |
| `qiuye: 生成变量名` | AI 生成变量名 |
| `qiuye: 启用背景` | 启用自定义背景 |
| `qiuye: 禁用背景` | 禁用自定义背景 |

## 配置

在 VSCode 设置中搜索 `qy-vscode-plugin`：

```json
{
  "qy-vscode-plugin.openai": {
    "apiKey": "sk-xxxxxxxx",
    "baseUrl": "https://api.openai.com/v1",
    "model": "gpt-3.5-turbo"
  },
  "qy-vscode-plugin.background.enabled": true,
  "qy-vscode-plugin.background.fullscreen": {
    "images": ["https://example.com/bg.jpg", "file:///D:/bg.jpg"],
    "opacity": 0.1,
    "interval": 0,
    "random": false
  }
}
```

### 常用模型

| 模型 | baseUrl |
|------|---------|
| OpenAI GPT | `https://api.openai.com/v1` |
| DeepSeek | `https://api.deepseek.com/v1` |
| 阿里云通义千问 | `https://dashscope.aliyuncs.com/compatible-mode/v1` |

## 注意事项

- 启用/禁用背景后需**重启 VSCode** 才能生效
- 修改 VSCode 核心文件可能需要管理员权限，插件会自动备份
- AI 变量命名需配置有效的 API Key

### 背景功能故障排除

若启用背景后 VSCode 无法启动，可恢复备份文件：
- 找到 VSCode 安装目录下的 `workbench.desktop.main.js`
- 将 `workbench.desktop.main.js.backup` 重命名为 `workbench.desktop.main.js`
- 重启 VSCode

## 开发

- Node.js >= 18，VSCode >= 1.105
- 构建：`npm run build`
- 打包：`npm run package`
- Lint：`npm run lint`

## 许可证

MIT License - 详见 [LICENSE](LICENSE)
