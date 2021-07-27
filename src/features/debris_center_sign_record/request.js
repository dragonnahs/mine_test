import { post } from '@/config/axios.config'
import { getQueryString } from '@/utils/index'

/**
 * 获取签到记录
 */
export const getSignRecord = () => {
  return post('/task_api/task/record', {
    taskId: getQueryString('taskId') || 1
  })
}