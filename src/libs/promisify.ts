export const noError = (func: Function) =>
  (...props: Array<any>) => new Promise(resolve => func(...props, resolve))

export const errorFirst = (func: Function) =>
  (...props: Array<any>) => new Promise((resolve, reject) =>
    func(...props, (err: Error, ...last: Array<any>) => {
      if (err) {
        reject(err)
        return
      }

      resolve(...last)
    })
  )