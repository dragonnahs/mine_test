import { post } from '@/config/axios.config'

/**
 * 兑换地址提交
 * @param {*} activityId --- 活动ID
 * 原地址： /activity_api/fragmentPrize/getExchangeList
 * 2021/02/05 修改接口地址 /activity_api/fragmentPrize/getExchangeInfoList
 */
export const getDebrisAwardDetail = ({ activityId, pageIndex = 0, pageSize = 10 }) => {
  return post('/activity_api/fragmentPrize/getExchangeInfoList', {
    activityId,
    startIndex: pageIndex * pageSize,
    pageSize
  })
}