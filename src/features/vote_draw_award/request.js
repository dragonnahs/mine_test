import { post } from '@/config/axios.config'


/**
 * 获取用户信息
 * @param {Number} activityId 活动id
 */
export const getAwardInfo = (activityId) => {
  return post('/activity_api/activity/operation/list', {
    activityId
  })
}

/**
 * 抽奖
 * @param {Number} activityId 活动id
 * @param {Number} buttonId
 */
export const drawAward = (activityId, buttonId) => {
  return post('/activity_api/activity/operation/draw', {
    activityId,
    buttonId
  })
}
