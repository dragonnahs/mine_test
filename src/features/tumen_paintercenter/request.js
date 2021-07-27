import { get } from '@/config/axios.config'
import { getQueryString } from '@/utils/url'

/**
 * 获取签约作者手机认证、签约状态以及身份认证状态以及作品数
 */
export const getAuthInfo = () => {
  return get(`/contract/getAuthInfo?access_token=${getQueryString('access_token') || ''}`)
}