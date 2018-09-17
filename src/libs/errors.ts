export const PageExists = '已存在同名的 Page 组件'
export const UnavailableValue = '输入的值不正确'
export const InnerError = '内部错误'
export const NoSuchPath = (path: string) => `未找到 ${path} 目录，请确认当前打开的是否为小程序工程`
export const NoPagePath = NoSuchPath('/pages')