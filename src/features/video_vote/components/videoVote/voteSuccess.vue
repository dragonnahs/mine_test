<template lang="pug">
  .vote-success
    .vote-success-container
      .vote-success-close(@click='handleToggleShowVote')
      .vote-success-title 投票成功
      .vote-success-bg
      .vote-success-desc
        p 获得
          span {{rewardDrawCount}}次
          | 抽奖机会
        p 离华为手机又近了一步
      .vote-success-btn(@click='handleGoDrawPage') 立即抽奖
</template>
<script>
import { skipUrl } from '@/utils/nativeToH5/index'
export default {
  props: ['rewardDrawCount'],
  data() {
    return {}
  },
  methods: {
    handleToggleShowVote() {
      this.$emit('handleToggleShowVote')
    },
    handleGoDrawPage() {
      this.$emit('handleToggleShowVote')
      skipUrl({
        skipUrl: `${window.location.origin}/BKH5-vote_draw_award.html${window.location.search}`
      })
    }
  }
}
</script>
<style lang="stylus">
.vote-success
  width 100%
  height 100vh
  position fixed
  left 0
  top 0
  background rgba(0, 0, 0, 0.6)
  z-index 30
  .vote-success-container
    box-sizing border-box
    width 305px
    height 256px
    background-color #ffffff
    border-radius 10px
    position relative
    left 50%
    top 50%
    transform translate(-50%, -50%)
    box-sizing border-box
    .vote-success-close
      width 15px
      height 15px
      background url('../../../../assets/video_vote/close.png') no-repeat center/100%
      position absolute
      top 10px
      right 10px
    .vote-success-title
      color #333333
      font-size 18px
      padding-top 20px
      font-weight 500
      text-align center
    .vote-success-bg
      width 69px
      height 62px
      background url('../../../../assets/video_vote/vote_success.png') no-repeat center/100%
      margin 14px auto
    .vote-success-desc
      font-size 15px
      color #333333
      line-height 27px
      text-align center
      p
        span
          color #FF5A00
          font-size 20px
    .vote-success-btn
      width 234px
      height 42px
      border-radius 42px
      line-height 42px
      text-align center
      background  linear-gradient(180deg,rgba(159,148,255,1) 0%,rgba(108,93,255,1) 100%)
      color #ffffff
      font-size 15px
      font-weight 500
      margin 10px auto 0
      box-sizing border-box
      padding-top 2px
</style>