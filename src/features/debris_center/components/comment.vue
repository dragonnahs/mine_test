<template lang="pug">
.comment_module(@click='goAwardCenter()')
  .comment_userInfo
    img.user_avator(:src='avatarUrl')
    .user_ID_time
      span.user_ID ID: {{ userId }}
      span.user_time {{ time }}
    .user_award {{awardName}}
  p.comment_desc
    | {{ awardDesc }}
  .comment_img
    .comment_award_img(v-for="item in awardImgs")
      img(:src='item')
</template>

<script>
export default {
  props: {
    avatarUrl: {
      type: String || null,
      default: ''
    },
    userId: {
      type: Number,
      required: true,
      default: '11'
    },
    time: {
      type: String,
      default: 0
    },
    awardName: {
      type: String,
      default: ''
    },
    awardDesc: {
      type: String,
      default: ''
    },
    awardImgs: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  mounted() {
  },
  methods: {
    goAwardCenter() {
      this.$emit('goAwardCenter', '查看更多')
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../../styles/index.styl';
.comment_module
  .comment_userInfo
    display flex
    flex-direction row
    align-items center
    .user_avator
      size(36px 36px)
      border 1px solid #FF9C3D
      border-radius 36px
    .user_ID_time
      display flex
      flex-direction column
      justify-content: space-around
      padding 0 20px 0 10px
      span.user_ID
        font-size 12px
        height 17px
        width 81px
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
        font-weight 500
        color #000000
        line-height 17px
      span.user_time
        height 14px
        font-size 10px
        font-family PingFangSC-Medium, PingFang SC
        font-weight 500
        color #999999
        line-height 14px
    .user_award
      font-size 12px
      font-family PingFangSC-Regular, PingFang SC
      font-weight 400
      max-width 106px
      color #F43939
      line-height 22px
      height 22px
      padding 0 13px 0 22px
      position relative
      &:before
        content ''
        absolute(top 1px left 0)
        background url('../../../assets/debris_center/gongxi@3x.png') no-repeat center center
        background-size cover
        size(16px 16px)
  .comment_desc
    margin 14px 0 10px
    width 310px
    min-height 55px
    background #FFF7EE
    border-radius 8px
    padding 7px 12px 8px 18px
    box-sizing border-box
    font-size: 14px
    font-family: PingFangSC-Medium, PingFang SC
    font-weight: 500
    color: #333333
    line-height: 20px
  .comment_img
    display flex
    flex-direction row
    justify-content space-between
    .comment_award_img
      size(94px 80px)
      border 1px solid #F2F2F2
      img
        width 100%
        height 100%
</style>