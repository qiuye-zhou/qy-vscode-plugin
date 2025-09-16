# QY VSCode Plugin

一个VSCode辅助插件，提供实用的开发工具和功能。

## 功能特性

- 快速提交代码
- 自定义提交代码的命令
- 打开仓库的远程地址
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

### 打包扩展

```bash
npm run build

npm install -g vsce
vsce package --no-dependencies
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
│   └── activates/    # 各命令函数
├── out/              # 编译输出目录
├── package.json      # 扩展清单
├── tsconfig.json     # TypeScript 配置
└── README.md         # 项目说明
```

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件
