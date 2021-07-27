// import { post } from '@/config/axios.config'
import axios from 'axios'
import BROWSER from './browser'
import bk from 'bayread-bridge'
const isProd = process.env.VUE_APP_DEVELOP_ENV === 'false'

/**
 * 获取设备类型
 */
function getOsType() {
  if (BROWSER.isAndroid) {
    return 'android'
  }
  if (BROWSER.isiPad || BROWSER.isiPhone) {
    return 'ios'
  }
  if (BROWSER.isWindows) {
    return 'windows'
  }
  return 'others'
}

/**
 * 端上埋点带过去的公共参数
 */
export const nDefaultData = {
  isProd,
  url: window.location.href,
  platformId: window.localStorage.getItem('platformId') || ''
}

/**
 * device string 操作系统 使用者 android、 ios、 windows、 others
 * url string 当前h5页面地址
 * eventTime bigint 埋点触发时间（ 用户设备时间）
 */

/**
 * H5自己发埋点
 * @param {String} eventKey 埋点字段
 * @param {object} eventValue 埋点字段
 */
export function mBuryPoint(eventKey=null, eventValue = {}) {
  const defaultData = {
    device: getOsType(),
    eventTime: Date.now(),
    url: window.location.href,
    eventKey
  }

  axios.get('/api/operation/statistics', {
    params: { ...defaultData, ...eventValue }
  }).then(() => {}).catch(err => {
    console.error('error ----> ', err)
  })
}

/**
 * 通知Native进行友盟埋点
 * @param {*} eventKey  事件名 --- 命名要求：1、 H5_页面名_自定义名称 2、全大写
 * @param {*} eventValue 埋点参数
 */
export function nBuryPoint(eventKey=null, eventValue = {}) {
  const defaultData = {
    ...nDefaultData,
    eventTime: Date.now(),
  }
  console.log('Native 埋点', eventKey, eventValue)
  bk.call('buryingPoint', {
    eventName: eventKey,
    map: { ...defaultData, ...eventValue }
  })
}

/**
 * 通知Native进行神策埋点
 * @param {*} eventKey 事件名 --- 命名规范（驼峰命名：eg：PageExposure）
 * @param {*} eventValue 事件属性 {}
 * 埋点数据结构：http://wiki.bayread.com/pages/viewpage.action?pageId=7045418
 * 埋点方法文档：http://wiki.bayread.com/pages/viewpage.action?pageId=1508231
 */
export function nSensorPoint(eventKey = null, eventValue = {}) {
  console.log('Native 神策埋点', eventKey, eventValue)
  bk.call('sendSensorEvent', {
    'eventName': eventKey,
    'eventProperties': { ...nDefaultData, ...eventValue }
  })
}