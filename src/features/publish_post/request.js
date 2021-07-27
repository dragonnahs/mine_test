
import { post } from '@/config/axios.config'


/**
 * 发表帖子
 * @param {String} bookId 书籍id
 * @param {String} content 书籍内容
 * @param {Number} score 评分
 * @param {String} title 标题
 * @param {String} image 图片地址
 * @param {String} chapterNo 章节号
 */
export const publishPost = ({ bookId, comment, score, title, image = '', chapterNo = '' }) => {
  return post('/community/comment/publish', {
    contentTypeId: 11,
    objectId: bookId,
    comment,
    score,
    chapterNo,
    title,
    image
  })
}