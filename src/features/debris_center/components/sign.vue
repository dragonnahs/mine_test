<template lang="pug">
#sign_cotent
  .header_title
    .header_left(@click="() => this.$emit('goSignRecord')")
      h2.title
        | 已连续签到{{ checkinInfo.checkinDays }}天
        img(src="../../../assets/debris_center/sign_icon_record.png")
    .header_right
      h3.title 签到提醒
      img.onOff(@click="() => this.$emit('openCalendarSignNotice')" :src="imgUrl")
  .content(@click="() => this.$emit('goSignRecord')")
    .content_day
      Swiper.swiper(:options="swiperOption")
        SwiperSlide.swiper-slide(v-for="(item, key) in checkinRewardInfoList")
          .img_cover(:style="{'--processBg': key < checkinInfo.checkinDays ? '#F65245' : '#FFE1C7'}")
            img.sign_default_cover(:src="setImg(item, key)")
            span.process_bg
            p.sign_debris_number(v-if="checkinInfo.checkinDays <= key")
              span +{{ item.rewardFragmentCount }}
          span.sign_title {{ item.checkinDayNum }}日
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
export default {
  props: ['openCalendarSignNotice', 'imgUrl', 'goSignRecord', 'checkinRewardInfoList', 'checkinInfo'],
  components: {
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      swiperOption: {
        slidesPerView: 5,
        spaceBetween: 17,
        centeredSlides: false,
        initialSlide: 0
      }
    }
  },
  computed: {},
  created() {
    const { checkinDays } = this.checkinInfo
    const lastFiveDays = this.checkinRewardInfoList && (this.checkinRewardInfoList.length - checkinDays)
    if (lastFiveDays < 5) {
      this.swiperOption.initialSlide = this.checkinRewardInfoList.length - 5
      return
    }
    if (checkinDays < 3) {
      this.swiperOption.initialSlide = 0
      return
    }
    this.swiperOption.initialSlide = checkinDays - 2
  },
  methods: {
    setImg(item, key) {
      const { rewardFragmentCount } = item
      if (key < this.checkinInfo.checkinDays) {
        return require('../../../assets/debris_center/sign_finish.png')
      } else if (rewardFragmentCount * 1 > 1) {
        return require('../../../assets/debris_center/sign_gift.png')
      } else {
        return require('../../../assets/debris_center/sign_default.png')
      }
    }
  },
  mounted() {}
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../../styles/index.styl';
#sign_cotent
  width 346px
  min-height 210px
  margin 0 auto
  box-sizing border-box
  margin-top 20px
  border-radius 10px
  box-shadow 0px 0px 8px 0px rgba(0, 0, 0, 0.09)
  background linear-gradient(235deg, #FFC87A 0%, #F43A3A 100%)
  border-radius 10px
  .header_title
    padding 0 20px 16px
    box-sizing border-box
    min-height 46px
    width 346px
    display flex
    flex-direction row
    justify-content space-between
    align-items center
    padding-top 20px
    .header_left
      display flex
      flex-direction column
      justify-content center
      align-items center
      h2.title
        height 22px
        font-size 16px
        font-family PingFangSC-Medium, PingFang SC
        font-weight 500
        line-height 22px
        color #FFFFFF
        display flex
        flex-direction row
        align-items center
        img
          size(16px 16px)
          border-radius 8px
          margin-left 10px
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
        padding-right 6px
      img.onOff
        width 26px
        display inline-block
  .content
    padding 0 10px
    box-sizing border-box
    .content_day
      width 100%
      height 120px
      background #FFFFFF
      box-sizing border-box
      border-radius 10px
      .swiper
        .swiper-slide
          display flex
          flex-direction column
          padding-top 30px
          .img_cover
            position relative
            size(46px, 46px)
            z-index 9
            .sign_default_cover
              size(46px 46px)
              absolute(top 0 left 0)
              z-index 12
            .process_bg
              absolute(right -30px top 0 bottom 0)
              z-index 1
              margin auto
              width 35px
              display inline-block
              height 12px
              background var(--processBg)
            p.sign_debris_number
              absolute(right -6px top -10px)
              z-index 19
              min-width 28px
              height 15px
              background linear-gradient(235deg, #FFC87A 0%, #F43A3A 100%)
              border-radius 150px 100px 100px 10px
              border 1px solid #FFFFFF
              font-size 12px
              line-height 15px
              color #FFFFFF
              font-family PingFangSC-Medium, PingFang SC
              text-align center
          .sign_title
            font-size 14px
            width 46px
            display inline-block
            color #8D3000
            padding-top 0
            text-align center
            font-family PingFangSC-Regular, PingFang SC
      .swiper .swiper-slide:last-child .img_cover .process_bg
        width 0
</style>
