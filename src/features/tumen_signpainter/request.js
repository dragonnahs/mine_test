
import { get } from '@/config/axios.config'
import { getQueryString } from '@/utils/url'

/**
 * 申请成为星画师
 */
export const bePainter = () => {
  return get(`/contract/apply?access_token=${getQueryString('access_token') || ''}`)
}
