import * as path from 'path'
import * as os from 'os'

export const EXTENSION_NAME = 'qy-vscode-plugin'
export const VERSION = '0.0.1'
export const BACKGROUND_VER = 'background.ver'
export const ENCODING = 'utf8'

// 获取VSCode的安装路径
export function getVSCodePath() {
  const platform = os.platform()
  let vscodePath = ''

  switch (platform) {
    case 'win32':
      vscodePath =
        process.env.VSCODE_PATH ||
        path.join(
          os.homedir(),
          'AppData',
          'Local',
          'Programs',
          'Microsoft VS Code',
        )
      break
    case 'darwin':
      vscodePath =
        process.env.VSCODE_PATH ||
        '/Applications/Visual Studio Code.app/Contents'
      break
    case 'linux':
      vscodePath = process.env.VSCODE_PATH || '/usr/share/code'
      break
  }

  return {
    root: vscodePath,
    jsPath: path.join(
      vscodePath,
      'resources',
      'app',
      'out',
      'vs',
      'workbench',
      'workbench.desktop.main.js',
    ),
    cssPath: path.join(
      vscodePath,
      'resources',
      'app',
      'out',
      'vs',
      'workbench',
      'workbench.desktop.main.css',
    ),
  }
}

export const vscodePath = getVSCodePath()
export const TOUCH_JSFILE_PATH = path.join(
  os.tmpdir(),
  'qy-vscode-plugin-touch',
)
