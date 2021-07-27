import { post } from '@/config/axios.config'


/**
 * 获取视频排行榜信息
 * @param {*} activityId 活动id
 * @param {*} pageNum 页数
 * @param {*} pageSize 每页条数
 */
export const getRankList = (activityId, pageNum = 1, pageSize = 10) => {
  return post('/activity_api/rank/list', {
    activityId,
    pageNum,
    pageSize
  })
}

/**
 * 获取当前用户拥有的票数
 */
export const getVoteCounts = () => {
  return post('/activity_api/rank/vote/count', {
    rewardType: 8
  })
}

/**
 * 获取任务列表
 */
export const getTaskList = () => {
  return post('/task_api/task/list', {
    moduleType: 3
  })
}

/**
 * 完成任务领取奖励(在这个项目中这个接口只针对每日支持票的任务领取)
 * @param {*} taskId 任务id
 */
export const handelFinishTask = (taskId) => {
  return post('/task_api/task/finish', {
    taskId
  })
}

/**
 * 领取任务奖励(这个接口针对其他的任务奖励领取)
 * @param {*} taskId 任务id
 */
export const getRawardTask = (taskId) => {
  return post('/task_api/task/reward', {
    taskId
  })
}

/**
 * 投票
 * @param {*} activityId 活动id
 * @param {*} id 视频id
 * @param {*} count 投票数
 */
export const handleRankVote = (activityId, id, count) => {
  return post('/activity_api/rank/vote', {
    activityId,
    id,
    count
  })
}