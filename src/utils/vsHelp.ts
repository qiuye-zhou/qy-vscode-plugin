import * as vscode from 'vscode'

export function showInfo(message: string) {
  vscode.window.showInformationMessage(message)
}

export function showError(message: string) {
  vscode.window.showErrorMessage(message)
}
