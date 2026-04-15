import * as path from 'path'
import * as os from 'os'

export const VERSION = '0.1.0'
export const BACKGROUND_VER = 'background.ver'
export const ENCODING = 'utf8'

export const TOUCH_JSFILE_PATH = path.join(
  os.tmpdir(),
  'qy-vscode-plugin-touch',
)
