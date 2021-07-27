import { post } from '@/config/axios.config'


/**
 * 获取转盘奖品列表
 */

export const getPrizeListFetch = (activityId) => {
  return post('/activity_api/fragmentPrize/getLotteryDrawList', {
    activityId
  })
}

/**
 * 抽奖
 * type： 抽奖类型1免费抽奖， 2抽奖一次，3抽奖多次
 */

export const drawAwardFetch = (type) => {
  return post('/activity_api/fragmentPrize/lotteryDraw', {
    type
  })
}