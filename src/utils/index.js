import {
  getQueryString,
  getAppVersion,
  getQueryObject,
  getUrlParamsByObject,
} from '@/utils/url'
import { compareVersion } from '@/utils/string'
import { getCookie } from '@/utils/utils'
import { routerToNative, jumpBookDetail } from '@/utils/native'
import { mBuryPoint, nBuryPoint, nSensorPoint } from '@/utils/buryPoint'
import {
  throttle,
  formatIsoTime,
  getType,
  isIPhoneXCallback,
  requestAnimFrame,
} from '@/utils/utils'
import BROWSER from '@/utils/browser'

import { skipUrl } from './nativeToH5/index'

export {
  getUrlParamsByObject,
  isIPhoneXCallback,
  getQueryString,
  getQueryObject,
  getAppVersion,
  compareVersion,
  BROWSER,
  formatIsoTime,
  getType,
  throttle,
  requestAnimFrame,
  getCookie,
  routerToNative,
  mBuryPoint,
  nBuryPoint,
  jumpBookDetail,
  skipUrl,
  nSensorPoint, // 端上神策埋点方法
}
