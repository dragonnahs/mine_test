import env from './env'

// normal
export function d(...args) {
  console.log(...args)
}

// information
export function i(...args) {
  // 蓝色
  console.log('%cInformation:', 'color: blue')
  console.log(...args)
}

// warning
export function w(...args) {
  // 橙色
  console.log('%cwarning', 'color: origin')
  console.log(...args)
}

// error
export function e(...args) {
  // 红色
  console.log('%cerror:', 'color: red')
  console.log(...args)
}

const noop = () => {}

export default {
  d: env.isDev ? d : noop,
  i: env.isDev ? i : noop,
  w: env.isDev ? w : noop,
  e: env.isDev ? e : noop,
}
