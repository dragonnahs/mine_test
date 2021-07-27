<template lang="pug">
#parent.bookslast-container
  .bookslast-header
    Urge(
      v-if="bookInfo.isSerial === 1 && mId === ''"
      :endInfo="endInfo"
      :showNotification="showNotification"
      :showNotificationResume="showNotificationResume"
      :isNoBook="isNoBook"
      :platform="platform"
      v-on:urgeforbook="urgeforbook")
    FreeVip(
      v-if="bookInfo.isSerial === 0 && mId === ''"
      :bookInfo="bookInfo"
      :vipExperienceCardInfoControl="vipExperienceCardInfoControl"
      :endInfo="endInfo"
      :mId="mId"
      v-on:receiveforbook="receiveforbook"
      :platform="platform"
      :isNoBook="isNoBook"
      )
    Score(
      :endInfo="endInfo"
      :platform='platform'
      v-if="endInfo && platform !== '15'"
      v-on:commentHandler="commentHandler"
      v-on:rewardHandler="rewardHandler"
    )
  BookMore(
    v-if="recommendBookVO.bookInfoVOList.length !== 0"
    :booklist="recommendBookVO.bookInfoVOList"
    :title='recommendBookVO.bookListTitle'
    v-on:handleGoBookDetail="gotoRead"
    :expGroup="expGroup"
  )
  BookContent(
    v-if="(content || boostList.length !== 0) && !showVideo"
    :boostTitle="boostTitle"
    :boostList="boostList"
    :endCategoryBook="endCategoryBook"
    :bookInfo="bookInfo"
    :mId="mId"
    :showtip="showtip"
    :showTag="showTag"
    :platform="platform"
    :contentTitle="contentTitle"
    :content="content"
    v-on:handleGoBookDetail="gotoRead"
    v-on:refreshHandler="refreshHandler"
    v-on:addShelf="addShelf"
    v-on:addShelfAndRead="addShelfAndRead"
  )
  VideoContent(
    v-if="showVideo"
    :videolists="videolists"
    v-on:clickVideo="clickVideo"
    v-on:gotoRead="gotoRead"
    v-on:gotoShelf="gotoShelf"
  )
  .book_test_A_content
    BookMore(
      title="读完本书的人还在读"
      isExchange=true
      :booklist='pointsBarrelBookList'
      :mId="mId"
      v-if="pointsBarrelBookList.length !== 0"
      @refreshHandler="refreshHandler"
      v-on:handleGoBookDetail="addShelfAndRead"
      :expGroup="expGroup")
</template>

<script>
import bk from 'bayread-bridge'
import { getEndCategoryBook, getEndInfo, getVipCard, getReadUrge, getVideoList } from './request.js'
import { compareVersion, routerToNative, getQueryString, mBuryPoint } from '@/utils/index.js'
export default {
  components: {
    Urge: () => import('./components/Urge.vue'),
    FreeVip: () => import('./components/FreeVip.vue'),
    Score: () => import('./components/Score.vue'),
    BookContent: () => import('./components/BookContent.vue'),
    VideoContent: () => import('./components/VideoContent.vue'),
    BookMore: () => import('./components/BookMore.vue')
  },
  data() {
    const bookId = getQueryString('bookId') || ''
    const currbookId = bookId
    return {
      endInfo: null,
      platform: '5',
      version: '',
      bookId,
      chapterNum: getQueryString('chapterNum') || '',
      mId: getQueryString('mId') || '',
      source: getQueryString('source') || '',
      pageNum: 1,
      boostList: [], // 补量位的书籍列表
      boostTitle: '', // 补量为的标题,
      contentTitle: '',
      bookInfo: {},
      endCategoryBook: {},
      content: '',  // 正文内容s
      vipExperienceCardInfoControl: false,
      showtip: true,
      showTag: false,
      showVideo: false, // 显示视频模块
      videolists: [], // 视频列表
      showNotification: false,
      showNotificationResume: false,
      buttonStatus: '1',
      currbookId,
      recommendBookVO: {
        bookInfoVOList: [],
        bookListTitle: ''
      },
      pointsBarrelBookList: [],
      expGroup: 'B'
    }
  },
  created() {
    bk.call('notificationInit', {}, data => {
      const { openNotification } = JSON.parse(data)
      // 通知开启初始化
      if (openNotification * 1 === 0) {
        this.showNotification = true
        this.buttonStatus = '3'
      }
    })
    window.notificationResume = this.notificationResume
  },
  computed: {
    isNoBook() { // 底部没有推荐的书的情况
      return this.recommendBookVO.bookInfoVOList.length === 0 && !this.content && this.boostList.length === 0 && this.pointsBarrelBookList.length === 0
    }
  },
  mounted() {
    getEndInfo(this.bookId, this.mId).then(res => { // 正文尾页信息
      if (!res.data) return
      if (!res.data.bookInfo) {
        res.data.bookInfo = {}
      }
      const { bookInfo, ItemInfo, recommendBookVO } = res.data
      if (typeof bookInfo.isSerial !== 'number') {
        bookInfo.isSerial = 0
      }
      this.endInfo = res.data
      this.bookInfo =bookInfo
      this.recommendBookVO = recommendBookVO || this.recommendBookVO
      this.handleDealBoostList(ItemInfo)
      this.version = localStorage.getItem('version')
      this.platform =localStorage.getItem('platformId') || '15'
      if (this.bookInfo.isSerial === 1 && !this.showNotification) {
        this.buttonStatus = this.endInfo.urgeInfo.status === 0 ? '4' : '5'
      } else if (this.bookInfo.isSerial === 0 && !this.showNotification) {
        this.buttonStatus = (this.endInfo.vipExperienceCardInfo.status === 0 && !this.vipExperienceCardInfoControl) ? '1' : '2'
      }
      if (compareVersion('1.48.10', this.version) >= 0 && Number(this.platform) === 5) {
        if (this.bookInfo && this.bookInfo.isShowVideo === 1) {
          // 加载视频模块
          getVideoList(this.currbookId).then(res => {
            const { data } = res
            if (!data || data.dataList.length === 0) {
              this.getEndCategoryBookCommon()
              return
            }
            this.videolists = data && data.dataList
            this.showVideo = true
            mBuryPoint('11', {
              bookTailEnter: 'bookTailEnter',
              enterType: '2',
              bookId: this.currbookId,
              buttonStatus: this.buttonStatus
            })
          })
          return
        } else {
          this.getEndCategoryBookCommon()
        }
      } else {
        this.getEndCategoryBookCommon()
      }
    })
    window.addEventListener('scroll', this.handleScroll, true)
    if (window.ibreader) {
      window.ibreader.setInterceptRefresh(true)
    }
  },
  methods: {
    notificationResume(data) {
      const { openNotification } = JSON.parse(data)
      // 开启返回
      if (openNotification * 1 === 1) {
        this.showNotificationResume = true
      }
    },
    getEndCategoryBookCommon() {
      //  整合进入文章阅读页面
      getEndCategoryBook(this.bookId, this.pageNum, this.mId, this.currbookId).then(res => {
        this.endCategoryBookResponseHandler(res.data)
        mBuryPoint('11', {
          bookTailEnter: 'bookTailEnter',
          enterType: '1',
          bookId: this.currbookId,
          buttonStatus: this.buttonStatus,
          expGroup: res.data.expGroup
        })
      })
    },
    gotoShelf() {
      window.location.assign('breader://bookstore/library')
    },
    gotoRead(item) { // 点击去阅读
      window.location.assign(`breader://www.bayread.com/bookview/bookread?bookId=${item.bookId}&source=bookslast&chapterNum=0`)
      mBuryPoint('11', {
        bookTailEnter: 'bookTailEnter',
        enterType: '2',
        clickRead: 'clickRead',
        bookId: item.bookId,
        vedioId: item.id || '',
        reportInfo: item.reportInfo || {},
        expGroup: this.expGroup
      })
    },
    clickVideo(item) { // 点击去看视频
      mBuryPoint('11', {
        bookTailEnter: 'bookTailEnter',
        enterType: '2',
        clickVedio: 'clickVedio',
        bookId: item.book.bookId,
        vedioId: item.id,
        expGroup: this.expGroup
      })
      // 跳转视频播放
      bk.call('RouterToVideo', {
        uri: item.extendInfo.scheme
      }, () => {
        console.log('播放视频')
      })
    },
    urgeforbook() { // 催更/开启通知
      if (!this.showNotification) {
        // 点击催更的点
        mBuryPoint('11', {
          bookTailEnter: 'bookTailEnter',
          clickUpdate: 'clickUpdate',
          bookId: this.bookId,
          expGroup: this.expGroup
        })
        // 催更
        getReadUrge(this.currbookId, this.chapterNum).then(() => {
          this.endInfo.urgeInfo.status = 1
        })
      } else {
        // 点击开启通知
        bk.call('notificationOpen', {}, () => {})
      }
    },
    rewardHandler() { // 打赏作者
      mBuryPoint('11', {
        bookTailEnter: 'bookTailEnter',
        clickReward: 'clickReward',
        bookId: this.currbookId,
        expGroup: this.expGroup
      })
      const rewardUrl = `breader://reward?bookId=${this.currbookId}`
      window.location = rewardUrl
    },
    commentHandler() { // 参与评分
      mBuryPoint('11', {
        bookTailEnter: 'bookTailEnter',
        clickScore: 'clickScore',
        bookId: this.currbookId,
        expGroup: this.expGroup
      })
      let version = this.version
      if (compareVersion('1.41.9', version) > 0) {
        let origin = window.location.origin
        let url = origin + '/BKH5-post_bar.html?bookId=' + this.currbookId
        routerToNative(url)
        return
      }
      window.location = 'breader://comment'
    },
    addShelf() { //  加入书架
      mBuryPoint('11', {
        bookTailEnter: 'bookTailEnter',
        enterType: '1',
        addBookShelf: 'addBookShelf',
        bookId: this.bookId,
        expGroup: this.expGroup
      })
      const addBookShelfUrl = `breader://addBookshelf?bookId=${this.bookId}&goRead=0&source=${this.source}`
      window.location = addBookShelfUrl
    },
    addShelfAndRead(book = { bookId: this.bookId }) { // 加入书架并继续阅读
      mBuryPoint('11', {
        bookTailEnter: 'bookTailEnter',
        enterType: '1',
        addBookShelfAndRead: 'addBookShelfAndRead',
        bookId: book.bookId,
        expGroup: this.expGroup
      })
      const addBookShelfAndReadUrl = `breader://addBookshelf?bookId=${book.bookId}&goRead=1&source=${this.source}`
      window.location = addBookShelfAndReadUrl
    },
    receiveforbook() {  // 领取VIP
      // 点击领取的点
      mBuryPoint('11', {
        bookTailEnter: 'bookTailEnter',
        clickVip: 'clickVip',
        bookId: this.currbookId,
        expGroup: this.expGroup
      })
      getVipCard(this.endInfo.vipExperienceCardInfo.id).then(() => {
        this.vipExperienceCardInfoControl = true
      }).catch(err => {
        console.log(err)
      })
    },
    handleDealBoostList(data) {
      data = Array.isArray(data) ? data : []
      const result = data.filter(item => {
        return item.subType === 29
      })
      let target
      if (result.length <= 0) {
        return
      }
      target = result[0]
      this.boostTitle = target.title
      this.boostList = Array.isArray(target.contentList) ? target.contentList : []
      if (this.boostList.length > 0) {
        let tempBookIds = this.boostList.map(item => {
          return item.bookId
        })
        let result = {
          eventKey: 2,
          type: 'exposure',
          bookid: tempBookIds.join(','),
          expGroup: this.expGroup
        }
        mBuryPoint(null, result)
      }
    },
    endCategoryBookResponseHandler(res) {
      if (res.expGroup && res.expGroup === 'A') { // 走 test A
        // res.pointsBarrelBookList[1].bookCoverUrl = 'http://cdn.ibreader.com/group1/M00/59/24/a.jpg'
        this.pointsBarrelBookList = res.pointsBarrelBookList
      }
      this.expGroup = res.expGroup
      if (!res || !res.bookInfo) return
      const { bookName, isSerial, bookId } = res.bookInfo
      this.bookId = bookId
      let _bookName = ''
      if (bookName.length > 9) {
        _bookName = bookName.substring(0, 9) + '...'
      } else {
        _bookName = bookName
      }

      // isSerial true 连载中 | false 完结
      let _serialValue = ''
      if (isSerial) {
        _serialValue = '连载中'
      } else {
        _serialValue = '完结'
      }
      res.bookInfo.serialValue = _serialValue
      res.bookInfo.bookName = _bookName
      const { grade } = res.bookInfo
      const newGrade = String(grade).length > 1 ? grade : grade + '.0'
      res.bookInfo.grade = newGrade
      this.endCategoryBook = res.bookInfo

      if (res.hasOwnProperty('tag')) {
        this.showTag = true
      } else {
        this.showTag = false
      }
      if (res.hasOwnProperty('tag')) {
        this.endCategoryBook = { ...this.endCategoryBook, tag: res.tag }
      }
      this.pageNum = res.pageNum
      this.content = res.bookShare.content
      this.contentTitle = res.bookShare.title
    },
    refreshHandler() {  // 换一本
      getEndCategoryBook(this.bookId, Number(this.pageNum) + 1, this.mId, this.currbookId).then(res => {
        this.endCategoryBookResponseHandler(res.data)
        const result = {
          action: 'endCategoryBook',
          bookId: this.bookId,
          expGroup: this.expGroup
        }
        mBuryPoint(null, result)
      })
    }
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../styles/index.styl';
@import './index.styl';
</style>
