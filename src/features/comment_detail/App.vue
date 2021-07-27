<template lang="pug">
    #wrapper(ref='wrapper')
      #comment
        comment-title(:commentInfo='commentInfo'
        @toggleStar='toggleStar')
        div.comment-reply
          div.comment-reply-title 全部评论
          comment-reply(v-for='item in list' :key='item.id' :item='item'
          @goReplyDetailPage='goReplyDetailPage'
          @toggleReplyStar='toggleReplyStar'
          @handlClickReply='handlClickReply')
          div.reply-tip(v-if='list.length > 0') {{isHasMore ? '加载中' : '暂无更多'}}
          div.reply-tip.reply-tip-null(v-else) 还没有回复，就等你了
      reply-input(@publishReply='publishReply')
      delete-dialog(v-show='isShowDeleteFlag'
      @deleteComment='deleteComment')
</template>

<script>
import BScroll from 'better-scroll'
import CommentTitle from './components/commentTitle'
import CommentReply from './components/commentReply'
import ReplyInput from './components/replyInput'
import { getQueryString } from '@/utils/url'
import { closeCurrentPage, skipUrl, toast, setHeader, judgeIsLogined, skipLoginPage } from '@/utils/nativeToH5/index'
import DeleteDialog from '@/features/post_bar/components/deleteDialog'

import bus from './bus'
import { getCommentInfo, getCommentReplyList,
  publishReply,
  deleteReply } from './request'
import { deleteComment,
  getStar,
  getUnStar  } from '../post_bar/request'
export default {
  components: {
    CommentTitle,
    CommentReply,
    ReplyInput,
    DeleteDialog
  },
  data() {
    return {
      isShow: true,
      list: [],
      scroll: null,
      commentInfo: {},
      pageNo: 0,
      replyId: '',
      isShowDeleteFlag: false,
      needDeleteCommentId: '',
      isCommentDelete: true,
      replyInfo: {},
      isHasMore: true
    }
  },
  methods: {
    goReplyDetailPage(replyId) {
      skipUrl({
        skipUrl: `${window.location.origin}/BKH5-reply_detail.html?replyId=${replyId}`
      })
    },
    initBScroll() {
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.wrapper, { click: true, tap: true })
        this.scroll.on('scrollEnd', () => {
          // 滚动到底部
          if (this.scroll.y <= (this.scroll.maxScrollY + 50) && this.isHasMore) {
            this.getCommentReplyList()
          }
        })
        this.$refs.wrapper.addEventListener('tap', () => {
          bus.$emit('replyInputBlur')
        }, false)
      })
    },
    async getCommentInfo() {
      const commentId = getQueryString('commentId')
      let res = await getCommentInfo(commentId)
      if (res.code === 100) {
        this.commentInfo = res.data || {}
        localStorage.setItem('postBarInfo', JSON.stringify(this.commentInfo))
      }
    },
    initPage() {
      this.getCommentInfo()
      this.getCommentReplyList()
      this.initBScroll()
    },
    async publishReply(content) {
      let parentId, type
      if (this.replyInfo.replyId) {
        parentId = this.replyInfo.replyId
        type = 2
      } else {
        parentId = this.commentInfo.commentId
        type = 1
      }
      let res = await publishReply(parentId, content, type)
      console.log(res, res.code === 100, 222)
      if (res.code === 100) {
        toast({
          content: '回复成功'
        })
        this.pageNo = 0
        this.list = []
        this.getCommentInfo()
        this.getCommentReplyList()
      } else {
        toast({
          content: res.msg
        })
      }
      this.replyInfo = {}
    },
    async getCommentReplyList() {
      const commentId = getQueryString('commentId')
      let res = await getCommentReplyList(commentId, this.pageNo)
      console.log(res.data.replyList)
      if (res.code === 100) {
        if (res.data && res.data.replyList) {
          this.list = this.list.concat(res.data.replyList)
          this.pageNo = this.pageNo + 1
          this.isHasMore = true
        } else {
          this.isHasMore = false
        }
        this.showPageReload()
      }
      this.scroll.refresh()
    },
    toggleStar() {
      judgeIsLogined({
        callback: 'isLoginedCommentToggleStar'
      })
    },
    async toggleStarLogined() {
      if (this.commentInfo.liked) {
        let res = await getUnStar(this.commentInfo.commentId)
        if (res.code === 100) {
          this.commentInfo.liked = false
          this.commentInfo.stars -= 1
          localStorage.setItem('postBarInfo', JSON.stringify(this.commentInfo))
        }
        return
      }
      let res = await getStar(this.commentInfo.commentId)
      if (res.code === 100) {
        this.commentInfo.liked = true
        this.commentInfo.stars += 1
        localStorage.setItem('postBarInfo', JSON.stringify(this.commentInfo))
      }
    },
    async deleteComment() {
      if (this.isCommentDelete) {
        let res = await deleteComment(this.needDeleteCommentId)
        if (res.code === 100) {
          this.commentInfo.isLocalDeleted = true
          localStorage.setItem('postBarInfo', JSON.stringify(this.commentInfo))
          this.needDeleteCommentId = ''
          closeCurrentPage()
        } else {
          toast({
            content: res.msg
          })
        }
        return
      }
      this.deleteReply()
    },
    async deleteReply() {
      let res = await deleteReply(this.needDeleteCommentId)
      console.log(res)
      if (res.code === 100) {
        this.list = this.list.filter(item => {
          return item.replyId !== this.needDeleteCommentId
        })
        this.isShowDeleteFlag = false
      } else {
        toast({
          content: res.msg
        })
      }
    },
    showPageReload() {
      setHeader({
        title: '帖子详情',
        titleColor: '#333333',
        refreshIcon: 0,
        closeIcon: 0,
      })
      // 通过缓存处理子页面操作
      let replyDetailInfo = localStorage.getItem('replyDetailInfo')
      replyDetailInfo = replyDetailInfo ? JSON.parse(replyDetailInfo) : ''
      if (replyDetailInfo) {
        this.getCorrectReplyList(replyDetailInfo)
        localStorage.removeItem('replyDetailInfo')
      }
    },
    toggleReplyStar(item) {
      this.replyInfo = item
      judgeIsLogined({
        callback: 'isLoginedToggleReplyStar'
      })
    },
    getCorrectReplyList(replyInfo) {
      console.log(replyInfo)
      this.list = this.list.map(item => {
        if (item.replyId === replyInfo.replyId) {
          item = replyInfo
        }
        return item
      })
    },
    async isLoginedToggleReplyStar() {
      if (this.replyInfo.liked) {
        let res = await getUnStar(this.replyInfo.replyId, 2)
        if (res.code === 100) {
          this.replyInfo.liked = false
          this.replyInfo.stars -= 1
          this.getCorrectReplyList(this.replyInfo)
        }
        this.replyInfo = {}
        return
      }
      let res = await getStar(this.replyInfo.replyId, 2)
      if (res.code === 100) {
        this.replyInfo.liked = true
        this.replyInfo.stars += 1
        this.getCorrectReplyList(this.replyInfo)
      }
      this.replyInfo = {}
    },
    handlClickReply(item) {
      this.replyInfo = item
      judgeIsLogined({
        callback: 'isLoginedHandleClickReply'
      })
    },
    isLoginedHandleClickReply() {
      bus.$emit('getReplyFoucs', this.replyInfo)
      bus.$emit('clickReplyBtn', this.replyInfo)
    },
  },
  mounted() {
    localStorage.setItem('postBarInfo', JSON.stringify(this.commentInfo))
    this.initPage()
    setHeader({
      title: '帖子详情',
      titleColor: '#333333',
      refreshIcon: 0,
      closeIcon: 0,
    })
    window.isLoginedCommentToggleStar = (isLogined) => {
      if (isLogined) {
        this.toggleStarLogined()
      } else {
        skipLoginPage()
      }
    }
    window.isLoginedToggleReplyStar = (isLogined) => {
      if (isLogined) {
        this.isLoginedToggleReplyStar()
      } else {
        skipLoginPage()
      }
    }
    window.isLoginedToggleReplyStar = (isLogined) => {
      if (isLogined) {
        this.isLoginedToggleReplyStar()
      } else {
        skipLoginPage()
      }
    }
    window.isLoginedHandleClickReply = (isLogined) => {
      if (isLogined) {
        this.isLoginedHandleClickReply()
      } else {
        skipLoginPage()
      }
    }
    window.ibreader.prohibitPull()
  },
  created() {
    window.showPageReload = this.showPageReload
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../styles/index.styl';
@import './index.styl';
</style>
