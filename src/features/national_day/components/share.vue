<template lang="pug">
.share-pop(@click='toggleShow')
  .share-box(@click.stop)
    .title 分享到
    .btn-box
      .wx-icon(@click='shareClick(1)')
      .wechat-icon(@click='shareClick(2)')
    .cancel(@click='toggleShow') 取消
</template>
<script>
export default {
  data() {
    return {}
  },
  methods: {
    shareClick(target) {
      this.$parent.parentShareFun && this.$parent.parentShareFun(target)
    },
    toggleShow() {
      this.$parent.handleShare && this.$parent.handleShare()
    }
  }
}
</script>
<style lang="stylus">
.share-pop
  width 100%
  height 100vh
  position fixed
  left 0
  top 0
  background rgba(0, 0, 0, 0.51)
  z-index 99
  .share-box
    width 375px
    height 220px
    position absolute
    left 0
    bottom 0
    background rgba(245, 245, 245, 1)
    border-radius 27px 27px 0 0
    .title
      font-size 14px
      color rgba(0, 0, 0, 0.49)
      padding-top 20px
      text-align center
    .btn-box
      display flex
      padding 0 86px
      align-items center
      justify-content space-between
      margin-top 20px
      border-bottom 1px solid rgba(236, 236, 236, 1)
      padding-bottom 20px
      .wx-icon
        width 59px
        height 59px
        border-radius 50%
        background url('../../../assets/national_day/wx_icon.png') no-repeat center/contain
      .wechat-icon
        width 59px
        height 59px
        border-radius 50%
        background url('../../../assets/national_day/wechat_icon.png') no-repeat center/contain
    .cancel
      padding-top 22px
      font-size 16px
      text-align center
</style>