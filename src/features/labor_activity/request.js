import { post } from '@/config/axios.config'

/**
 * 初始化页面的请求函数
 */
export const initPageFetch = () => {
  return post('/task_api/activity/labourDay/getActivityInfo', { })
}

/**
 * 立即参加五一活动
 */
export const joinLaborActivityFetch = () => {
  return post('/task_api/activity/labourDay/join')
}

/**
 * 立即提现，当前项目只支持微信
 */
export const withdrawMoneyFetch = () => {
  return post('/task_api/activity/withdraw', {
    itemId: 7, // 提现选项id，当前项目是7
    platform: 0 // 目前只支持微信
  })
}