<template lang="pug">
div
  .new_ad_user_landing(v-if='platform > -1 && platformInfo[platform]')
    img.landing_bg(
      :src='platformInfo[platform].bgImg'
    )
    .landing_content
      .landing_btn(
        @click='downloadApp'
        :class="platformInfo[platform].btnClassName"
      ) 立即下载
      .landing_text 下载APP，阅读更流畅
  .new_ad_user_landing(v-if='platform > -1 && !platformInfo[platform]')
    img.landing_bg(
      src='../../assets/new_ad_user_guide_landing/bk_free_bg.png'
    )
    .landing_content
      .landing_btn(
        @click='downloadApp'
      ) 立即下载
      .landing_text 下载APP，阅读更流畅
</template>

<script>
import { getQueryString, throttle, BROWSER } from '@/utils/index'
import { Base64 } from 'js-base64'
export default {
  data() {
    return {
      /**
       * 平台号：5=必看，6=必阅，7=坚果，51=洋葱
       */
      platform: -1,
      // 各个平台对应的信息
      platformInfo: {
        5: {
          bgImg: require('../../assets/new_ad_user_guide_landing/bk_free_bg.png'),
          btnClassName: 'bk_free_app',
          url: 'breader://www.bayread.com',
          bookSchema: 'breader://www.bayread.com/bookview/bookread?bookId=<bookId>&source=adUserGuide&chapterNum=0&userPath=adUserGuide,deeplink'
        },
        6: {
          bgImg: require('../../assets/new_ad_user_guide_landing/by_bg.png'),
          btnClassName: 'by_app',
          url: 'bybreader://www.bayread.com',
          bookSchema: 'bybreader://www.bayread.com/bookview/bookread?bookId=<bookId>&source=adUserGuide&chapterNum=0&userPath=adUserGuide,deeplink'
        },
        7: {
          bgImg: require('../../assets/new_ad_user_guide_landing/jg_bg.png'),
          btnClassName: 'jg_app',
          url: 'jgbreader://www.bayread.com',
          bookSchema: 'jgbreader://www.bayread.com/bookview/bookread?bookId=<bookId>&source=adUserGuide&chapterNum=0&userPath=adUserGuide,deeplink'
        },
        51: {
          bgImg: require('../../assets/new_ad_user_guide_landing/yc_bg.png'),
          btnClassName: 'yc_app',
          url: 'ycbreader://www.bayread.com',
          bookSchema: 'ycbreader://www.bayread.com/bookview/bookread?bookId=<bookId>&source=adUserGuide&chapterNum=0&userPath=adUserGuide,deeplink'
        },
      },
      default: {
        url: 'breader://www.bayread.com',
        bookSchema: 'breader://www.bayread.com/bookview/bookread?bookId=<bookId>&source=adUserGuide&chapterNum=0&userPath=adUserGuide,deeplink'
      }
    }
  },
  methods: {
    downloadApp: throttle(function() {
      this.jumpSchema()
    }, 50),
    jumpSchema() {
      let bookId = getQueryString('bookId')
      let apkPath = getQueryString('apkPath')
      apkPath = Base64.decode(apkPath)
      let currentPlatformInfo = this.platformInfo[this.platform] ? this.platformInfo[this.platform] : this.default
      currentPlatformInfo.bookSchema = currentPlatformInfo.bookSchema.replace('<bookId>', bookId)
      if (!BROWSER.isiOS) {
        if (window._czc) {
          window._czc.push([
            '_trackEvent',
            window.location.host + window.location.pathname,
            '点击按钮',
            `bookId=${bookId}&platform=${this.platform}`,
          ])
        }
        window.location = bookId?currentPlatformInfo.bookSchema : currentPlatformInfo.url
        setTimeout(() => {
          window.location = apkPath
        }, 2000)
      }
    },
    dealTitle(platform) {
      let title = ''
      switch (platform) {
      case 5:
        title = '必看免费小说'
        break
      case 6:
        title = '必阅免费小说'
        break
      case 7:
        title = '坚果免费小说'
        break
      case 51:
        title = '洋葱免费小说'
        break
      default:
        title = '免费小说'
        break
      }
      document.title = title
    }
  },
  created() {
    let platform = getQueryString('platform') ? Number(getQueryString('platform')) : 0
    this.platform = platform
    this.dealTitle(platform)
  },
  mounted() {},
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../styles/index.styl';
@import './index.styl'
</style>
