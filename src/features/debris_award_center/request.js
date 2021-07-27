import { post } from '@/config/axios.config'

/**
 * 获取碎片评论列表接口
 * @param {*} activityId --- 活动ID
 */
export const getDebrisCommentList = (activityId) => {
  return post('/activity_api/fragmentPrize/getCommentList', {
    activityId
  })
}