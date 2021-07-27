import { post } from '@/config/axios.config'

/**
 * 获取用户性别偏好设置
 */
export const getUserPreference = () => {
  return post('/api/user/preference')
}

