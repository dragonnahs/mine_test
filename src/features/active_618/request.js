import { post } from '@/config/axios.config'

/**
 * 获取中奖用户信息
 * @param {String} activityId 活动id
 */
export const getNoticeList = (activityId) => {
  return post('/activity_api/activity/operation/rewardNoticeList', {
    activityId
  })
}

/**
 * 获取游戏地址
 * @param {Number} appType android为0，ios为1
 * @param {Number}} transfer 代表哪个游戏，2第一个游戏，3第二个，4第三个
 */
export const getGameUrl = (appType = 0, transfer = 0) => {
  return post('/api/coinmall/login', {
    appType, transfer
  })
}
