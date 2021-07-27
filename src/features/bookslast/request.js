import { post } from '@/config/axios.config'

/**
 *
 * @param {*} bookId
 * @param {*} pageNum
 * @param {*} mId
 * @param {*} readBookId
 */
export const getEndCategoryBook = (bookId, pageNum, mId, readBookId) => {
  return post('/api/read/endCategoryBook', {
    bookId, pageNum, mId, readBookId
  })
}

/**
 *
 * @param {*} bookId
 * @param {*} mId
 */
export const getEndInfo = (bookId, mId) => {
  return post('/api/read/endInfo', {
    bookId, mId
  })
}

/**
 * 领取三天VIP奖励
 * @param {*} id
 */
export const getVipCard = (id) => {
  return post('/api/activity/get_vip_card', {
    id
  })
}

/**
 *  催更
 * @param {*} bookId
 * @param {*} chapterNum
 */
export const getReadUrge = (bookId, chapterNum) => {
  return post('/api/read/urge', {
    bookId,
    chapterNum
  })
}

/**
 * 获取视频详情
 */
export const getVideoList = (bookId) => {
  return post('/api/video/getBookOverVideos', {
    bookId
  })
}