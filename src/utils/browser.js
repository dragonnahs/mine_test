import { getQueryString } from '@/utils/url'
/**
 * check browser type
 */
const BROWSER = (function() {
  var ua = navigator.userAgent.toLowerCase()
  var isAndroid = ua.indexOf('android') !== -1 ? 1 : 0

  const isAndroidOSVersion = ua.match(/android\s([0-9\.]*)/)  // 获取安卓版本号
  const isiOSOSVersion = ua.match(/cpu iphone os (.*?) like mac os/)  // 获取ios版本号

  return {
    isAndroid,
    isiOS: !!ua.match(/\(i[^;]+;( u;)? cpu.+mac os x/),
    isiPhone: ua.indexOf('iphone') > -1 || ua.indexOf('mac') > -1,
    isiPad: ua.indexOf('ipad') > -1,
    isWeChat: ua.indexOf('micromessenger') !== -1 ? 1 : 0,
    isQQ: !!ua.match(/QQ/i),
    isWeiBo: !!ua.match(/Weibo/i),
    androidVersion: isAndroid ? ua.substr(ua.indexOf('android') + 8, 1) : false,
    isAndroidOSVer: isAndroidOSVersion ? isAndroidOSVersion[1] : false,
    isiOSOSVer: isiOSOSVersion ? isiOSOSVersion[1] : false
  }
})()
export function isIphoneX() {
  if (getQueryString('isIphoneX') === '1') {
    return true
  } else if (window.screen.width === 375 && window.screen.height === 812) {
    return true
  } else {
    return false
  }
}

export default BROWSER
