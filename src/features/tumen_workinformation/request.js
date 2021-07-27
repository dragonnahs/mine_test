
import { post } from '@/config/axios.config'
import { getQueryString } from '@/utils/url'

/**
 * 作品信息提交
 * @param {String} opusName 作品名称
 * @param {String} price 作品收益价格 单位：分
 * @param {String} saleNum 售卖版数
 * @param {String} images 作品图片地址集合
 */
export const eSign = (opusName, price, saleNum, images) => {
  return post(`/contract/uploadOpus?access_token=${getQueryString('access_token') || ''}`, {
    opusName,
    price,
    saleNum,
    images
  })
}
