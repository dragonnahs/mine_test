<template lang="pug">
.extra__welfare
  .extra__title
    h3.title 额外福利
    p.desc 超过{{ showReadPercent }}%的用户都在阅读的大热书籍
  .extra_content
    .extra_content_item(v-for="(item, key) in singleBookLists" :key="key" @click="routerToRead(item, key)")
      img.img(:src="item.bookCoverUrl")
      span.btn
        span 立即阅读
      span.icon {{ item.classify }}
</template>
<script>
export default {
  props: ['singleBookLists', 'showReadPercent'],
  methods: {
    routerToRead(item, key) {
      this.$emit('routerToRead', item, key)
    }
  },
  mounted() {}
}
</script>
<style lang="stylus">
@import '../../../styles/index.styl';
.extra__welfare
  padding 0 20px
  box-sizing border-box
  margin 30px 0 0 0
  .extra__title
    display flex
    justify-content space-between
    flex-direction row
    h3.title
      height 22px
      font-size 16px
      font-family PingFangSC-Medium, PingFang SC
      font-weight bold
      color #000000
      line-height 22px
    p.desc
      height 20px
      font-size 14px
      font-family PingFangSC-Regular, PingFang SC
      font-weight 400
      color #999999
      line-height 20px
      padding 1px 0
  .extra_content
    margin-top 20px
    min-height 200px
    background #FFFFFF
    box-shadow 0px 0px 6px 0px rgba(223, 223, 223, 0.5)
    border-radius 10px
    display flex
    flex-direction row
    justify-content space-around
    .extra_content_item
      display flex
      flex-direction column
      justify-content center
      align-items center
      position relative
      .img
        size(90px, 120px)
        border-radius 4px
      .btn
        margin 10px auto 0
        display inline-block
        size(70px, 22px)
        background linear-gradient(235deg, #FFC87A 0%, #F43A3A 100%)
        border-radius 11px
        span
          clear both
          float left
          font-size 12px
          color #ffffff
          font-weight bold
          line-height 23px
          display inline-block
          width 100%
          text-align center
      .icon
        display inline-block
        size(62px 15px)
        font-size 12px
        color #ffffff
        line-height 12px
        padding 2px 0 1px 4px
        box-sizing border-box
        z-index 9998
        absolute(top 15px left 0)
        background url('../../../assets/welfare_task/extra_icon.png') no-repeat center center
        background-size 100% 100%
</style>