import { post } from '@/config/axios.config'

/**
 * 获取福利中心列表页面
 * @param {*} activityId --- 活动ID
 */
export const getDebrislist = (activityId) => {
  return post('/activity_api/fragmentPrize/home', {
    activityId
  })
}