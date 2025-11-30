# QY VSCode Plugin

一个VSCode辅助插件，提供一些实用的功能。

## 功能

- 快速提交代码
- 自定义提交代码的命令
- 打开仓库的远程地址
- 自定义Vscode背景(图片使用file协议有问题待修，暂时只能使用http的图片)
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
  "qy-vscode-plugin.background.enabled": true,
  "qy-vscode-plugin.background.fullscreen": {
    "images": [
      "https://example.com/image1.jpg",
    ],
    "opacity": 0.1,
    "size": "cover",
    "position": "center",
    "interval": 0,
    "random": false
  }
}
```

## 参数说明

- \`images\`: 背景图片列表，支持https协议
- \`opacity\`: 透明度，建议0.1-0.3
- \`size\`: 图片大小，cover为自适应
- \`position\`: 图片位置
- \`interval\`: 轮播间隔（秒），0为禁用
- \`random\`: 是否随机显示

配置完成后重启VSCode即可生效。

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件
