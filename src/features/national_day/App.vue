<template lang="pug">
  .national(v-if='isLoaded')
    .sex(:class='{"is-male": isMale, "is-bk": getPlatform() == 5 || (getPlatform() == ""), "is-ios": isIos}')
      .top
      .banner(:class='{"is-fixed": isFixed === true}')
        div.banner-item(v-for='(item, index) in list' :key='index'
        :class='{"active": item.id === selected}'
        v-if='!item.isLink'
        @click='handleClickBanner(item.id)')
          | {{item.title}}
      .book-box(:class='{"is-fixed": isFixed}')
        template(v-for='(item,index) in list')
          .video-list.book-list-common(v-if='item.isVideo' :key='index')
            .video-item(v-for='(videoItem,innerIndex) in item.list' :key='"a"+innerIndex'
            @click='handleClickItem(videoItem, 1, item)')
              .video-item-cover
                img(:src='videoItem.bookCover')
                .video-item-play
              .video-item-name {{videoItem.bookName}}
          .link-list(v-else-if='item.isLink' :key='index')
            .link-item(v-for='(linkItem,innerIndex) in item.list'
            :key='"b"+innerIndex'
            v-if='(isShowVideo && innerIndex < 2) || !isShowVideo'
            @click='handleClickItem(linkItem,2, item)')
              img.link-item-cover(:src='linkItem.imgUrl')
          .book-list.book-list-common(:key='index' v-else)
            .book-item(v-for='(bookItem,innerIndex) in item.list' :key='"c"+innerIndex'
            @click='handleClickItem(bookItem, 3, item)')
              img.book-cover(:src='bookItem.bookCover')
              .book-read-tip
              .book-item-name {{bookItem.bookName}}
      .share-icon(v-if='dealInOrOut()' @click='handleShareBtn')
      .pop-tip(v-if='countTime > 0') 正在跳转中,请稍等...
      v-share(v-show='isShowShare')
</template>

<script>
import data from './data'
import { debounce } from '@/utils/utils'
import { skipUrl, shareMenu } from '@/utils/nativeToH5'
import { jumpBookDetail, goVideoPage } from '@/utils/native'
import { getQueryString } from '@/utils/url.js'
import {
  mBuryPoint,
  compareVersion
} from '@/utils/index'
import { getUserPreference } from './request'
import Share from './components/share.vue'
import BROWSER from '@/utils/browser'
import { scrollAnimation } from '@/utils/common.js'
export default {
  components: {
    'v-share': Share
  },
  data() {
    return {
      list: [],
      selected: 0,
      isFixed: false,
      isMale: true,
      isShowVideo: false, // 是否展示视频,
      platform: '', // 平台，可以判断是不是在app内打开
      bookUri: '',
      countTime: 0,
      shareOptions: {
        platform: 1,
        title: '精彩小说陪你度长假',
        desc: '窗内的月圆，书中的精彩都是旅途上难得瞬间，更多美好，待你发现',
        icon: require('@/assets/national_day/bk_share_icon_male.png'),
        url: window.location.href,
        type: 1
      },
      isShowShare: false,
      isLoaded: false
    }
  },
  methods: {},
  created() {
    this.getDataList()
  },
  computed: {
    isIos() {
      return BROWSER.isiOS
    }
  },
  methods: {
    dealInOrOut() {
      // 不存在是站外
      return localStorage.getItem('platformId')
    },
    handleClickItem(target, type, parentTarget) {
      debounce(() => {
        if (!this.dealInOrOut()) {
          // 站外
          this.downLoadApp(target)
          return
        }
        if (type === 1) {
          this.clickVideoItem(target)
        } else if (type === 2) {
          this.clickLinkActivity(target)
        } else {
          this.goBookDetail(target)
        }
        mBuryPoint('12', {
          topicClick: this.isMale ? 1 : 0,
          position: localStorage.getItem('platformId') ? 1 : 0,
          platform: this.getPlatform(),
          topicType: target.type ? target.type :  parentTarget.type,
          bookId: target.videoId ? '' : (target.bookId || ''),
          videoId: target.videoId
        })
      }, 200)()
    },
    downLoadApp(target) {
      const { bookId = '' } = target
      let tempPlatform = getQueryString('platform')
      console.log(tempPlatform)
      let tempUrl
      if (tempPlatform == 5) {
        tempUrl = 'http://dl.ibreader.com/api/download/311'
      } else {
        tempUrl = 'http://dl.ibreader.com/api/download/312'
      }
      if (BROWSER.isiOS) {
        tempUrl = 'http://itunes.apple.com/cn/app/id1500717212?mt=8'
      }
      let timer
      if (bookId) {
        window.location.assign(`breader://www.bayread.com/bookview/bookread?bookId=${bookId}&source=national_day&userPath=national_day,deeplink&chapterNum=0`)
      } else {
        window.location.assign('breader://www.bayread.com')
      }

      setTimeout(() => {
        window.location = tempUrl
      }, 1000)
      this.countTime = 5
      timer = setTimeout(() => {
        this.countTime  = 0
        clearTimeout(timer)
      }, 5000)
    },
    goBookDetail(target) {
      jumpBookDetail({
        bookId: target.bookId
      })
    },
    clickLinkActivity(target) {
      skipUrl({
        skipUrl: target.url
      })
    },
    clickVideoItem(target) {
      goVideoPage({
        videoId: target.videoId
      })
    },
    handleShareBtn() {
      this.handleShare()
      mBuryPoint('12', {
        shareClick: 'shareClick',
        shareType: 0
      })
    },
    handleShare() {
      // 弹出分享弹窗
      this.isShowShare = !this.isShowShare
    },
    parentShareFun(target) {
      let tempShareOptions = { ...this.shareOptions }
      if (!this.isMale) {
        tempShareOptions.icon = require('@/assets/national_day/bk_share_icon_female.jpg')
      }
      tempShareOptions.platform = target
      if (target == 2) {
        tempShareOptions.title = `【${tempShareOptions.title}】${tempShareOptions.desc}`
      }
      if (!getQueryString('platform') && this.dealInOrOut()) {
        if (window.location.search) {
          tempShareOptions.url = window.location.href + '&platform=' + this.platform + '&sex='+ (this.isMale ? 1 : 0)
        } else {
          tempShareOptions.url = window.location.href + '?platform=' + this.platform + '&sex='+ (this.isMale ? 1 : 0)
        }
      }
      shareMenu(tempShareOptions, (isSuccess) => {
        console.log(isSuccess)
      })
      setTimeout(() => {
        this.handleShare()
      }, 200)
      mBuryPoint('12', {
        shareClick: 'shareClick',
        shareType: target
      })
    },
    init() {
      let bannerTop = document.getElementsByClassName('banner')[0].offsetTop
      console.log(bannerTop)
      document.onscroll = () => {
        let btop = document.body.scrollTop||document.documentElement.scrollTop
        if (btop > bannerTop) {
          this.isFixed = true
        } else {
          this.isFixed = false
        }
        debounce(this.dealBannerPos, 50)()
      }
    },
    async getDataList() {
      let sexInfo = await getUserPreference()
      let sexType = sexInfo.data ? sexInfo.data.sex : 1
      if (getQueryString('sex') !== '') {
        sexType = getQueryString('sex')
      }

      mBuryPoint('12', {
        topicEnter: sexType,
        position: localStorage.getItem('platformId') ? 1 : 0,
        platform: this.getPlatform()
      })
      console.log(sexType, 'sex-url')
      this.isLoaded = true
      this.$nextTick(() => {
        this.init()
      })
      this.isMale = sexType == 1
      let list = sexType == 0 ? data.female : data.male
      let isShowVideo = this.judgeIsShowVideo()
      let resultArr = []
      list.map(item => {
        if (!(!isShowVideo && item.isVideo)) {
          resultArr.push(item)
        }
      })
      this.isShowVideo = isShowVideo
      this.list = resultArr
    },
    judgeIsShowVideo() {
      let platform
      let tempPlatform = getQueryString('platform')
      platform = localStorage.getItem('platformId') ? localStorage.getItem('platformId') : tempPlatform
      let version = localStorage.getItem('version')  // 真实版本
      let isTrue = compareVersion('1.47.0', version) !== -1
      this.platform = platform
      return ((isTrue && platform == 5) || !platform) && !this.isIos
    },
    getPlatform() {
      let tempPlatform = getQueryString('platform')
      return localStorage.getItem('platformId') ? localStorage.getItem('platformId') : tempPlatform
    },
    handleClickBanner(target) {
      if (this.selected === target) {
        return
      }
      // 点击滚动到指定位置
      let offsetTop = document.getElementsByClassName('book-list-common')[target].offsetTop - document.getElementsByClassName('banner')[0].clientHeight
      try {
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        })
      } catch (error) {
        scrollAnimation((document.body.scrollTop||document.documentElement.scrollTop), offsetTop)
      }

    },
    // 计算位置切换banner
    dealBannerPos() {
      let btop = (document.body.scrollTop||document.documentElement.scrollTop) + document.getElementsByClassName('banner')[0].clientHeight
      let bookListArr = Array.from(document.getElementsByClassName('book-list-common'))
      for (let i = 0; i < bookListArr.length;i++) {
        if (bookListArr[i+1] &&  bookListArr[i+1].offsetTop > btop && bookListArr[i].offsetTop <= btop) {
          this.selected = i
        } else if (i === 0 && bookListArr[0].offsetTop > btop) {
          this.selected = 0
        } else if (!bookListArr[i+1] && bookListArr[i].offsetTop <= btop) {
          this.selected = i
        }
      }
    }

  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../styles/index.styl';
  @import './index.styl'
</style>