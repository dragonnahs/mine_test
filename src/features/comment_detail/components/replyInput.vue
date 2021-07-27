<template lang="pug">
  div.reply-input
      input(v-model='replyContent' @keyup.13='handleReply' ref='input' @blur='handleBlur')
      div.reply-input-btn(@click='handleReply') 发送
      div.input-tip(
        v-show='replyContent.trim().length === 0'
        @click.stop='$refs.input.focus()') 回复评论...
</template>
<script>
import bus from '../bus.js'
import { judgeIsLogined, skipLoginPage, toast } from '@/utils/nativeToH5/index'
export default {
  data() {
    return {
      replyContent: '',
      replyInfo: {}
    }
  },
  mounted() {
    bus.$on('getReplyFoucs', (replyInfo) => {
      console.log(replyInfo)
      if (replyInfo.name) {
        this.replyInfo = replyInfo
        this.replyContent = `@${replyInfo.name}:`
      }
      this.$refs.input.focus()
    })
    bus.$on('replyInputBlur', () => {
      this.$refs.input.blur()
    })
    window.isLoginedReplyInput = (isLogined) => {
      if (isLogined) {
        if (!this.replyContent) {
          toast({
            content: '发言不能为空'
          })
          return
        }
        this.$emit('publishReply', this.replyContent.replace(`@${this.replyInfo.name}:`, ''))
        this.replyContent = ''
        this.$refs.input.blur()
      } else {
        skipLoginPage()
      }
    }
  },
  methods: {
    handleReply() {
      judgeIsLogined({
        callback: 'isLoginedReplyInput'
      })
    },
    handleBlur() {
      if (this.$parent.replyInputFlag) {
        this.$parent.replyInputFlag = false
        // this.replyContent = ''
      }
    },
    handleClickBlurOut() {
      this.$refs.input.blur()
    }
  }
}
</script>
<style lang="stylus" scoped>
.reply-input
    position fixed
    left 0
    bottom 0
    border-top 1px solid #EEEEEE
    width 100%
    height 48px
    box-sizing border-box
    padding 0px 20px
    background-color #ffffff
    z-index 20
    display flex
    align-items center
    input
      outline none
      appearance none
      border-radius 0
      width 259px
      height 32px
      box-sizing border-box
      border none
      background-color #EEEEEE
      border-radius 4px
      font-size 14px
      padding-left 10px
    .reply-input-btn
      width 66px
      height 32px
      line-height 32px
      text-align center
      background #FF5A00
      border-radius 4px
      color #ffffff
      font-size 16px
      display inline-block
      margin-left 10px
    .input-tip
      color #999999
      font-size 14px
      position absolute
      left 30px
      top 8px
      padding-left 20px
      height 32px
      line-height 34px
      &:before
        content ''
        position absolute
        width 14px
        height 20px
        left 0
        top 4px
        background url('../../../assets/community/input_tip_icon.png') no-repeat left center/100% 100%
</style>