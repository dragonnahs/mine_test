import { post } from '@/config/axios.config'

/**
 * 根据专题id获取专题数据详情
 * @param {*} topicId --- 专题id
 */
export const getTopicList = (topicId) => {
  return post('/api/recommendbusiness/topic/getTopicById', {
    topicId
  })
}