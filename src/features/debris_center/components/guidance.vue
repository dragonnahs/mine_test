<template lang="pug">
#person_guidance(@click.stop='nextStep()' @touchmove.stop.prevent)
  .first_step(v-if="step === '1'")
    span.title 我知道了
    span.desc
      | 参与抽奖赢
      em(:style="{color: '#FCA66B'}") 碎片
      img.img_icon(src="../../../assets/debris_center/step_icon.png")
    span.path
    span.gift
  .second_step(v-if="step === '2'")
    span.title 我知道了
    span.desc
      | 完成阅读任务可获得更多
      em 碎片
      img.img_icon(src="../../../assets/debris_center/step_icon.png")
    span.path
    span.gift(ref="stepSecond")
      .gift_content
        .header_title
          h2.second_title 今日阅读 30章
          p.second_desc 已通过阅读到账8枚碎片，再阅读2章，到账1枚
        ul.second_task_list
          li.second_single_task(v-for="(item, key) in taskInfoList" v-if="key < 2")
            p.second_task_name {{ item.name }}
            p.second_task_state 待领取
  .three_step(v-if="step === '3' && singleBookGuidance")
    span.title 我知道了
    span.desc
      | 阅读专享书籍获得更多
      em 碎片
      img.img_icon(src="../../../assets/debris_center/step_icon.png")
    span.path
    span.gift(ref="stepThree")
      .three_single_book
        img.single_book_cover(:src="singleBookGuidance.bookCoverUrl")
        div.single_book_desc
          span.single_book_title {{ singleBookGuidance.bookName }}
          span.single_book_info {{ singleBookGuidance.intro }}
          span.single_book_class {{ singleBookGuidance.classify }}
        span.single_book_btn 去阅读
</template>
<script>
import ContentSlot from './content_slot'
export default {
  props: ['taskInfoList', 'taskTitle', 'desc', 'singleBookGuidance'],
  components: {
    ContentSlot
  },
  data() {
    return {
      step: '1'
    }
  },
  methods: {
    nextStep() {
      if (this.step === '1') {
        this.step = '2'
        this.$nextTick(() => {
          const scrollHeight = this.$refs.stepSecond.offsetHeight
          this.$emit('scrollStep', '2', scrollHeight)
        })
        return
      } else if (this.step === '2') {
        if (!this.singleBookGuidance) {
          this.$emit('closeGuidance')
          return
        }
        this.step = '3'
        this.$nextTick(() => {
          const scrollHeight = this.$refs.stepThree.getBoundingClientRect().top
          this.$emit('scrollStep', '3', scrollHeight)
        })
        return
      }
      if (this.step === '3') {
        this.$emit('closeGuidance')
      }
    }
  },
  mounted() {}
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '../../../styles/index.styl';
.second_task_state, .single_book_btn
  width 66px
  line-height normal
  padding 5px 0
  box-sizing border-box
  background linear-gradient(235deg, #FFC87A 0%, #F43A3A 100%)
  border-radius 15px
  text-align center
  font-size 12px
  color #FFFFFF
  font-family PingFangSC-Regular, PingFang SC
#person_guidance
  position relative
  size(100%, 100%)
  background #000000
  background-color rgba(0,0,0,0.7)
  .first_step, .second_step, .three_step
    font-size 14px
    color #ffffff
    display flex
    flex-direction column
    justify-content center
    align-items flex-end
    absolute(bottom 20px right 9px)
    .title
      font-family PingFangSC-Medium, PingFang SC
      font-weight bold
      padding-bottom 15px
      align-self center
    .desc
      max-width 156px
      min-height 34px
      display inline-block
      align-items center
      padding 5px 13px
      box-sizing border-box
      box-shadow inset 0px 0px 11px 0px #FFFFFF
      border 1px solid #FFFFFF
      border-radius 10px
      margin-bottom 9px
      position relative
      text-align center
      &:after
        size(0,0)
        absolute(right 23px bottom -17px)
        content ''
        border-top 8px solid #ffffff
        border-right 8px solid transparent
        border-bottom 8px solid transparent
        border-left 8px solid transparent
      .img_icon
        size(14px 14px)
        padding 2px 0 0 3px
        box-sizing border-box
      em
        color #FCA66B
    .path
      size(42px 41px)
      display inline-block
      background url('../../../assets/debris_center/Path@3x.png') no-repeat center center
      background-size 100% 100%
      align-self center
      padding-bottom 5px
      position relative
      text-align center
      &:after
        content ''
        absolute(bottom -13px right -9px)
        size(30px 30px)
        background #FFCE87
        border-radius 50%
        opacity 0.56
        box-sizing border-box
        border 6px solid #F43A3A
        z-index 9998
    .gift
      size(98px 70px)
      display inline-block
      border-radius 35px
      background-image linear-gradient(235deg, rgba(255, 200, 122, 1), rgba(244, 58, 58, 1))
      position relative
      &:after
        content ''
        absolute(left 2px top 2px)
        size(94px, 66px)
        border-radius 35px
        background #ffffff
      &:before
        content ''
        absolute(left 7px top 0px)
        size(80px, 78px)
        border-radius 35px
        background url('../../../assets/debris_center/award_gift.png') no-repeat center center
        background-size 100% 100%
        z-index 9999
  .second_step, .three_step
    bottom 9px
    align-items center
    .gift
      width 9.45rem!important
      min-height 5.47rem!important
      box-sizing border-box
      &:after
        content ''
        border-radius 35px
        background transparent
      &:before
        content ''
        background none
      .gift_content
        width 9.32rem
        height 5.348rem
        background #ffffff
        border-radius 34px
        absolute(left 2px top 2px)
        padding 28px 16px 30px
        box-sizing border-box
        .header_title
          color #8D3000
          line-height 18px
          h2.second_title
            font-size 18px
            font-weight bold
            padding-bottom 12px
          p.second_desc
            font-weight normal
            font-size 14px
        .second_task_list
          color #8D3000
          height 203px
          overflow hidden
          .second_single_task
            display flex
            flex-direction row
            justify-content space-between
            padding 16px 0 18px
  .three_step
    bottom 83px
    .gift
      min-height 141px!important
      padding 2px
      .three_single_book
        width 9.315rem
        height 3.6286rem
        border-radius 0.89rem
        background #ffffff
        padding 24px 10px 24px 14px
        box-sizing border-box
        display flex
        flex-direction row
        justify-content space-between
        .single_book_cover
          display inline-block
          size(72px 95px)
          borde-radius 4px
        .single_book_btn
          align-self center
        .single_book_desc
          flex 1
          padding 0 16px 0 10px
          box-sizing border-box
          display flex
          flex-direction column
          justify-content flex-start
          position relative
          .single_book_title
            font-size 16px
            font-family PingFangSC-Medium, PingFang SC
            font-weight bold
            color #000000
            width 156px
            ellipsis(true)
          .single_book_info
            padding-top 10px
            width 100%
            font-size 14px
            font-family PingFangSC-Regular, PingFang SC
            color #999999
            overflow hidden
            text-overflow ellipsis
            display -webkit-box
            -webkit-line-clamp 2
            -webkit-box-orient vertical
          .single_book_class
            font-size 12px
            transform scale(0.8)
            font-family PingFangSC-Regular, PingFang SC
            color #999999
            absolute(left 6px bottom 0)
</style>
