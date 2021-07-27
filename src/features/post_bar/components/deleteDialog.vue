<template lang="pug">
  .delete-dialog
    div.delete-dialog-box
      div.delete-dialog-title 是否确认删除
      div.delete-dialog-handle
        div.delete-dialog-cancle(@click='handleCancle') 取消
        div.delete-dialog-sure(@click='$emit("deleteComment")') 确定
</template>
<script>
export default {
  data() {
    return {}
  },
  methods: {
    handleCancle() {
      this.$parent.isShowDeleteFlag = false
      this.$parent.needDeleteCommentId = ''
    }
  }
}
</script>

<style lang="stylus">
.delete-dialog
  position fixed
  width 100%
  height 100%
  left 0
  top 0
  background rgba(0, 0, 0, 0.6)
  z-index 99
  .delete-dialog-box
    width 270px
    height 104px
    border-radius 12px
    background #ffffff
    position relative
    top 50%
    left 50%
    transform translate(-50%, -50%)
    .delete-dialog-title
      height 60px
      line-height 60px
      text-align center
      color #333333
      font-size 17px
      box-sizing border-box
      border-bottom 1px solid #DDDDDD
    .delete-dialog-handle
      display flex
      align-items center
      font-size 16px
      color #333333
      height 44px
      div
        height 44px
        line-height 44px
        text-align center
        flex 1
      .delete-dialog-cancle
        border-right 1px solid #D8D8D8
        box-sizing border-box
</style>