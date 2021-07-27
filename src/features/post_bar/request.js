
import { post } from '@/config/axios.config'

/**
 * 获取书友吧相关信息
 * @param {String} bookId 书籍id
 */
export const getBookFriendsBarInfo = (bookId) => {
  return post('/community/comment/book-friends-bar/info', {
    bookId
  })
}

/**
 * 获取贴吧列表
 * @param {String} bookId 书籍id
 * @param {Number} byType 列表类型1=动态，2=热门，3=我的发布
 * @param {Number} pageNum 第几页
 * @param {Number} pageSize 一页多少条
 */
export const getPostsList = (bookId, byType = 1, pageNum = 0, pageSize = 10) => {
  return post('/community/comment/list', {
    objectId: bookId,
    byType,
    pageNum,
    pageSize
  })
}

/**
 * 删除帖子接口
 * @param {String} commentId 帖子id
 */
export const deleteComment = (commentId) => {
  return post('/community/comment/delete', {
    commentId
  })
}

/**
 * 点赞接口
 * @param {String} commentId 点赞条目id
 * @param {Number} type 点赞的主题类型，1=评论，2=回复
 */
export const getStar = (commentId, type = 1) => {
  return post('/community/comment/star', {
    parentId: commentId,
    type
  })
}

/**
 * 取消点赞
 * @param {String} commentId 当前取消点赞的条目的id
 * @param {Number} type 取消点赞类型，1=评论，2=回复
 */
export const getUnStar = (commentId, type = 1) => {
  return post('/community/comment/unStar', {
    parentId: commentId,
    type
  })
}