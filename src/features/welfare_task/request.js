import { post } from '@/config/axios.config'
/**
 * 获取任务列表
 */
let adTypes7 = null // type = 7 的 8 个icon广告位
let adTypes8 = null // type = 7 的 8 个icon广告位

export const getTaskLists = async() => {
  let { data } = await post('/task_api/task/list')
  if (data) {
    adTypes7 = data.filter(item => item.type === 7)
    adTypes8 = data.filter(item => item.type === 8)
    return data.filter(item => item.type === 3)
  }
}

/**
 * 8个icon的广告位
 */
export const getFourAdLists = () => {
  let adPosFour = [], adPosLists = []
  if (!adTypes7) return
  adTypes7.filter(item => {
    const extra = item.extraResultList[0]
    if (extra && extra.type === 1) {
      adPosLists.push(item)
    }
    if (extra && extra.type === 2) {
      adPosFour.push(extra.adPos)
    }
  })
  if (adPosFour.length !== 0) {
    const adStr = adPosFour.join(',')
    return new Promise((resolve, reject) => {
      getAdLists(adStr).then(data => {
        adPosLists = adPosLists.concat(data)
        resolve(adPosLists)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

/**
 *
 * banner 2个 广告位
 */

export const getAdBannerLists = () => {
  let adPosBannerLists = []
  const data = adTypes8.length > 0 ? JSON.parse(adTypes8[0].extraResult) : []
  adPosBannerLists = data.filter(item => item.type === 1)
  if (adPosBannerLists.length > 1) {
    return Promise.resolve(adPosBannerLists)
  }
  let adPosBanner = []
  data.filter(item => {
    if (item.type === 2) {
      adPosBanner.push(item.adPos)
    }
  })
  if (adPosBanner.length !== 0) {
    const adStr = adPosBanner.join(',')
    return new Promise((resolve, reject) => {
      getAdLists(adStr).then(data => {
        adPosBannerLists = adPosBannerLists.concat(data)
        resolve(adPosBannerLists)
      }).catch(err => {
        reject(err)
      })
    })
  }
}


/**
 * 广告ID
 * @param {String} adPosList
 */
export const getAdLists = async(adPosList) => {
  let { data } = await post('/api/ad/adInfoList', {
    supportAdvertiser: 10,
    adPosList,
    pageSize: 1
  })
  // if (data) return data.adInfoList
  if (data) {
    const res = data.adInfoList
    let result = []
    res.map(item => {
      if (item.adList && item.adList.length !== 0) {
        result.push({
          ...item.adList[0].opAdInfo,
          adPos: item.adPos,
          adCodeId: item.adList[0].adCodeId,
          advertiserId: item.adList[0].advertiserId,
          adApiType: item.adList[0].adApiType
        })
      }
    })
    return result
  }
  return null
}

/**
 * 单书激励任务列表
 */
export const getSingleBookList = async() => {
  let { data } = await post('/task_api/task/getSingleBookList')
  if (data) return data
}

/**
 *
 * @param {Integer} readChapterCount 阅读章数
 * @param {Integer} chapterCoinRate 单章兑换金币汇率
 */
export const getServiceAreaTaskList = async(readChapterCount, chapterCoinRate) => {
  let { data } = await post('/task_api/task/getServiceAreaTaskList', {
    readChapterCount, chapterCoinRate
  })
  if (data) return data
}

/**
 * 用户手动触发完成接口
 * taskId 任务ID
 * readChapter 当天阅读章节数
 * historyReadChapter 历史阅读章节数
 */
export const getTaskFinish = async(taskId, readChapter, historyReadChapter) => {
  let { code } = await post('/task_api/task/finish', { taskId, readChapter, historyReadChapter })
  if (code) return code
}


export const getUserInfo = async() => {
  let { data } = await post('/api/user/userInfoQuickApp ')
  if (data && data.userInfo) return data.userInfo
}
