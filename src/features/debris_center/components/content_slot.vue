<template lang="pug">
#contentslot
  .header_title
    .header_left
      h2.title(:style="{color: fontColor}") {{ title }}
      p.desc(v-if="desc" :style="{color: fontColor}") {{ desc }}
    .header_right(v-if="isShowRight" @click="goAwardCenter" :class="desc ? 'alignSelf' : ''")
      h3.title(:style="{color: fontColor}") {{ rightText }}
  .content(:style="styles")
    <slot></slot>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    desc: {
      type: String,
      default: ''
    },
    styles: {
      type: Object
    },
    imgUrl: {
      type: String,
      default: require('../../../assets/debris_center/open_icon@2x.png')
    },
    fontColor: {
      type: String,
      default: '#ffffff'
    },
    isShowRight: { // 控制右侧文案显示
      type: Boolean,
      default: false
    },
    rightText: {
      type: String,
      default: ''
    }
  },
  mounted() {},
  methods: {
    goAwardCenter() {
      this.$emit('goAwardCenter', this.rightText)
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '../../../styles/index.styl';
  #contentslot
    width 346px
    min-height 200px
    margin 0 auto
    background #FFFFFF
    box-sizing border-box
    margin-top 20px
    border-radius 10px
    box-shadow 0px 0px 8px 0px rgba(0, 0, 0, 0.09)
    padding-top 22px
    .header_title
      padding 0 15px
      box-sizing border-box
      min-height 46px
      width 346px
      display flex
      flex-direction row
      justify-content space-between
      align-items center
      .header_left
        display flex
        flex-direction column
        justify-content center
        align-items space-between
        h2.title
          height 22px
          font-size 18px
          font-family PingFangSC-Medium, PingFang SC
          font-weight bold
          line-height 22px
        p.desc
          height 17px
          font-size 12px
          font-family PingFangSC-Regular, PingFang SC
          font-weight 400
          line-height 17px
          padding-top 8px
      .header_right
        display flex
        flex-direction row
        justify-content center
        align-items center
        h3.title
          height 12px
          font-size 12px
          font-family PingFangSC-Regular, PingFang SC
          font-weight 400
          color #FFFFFF
          line-height 12px
        img.onOff
          size(26px 16px)
          display inline-block
    .content
      width 346px
      min-height 60px
      border-top 0
  .alignSelf
    align-self flex-start!important
    padding-top 5px!important
</style>
