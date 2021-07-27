<template lang="pug">
#app
  .spring
    img(src="@/assets/Spring/title.png")
    img(src="@/assets/Spring/txt.png")
  .content
    .btn(@click="bindPhone()")
  .swiper_content
    Swiper.swiperTab(
      :options="swiperOption"
      ref="mySwiper"
    )
      swiper-slide(v-for="item in 13" :key="item")
        .learn_page
          img(:src="require(`@/assets/Spring/malls/${item}.png`)")
      .swiper-button-prev.swiper-button-black(slot="button-prev")
      .swiper-button-next.swiper-button-black(slot="button-next")
  .content
    .btn_mall(@click="gotoMall()")
  .footer
    | 本活动最终解释权归必看小说所有，如有任何问题请联系客服：QQ488132298
  .toast(v-if='toastShow')
    span 你已绑定过手机号
</template>

<script>
import { post } from '@/config/axios.config'
import { routerToNative } from '@/utils/native'
import { mBuryPoint } from '@/utils/buryPoint'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    const _this = this
    return {
      swiperOption: {
        notNextTick: true,
        slidesPerView: 2,
        spaceBetween: 0,
        centeredSlides: true,
        // 循环
        loop: true,
        // 设定初始化时slide的索引
        initialSlide: 0,
        // 滑动速度
        speed: 300,
        // 滑动方向
        direction: 'horizontal',
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        // 滑动之后回调函数
        on: {
          slideChangeTransitionEnd() {
            _this.lastIndex = this.isEnd
          },
        },
      },
      userInfo: {},
      toastShow: false,
      loginUrl: '',
      timer: null,
      state: true // 设置停止论询
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper
    },
  },
  created() {
    window.callRouterReload = this.callRouterReload
    this.getUserInfo()
    this.getMallScheme()
  },
  mounted() {
    mBuryPoint('enterSpring')
  },
  methods: {
    callRouterReload() {
      this.getUserInfo()
    },
    gotoMall() {
      if (this.loginUrl === '') {
        window.location.assign('breader://common/login?isBindPhone=true')
        return
      }
      mBuryPoint('clickGoMall')
      routerToNative(this.loginUrl)
    },
    bindPhone() {
      if (this.userInfo.phoneNum !== '') {
        mBuryPoint('clickBindPhone', {
          isBindPhone: 0
        })
        this.toastShow = true
        setTimeout(() => {
          this.toastShow = false
        }, 2500)
        return
      }
      mBuryPoint('clickBindPhone', {
        isBindPhone: 1
      })
      window.location.assign('breader://common/login?isBindPhone=true')
      setTimeout(() => {
        this.state = false
      }, 120000)
    },
    getUserInfo() {
      post('/api/user/userInfoQuickApp').then(res => {
        if (!res.data) return
        const { userInfo } = res.data
        this.userInfo =  userInfo
        if (this.state) {
          clearInterval(timer)
          timer = setTimeout(() => {
            this.getUserInfo()
          }, 1000)
        }
      })
    },
    getMallScheme() {
      post('/api/coinmall/login').then(res => {
        this.loginUrl = res.data.loginUrl
      })
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../styles/index.styl';
body, html
  size(100%, 100%)
  margin 0 auto
#app
  width 100%
  padding 30px 0 29px
  background url('../../assets/Spring/bg.png') no-repeat center center
  background-size 100% 100%
  img
    width 100%
  .spring
    padding 0 24px
    box-sizing border-box
  .content
    margin 17px 0 15px
    .btn
      size(215px 50px)
      background url('../../assets/Spring/btn_phone.png') no-repeat center center
      background-size 100% 100%
      margin 0 auto
    .btn_mall
      size(215px 50px)
      background url('../../assets/Spring/btn_mall.png') no-repeat center center
      background-size 100% 100%
      margin 0 auto
  .footer
    padding 28px 30px 0 25px
    font-size 14px
    font-family PingFang SC
    font-weight 600
    color rgba(102,102,102,1)
  .toast
    display flex
    justify-content center
    align-items center
    fixed(top 0 bottom 0 left 0 right 0)
    z-index 9999
    font-weight bold
    span
      font-size 14px
      padding 5px 25px
      background rgba(0,0,0,0.6)
      color #ffffff
      border-radius 15px
  .swiper_content
    .learn_page img
      border-radius 6px
.swiper-slide
  display flex
  align-items center
  transition 300ms
  transform scale(0.8)!important
  position relative!important
  &::before
    content ''
    absolute(top 0 left 0 right 0 bottom 6px)
    background rgba(0,0,0,0.2)
    border-radius 6px
.swiper-slide-active,.swiper-slide-duplicate-active
  transform: scale(1)!important
  &::before
    content ''
    absolute(top 0 left 0 right 0 bottom 0)
    background rgba(0,0,0,0)
.swiperTab .swiper-button-prev,.swiperTab .swiper-button-next
  &:after
    color #ffffff
    transform scale(0.3)
    font-weight bold
.swiperTab .swiper-button-prev
  left 20px
.swiperTab .swiper-button-next
  right 20px
</style>
