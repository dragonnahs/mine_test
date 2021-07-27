<template lang="pug">
  .winning-pop
    .winning-pop-container
      .winning-pop-title 恭喜抽中
      .winning-pop-icon
        img(src='../../../assets/vote_draw_award/draw_item_3.png')
      .winning-pop-text {{awardInfo.title}}
      .winning-pop-handle
        .winning-pop-left(@click='handleGoVotePage')
          img(src='../../../assets/vote_draw_award/winning_pop_left_btn.png')
        .winning-pop-right(@click='handleContinueDraw')
          img(src='../../../assets/vote_draw_award/winning_pop_right_btn.png')
      .winning-pop-close(@click='toggleShowSuccessPop')
</template>
<script>
import { closeCurrentPage } from '@/utils/nativeToH5/index'
import { getCookie } from '@/utils/utils'
export default {
  props: ['awardInfo'],
  data() {
    return {}
  },
  methods: {
    handleContinueDraw() {
      this.toggleShowSuccessPop()
      this.$parent.drawAwardButtonMethod()
    },
    toggleShowSuccessPop() {
      this.$emit('toggleShowSuccessPop')
    },
    getVersion() {
      let versionStr = getCookie('version')
      let versionArr = versionStr ? versionStr.split('.') : []
      if (versionArr.length > 0) {
        return parseFloat(versionArr[1] + '.' + versionArr[2])
      }
    },
    handleGoVotePage() {
      this.toggleShowSuccessPop()
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
.winning-pop
  width 100%
  height 100vh
  position fixed
  left 0
  top 0
  background rgba(0, 0, 0, 0.6)
  z-index 30
  .winning-pop-container
    box-sizing border-box
    width 305px
    height 316px
    background-color #ffffff
    position relative
    left 50%
    top 50%
    transform translate(-50%, -50%)
    box-sizing border-box
    background url('../../../assets/vote_draw_award/winnng_pop_bg.png') no-repeat top center/100% 100%
    text-align center
    .winning-pop-title
      font-size 20px
      font-weight 500
      color rgba(51, 51, 51, 1)
      padding-top 63px
    .winning-pop-icon
      width 57px
      height 58px
      margin-top 15px
      font-size 0
      margin 0 auto
      img
        width 100%
        height 100%
    .winning-pop-text
      font-size 16px
      color rgba(51, 51, 51, 1)
      margin-top 4px
    .winning-pop-handle
      display flex
      margin-top 64px
      align-items center
      font-size 0
      .winning-pop-left
        width 128px
        height 42px
        // background url('../../../assets/vote_draw_award/winning_pop_left_btn.png') no-repeat center/100%
        // background-size contain
        margin-left 17px
        margin-right 13px
        box-sizing border-box
        img
          width 100%
          height 100%
      .winning-pop-right
        width 128px
        height 42px
        // background url('../../../assets/vote_draw_award/winning_pop_right_btn.png') no-repeat center/100%
        // background-size contain
        box-sizing border-box
        img
          width 100%
          height 100%
    .winning-pop-close
      width 28px
      height 28px
      background url('../../../assets/vote_draw_award/winning_pop_close.png') no-repeat center/100%
      position absolute
      left 50%
      bottom -38px
      transform translateX(-50%)
</style>