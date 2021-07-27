<template lang="pug">
.day__welfare
  .welfare__title
    .welfare__title__left
      .title__left__top
        img(src="@/assets/welfare_task/day_welfare_title.png")
        span.has__read__chapter {{ readChapterCount }}章
      .title__left__bottom
        | 已经通过阅读到账{{ receivedCoin }}金币
    .welfare__title__right(v-if="Number(totalCoin) !== 0")
      img(src="@/assets/welfare_task/day_welfare_title_icon.png")
      p 今日可领
        span {{ totalCoin }}
  .welfare__progress
    h3.title 当日连续阅读福利
    .progress__content
      .progress__item(v-for="(item, key) in excitationUserTaskVOList" :key="key")
        p.start__task(:style="changeBgCoinImage(item.isFinish, item.totalReadChapter)") {{ item.totalReadChapter === 0 ? '开始阅读' : `${item.rewardNum}金币` }}
        p.task__chapter(:style="changeBgChapterImage(item.isFinish)")
          span {{ item.totalReadChapter }}
          span 章
      p.progress__bar(ref="BarDOM")
        span.progress__bar__active(:style="width")
    h5.footer_desc(v-if="needChapter !== 0") 还需阅读{{ needChapter }}章节
</template>
<script>
export default {
  props: ['excitationUserTaskVOList', 'receivedCoin', 'totalCoin', 'readChapterCount'],
  data() {
    return {
      bgChapterImage: {
        'background-image': `url(${require('../../../assets/welfare_task/day_welfare_chapter_default.png')})`,
        'color': '#FCF1D0'
      },
      bgCoinImage: {
        'background-image': `url(${require('../../../assets/welfare_task/progress_default.png')})`,
        'color': '#FCF1D0'
      },
      width: {
        'width': '0px'
      },
      widthIndex: [15, 93, 171, 257],
      needChapter: 0
    }
  },
  methods: {
    changeBgChapterImage(isFinish) {
      return isFinish * 1 === 1 ?
        {
          'background-image': `url(${require('../../../assets/welfare_task/day_welfare_chapter.png')})`,
          'color': '#D23131'
        }:
        {
          'background-image': `url(${require('../../../assets/welfare_task/day_welfare_chapter_default.png')})`,
          'color': '#FCF1D0'
        }
    },
    changeBgCoinImage(isFinish, totalReadChapter) {

      return isFinish * 1 === 1 && totalReadChapter * 1 !== 0 ?
        {
          'background-image': `url(${require('../../../assets/welfare_task/day_welfate_active.png')})`,
          'color': '#D23131'
        } : {
          'background-image': `url(${require('../../../assets/welfare_task/progress_default.png')})`,
          'color': '#FCF1D0'
        }
    }
  },
  mounted() {
    this.$nextTick(() => {
      const BarDOMWidth = this.$refs.BarDOM.clientWidth
      let Index = 0
      if (this.readChapterCount > this.excitationUserTaskVOList[this.excitationUserTaskVOList.length - 1 ].totalReadChapter) {
        this.needChapter = 0
        return this.width.width = `${BarDOMWidth}px`
      } else {
        Index = this.excitationUserTaskVOList.findIndex(item => item.totalReadChapter >= this.readChapterCount)
      }
      const isFinishArr = this.excitationUserTaskVOList.filter(item => item.isFinish === 1) || []
      const lastIndex = isFinishArr.length > 0 && isFinishArr.length - 1 || 0
      if (this.readChapterCount * 1 < this.excitationUserTaskVOList[lastIndex].totalReadChapter) {
        if (lastIndex === 3) {
          this.needChapter = 0
          return this.width.width = `${BarDOMWidth}px`
        }
        this.needChapter = this.excitationUserTaskVOList[isFinishArr.length].totalReadChapter - this.readChapterCount
        this.width.width = `${this.widthIndex[lastIndex]}px`
        return
      }
      if (Index === 0) {
        this.needChapter =  this.excitationUserTaskVOList[1].totalReadChapter
        if (this.readChapterCount * 1 !== 0) {
          this.width.width = '15px'
        } else {
          this.width.width = '0px'
        }
        return
      }

      const startChapter = this.excitationUserTaskVOList[Index - 1].totalReadChapter
      const endChapter = this.excitationUserTaskVOList[Index].totalReadChapter
      const secChapter = endChapter - startChapter
      const stepChapter = this.readChapterCount - startChapter
      if (secChapter === stepChapter) { // 今日阅读章节数和任务的章节数相等时
        if (Index === 3) {
          this.needChapter = 0
          return this.width.width = `${BarDOMWidth}px`
        }
        this.needChapter =  this.excitationUserTaskVOList[Index + 1].totalReadChapter - this.readChapterCount
        this.width.width = `${this.widthIndex[Index]}px`
        return
      }
      this.needChapter = endChapter - this.readChapterCount // 到下一个任务还需要阅读多少章
      const startWidth = this.widthIndex[Index - 1]
      const endWidth = this.widthIndex[Index]
      const secWidth = endWidth - startWidth
      this.width.width = `${secWidth/secChapter * stepChapter + startWidth}px`

    })
  }
}
</script>
<style lang="stylus">
@import '../../../styles/index.styl';
.day__welfare
  padding 0 21px
  box-sizing border-box
  margin-top 30px
  .welfare__title
    display flex
    flex-direction row
    justify-content space-between
    .welfare__title__left
      color #999999
      font-family PingFangSC-Regular, PingFang SC
      .title__left__top
        img
          size(109px, 26px)
        .has__read__chapter
          font-size 20px
          line-height 28px
          padding-left 15px
      .title__left__bottom
        font-size 14px
        line-height 20px
    .welfare__title__right
      text-align center
      img
        size(27px, 28px)
      p
        font-size 14px
        color #333333
        line-height 20px
        span
          color #FF4900
          font-weight bold
  .welfare__progress
    margin-top 20px
    padding 15px 15px 0
    box-sizing border-box
    min-height 166px
    background url('../../../assets/welfare_task/welfare_content_bg.png') no-repeat center center
    background-size 100% 100%
    h3.title
      padding 0 0 13px 0
      box-sizing border-box
      height 14px
      font-size 14px
      font-family PingFangSC-Medium, PingFang SC
      font-weight 500
      color #FCF1D0
      line-height 14px
    .progress__content
      padding-top 13px
      box-sizing border-box
      display flex
      flex-direction row
      justify-content space-between
      position relative
      .progress__item
        p.start__task
          size(60px 25px)
          color #D23131
          background-repeat no-repeat
          background-position center center
          background-size 100% 100%
          text-align center
          font-size 12px
          font-weight bold
          padding-top 2.5px
          box-sizing border-box
        p.task__chapter
          margin 21px auto 0
          size(26px 36px)
          background-repeat no-repeat
          background-position center center
          background-size 100% 100%
          color #D23131
          text-align center
          display flex
          flex-direction column
          justify-content center
          align-items center
          span
            display inline-block
            height 10px
            font-size 12px
            transform scale(0.75, 0.75)
      .progress__bar
        absolute(left 0 top 47px right 0)
        margin 0 auto
        size(267px, 2px)
        background-color #A93333
        border-radius 3.5px
        background rgba(0,0,0,0.18)
        .progress__bar__active
          absolute(top 0 left 0)
          height 2px
          display inline-block
          background #FCF1D0
          border-radius 4px
          &::after
            content ''
            size(8px 11px)
            absolute(right 0 top -5px)
            background url('../../../assets/welfare_task/day_welfare_chapter.png') no-repeat center center
            background-size 100% 100%
    h5.footer_desc
      font-size 12px
      color #FCF1D0
      line-height 17px
      text-align center
      padding-top 15px
</style>