import { window } from 'vscode'

import pathLib, { mkdir, templateExts, copyFiles, exists } from './pathLib'
import * as errors from './errors'

async function getName() {
  const name = await window.showInputBox({
    placeHolder: '页面名称',
  })

  if (!name) {
    throw new Error(errors.UnavailableValue)
  }

  const path = pathLib.pagePath(name)

  if (await exists(path)) {
    throw new Error(errors.PageExists)
  }

  return name
}

async function createPage(name: string) {
  const path = pathLib.pagePath(name)
  const { pageTemplate } = pathLib
  const dests = <[string]>templateExts.map(v => `${path}/${name}${v}`)

  await mkdir(path)
  await copyFiles(pageTemplate, dests);
}

async function saveConfig(name: string) {
  const path = `pages/${name}/${name}`
  const { appConfig } = pathLib

  appConfig.pages.push(path)
  pathLib.setAppConfig(appConfig)
}

export default async function () {
  if (!(await exists(pathLib.pagesPath))) {
    window.showErrorMessage(errors.NoPagePath)
    return
  }

  try {
    const name = await getName()
    await createPage(name)
    await saveConfig(name)
  } catch (error) {
    window.showErrorMessage(error.message)
  }
}