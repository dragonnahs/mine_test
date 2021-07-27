import { post } from '@/config/axios.config'


/**
 * 获取碎片记录奖励明细列表
 */

export const getDebrisDetailList = (activityId) => {
  return post('/activity_api/fragmentPrize/getRecords', {
    activityId
  })
}