# QY VSCode Plugin

一个VSCode辅助插件，提供实用的开发工具和功能。

## 功能特性

- Hello World 命令示例
- 更多功能正在开发中...

## 开发环境设置

### 前置要求

- Node.js (推荐使用 LTS 版本)
- npm 或 yarn，pnpm
- VSCode

### 安装依赖

```bash
npm install
```

### 开发调试

1. 按 `F5` 或使用 `Ctrl+Shift+P` 打开命令面板，选择 "Debug: Start Debugging"
2. 这将打开一个新的 VSCode 窗口，其中加载了您的扩展
3. 在新窗口中按 `Ctrl+Shift+P` 并运行 "Hello World" 命令

### 构建

```bash
# 构建一次
npm run esbuild

# 监听模式构建
npm run esbuild-watch
```

### 代码检查

```bash
npm run lint
```

## 发布

### 打包扩展

```bash
npm install -g vsce
vsce package
```

### 安装扩展

```bash
code --install-extension qy-vscode-plugin-0.0.1.vsix
```

## 项目结构

```
├── .vscode/          # VSCode 配置文件
│   ├── launch.json   # 调试配置
│   └── tasks.json    # 任务配置
├── src/              # 源代码
│   ├── extension.ts  # 主扩展文件
│   └── test/         # 测试文件
├── out/              # 编译输出目录
├── package.json      # 扩展清单
├── tsconfig.json     # TypeScript 配置
└── README.md         # 项目说明
```

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件
