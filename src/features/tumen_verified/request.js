
import { post } from '@/config/axios.config'
import { getQueryString } from '@/utils/url'

/**
 * 实名信息上传
 * @param {String} realName 真实姓名
 * @param {String} idCardFrontUrl 身份证前面
 * @param {String} idCardBackUrl 身份证后面
 * @param {String} idCardBackUrl 身份证号码
 */
export const realNameAuth = (realName, idCardFrontUrl, idCardBackUrl, idCardNumber) => {
  return post(`/contract/realNameAuth?access_token=${getQueryString('access_token') || ''}`, {
    realName,
    idCardFrontUrl,
    idCardBackUrl,
    idCardNumber
  })
}
