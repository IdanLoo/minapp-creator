import { workspace, ExtensionContext } from 'vscode'
import * as fs from 'fs'

import * as errors from './errors'
import { errorFirst, noError } from './promisify'

type PathLib = {
  context?: ExtensionContext,
  [name: string]: any
}

export const templateExts = ['.js', '.json', '.wxml', '.wxss']

export const exists = noError(fs.exists)
export const mkdir = errorFirst(fs.mkdir)
export const writeFile = errorFirst(fs.writeFile)
export const copyFile = errorFirst(fs.copyFile)
export const copyFiles = (srcs: [string], dests: [string]) => {
  const promises = srcs.map((s, i) => copyFile(s, dests[i]))
  return Promise.all(promises)
}

export default <PathLib>{
  context: undefined,

  get rootPath() {
    return workspace.rootPath
  },

  get pagesPath() {
    return `${this.rootPath}/pages`
  },

  get appConfigPath() {
    return `${this.rootPath}/app.json`
  },

  get appConfig() {
    return require(this.appConfigPath)
  },

  async setAppConfig(value: any) {
    value = JSON.stringify(value, null, 2)
    await writeFile(this.appConfigPath, value)
  },

  get extensionPath() {
    if (!this.context) {
      throw new Error(errors.InnerError)
    }

    return this.context.extensionPath
  },

  get templatesPath() {
    return `${this.extensionPath}/src/templates`
  },

  get pageTemplate() {
    const { templatesPath } = this
    return templateExts.map(v => `${templatesPath}/page/template${v}`)
  },

  get componentTemplate() {
    const { templatesPath } = this
    return templateExts.map(v => `${templatesPath}/component/template${v}`)
  },

  pagePath(name: string) {
    return `${this.pagesPath}/${name}`
  },
}