
import { post } from '@/config/axios.config'

/**
 * 获取帖子详情
 * @param {String} commentId 评论id
 */
export const getCommentInfo = (commentId) => {
  return post('/community/comment/detail', {
    commentId
  })
}

/**
 * 评论接口
 * @param {String} commentId 评论id
 * @param {Number} pageNum 第几页
 * @param {Number} pageSize 一页多少条
 */
export const getCommentReplyList = (commentId, pageNum = 0, pageSize = 10) => {
  return post('/community/comment/replyList', {
    commentId,
    pageNum,
    pageSize
  })
}
/**
 * 回复接口
 * @param {String} commentId 回复的条目id
 * @param {String} content 回复内容
 * @param {Number} type 回复类型，1=评论的回复，2=回复的回复
 */
export const publishReply = (commentId, content, type = 1) => {
  return post('/community/comment/reply', {
    parentId: commentId,
    content,
    type
  })
}

/**
 * 删除回复接口
 * @param {Number} replyId 回复id
 */
export const deleteReply = (replyId) => {
  return post('/community/comment/reply/delete', {
    replyId
  })
}