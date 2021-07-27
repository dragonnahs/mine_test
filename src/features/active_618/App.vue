<template lang="pug">
#active-618(:class='{"platform1": isPlatform == 51}')
  div.active-rule(@click='isShowRule = true') 活动规则
  div.recharge-box
    div.recharge-item
      div.recharge-item-btn(v-if='isStarted' @click='handleGoUserCenter(1)')
      div.recharge-item-time(v-else)
        div 倒计时:
        div.mine-time {{hour}}
        div 小时
        div.mine-time {{min}}
        div 分
    div.recharge-item
      div.recharge-item-btn(v-if='isStarted' @click='handleGoUserCenter(2)')
      div.recharge-item-time(v-else)
        div 倒计时:
        div.mine-time {{hour}}
        div 小时
        div.mine-time {{min}}
        div 分
  div.notice-list(v-if='isPlatform != 1 && noticeList.length')
    swiper.notice-swiper.swiper-no-swiping(:options='swiperOptions')
      swiper-slide.notice-swiper-slide(v-for='(item, index) in noticeList'
      :key='index')
        img(:src='item.headImage')
        span.notice-nickname {{item.nickName}}中了
        span.notice-award {{item.rewardName}}
  div.more-game(v-if='isPlatform != 1')
    div.game-one
      div.game-btn(v-if='isStarted' @click='getGameUrl(2)')
      div.game-time(v-else)
        div 倒计时:
        div.mine-time {{hour}}
        div 小时
        div.mine-time {{min}}
        div 分
    div.game-two
      div.game-btn(v-if='isStarted' @click='getGameUrl(3)')
      div.game-time(v-else)
        div 倒计时:
        div.mine-time {{hour}}
        div 小时
        div.mine-time {{min}}
        div 分
    div.game-three(@click='getGameUrl(4)')
  div.member-power
  div.active-book-box
    div.active-book-list
      div.active-book-item(v-for='item in bookList'
      :key='item.bookId'
      @click='handleGoBookDetail(item.bookId)')
        img(:src='item.imgUrl')
        div.active-book-name {{item.bookName}}
    div.active-book-btn(@click='handleGoRanking')
  rule(v-show='isShowRule' @toggleShowRule='isShowRule = false')
</template>

<script>
import { mBuryPoint } from '@/utils/buryPoint'
import { getNoticeList, getGameUrl } from './request.js'
import { getQueryString } from '@/utils/url.js'
import { routerToNative, jumpBookRanking, jumpBookDetail } from '@/utils/native'
import BROWSER from '@/utils/browser'
import { bookList } from './variable.js'
import { countDown } from '@/utils/utils.js'
import Rule from './components/rule'

import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

export default {
  components: {
    Swiper,
    SwiperSlide,
    Rule
  },
  data() {
    return {
      isStarted: false,
      noticeList: [],
      swiperOptions: {
        autoplay: {
          delay: 1000
        },
        speed: 1000,
        loop: true,
        centeredSlides: true,
        slidesPerView: 3,
        direction: 'vertical',
        spaceBetween: 4
      },
      bookList,
      min: '0',
      hour: '00',
      isShowRule: false,
      isPlatform: 5
    }
  },
  methods: {
    initPage() {
      mBuryPoint(5, { enterActivityLandPage: 'enterActivityLandPage' })
      this.isPlatform = getQueryString('platform')
      if (getQueryString('platform') !== 1) {
        this.getNoticeList()
      }
      this.computedCountDown()
    },
    async getNoticeList() {
      const activityId = getQueryString('activityId')
      let res = await getNoticeList(activityId)
      console.log(res)
      if (res.code === 100) {
        this.noticeList = res.data
      }
    },
    async getGameUrl(transfer) {
      mBuryPoint(5, { clickButton: 'clickButton', position: transfer + 1 })
      if (transfer === 4) {
        let result = window.location.origin.indexOf('test') > -1 ? ('http://test.activities.ibreader.com/#/luckmay') : 'https://activities.ibreader.com/#/luckmay'
        result += window.location.search
        routerToNative(result)
        return
      }
      let appType = BROWSER.isiOS ? 1 : 0
      let res = await getGameUrl(appType, transfer)
      if (res.code === 100) {
        if (res.data && res.data.loginUrl) {
          routerToNative(res.data.loginUrl)
        } else {
          window.location.assign('breader://common/login?isBindPhone=true')
        }
      }
    },
    computedCountDown() {
      let time = new Date('2020/06/18 00:00:00').getTime() - new Date().getTime()
      if (time <= 0) {
        this.isStarted = true
        return
      }
      countDown(time, ({ day, hour, min, sec }) => {
        let hourTemp = Number(day)*24 + Number(hour)
        this.hour = hourTemp > 9 ? hourTemp : '0'+hourTemp
        this.min = min
        if (day == 0 && hour == 0 && min == 0 && sec > 0) {
          this.min = '01'
        }
        if (day == 0 && hour == 0 && min == 0 && sec == 0) {
          window.reload()
        }
      })
    },
    handleGoRanking() {
      mBuryPoint(5, { clickButton: 'clickButton', position: 6 })
      jumpBookRanking()
    },
    handleGoBookDetail(bookId) {
      mBuryPoint(5, { clickButton: 'clickButton', bookId })
      jumpBookDetail({ bookId })
    },
    handleGoUserCenter(target) {
      mBuryPoint(5, { clickButton: 'clickButton', position: target })
      window.location = 'breader://usercenter/vip'
    }
  },
  mounted() {
    this.initPage()
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../styles/index.styl';
@import './index.styl'
</style>
