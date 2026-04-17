import * as path from 'path'
import * as os from 'os'

import pkg from '../../package.json'

export const VERSION = pkg.version
export const BACKGROUND_VER = 'background.ver'
export const ENCODING = 'utf8'

export const TOUCH_JSFILE_PATH = path.join(
  os.tmpdir(),
  'qy-vscode-plugin-touch',
)
