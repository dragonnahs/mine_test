import dsbridge from 'dsbridge'
import { getCookie } from '@/utils/utils'
var b64 = require('js-base64').Base64
const getVersion = () => {
  let versionStr = getCookie('version')
  let versionArr = versionStr ? versionStr.split('.') : []
  if (versionArr.length > 0) {
    return parseFloat(versionArr[1] + '.' + versionArr[2])
  } else {
    return 0
  }
}

/**
 * 设置导航栏的自定义方法
 * @param {Object} args 传入一个对象,包含以下参数
 * title: 顶部标题
 * titleColor: 标题颜色
 * rightText: 导航右侧文案
 * rightTextColor: 导航右侧的文字颜色
 * callback: 导航右侧文字的点击回调
 * bgColor: 导航背景颜色
 * iconType: 返回按钮的样式
 */
export const setHeader = (args) => {
  dsbridge.call('setupNavigationBar', args)
}

/**
 * 关闭h5的当前页面
 * @param {Function} callback 关闭当前页面后的回调
 */
export const closeCurrentPage = (callback) => {
  dsbridge.call('closePageNative', callback)
}
/**
 * 返回
 * @param {Object} args 对象包含以下参数
 * step: 返回多少层级
 */
export const goBack = (args) => {
  console.log(args)
  dsbridge.call('goBackNative', args)
}

/**
 * 吐司提示
 * @param {Object} args 包含以下属性
 * content: 吐司提示的内容
 */
export const toast = (args) => {
  console.log(args)
  dsbridge.call('showToastNative', args)
}

/**
 * 调用原生的分享
 * @param {Object} args 包含以下属性
 * platform:[]数组，显示的平台有哪些(qq,微信=1，朋友圈=2)
 * title: 分享标题
 * desc: 分享描述
 * icon: 分享的图标
 * url: 分享的地址
 * type: 分享的类型(图片，图文链接,文字链接)
 * imgUrl: 如果是图片的话该参数必传
 * @param {*} callback
 */
export const shareMenu = (args, callback) => {
  console.log(args, getVersion())
  if (getVersion() < 1.42) {
    if (args.platform == 1) {
      window.location = `breader://share/wechat?url=${b64.encode(args.url)}&title=${args.title}&imgurl=${encodeURIComponent(args.icon)}&desc=${args.desc}`
    } else if (args.platform == 2) {
      window.location = `breader://share/moments?url=${b64.encode(args.url)}&title=${args.title}&imgurl=${encodeURIComponent(args.icon)}&desc=${args.desc}`
    }
    return
  }
  dsbridge.call('showShareMenuNative', args, callback)
}

/**
 * 跳转url
 * @param {Object} args 对象包含到属性
 * skipUrl: 地址
 */
export const skipUrl = (args) => {
  console.log(args, getVersion())
  if (getVersion() >= 1.42) {
    dsbridge.call('skipUrlNative', args)
  } else {
    window.location.href = `breader://common/browser?url=${encodeURIComponent(args.skipUrl)}`
  }
}

/**
 * 跳转登陆页面
 */
export const skipLoginPage = () => {
  dsbridge.call('skipLoginPage')
}
/**
 * 判断用户是否登陆返回值是boolean
 */
export const judgeIsLogined = (args) => {
  console.log(args, '参数args')
  dsbridge.call('judgeIsLogined', args)
}

/**
 * 跳转到指定排行榜的指定位置
 * @param {传入的参数} args categoryId： 分类id 98-男生 122-女生 79-出版
 * rankingName：榜单名称 eg：推荐榜
 * rank：榜单名次
 */
export const skipRanking = (args) => {
  console.log('skipRanking', args)
  dsbridge.call('skipRanking', args)
}

/**
 * 友盟打点
 * @param {传入的参数} args {
        eventName: 'h5_post_bar_vote',
        map: {
          bookId: getQueryString('bookId'),
          page: 'post_bar',
          rankingName: this.bookInfo.rankingName
        }
      }
 */
export const buryingPoint = (args) => {
  console.log('buryingPoint:', args)
  dsbridge.call('buryingPoint', args)
}

/*
* 判断设备浏览器类型
*/

export const BROWSER = (function() {
  var ua = navigator.userAgent.toLowerCase()
  var isAndroid = ua.indexOf('android') !== -1 ? 1 : 0
  var isTMApp = ua.indexOf('illustration')!==-1?1:0

  return {
    isTMApp,
    isAndroid,
    isiOS: !!ua.match(/\(i[^;]+;( u;)? cpu.+mac os x/),
    isiPhone: ua.indexOf('iphone') > -1 || ua.indexOf('mac') > -1,
    isiPad: ua.indexOf('ipad') > -1,
    isWeChat: ua.indexOf('micromessenger') !== -1 ? 1 : 0,
    isQQ: !!ua.match(/QQ/i),
    isWeiBo: !!ua.match(/Weibo/i),
    androidVersion: isAndroid ? ua.substr(ua.indexOf('android') + 8, 1) : false
  }
})()

/*
* 设置导航栏
*/

export const tmSetNavBar=(args) => {
  dsbridge.call('setupNavigationBar', args)
}
/*
* 设置右侧导航icon
*/
export const tmNavRightIcon = (args, callback) => {
  dsbridge.call('setupNavigationBarRightItems', args, callback)
}

/**
 *  分享注册方法
 * @param {*} args
 * @param {*} callback
 */
export const tmShareClickReg = (callback) => {
  dsbridge.register('navigationBarRightItemTapped', callback)
}
/**
 * 页面出现
 * @param {*} args
 * @param {*} callback
 */
export const tmPageshow = (callback) => {
  dsbridge.register('browserPageResume', callback)
}
/**
 * 页面消失
 * @param {*} args
 * @param {*} callback
 */
export const tmPageHidden = (callback) => {
  dsbridge.register('browserPageDisappear', callback)
}
/**
 * 页面即将关闭
 * @param {*} args
 * @param {*} callback
 */
export const tmPageClose = (callback) => {
  dsbridge.register('browserPageWillClose', callback)
}
/*
* 分享
*/
export const tmShare = (args, callback) => {
  dsbridge.call('popShare', args, callback)
}

/*
* 获取用户登录信息
*/

export const tmClientInfo = (callback) => {
  dsbridge.call('getClientInfo', callback)
}
/**
 * 去登录
 */

export const tmGlogin = (args, callback) => {
  dsbridge.call('loginWithCallback', args, callback)
}

