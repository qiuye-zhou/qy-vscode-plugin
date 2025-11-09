import * as path from 'path'
import * as os from 'os'
import * as child_process from 'child_process'

export const VERSION = '0.1.0'
export const BACKGROUND_VER = 'background.ver'
export const ENCODING = 'utf8'

function getVSCodePathFromRunningProcess(): string {
  try {
    let command: string
    let isWindows = os.platform() === 'win32'

    if (isWindows) {
      command =
        'wmic process where "name=\'Code.exe\'" get ExecutablePath /value'
    } else {
      command =
        'ps aux | grep "[c]ode" | grep -v grep | head -1 | awk \'{for(i=11;i<=NF;i++) print $i}\''
    }

    const result = child_process.execSync(command, { encoding: 'utf8' })

    if (result) {
      if (isWindows) {
        // Windows 输出示例: ExecutablePath=C:\Program Files\Microsoft VS Code\Code.exe
        const match = result.match(/ExecutablePath=(.*)/)
        if (match && match[1]) {
          return path.dirname(match[1].trim())
        }
      } else {
        // Unix-like 系统
        const lines = result
          .trim()
          .split('\n')
          .filter((line) => line.includes('code') || line.includes('Code'))
        if (lines.length > 0) {
          const fullPath = lines[0].trim()
          // 移除参数，只保留路径
          const codePath = fullPath.split(' ')[0]
          return path.dirname(codePath)
        }
      }
    }
  } catch (error) {
    console.debug(
      'Could not determine VSCode path from running process:',
      error,
    )
  }

  return ''
}

// 获取VSCode的安装路径
export function getVSCodePath() {
  const platform = os.platform()
  let vscodePath = ''

  switch (platform) {
    case 'win32':
      vscodePath = process.env.VSCODE_PATH || getVSCodePathFromRunningProcess()
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
