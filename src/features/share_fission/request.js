import { post } from '@/config/axios.config'

/**
 * 好友点击链接上报奖励
 * @param {Object} code从微信获取到的授权值，recordId是分享链接的用户(从客户端分享的用户)
 */
export const interviewReportFetch = ({ code: wxCode='', recordId: shareRecordId='' }) => {
  return post('/task_api/task/share/reward', {
    code: wxCode,
    recordId: shareRecordId
  }, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

/**
 * 获取微信分享功能的初始化信息接口
 * @param {String} currentUrl,当前页面地址
 */
export const initWxSdkApiFetch = (currentUrl) => {
  return post('/task_api/task/share/getJsSdkConfig', {
    url: currentUrl
  })
}

/**
 * 获取分享页面的信息
 * @param { String } 当前访问的recodId
 */
export const getPageInfoFetch = (recordId) => {
  return post('/task_api/task/share/getShareInfo', {
    recordId
  })
}