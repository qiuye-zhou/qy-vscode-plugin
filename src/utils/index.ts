import * as fs from 'fs'
import * as path from 'path'

/**
 * 获取文件所在的项目根目录
 * @param filePath
 * @returns
 */
export function getProjectRoot(filePath: string): string {
    let currentDir = path.dirname(filePath)
    while (currentDir !== path.parse(currentDir).root) {
        if (fs.existsSync(path.join(currentDir, '.git'))) {
            return currentDir
        }
        currentDir = path.dirname(currentDir)
    }
    return ''
}