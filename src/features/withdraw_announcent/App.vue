<template lang="pug">
#app
  .content
    h3 尊敬的必看用户：您好
    p 感谢您一直以来对“必看免费小说”的支持与喜爱，为提高用户使用感受并降低提现难度，平台综合考虑后，接受广大用户提出的建议，自2020年3月31日起，更改提现规则。
    h3 新规则为：【100元提现额度仅限使用一次】
    p.desc 此公告上线之日起，“100元提现额度”将只提供一次使用机会。同时，为保障老用户的权益，新规则上线之日起，每位老用户仍可享有一次“100元”提现机会。
    p.desc 老用户定义：2020年3月31日之前下载并注册“必看免费小说”的用户。
    p.desc 必看将不忘初心，致力于为用户提供最好的阅读体验。祝您阅读愉快～
    p.footer 本次行为最终解释权归本公司所有。
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
body, html
  size(100%, 100%)
#app
  width 100%
  height 100%
  padding 16px 13px 42px
  background #F7F7F7
  box-sizing border-box
  .content
    padding 20px 13px 20px 19px
    box-sizing border-box
    size(100% 100%)
    background #fff
    position relative
    border-radius 11px
    h3
      font-size 16px
      color #333333
      font-weight bold
    p
      font-size 13px
      color #666666
      padding 12px 0 7px
      text-indent 26px
    p.desc
      padding 0
    p.footer
      font-size 13px
      font-family PingFangSC-Regular,PingFang SC
      font-weight 400
      color rgba(153,153,153,1)
      text-align center
      text-indent 0
      absolute(bottom 10px left 0 right 0)
</style>
