import { post } from '@/config/axios.config'


/**
 * 提交评论
 */

export const submitComment = (content, img, exchangeId) => {
  return post('/activity_api/fragmentPrize/comment', {
    content,
    img,
    exchangeId
  })
}