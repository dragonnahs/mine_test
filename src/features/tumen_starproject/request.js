
import { get } from '@/config/axios.config'
import { getQueryString } from '@/utils/url'

/**
 * 获取签约作者手机认证、签约状态以及身份认证状态以及作品数
 */
export const getAuthInfo = () => {
  return get(`/contract/getAuthInfo?access_token=${getQueryString('access_token') || ''}`)
}
/**
 * 验证码发送接口
 * @param {String} cellphone 手机号
 */
export const sendMsg = (cellphone) => {
  return get(`/contract/sendMsg?cellphone=${cellphone}&access_token=${getQueryString('access_token') || ''}`)
}
/**
 * 手机认证接口
 * @param {String} cellphone 手机号
 * @param {String} verificationCode 验证码
 */
export const cellphoneAuth = (cellphone, verificationCode) => {
  return get(`/contract/cellphoneAuth?cellphone=${cellphone}&verificationCode=${verificationCode}&access_token=${getQueryString('access_token') || ''}`)
}
