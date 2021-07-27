<template lang="pug">
.content__video
  .video__title 视频「看」好书
  .video__book(v-for="item in videolists")
    .video__book__top(@click="clickVideo(item)")
      p {{ item.title }}
      img.video__img(:src='item.cover.horizontalCoverUrl || imgDefault')
      img.play_icon(src="@/assets/bookslast/play_icon@2x.png")
    .novel__content(@click="gotoRead(item)")
      img.novel__img(:src="item.book.cover")
      .novel__center
        h4 {{ item.book.bookName }}
        .novel__desc
          span {{ item.book.category }}
          span(v-if="item.book.source") {{ item.book.source }}分
      .novel__button
        img(src="@/assets/bookslast/bookslast_icon@2x.png")
        p 去阅读
  footer(@click="gotoShelf()")
    p 没有视频啦，去书城找好书吧>>
</template>
<script>
export default {
  props: ['videolists'],
  data() {
    return {
      imgDefault: require('../../../assets/bookslast/video_default.png')
    }
  },
  mounted() {},
  methods: {
    clickVideo(item) {
      this.$emit('clickVideo', item)
    },
    gotoRead(item) {
      this.$emit('gotoRead', item)
    },
    gotoShelf() {
      this.$emit('gotoShelf')
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '../index.styl'
.content__video
  height auto
  padding 0.43rem 0.43rem 0 0.51rem
  background #ffffff
.video__title
  height 0.43rem
  font-size 0.43rem
  font-family PingFangSC-Medium, PingFang SC
  font-weight bold
  color #000000
  line-height 0.43rem
  padding-bottom 0.43rem
.video__book
  padding-bottom 0.45rem
.video__book .video__book__top
  position relative
  .play_icon
    width 1.07rem
    height 1.07rem
    position absolute
    top 1.89rem
    left 4rem
.video__book .video__book__top p
  position absolute
  top 0
  left -1px
  width 8.59rem
  height 1.1rem
  font-size 0.4rem
  background linear-gradient(180deg , rgba(0,0,0,0.81), rgba(0,0,0,0.04))
  border-radius 0.28rem
  font-family PingFangSC-Regular, PingFang SC
  font-weight 400
  color #ffffff
  line-height 0.57rem
  padding 0.19rem 0.2rem 0 0.32rem
.video__book .video__book__top img
  width 9.07rem
  height 5.1rem
  border-radius 0.28rem
.novel__content
  height 1.42rem
  display flex
  box-sizing border-box
  flex-direction row
  align-items center
.novel__content .novel__img
  width 1.07rem
  height 1.42rem
  background #999999
  margin-right 0.27rem
.novel__content .novel__center
  height inherit
  display flex
  flex-direction column
  justify-content space-between
  margin-right 0.88rem
.novel__content .novel__center h4
  width 4.88rem
  height 0.37rem
  font-size 0.37rem
  font-family PingFangSC-Medium, PingFang SC
  font-weight bold
  color #000000
  line-height 0.37rem
  text-overflow ellipsis
  white-space nowrap
  overflow hidden
.novel__content .novel__center .novel__desc
  /* width 1.28rem */
  height 0.37rem
  font-size 0.32rem
  font-family PingFangSC-Regular, PingFang SC
  font-weight 400
  color #999999
  line-height 0.37rem
  display flex
  flex-direction row
  justify-content space-between
.novel__content .novel__center .novel__desc span:last-child
  color #ff5a00
.novel__content .novel__button
  display flex
  flex-direction row
.novel__content .novel__button img
  width 0.59rem
  height 0.59rem
  display inline-block
.novel__content .novel__button p
  padding-left 0.16rem
  height 0.59rem
  font-size 0.37rem
  font-family PingFangSC-Medium, PingFang SC
  font-weight bold
  color #ff5a00
  line-height 0.59rem
footer
  width 100%
  padding 0.11rem 0 0.59rem
  /* margin 0 auto */
  background #fff
footer p
  height 0.43rem
  font-size 0.32rem
  font-family PingFangSC-Medium, PingFang SC
  font-weight bold
  color #ff5a00
  line-height 0.43rem
  text-align center
</style>