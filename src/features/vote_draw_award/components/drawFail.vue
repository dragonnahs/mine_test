<template lang="pug">
  div.draw-fail-rule
    div.draw-fail-rule-container
      div.draw-fail-rule-bg
      div.draw-fail-rule-close(@click='toggleShowFailPop')
      div.draw-fail-rule-title 抽奖次数不足
      div.draw-fail-rule-btn(@click='handleGoVotePage') 去投票
</template>
<script>
import { closeCurrentPage } from '@/utils/nativeToH5/index'
import { getCookie } from '@/utils/utils'
export default {
  data() {
    return {}
  },
  methods: {
    toggleShowFailPop() {
      this.$emit('toggleShowFailPop')
    },
    getVersion() {
      let versionStr = getCookie('version')
      let versionArr = versionStr ? versionStr.split('.') : []
      if (versionArr.length > 0) {
        return parseFloat(versionArr[1] + '.' + versionArr[2])
      }
    },
    handleGoVotePage() {
      this.toggleShowFailPop()
      if (this.getVersion() >= 1.42) {
        closeCurrentPage()
      } else {
        let url = `${window.location.origin}/BKH5-video_vote.html${window.location.search}`
        window.location.href = `breader://common/browser?url=${encodeURIComponent(url)}`
      }
    }
  }
}
</script>
<style lang="stylus">
.draw-fail-rule
  width 100%
  height 100vh
  position fixed
  left 0
  top 0
  background rgba(0, 0, 0, 0.6)
  z-index 30
  .draw-fail-rule-container
    box-sizing border-box
    width 305px
    height 175px
    background-color #ffffff
    border-radius 10px
    position relative
    left 50%
    top 50%
    transform translate(-50%, -50%)
    box-sizing border-box
    padding 48px 27px 0
    .draw-fail-rule-bg
      width 118px
      height 82px
      background url('../../../assets/vote_draw_award/fail_pop_bg.png') no-repeat center/100%
      position absolute
      left 50%
      top 0
      transform translate(-50%, -33px)
    .draw-fail-rule-close
      width 15px
      height 15px
      background url('../../../assets/vote_draw_award/fail_pop_close.png') no-repeat center/100%
      position absolute
      top 10px
      right 10px
    .draw-fail-rule-title
      color #333333
      font-size 16px
      font-weight 500
      text-align center
      margin-top 10px
    .draw-fail-rule-btn
      width 234px
      height 42px
      border-radius 42px
      line-height 42px
      text-align center
      background  linear-gradient(180deg,rgba(159,148,255,1) 0%,rgba(108,93,255,1) 100%)
      color #ffffff
      font-size 15px
      font-weight 500
      margin 27px auto 0
      box-sizing border-box
      padding-top 2px
</style>