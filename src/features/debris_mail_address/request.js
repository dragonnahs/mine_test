import { post } from '@/config/axios.config'

/**
 * 获取碎片奖励明细接口
 * @param {*} activityId --- 活动ID
 */
export const submitMailAddress = ({ activityId, activityRecordId, userRealName, userPhone, userAddress }) => {
  return post('/activity_api/fragmentPrize/exchange', {
    activityId,
    activityRecordId,
    userRealName,
    userPhone,
    userAddress
  })
}