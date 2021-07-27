import { post } from '@/config/axios.config'
/**
 * 获取金币详情接口
 */
export const getWalletInfo = (cb) => {
  post('/api/task/v1/wallet/user/info').then(res => {
    return cb && cb(res)
  }).catch(err => {
    console.error('error ----> ', err)
  })
}

/**
 * 获取积分商城跳转链接
 * params appType 0 -- android 1 -- ios
 * params transfer 0 -- 虚拟商城  1 -- 实物商城
 */

export const getMallUrl = (appType = 0, transfer = 0) => {
  return post('/api/coinmall/login', {
    appType, transfer
  })
}
