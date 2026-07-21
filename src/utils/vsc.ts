export let vsc: typeof import('vscode') | undefined

try {
  vsc = require('vscode')
} catch {
  // nothing todo
}
