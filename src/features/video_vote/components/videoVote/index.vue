<template lang="pug">
  .vote-pop(v-if='!isShowSuccess'
  @click='handleToggleShowVote')
    div.vote-pop-container(v-show='showFlag === 1'
    @click.stop)
      div.vote-pop-header 支持票
      div.vote-pop-close(@click='handleToggleShowVote')
      div.vote-pop-content
        div.vote-pop-toggle-num
          div.vote-pop-delete(
            @click='toggleVoteCounts(-1)'
            :class="{'vote-pop-disabled': voteCount === 0}")
          | {{voteCount}}张
          div.vote-pop-add(@click='toggleVoteCounts(1)'
          :class="{'vote-pop-disabled': voteCount === maxVoteCount}")
        div.vote-pop-toggle-tip 当日有效
        div.vote-pop-bottom
          | 拥有{{maxVoteCount}}张支持票
          span.vote-pop-get-votes-tip(@click='getTaskList') 点击获得更多支持票
          span.vote-pop-vote-btn(@click='handleVoteNow') 立即投票
    div.vote-pop-container(v-show='showFlag === 2'
    @click.stop)
      div.vote-pop-header 支持票
      div.vote-pop-close(@click='handleToggleShowVote')
      div.vote-pop-content
        div.vote-pop-no-tip 您暂无支持票
        div.vote-pop-no-btn(@click='getTaskList') 立即领取
        div.vote-pop-toggle-tip 当日有效
        div.vote-pop-bottom
          | 拥有0张支持票
    div.vote-pop-container.is-task-list(v-show='showFlag === 3'
    @click.stop)
      div.vote-pop-header 做任务得支持票
      div.vote-pop-close(@click='handleToggleShowVote')
      div.vote-pop-content
        div.vote-pop-task-item(v-for='item in taskList'
        :key='item.id')
          div.vote-task-item-left
            div.vote-task-item-title {{item.name}}
            div.vote-task-item-desc 每天可领取{{item.rewardNum}}张
              <span v-if='item.id === 66'>,已完成{{item.finishTimes}}/{{item.maxLimit}}</span>
              <span v-if='item.id === 69'>,已完成{{item.finishTimes}}/{{item.maxLimit}}</span>

          template(v-if='item.id === 65')
            div.vote-task-item-btn(
              :class="{'already-get-award': true}"
              v-if='item.isFinish === 1') 已完成
            div.vote-task-item-btn(
              :class="{'already-get-award': false}"
              @click='handleClickItem(item)'
              v-else) {{item.buttonHint}}
          template(v-else)
            div.vote-task-item-btn(
              :class="{'already-get-award': item.id !== 67}"
              v-if='item.isFinish === 0'
              @click='handleUnfinishBtn(item.id)') {{item.buttonHint}}
            div.vote-task-item-btn(
              :class="{'already-get-award': false}"
              v-else-if='item.isFinish === 1 && item.rewardStatus === 1'
              @click='handleClickItem(item)') 立即领取
            div.vote-task-item-btn(
              :class="{'already-get-award': true}"
              v-else) 已完成
  vote-success(v-else
  @handleToggleShowVote='handleToggleShowVote'
  :rewardDrawCount='voteCount')
</template>
<script>
import VoteSuccess from './voteSuccess'
import { toast } from '@/utils/nativeToH5/index'

import { getQueryString } from '@/utils/url'
import { getTaskList, handelFinishTask, handleRankVote, getRawardTask } from '../../request'
import { mBuryPoint } from '@/utils/buryPoint'
export default {
  components: {
    VoteSuccess
  },
  props: ['myVoteCounts', 'voteTargetInfo'],
  data() {
    return {
      showFlag: 1,
      taskList: [],
      isShowSuccess: false,
      voteCount: 0, // 投递的票数
      maxVoteCount: 0, // 拥有的票数,
      isRechargeReload: false
    }
  },
  created() {
    window.showPageReload = this.showPageReload
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.maxVoteCount = this.myVoteCounts || 0
      this.voteCount = this.maxVoteCount
      this.setShowNum(this.maxVoteCount === 0 ? 2 : 1)
    },
    handleClickItem(target) {
      this.handelFinishTask(target.id)
    },
    async handelFinishTask(taskId) {
      mBuryPoint('7', {
        clickType: 1,
        taskId
      })
      let res
      if (taskId === 66 || taskId === 67) {
        res = await getRawardTask(taskId)
      } else {
        res = await handelFinishTask(taskId)
      }
      if (res.code === 100) {
        toast({
          content: '领取成功'
        })
        this.getTaskList()
        this.$parent.getVoteCounts()
      } else {
        toast({
          content: '领取失败'
        })
      }
    },
    async getTaskList() {
      let res = await getTaskList()
      this.setShowNum(3)
      if (res.code === 100) {
        this.taskList = res.data
      }
    },
    toggleVoteCounts(target) {
      if (target < 0 && this.voteCount > 0) {
        this.voteCount -= 1
      }
      if (target > 0 && this.voteCount < this.maxVoteCount) {
        this.voteCount += 1
      }
    },
    async handleVoteNow() {
      if (this.voteCount === 0) {
        return
      }
      let res = await handleRankVote(getQueryString('activityId'), this.voteTargetInfo.id, this.voteCount)
      if (res.code === 100) {
        this.isShowSuccess = true
        this.$parent.dealRankListAfterVote()
      } else {
        toast({
          content: res.msg || '网络不给力，请重试!'
        })
      }
    },
    handleToggleShowVote() {
      this.$emit('handleToggleShowVote')
    },
    setShowNum(target) {
      if (target === 3) {
        mBuryPoint('7', {
          enterType: 3
        })
      }
      this.showFlag = target
    },
    handleUnfinishBtn(taskId) {
      if (taskId === 67) {
        this.isRechargeReload = true
        window.location = 'breader://common/recharge'
      }
    },
    showPageReload() {
      if (this.isRechargeReload) {
        this.isRechargeReload = false
        this.getTaskList()
      }
    }
  },
  watch: {
    maxVoteCount() {
      this.setShowNum(this.maxVoteCount === 0 ? 2 : 1)
    }
  }
}
</script>
<style lang="stylus">
@import './index.styl'
</style>