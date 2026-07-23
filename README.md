# QY VSCode Plugin

一个高效的 VSCode 辅助插件，旨在提升开发体验和工作流效率。提供代码提交管理、背景自定义、智能变量命名等实用功能。

## 功能特性

### Git 快速提交
- **快速提交**：一键执行 `add → commit → push`，默认提交信息 `chore: update`
- **自定义提交**：支持输入自定义提交信息
- **仓库初始化**：自动检测并提示初始化 Git 仓库

### 远程仓库跳转
- **一键打开**：快速跳转到当前项目的远程仓库地址
- **多仓库支持**：自动识别并支持多个远程仓库

### 自定义背景
- **全屏背景**：支持自定义 VSCode 全屏背景图片
- **图片轮播**：支持多张图片轮播显示
- **透明度调节**：可自定义背景图片透明度
- **协议支持**：支持 `https` 和 `file` 协议

### AI 智能变量命名
- **智能生成**：根据中文描述生成符合 TypeScript/JavaScript 命名规范的变量名
- **多模型支持**：支持 GPT、DeepSeek、阿里云通义千问等多种模型
- **上下文感知**：结合当前代码上下文生成更合适的变量名

## 安装方法

1. 克隆仓库：`git clone https://github.com/qiuye-zhou/qy-vscode-plugin.git`
2. 运行 `npm install` 安装依赖
3. 安装 `vsce`：`npm install -g @vscode/vsce`
4. 运行 `npm run package` 构建扩展
5. 在 VSCode 中选择「扩展」→ 「从 VSIX 安装」，选择生成的 `.vsix` 文件


## 使用说明

### 命令面板

按 `Ctrl+Shift+P` 打开命令面板，输入以下命令：

| 命令 | 描述 |
|------|------|
| `qiuye: Push: chore update` | 快速提交代码 |
| `qiuye: Push: custom message` | 自定义提交信息 |
| `qiuye: 打开远程仓库地址` | 打开远程仓库 |
| `qiuye: 生成变量名` | AI 生成变量名 |
| `qiuye: 启用背景` | 启用自定义背景 |
| `qiuye: 禁用背景` | 禁用自定义背景 |

### 右键菜单

插件已集成到编辑器右键菜单中：
- **生成变量名**：在编辑器中右键选择
- **Push: chore update**：快速提交
- **Push: custom message**：自定义提交
- **打开远程仓库地址**：跳转远程仓库

## 配置说明

在 VSCode 设置中搜索 `qy-vscode-plugin` 进行配置：

```json
{
  // OpenAI 配置
  "qy-vscode-plugin.openai": {
    "apiKey": "sk-xxxxxxxxxxxxxxxxxxxxxxxx",
    "baseUrl": "https://api.openai.com/v1",
    "model": "gpt-3.5-turbo"
  },

  // 背景功能开关
  "qy-vscode-plugin.background.enabled": true,

  // 全屏背景配置
  "qy-vscode-plugin.background.fullscreen": {
    "images": [
      "https://example.com/image1.jpg",
      "file:///D:/Images/background.jpg"
    ],
    "opacity": 0.1,
    "size": "cover",
    "position": "center",
    "interval": 0,
    "random": false
  }
}
```

### 配置参数详解

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `openai.apiKey` | string | `""` | OpenAI API Key |
| `openai.baseUrl` | string | `""` | API 基础 URL，支持阿里云通义千问、DeepSeek 等兼容接口 |
| `openai.model` | string | `gpt-3.5-turbo` | 模型名称 |
| `background.enabled` | boolean | `true` | 是否启用背景功能 |
| `background.fullscreen.images` | array | `[]` | 背景图片列表，支持 `https://` 和 `file:///` |
| `background.fullscreen.opacity` | number | `0.1` | 透明度，范围 0-0.6 |
| `background.fullscreen.size` | string | `cover` | 图片尺寸模式 |
| `background.fullscreen.position` | string | `center` | 图片位置 |
| `background.fullscreen.interval` | number | `0` | 轮播间隔（秒），0 为禁用 |
| `background.fullscreen.random` | boolean | `false` | 是否随机显示图片 |

### 支持的模型

| 模型 | baseUrl |
|------|---------|
| GPT-3.5/4 | `https://api.openai.com/v1` |
| DeepSeek | `https://api.deepseek.com/v1` |
| 阿里云通义千问 | `https://dashscope.aliyuncs.com/compatible-mode/v1` |

## 开发指南

### 环境要求

- Node.js >= 18
- VSCode >= 1.105
- npm/pnpm

### 项目结构

```
src/
├── activates/          # 功能激活入口
│   ├── quickGit.ts     # Git 提交功能
│   ├── background.ts   # 背景功能
│   └── aiVariableName.ts # AI 变量命名
├── background/         # 背景补丁相关
│   ├── Background.ts   # 背景管理类
│   ├── PatchGenerator.ts # 补丁生成器基类
│   ├── FullscreenPatchGenerator.ts # 全屏背景补丁
│   ├── JsPatchFile.ts  # JS 文件补丁操作
│   └── PatchGeneratorFactory.ts # 补丁工厂
├── utils/              # 工具函数
│   ├── constants.ts    # 常量定义
│   ├── vsHelp.ts       # VSCode 帮助函数
│   ├── path.ts         # 路径工具
│   ├── vsc.ts          # VSCode API 封装
│   ├── vscodePath.ts   # VSCode 路径获取
│   └── sudo.ts         # sudo 权限处理
└── extension.ts        # 扩展入口
```

## 注意事项

1. **背景功能**：启用背景后需要重启 VSCode 才能生效
2. **权限问题**：修改 VSCode 核心文件可能需要管理员权限
3. **备份机制**：插件会自动备份修改的文件，如遇问题可手动恢复
4. **AI 变量命名**：需要配置有效的 OpenAI API Key 才能使用

## 故障排除

### VSCode 启动后空白或无法正常使用

如果启用背景后 VSCode 无法正常启动，可能是核心文件被损坏。请按以下步骤恢复：

1. 关闭所有 VSCode 窗口
2. 找到 VSCode 安装目录下的 `workbench.desktop.main.js` 文件：
   - Windows: `C:\Users\<用户名>\AppData\Local\Programs\Microsoft VS Code\resources\app\out\vs\workbench\workbench.desktop.main.js`
   - macOS: `/Applications/Visual Studio Code.app/Contents/Resources/app/out/vs/workbench/workbench.desktop.main.js`
3. 删除损坏的文件，或者将 `workbench.desktop.main.js.backup` 重命名为 `workbench.desktop.main.js`
4. 重新启动 VSCode

### 背景图片不显示

1. 检查图片 URL 是否正确
2. 确保图片 URL 以 `https://` 或 `file:///` 开头
3. 检查网络连接（如果使用在线图片）
4. 确保透明度设置在合理范围内（建议 0.1-0.3）
5. 重启 VSCode 后再试

### AI 变量命名不工作

1. 检查 API Key 是否正确配置
2. 检查 baseUrl 是否正确（国内用户建议使用 DeepSeek 或阿里云通义千问）
3. 检查网络连接是否正常
4. 确保模型名称与 baseUrl 匹配

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件