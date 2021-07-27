import { get } from '@/config/axios.config'

function canUseWebP() {
  /* istanbul ignore next */
  try {
    if (window.__SUPORTWEBP__ !== undefined) {
      return window.__SUPORTWEBP__
    }
  } catch (e) {
    return false
  }
  /* istanbul ignore next */
  try {
    const elem = document.createElement('canvas')
    if (elem.getContext && elem.getContext('2d')) {
      const support = elem.toDataURL('image/webp').indexOf('data:image/webp') === 0
      window.__SUPORTWEBP__ = support
      return support
    }
  } catch (e) {
    return false
  }
  /* istanbul ignore next */
  return false
}
/**
 * 图片
 * @param {*} url
 * @param {*} size
 */
export function judegImg(url, size = 4) {
  let imgPer = ['.jpg', '.jpeg', '.png', '.gif', '.HEIC', '.JPG']
  if (url) {
    let x = imgPer.some((item) => {
      return url.slice(-6).includes(item)
    })
    if (url.slice(-6).includes('.mp4')) {
      return url + '?x-oss-process=video/snapshot,t_1,f_jpg'
    }
    if (url.includes('x-oss-process=video/snapshot')) {
      return url
    }
    if (x && canUseWebP()) {
      return url + `?x-oss-process=image/format,webp/resize,w_${216 * size},h_${168 * size}`
    }
    if (x) {
      return url + `?x-oss-process=image/resize,w_${216 * size},h_${168 * size}`
    }
    if (url.slice(-6).includes('.webp') && canUseWebP()) {
      return url
    }
    return url + `?x-oss-process=image/format,jpeg/resize,w_${216 * size},h_${168 * size}`
  }
  return require('../../assets/tu_starplan/error_img.png')
}

const WorksServerApi ={
  getOssAuth: (params) => {
    console.log(params, 44)
    // let options = new HttpOptions('/tumen/oss/getResourceUploadToken')
    return get('https://cartoon.ibreader.com/api/oss/getResourceUploadToken', {
      params
    })
  },
  // followUser: (params) => {
  //   params = objKeySort(params)
  //   let paramsTostr = Qs.stringify(params)
  //   let options = new HttpOptions('/api/follow/follow', paramsTostr)
  //   options.headers = [{ name: 'Content-Type', value: 'application/x-www-form-urlencoded' }]
  //   return HttpRequestService.post(options)
  // },
  // unfollowuser: (params) => {
  //   params = objKeySort(params)
  //   let paramsTostr = Qs.stringify(params)
  //   const options = new HttpOptions('/api/follow/unfollow', paramsTostr)
  //   options.headers = [{ name: 'Content-Type', value: 'application/x-www-form-urlencoded' }]
  //   return HttpRequestService.post(options)
  // },
}

export default WorksServerApi