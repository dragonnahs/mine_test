<template lang="pug">
div
  .video-vote-scroll(:class='{"is-disabled-scroll": isShowVote}')
    div.video-vote-bg
      div.video-vote-rule-btn(@click='handleToggleShowRule') 活动规则
      div.video-count-time
        | 倒计时：
        span.video-count-time-item {{countTime.day || 0}}
        | 天
        span.video-count-time-item {{countTime.hour || '00'}}
        | :
        span.video-count-time-item {{countTime.min || '00'}}
        | :
        span.video-count-time-item {{countTime.sec || '00'}}
      div.video-tip
      div.video-box(ref='videoBox')
        video-item(v-for='(item) in rankList'
        v-if='item.id'
        :key='item.id'
        :playerList='playerList'
        :rankInfo='item'
        ref='videoVoteItem'
        @handleToggleShowVote='handleToggleShowVote')
  div.video-vote-number(:class='{"video-is-show": !isShowAwardBtn}')
    span.video-vote-number-box
      | 可投票数 <br>
      | {{myVoteCounts||0}}票
  div.video-vote-draw(@click='handeGoDrawPage'
  :class='{"is-show-award-btn": !isShowAwardBtn}')
  video-rule(v-if='isShowRule'
  @handleToggleShowRule='handleToggleShowRule')
  video-vote(v-if='isShowVote'
  @handleToggleShowVote='handleToggleShowVote'
  :myVoteCounts='myVoteCounts'
  :voteTargetInfo='voteTargetInfo')
</template>

<script>
import bus from './bus'
import VideoItem from './components/videoItem'
import VideoRule from './components/videoRule'
import VideoVote from './components/videoVote/index'

import { getRankList, getVoteCounts } from './request'
import { getQueryString } from '@/utils/url'
import { countDown, debounce } from '@/utils/utils.js'
import { skipUrl, toast } from '@/utils/nativeToH5/index'
import { mBuryPoint } from '@/utils/buryPoint'

export default {
  components: {
    VideoItem,
    VideoRule,
    VideoVote,
  },
  data() {
    return {
      isHasMore: true,
      playerList: [],
      currentPlayer: null,
      rankList: [],
      isShowRule: false,
      isShowVote: false,
      countTime: {},
      pageNum: 1,
      myVoteCounts: 0,
      voteTargetInfo: {},
      countTimeEnd: 0,
      isShowAwardBtn: true,
    }
  },
  created() {
    this.getAllPlayerList()
    this.init()
    mBuryPoint('7', {
      enterType: 1
    })
    this.scrollEvent()
    window.ibreader && window.ibreader.prohibitPull()
  },
  methods: {
    init() {
      this.getRankList()
      this.getVoteCounts()
    },
    scrollEvent() {
      window.addEventListener('scroll', debounce(() => {
        this.scrollDealHeight()
        this.dealVideoIsPlay()
      }, 100))
      window.addEventListener('scroll', () => {
        this.isShowAwardBtn = false
      })
    },
    scrollDealHeight() {
      var lineHeight=this.$refs.videoBox.clientHeight
      var windowHeight=document.body.clientHeight || document.documentElement.clientHeight
      var scrollTop=document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
      if (scrollTop + windowHeight >= lineHeight) {
        this.getRankList()
      }
    },
    dealVideoIsPlay() {
      this.isShowAwardBtn = true
      this.$refs.videoVoteItem.map((item) => {
        let ele = item.$el
        const eleOffsetTop = ele.offsetTop
        const eleClientHeight = ele.clientHeight
        const docClientHeight = document.body.clientHeight || document.documentElement.clientHeight
        const scrollTop=document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
        if (Math.abs(scrollTop) > eleOffsetTop || (eleOffsetTop + eleClientHeight - docClientHeight) > Math.abs(scrollTop)) {
          item.pauseChildVideo && item.pauseChildVideo(item)
        }
      })
    },
    async getVoteCounts() {
      let res = await getVoteCounts()
      if (res.code === 100) {
        this.myVoteCounts = res.data.count || 0
      }
    },
    async getRankList() {
      this.isHasMore = false
      let res = await getRankList(getQueryString('activityId'), this.pageNum)
      if (res.code === 100) {
        if (this.countTimeEnd === 0) {
          this.countTimeEnd = res.data.endTime - new Date().getTime()
          this.countDown(this.countTimeEnd)
        }
        if (res.data.rankList && res.data.rankList.length > 0) {
          this.isHasMore = true
          this.pageNum += 1
          this.rankList = this.rankList.concat(res.data.rankList)
        } else {
          this.isHasMore = false
          return
        }
      }
    },
    getAllPlayerList() {
      // 获取视频播放列表
      bus.$on('currentPlayer', (value) => {
        value && this.playerList.push(value)
      })
    },
    countDown(time) {
      countDown(time, (value) => {
        this.countTime = value
      })
    },
    handleToggleShowRule() {
      if (this.isShowRule) {
        document.body.className = document.body.className.replace('is-disabled', '')
      } else {
        document.body.className = document.body.className + ' is-disabled'
      }
      this.isShowRule = !this.isShowRule
    },
    handleToggleShowVote(target) {
      if (this.countTime.day === undefined || (this.countTime.day == 0 && this.countTime.hour == 0 && this.countTime.min == 0 && this.countTime.sec == 0)) {
        toast({
          content: '活动已结束，暂停投票'
        })
        return
      }
      if (target) {
        this.voteTargetInfo = target
      }
      if (this.isShowVote) {
        document.body.className = document.body.className.replace('is-disabled', '')
      } else {
        document.body.className = document.body.className + ' is-disabled'
      }
      this.isShowVote = !this.isShowVote
    },
    handeGoDrawPage() {
      mBuryPoint('7', {
        clickType: 3
      })
      if (this.countTime.day === undefined || (this.countTime.day == 0 && this.countTime.hour == 0 && this.countTime.min == 0 && this.countTime.sec == 0)) {
        toast({
          content: '活动已结束，暂停抽奖'
        })
        return
      }
      skipUrl({
        skipUrl: `${window.location.origin}/BKH5-vote_draw_award.html${window.location.search}`
      })
    },
    dealRankListAfterVote() {
      this.playerList = []
      this.rankList = []
      this.pageNum = 1
      this.getRankList()
      this.getVoteCounts()
    }
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../styles/index.styl';
@import './index.styl';
body.is-disabled{
  touch-action none !important
  overflow hidden
}
</style>