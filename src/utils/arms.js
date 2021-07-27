/**
 * arms 阿里监控接入
 * 配置文档 https://www.npmjs.com/package/alife-logger
 *
 */
import BrowerLogger from 'alife-logger'
import packageConfig from '../../package.json'
const isProd = process.env.VUE_APP_DEVELOP_ENV === 'false'

const logger = (() => {
  if (isProd) {
    try {
      return BrowerLogger.singleton({
        pid: 'iiabd5we3q@9b13646576a4cd7', // 项目ID
        imgUrl: 'https://arms-retcode.aliyuncs.com/r.png?', // 日志上传地址
        enableSPA: false, // 是否是但页面应用
        sendResource: true, // 是否上报资源数据
        release: packageConfig.version, // 当前H5线上版本号
        sample: 10, // 日志采样上报配置 1 表示100% 采样，10表示10%采样， 100 表示1%采样
        useFmp: true // 采集首屏 FMP（First Meaningful Paint，首次有效渲染）数据。
      // disabledHook: true // 禁用自动API上报
      })
    } catch (e) {
    // eslint-disable-next-line no-console
      console.error('init logger fail', e)
    }
  } else {
    return {
      error() {}
    }
  }
})()

export default logger