<template lang="pug">
  div.video-rule
    div.video-rule-container
      div.video-rule-bg
      div.video-rule-close(@click='handleToggleShowRule')
      div.video-rule-title 活动规则
      div.vidoe-rule-content
        p 1、每成功进行一次投票可进行抽奖一次
        p 2、金币为虚拟商品概不退款
        p 3、本活动结束后7个工作日内，发放所有实物奖励
        p 4、活动中有任何疑问，可咨询客服服务
        p 5、本活动拒绝一切作弊，一旦发现取消活动资格
        p 6、本活动唯一解释权归官方平台所有
      div.video-rule-btn(@click='handleToggleShowRule') 我知道了
</template>
<script>
export default {
  data() {
    return {}
  },
  methods: {
    handleToggleShowRule() {
      this.$emit('handleToggleShowRule')
    }
  }
}
</script>
<style lang="stylus">
.video-rule
  width 100%
  height 100vh
  position fixed
  left 0
  top 0
  background rgba(0, 0, 0, 0.6)
  z-index 30
  .video-rule-container
    box-sizing border-box
    width 305px
    height 360px
    background-color #ffffff
    border-radius 10px
    position relative
    left 50%
    top 50%
    transform translate(-50%, -50%)
    box-sizing border-box
    padding 48px 27px 0
    .video-rule-bg
      width 118px
      height 82px
      background url('../../../assets/video_vote/rule_bg.png') no-repeat center/100%
      position absolute
      left 50%
      top 0
      transform translate(-50%, -33px)
    .video-rule-close
      width 15px
      height 15px
      background url('../../../assets/video_vote/close.png') no-repeat center/100%
      position absolute
      top 10px
      right 10px
    .video-rule-title
      color #333333
      font-size 16px
      font-weight 500
    .vidoe-rule-content
      font-size 14px
      color #666666
      margin-top 12px
      p
        text-align left
        line-height 20px
        margin-bottom 8px
    .video-rule-btn
      width 234px
      height 42px
      border-radius 42px
      line-height 42px
      text-align center
      background  linear-gradient(180deg,rgba(159,148,255,1) 0%,rgba(108,93,255,1) 100%)
      color #ffffff
      font-size 15px
      font-weight 500
      margin 15px auto 0
      box-sizing border-box
      padding-top 2px
</style>