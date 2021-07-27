/**
 * 常用的活动调用的js方法
 */
import BROWSER from './browser'
import { post } from '@/config/axios.config'
import { getCookie, compareVersion, routerToNative, getUrlParamsByObject } from '@/utils/index'
/**
 * 下载app
 * @param {Number}} time 业务需求，延时跳转商店单位毫秒
 */
export function downLoadApp(andoridApk, iosStoreUrl, time) {
  if (BROWSER.isiOS || BROWSER.isiPhone) {
    if (time) {
      setTimeout(() => {
        window.location.href = iosStoreUrl
      }, time)
    } else {
      window.location.href = iosStoreUrl
    }
  } else {
    window.location.href = andoridApk
  }
}

// js原生动画滚动
export function scrollAnimation(currentY, targetY) {
  // 动画滚动
  let needScrollTop = targetY - currentY
  let _currentY = currentY
  setTimeout(() => {
    // 一次调用滑动帧数，每次调用会不一样
    const dist = Math.ceil(needScrollTop / 10)
    _currentY += dist
    window.scrollTo(0, currentY)
    // 如果移动幅度小于十个像素，直接移动，否则递归调用，实现动画效果
    if (needScrollTop > 10 || needScrollTop < -10) {
      scrollAnimation(_currentY, targetY)
    } else {
      window.scrollTo(0, targetY)
    }
  }, 1)
}

// 联结在线客服

export const callOnline = async() => {
  let userInfoRes = {}
  let res = await post('/api/user/userInfoQuickApp')
  if (res.data) {
    const { vipInfo, userInfo } = res.data
    userInfoRes = { ...vipInfo, ...userInfo }
  }
  const vId = getCookie('vId')
  const sessionId = getCookie('sessionid') // sessionId 存在～说明用户已经登录
  const { username, nickname, phoneNum } = userInfoRes
  const version = localStorage.getItem('version')
  const params = {
    sysnum: '97eed5af7ee44513b227658750dc0981',
    channelid: '2',
    partnerid: sessionId ? sessionId : vId,
    uname: username,
    realname: nickname,
    tel: phoneNum,
    type: '3',
    msg_flag: '0',
    level_msg_flag: '1',
    feedback_flag: '1',
    photo_flag: compareVersion('1.38.0', version) !== -1 ? '1' : '0',
    to_customsys_open_style: '0',
    // leave_customsys_flag: '1',
    agent_mode_flag: '1',
    top_bar_flag: '0',
    guide_flag: '1',
    time: '2880',
    artificial: true
  }
  console.log(params)
  const url = `https://chat.sobot.com/chat/h5/v2/index.html${getUrlParamsByObject(params)}`
  routerToNative(url)
}
