import { ExtensionContext, commands } from 'vscode'

import pathLib from './libs/pathLib'
import createPage from './libs/page'
import createComponent, { addComponentPath } from './libs/component'

export function activate(context: ExtensionContext) {
  pathLib.context = context

  const pageDisposable = commands.registerCommand('createPage', createPage)
  const componentPathDisposable = commands.registerCommand(
    'addComponentPath',
    () => addComponentPath(context)
  )
  const componentDisposable = commands.registerCommand(
    'createComponent',
    () => createComponent(context)
  )

  context.subscriptions.push(pageDisposable)
  context.subscriptions.push(componentPathDisposable)
  context.subscriptions.push(componentDisposable)
}

export function deactivate() {  }