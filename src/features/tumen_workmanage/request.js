
import { get } from '@/config/axios.config'
import { getQueryString } from '@/utils/url'

/**
 * 作品信息提交
 * @param {String} size 一页多少
 * @param {String} page 页数
 */
export const opusList = (page, size = 10) => {
  return get(`/contract/opusList?size=${size}&page=${page}&access_token=${getQueryString('access_token') || ''}`)
}
