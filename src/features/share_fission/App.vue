<template lang="pug">
#app
  div.grow-fission
    div.list-box
      ul.list
        li.item(v-for='val in noticeList')
          span
            img(:src='val.imgUrl')
            | {{val.name}}
          span.message {{val.message}}
          span {{val.time}}
    div.content-box
      div.content
        //- img.content-bg(src='@/assets/share_fission/bg.png')
        div.title 您有一个红包待领取
        div.award {{ money }}
          span.unit 元
          span.most
        div.book-box
          div.book-box-tip
            img(src='@/assets/share_fission/icon.png')
            span 免费看小说+赚钱
          div.book-list
            swiper(ref='mySwiper' :options='swiperOptions')
              swiper-slide(v-for='(item, index) in bookList' :key='item.bookId')
                div.slider-item
                  img.book-cover(:src='item.imgUrl')
                  div.book-info
                    div.book-title {{item.name}}
                    div.book-intro {{item.intro}}
              div.swiper-pagination(slot="pagination")
        div.get-award-btn(@click='handleGetNow')
        div.count-down
          span.time {{hour}}
          |:
          span.time {{min}}
          |:
          span.time {{sec}}
          |:
          span.time {{ms}}
          span.time-tip 后红包失效请尽快收钱
    div.pop-fixed(v-show='isShowPop')
      img.pop-icon(src='@/assets/share_fission/pop_icon.png')
      img.pop-tip(src='@/assets/share_fission/pop_tip.png')
      img.pop-btn(src='@/assets/share_fission/pop_btn.png' @click='handleHidePop')
      img.pop-direction(src='@/assets/share_fission/pop_direction.png')
</template>

<script>
import { mBuryPoint } from '@/utils/buryPoint'
import { copyToClipboardNative } from '@/utils/native.js'
import { bookList, noticeList, iosCarefreeAppStoreUrl, andoridApk } from './variable'
import { downLoadApp } from '@/utils/common'
import { interviewReportFetch, initWxSdkApiFetch, getPageInfoFetch } from './request'
import { wxAuthorize, wxInit, wxShareMoentsAndFriend } from '@/utils/wx_sdk.js'
import BROWSER from '@/utils/browser.js'
import { countDown, applink, copyToClipboard, randomStringFixLen } from '@/utils/utils.js'
import { getQueryString } from '@/utils/url'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
export default {
  components: {
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      noticeList,
      day: '00',
      hour: '00',
      min: '00',
      sec: '00',
      ms: '00',
      money: '0.00',
      swiperOptions: {
        pagination: {
          el: '.swiper-pagination'
        },
        loop: true,
        initialSlide: 0,
        autoplay: {
          disableOnInteraction: false, // 手动滑动之后不打断播放
          delay: 3000
        },
        speed: 300
      },
      isShowPop: false,
      bookList
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper
    }
  },
  methods: {
    shareCountDown(time) {
      countDown(time, ({ day, hour, min, sec, ms }) => {
        this.day = day
        this.hour = hour
        this.min = min
        this.sec = sec
        this.ms = ms
      }, 50)
    },
    // 关闭蒙层页
    handleHidePop() {
      this.isShowPop = false
      mBuryPoint('clickShareDP')
    },
    // 立即领取函数
    handleGetNow() {
      mBuryPoint('clickShareLandPageGet', { ...this.getMBuryPorintData() })
      if (BROWSER.isWeChat) {
        // 微信环境打开
        this.isShowPop = true
        mBuryPoint('enterShareDP', { type: 0 })
        return
      }
      mBuryPoint('enterShareDP', { type: 1 })
      if (BROWSER.isiOS || BROWSER.isiPhone) {
        this.$showToast('下载《必看小说畅读版》领取奖励', 5000)
        let strCopy = copyToClipboardNative()
        copyToClipboard(strCopy)
        downLoadApp('', iosCarefreeAppStoreUrl, 5000)
      } else {
        this.$showToast('请立即打开《必看免费小说》APP,以免现金过期无法到账哦~', 20000)
        let strCopy = copyToClipboardNative()
        copyToClipboard(strCopy)
        applink(() => {
          downLoadApp(andoridApk, '', 5000)
        })
      }
    },
    // 微信授权
    wxAuthorize() {
      if (BROWSER.isWeChat) {
        wxAuthorize({
          url: this.disHost(),
          // appid: 'wxd4f4b7bb44ef3718'
          appid: 'wxa5e55e1a7ce23586'
        })
      }
    },
    // 获取埋点的数据
    getMBuryPorintData() {
      let shareChannel
      if (BROWSER.isWeChat) {
        shareChannel = getQueryString('from') === 'timeline' ? 'WeChartMoments' : 'WeChart'
      } else {
        shareChannel = 'Browser'
      }
      return {
        shareChannel,
        adCodeId: getQueryString('adCodeId'),
        adPosId: getQueryString('adPos'),
        adShareAward: getQueryString('shareReward'),
        adReadAward: getQueryString('sharePersonReward'),
        viewEffect: 'redEnvelops'
      }
    },
    // 页面初始化
    initPage() {

      if (BROWSER.isWeChat) {
        mBuryPoint('enterShareLandPage', { ...this.getMBuryPorintData(), type: 0 })
      } else {
        mBuryPoint('enterShareLandPage', { ...this.getMBuryPorintData(), type: 1 })
      }
      if (getQueryString('code')) {
        // 通过code调用接口，返回openid,进行后续的操作
        setTimeout(() => {
          interviewReportFetch({
            code: getQueryString('code'),
            recordId: getQueryString('recordId')
          })
        }, 5000)
        this.initWxSdkApi()
      } else {
        this.wxAuthorize()
      }
      this.getPageInfo()
    },
    // 微信sdk api初始化
    async initWxSdkApi() {
      let res = await initWxSdkApiFetch(this.getShareUrl())
      try {
        if (res.code === 100) {
          wxInit({ ...res.data })
          wxShareMoentsAndFriend({ title: '帮我点一下，这是一个好看又能赚钱的有趣应用', content: '一个边看小说边赚钱的有趣应用', url: this.getShareUrl(), desc: '海量小说免费看，躺在家里就能赚钱。', imgUrl: require('@/assets/share_fission/share_icon.png') })
        }
      } catch (err) {
        console.log(err)
      }
    },
    // 获取页面信息接口
    async getPageInfo() {
      let res = await getPageInfoFetch(getQueryString('recordId'))
      try {
        if (res.code === 100) {
          this.shareCountDown(res.data.expireTime-new Date().getTime())
          this.money = res.data.rewardNum
        }
      } catch (err) {
        console.log(err)
      }
    },
    // 去除泛域名
    disHost() {
      let { host, protocol, search, pathname } = window.location
      let hostArr = host.split('.')
      if (typeof Number(hostArr[0]) === 'number' && !isNaN(Number(hostArr[0]))) {
        host = hostArr.splice(1).join('.')
      }
      let randomPath = '/share/' + randomStringFixLen(6)
      if (/\/share\//.test(pathname)) {
        randomPath = ''
      }
      console.log(`${protocol}//${host}${randomPath}${pathname}${search}`, /\/share\//.test(pathname), 333)
      return `${protocol}//${host}${randomPath}${pathname}${search}`
    },
    // 获取分享链接
    getShareUrl() {
      let { search, origin, pathname } = window.location
      let searchArr = search.substring(1).split('&')
      let resultArr = searchArr.filter(str => {
        return !/(code=)|(state=)|(from=)|(isappinstalled=)/.test(str)
      })
      if (resultArr.length > 0) {
        search = resultArr.join('&')
        search = `?${search}`
      }
      return `${origin}${pathname}${search}`
    }
  },
  mounted() {
    this.initPage()
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../styles/index.styl';
@import './index.styl';
</style>
