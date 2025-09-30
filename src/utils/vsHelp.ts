import * as vscode from 'vscode'

export function showInfoRestart(message: string) {
  vscode.window.showInformationMessage(message)
}

export function showError(message: string) {
  vscode.window.showErrorMessage(message)
}
