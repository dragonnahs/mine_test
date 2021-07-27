<template lang="pug">
.rule
  .rule-box
    .close(@click='$emit("toggleShowRule")')
    .rule-title 活动规则
    .rule-content
      div 1、本活动结束后7个工作日内，发放所有实物奖励
      div 2、活动优惠所有福利，仅在活动期间内充值有效
      div 3、会员为虚拟产品概不支持退款
      div 4、活动中有任何疑问，可咨询客服服务
      div 5、本活动拒绝一切作弊，一旦发现取消活动资格
      div 6、本活动唯一解释权归官方平台所有
</template>
<script>
export default {
  data() {
    return {}
  }
}
</script>

<style lang="stylus">
.rule
  width 100%
  height 100%
  position fixed
  left 0
  top 0
  background rgba(0, 0, 0, 0.6)
  font-size 14px
  z-index 22
  .rule-box
    width 290px
    height 346px
    background url('../../../assets/active_618/rule_bg.png') no-repeat center center/100% 100%
    position relative
    left 50%
    top 50%
    transform translate(-50%, -50%)
    box-sizing border-box
    overflow hidden
    .close
      width 22px
      height 22px
      position absolute
      top 20px
      right 20px
      background url('../../../assets/active_618/rule_close.png') no-repeat center center/100% 100%
    .rule-title
      font-size 16px
      font-weight bold
      color #333333
      text-align center
      margin-top 26px
    .rule-content
      box-sizing border-box
      font-size 14px
      padding 0 15px 0 21px
      color #666666
      margin-top 20px
      line-height 24px
</style>