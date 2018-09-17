import { ExtensionContext, window } from 'vscode'

// import pathLib, { mkdir, templateExts, copyFiles, exists } from './pathLib'
import pathLib, { exists, mkdir, templateExts, copyFiles } from './pathLib'
import * as errors from './errors'

const componentPathnameKey = 'component-pathnames'
let _context: ExtensionContext

async function getComponentPath() {
  const pathnames = [
    '/components',
    '/controls',
    ..._context.workspaceState.get(componentPathnameKey, [])
  ]

  const path = pathLib.rootPath + await window.showQuickPick(pathnames)
  if (!(await exists(path))) {
    throw new Error(errors.NoSuchPath(path))
  }

  return path
}

async function getName() {
  const name = await window.showInputBox({
    placeHolder: '组件名称'
  })

  if (!name) {
    throw new Error(errors.UnavailableValue)
  }

  return name;
}

async function create() {
  const componentPath = await getComponentPath();
  const name = await getName();
  const path = `${componentPath}/${name}`;

  const { componentTemplate } = pathLib;
  const dests = <[string]>templateExts.map(v => `${path}/${name}${v}`);

  await mkdir(path);
  await copyFiles(componentTemplate, dests);
}

async function addPathname() {
  const pathname = await window.showInputBox({
    placeHolder: '组件目录，以项目路径为根目录。例如：/components'
  })

  if (!pathname) {
    throw new Error(errors.UnavailableValue)
  }

  const path = `${pathLib.rootPath}${pathname}`
  if (!(await exists(path))) {
    throw new Error(errors.NoSuchPath(path))
  }

  const pathnames = _context.workspaceState.get(componentPathnameKey, [])
  await _context.workspaceState.update(
    componentPathnameKey,
    [...pathnames, pathname]
  )
}

export async function addComponentPath(context: ExtensionContext) {
  _context = context

  try {
    await addPathname()
    window.showInformationMessage('添加成功！')
  } catch (error) {
    window.showErrorMessage(error.message)
  }
}

export default async function (context: ExtensionContext) {
  _context = context;

  try {
    await create()
  } catch (error) {
    window.showErrorMessage(error.message)
  }
}