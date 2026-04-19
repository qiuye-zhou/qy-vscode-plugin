# QY VSCode Plugin

一个高效的 VSCode 辅助插件，旨在提升开发体验和工作流效率。提供代码提交管理、背景自定义、智能变量命名等实用功能。

## 功能

- 快速提交代码，支持自定义 Git 提交命令，简化提交流程
- 一键打开当前项目对应的远程仓库地址
- 自定义Vscode背景(支持http图片，file协议图片)
- 根据中文描述快速生成符合规范的英文变量名
- 更多功能正在开发中...

## 安装

1. 克隆仓库
2. 运行 `npm install` 安装依赖
3. 运行 `npm run package` 构建扩展
4. 在根目录下右键qy-vscode-plugin.vsix文件，选择安装扩展

## 背景插件使用说明

## 配置方法

在VSCode设置中有以下配置：

```json
{
  // 是否启用背景插件
  "qy-vscode-plugin.background.enabled": true,
  // openai 配置
  "qy-vscode-plugin.openai": {
    // 你的 API Key
    "apiKey": "sk-xxxxxxxxxxxxxxxxxxxxxxxx",
    // API 基础 URL
    // 阿里云通义千问示例: "https://dashscope.aliyuncs.com/compatible-mode/v1"
    // DeepSeek 示例: "https://api.deepseek.com/v1"
    "baseUrl": "",
    // 模型名称 (例如: gpt-3.5-turbo, gpt-4o, qwen-plus, deepseek-chat)
    "model": "gpt-3.5-turbo"
  }
  // 全屏背景配置
  "qy-vscode-plugin.background.fullscreen": {
    // 背景图片列表，支持 https 和 file 协议
    "images": [
      "https://example.com/image1.jpg",
      "file:///D:/Images/background.jpg"
    ],
    // 透明度 (0.0 - 1.0)，建议设置在 0.0 - 0.3
    "opacity": 0.1,
    // 图片尺寸模式: cover, contain, auto 等
    "size": "cover",
    // 图片位置: center, top, bottom, left, right 等
    "position": "center",
    // 轮播间隔时间（秒），设置为 0 则禁用轮播
    "interval": 0,
    // 是否随机显示图片
    "random": false
  }
}
```

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件
