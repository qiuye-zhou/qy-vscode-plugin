import path from 'path'

import { sudoUtils } from './sudo'
import { vsc } from './vsc'

const base = (() => {
  const mainFilename = require.main?.filename
  const vscodeInstallPath = vsc?.env.appRoot
  return mainFilename?.length
    ? path.dirname(mainFilename)
    : path.join(vscodeInstallPath!, 'out')
})()

const jsPath = (() => {
  if (sudoUtils.isDesktop) {
    return path.join(base, 'vs/workbench/workbench.desktop.main.js')
  }
  return path.join(base, 'vs/code/browser/workbench/workbench.js')
})()

export const vscodePath = {
  base,
  extRoot: path.join(__dirname, '../../'),
  jsPath,
}
