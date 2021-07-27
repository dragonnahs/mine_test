
import { post } from '@/config/axios.config'

/**
 * 获取回复id
 * @param {String} replyId 回复id
 */
export const getReplyDetail = (replyId) => {
  return post('/community/comment/reply/detail', {
    replyId
  })
}

/**
 * 获取回复的条数
 * @param {String} replyId 回复id
 * @param {Number} pageNum 第几页
 * @param {Number} pageSize 一页多少条
 */
export const getReplyList = (replyId, pageNum = 0, pageSize = 10) => {
  return post('/community/comment/reply/list', {
    replyId,
    pageNum,
    pageSize
  })
}