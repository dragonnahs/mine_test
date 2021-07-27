import { post } from '@/config/axios.config'

/**
 * 获取获奖记录
 * @param {*} type 类型
 */
export const getAwardRecord = (type = 15) => {
  return post('/api/task/v1/wallet/user/records', {
    type
  })
}