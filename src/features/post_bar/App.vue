<template lang="pug">
#post-bar(ref='wrapper')
  div
    div.top
      div.book
        img.book-cover(v-if='bookInfo.bookCoverUrl' :src='bookInfo.bookCoverUrl' :onerror='defaultBookCover')
        img.book-cover(v-else :src='nullBookCover')
        div.book-info
          div.book-name {{bookInfo.bookName}}
          div.book-info-bottom
            div.book-info-left
              //- div.book-handle
              div.book-handle(v-if='versionNum >= 1.44 && bookInfo.rank && bookInfo.rank <= 99 && isShowVote')
                div.book-ranking(@click='handleGoRanking')
                  div.book-ranking-num {{bookInfo.rank||0}}
                  div.book-ranking-text {{rankingName}}{{bookInfo.rankingName}}第{{bookInfo.rank||0}}名
                    span.book-right-img
              div.book-tip
                span {{bookInfo.comments}}帖子
            div.book-vote(@click='handleBookVote' v-if='versionNum >= 1.44 && isShowVote') 投票
      div.nav(ref='navDom' v-show='!isFixedTop')
        div.nav-dynamic(
          :class='{"active": type === 1}'
          @click='handleToggleCommentList(1)') 动态
        div.nav-hot(
          :class='{"is-show-hot": isShowHot, "active": type !== 1}'
          @click='handleToggleHot') {{type===3?'我的发布':'热门'}}
          div.hot-box(v-show='isShowHot')
            div.hot-item(
              :class='{"active": type === 2}'
              @click.stop='handleToggleCommentList(2)') 热门
            div.hot-item(
              :class='{"active": type === 3}'
              @click.stop='handleToggleCommentList(3)') 我的发布
    div.wrapper(:class='{"is-fixed-wrapper": isFixedTop}')
      .content
        //- div.ad-box 幸运抽奖100%中奖
        div.comment-box
          comment-item(v-for='item in list' :key='item.id'
          :commentInfo='item'
          @deleteComment='deleteComment'
          @toggleStar='toggleStar')
          div.is-null-comment(v-if='this.list.length === 0') 没有书评就等你了～
          template(v-else)
            div.is-has-more(v-if='isHasMore') 加载中
            div.is-has-more(v-else) 暂无更多
  div.nav(v-show='isFixedTop' :class='{"is-fixed-top": isFixedTop}')
    div.nav-dynamic(
      :class='{"active": type === 1}'
      @click='handleToggleCommentList(1)') 动态
    div.nav-hot(
      :class='{"is-show-hot": isShowHot, "active": type !== 1}'
      @click='handleToggleHot') 热门
      div.hot-box(v-show='isShowHot')
        div.hot-item(
          :class='{"active": type === 2}'
          @click.stop='handleToggleCommentList(2)') 热门
        div.hot-item(
          :class='{"active": type === 3}'
          @click.stop='handleToggleCommentList(3)') 我的发布
  div.publish(@click='handleGoPublishPost' :class='{"publish-animate": !isShowPublishPost}')
    img(src='@/assets/community/publish_icon.png')
    | 发帖
  reply-input(v-show='replyInputFlag' @publishReply='publishReply')
  delete-dialog(v-show='isShowDeleteFlag'
  @deleteComment='deleteComment')
</template>

<script>
import BScroll from 'better-scroll'
import CommentItem from './components/commentItem'
import ReplyInput from '@/features/comment_detail/components/replyInput'
import { getQueryString } from '@/utils/url'
import { getCookie } from '@/utils/utils'
import { skipUrl, setHeader, toast, judgeIsLogined, skipLoginPage, skipRanking, bookVote } from '@/utils/nativeToH5/index'
import DeleteDialog from '@/features/post_bar/components/deleteDialog'
import { mBuryPoint } from '@/utils/buryPoint'
import { nSensorPoint } from '@/utils/index'
import { compareVersion } from '@/utils'

import { publishReply } from '@/features/comment_detail/request'
import { getBookFriendsBarInfo,
  getPostsList,
  deleteComment,
  getStar,
  getUnStar } from './request'
export default {
  components: {
    CommentItem,
    ReplyInput,
    DeleteDialog
  },
  data() {
    return {
      scroll: null,
      isShowHot: false,
      type: 1, // 数据类型1=动态，2=热门，3=我的发布
      list: [],
      bookInfo: {},
      pageNum: 0,
      replyInputFlag: false,
      commentInfo: {},
      isFixedTop: false,
      navDomTop: 0,
      isShowDeleteFlag: false,
      needDeleteCommentId: '',
      isHasMore: true,
      isShowPublishPost: true,
      nullBookCover: require('../../assets/community/book_default.png'),
      defaultBookCover: 'this.src="'+require('../../assets/community/book_default.png')+'"',
      versionNum: 0
    }
  },
  computed: {
    rankingName() {
      switch (this.bookInfo.categoryId) {
      case 98:
        return '男生'
      case 122:
        return '女生'
      case 79:
        return '出版'
      default:
        return '男生'
      }
    },
    isShowVote() {
      // 通过版本筛选是否显示投票和排行榜功能
      return compareVersion('1.61.0', localStorage.getItem('version')) == -1
    }
  },
  methods: {
    initBScroll() {
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.wrapper, { click: true, tap: true, probeType: 3, bounce: false })
        this.scroll.on('scroll', () => {
          this.isFixedTop = (this.navDomTop + this.scroll.y < 0)
          if (this.scroll.directionY == -1) {
            this.isShowPublishPost = true
          } else if (this.scroll.directionY == 1) {
            this.isShowPublishPost = false
          }
        })
        this.scroll.on('scrollEnd', () => {
          // 滚动到底部
          if (this.scroll.y <= (this.scroll.maxScrollY + 50) && this.isHasMore) {
            this.getPostsList()
          }
          if (this.scroll.directionY == -1) {
            this.isShowPublishPost = true
          } else if (this.scroll.directionY == 1) {
            this.isShowPublishPost = false
          }
        })
      })
    },
    handleToggleHot() {
      this.isShowHot = !this.isShowHot
    },
    async handleToggleCommentList(target) {
      this.isShowHot = false
      if (this.type === target) {
        return
      }
      if (target == 2) {
        let bookId = getQueryString('bookId')
        mBuryPoint('6', {
          clickHotSelect: 'clickHotSelect',
          bookId
        })
      }
      this.type = target
      this.scroll.scrollTo(0, 0, 500)
      this.list = []
      this.pageNum = 0
      this.getPostsList()
    },
    initPage() {
      this.navDomTop = this.$refs.navDom.offsetTop
      this.getBookFriendsBarInfo()
      this.getPostsList()
      this.initBScroll()
      let versionStr = getCookie('version')
      let versionArr = versionStr ? versionStr.split('.') : []
      if (versionArr.length > 0) {
        this.versionNum = parseFloat(versionArr[1] + '.' + versionArr[2])
      }
      console.log(this.versionNum, 'aaaa')
    },
    async getBookFriendsBarInfo() {
      let bookId = getQueryString('bookId')
      mBuryPoint('6', {
        enterPostBarIndex: 'enterPostBarIndex',
        bookId
      })
      let res = await getBookFriendsBarInfo(bookId)
      console.log(res)
      if (res.code === 100) {
        this.bookInfo = res.data || {}
        // 新增加神策埋点
        nSensorPoint('BookFriend_Page_View', {
          lw_book_id: bookId,
          lw_book_name: this.bookInfo.bookName
        })
        setHeader({
          title: this.bookInfo.bookName,
          titleColor: '#ffffff',
          refreshIcon: 0,
          closeIcon: 0,
          bgColor: '#709EB2'
        })
      }
    },
    async getPostsList() {
      let bookId = getQueryString('bookId')
      let res = await getPostsList(bookId, this.type, this.pageNum)
      if (res.code === 100) {
        if (res.data && res.data.length > 0) {
          this.list = this.list.concat(res.data)
          this.pageNum += 1
          this.isHasMore = res.data.length === 10
        } else {
          this.isHasMore = false
        }
      }
      this.getDifferList()
      this.scroll.refresh()
    },
    async deleteComment() {
      const res = await deleteComment(this.needDeleteCommentId)
      if (res.code === 100) {
        this.list = this.list.filter(item => {
          return item.commentId !== this.needDeleteCommentId
        })
        this.isShowDeleteFlag = false
      }
    },
    getCorrectList(commentInfo, type) {
      this.list.map(item => {
        if (item.commentId === commentInfo.commentId) {
          item.liked = type > 0
          item.stars = type > 0 ? (item.stars + 1) : (item.stars - 1)
          console.log(item)
        }
      })
    },
    toggleStar(commentInfo) {
      this.commentInfo = commentInfo
      judgeIsLogined({
        callback: 'isLoginedToggleStar'
      })
    },
    handleGoPublishPost() {
      // 点击发帖
      let bookId = getQueryString('bookId')
      mBuryPoint('6', {
        clickPublishPost: 'clickPublishPost',
        bookId
      })
      judgeIsLogined({
        callback: 'isLogined'
      })
    },
    getDifferList() {
      // 返回到首页时，对比下是否有新更改的内容
      let postBarInfo = localStorage.getItem('postBarInfo')
      postBarInfo = postBarInfo ? JSON.parse(postBarInfo) : ''
      if (typeof postBarInfo === 'object') {
        this.list = this.list.filter(item => {
          return !item.isLocalDeleted
        })
        this.list = this.list.map(item => {
          if (item.commentId === postBarInfo.commentId) {
            item = postBarInfo
          }
          return item
        })
        console.log(this.list)
        localStorage.removeItem('postBarInfo')
      }
    },
    showPageReload() {
      setHeader({
        title: this.bookInfo.bookName,
        titleColor: '#ffffff',
        refreshIcon: 1,
        closeIcon: 1,
        bgColor: '#709EB2'
      })
      this.getDifferList()
    },
    async publishReply(content) {
      let parentId = this.commentInfo.commentId
      let type = 1
      let res = await publishReply(parentId, content, type)
      console.log(res, res.code == 100, 22)
      this.replyInputFlag = false
      if (res.code == 100) {
        this.commentInfo.replyNum += 1
        localStorage.setItem('postBarInfo', JSON.stringify(this.commentInfo))
        toast({
          content: '回复成功'
        })
      } else {
        toast({
          content: res.msg
        })
      }
    },
    handleGoRanking() {
      skipRanking({
        categoryId: this.bookInfo.categoryId,
        rankingName: this.bookInfo.rankingName,
        rank: this.bookInfo.rank
      })
    },
    handleBookVote() {
      nSensorPoint('Ballot_Click', {
        lw_book_id: getQueryString('bookId'),
        lw_book_name: this.bookInfo.bookName,
        lw_page_name: 'bookFriend_page'
      })
      judgeIsLogined({
        callback: 'isLoginedBookVote'
      })
    }
  },
  created() {
    window.showPageReload = this.showPageReload
  },
  mounted() {
    this.initPage()
    window.isLogined = (isLogined) => {
      console.log(isLogined, '是否登陆111')
      if (isLogined) {
        skipUrl({
          skipUrl: `${window.location.origin}/BKH5-publish_post.html${window.location.search}`
        })
      } else {
        skipLoginPage()
      }
    }
    window.isLoginedToggleStar = async(isLogined) => {
      if (isLogined) {
        if (!this.commentInfo.liked) {
          let res = await getStar(this.commentInfo.commentId)
          if (res.code === 100) {
            this.getCorrectList(this.commentInfo, 1)
          }
          return
        }
        let res = await getUnStar(this.commentInfo.commentId)
        if (res.code === 100) {
          this.getCorrectList(this.commentInfo, -1)
        }
      } else {
        skipLoginPage()
      }
    }
    window.isLoginedBookVote = (isLogined) => {
      if (isLogined) {
        bookVote({
          bookId: getQueryString('bookId')
        })
      } else {
        skipLoginPage()
      }
    }
    window.ibreader.prohibitPull()
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../styles/index.styl';
@import './index.styl'
</style>
