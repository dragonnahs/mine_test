<template lang="pug">
#signRule
  .signRule__content
    p 1.自注册之日起第3天签到，且账户金币数不小于3000，且累计阅读小说50章，可立即提现0.3元；
    p 2.自注册之日起第7天签到，且账户金币数不小于7000，且累计阅读小说100章，可立即提现0.7元；
    p 3.活动期间，如发现有用户通过不正当手段参加活动而有碍其他用户公平参加本次活动或有违反
      | 活动目的之行为，活动举办方有权取消该用户获
      | 奖资格或取消、并收回所获金币、现金或相关奖
      | 品，如因其行为给本平台造成损失，同时应当承担赔偿责任。
    p.footer 最终解释权归本公司所有。
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {},
  mounted() {},
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../styles/index.styl';
body,html
  size(100%, 100%)
#signRule
  size(100%,100%)
  background #F7F7F7
  padding 16px 13px 13px
  box-sizing border-box
  .signRule__content
    size(100%,100%)
    background #ffffff
    border-radius 10px
    padding 22px 27px 20px 20px
    box-sizing border-box
    position relative
    p
      font-size 14px
      font-family PingFangSC-Regular, PingFang SC
      font-weight 400
      color #666666
      line-height 20px
      padding-bottom 10px
    p.footer
      absolute(bottom 0 left 0 right 0)
      text-align center
</style>
