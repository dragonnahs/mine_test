<template lang="pug">
#wrapper(ref='wrapper')
  #reply-detail.clearfix
    comment-reply(:isShowReply='false'
    :item='replyInfo'
    :isShowBorder='false'
    :isShowDelete='false'
    @toggleReplyStar='toggleReplyStar')
    div.reply-box
      div.reply-all-title 全部回复
        span(v-if='replyInfo.count > 0') ({{replyInfo.count}}条)
      template(v-if='list.length>0')
        comment-reply(v-for='item in list'
        :key='item.id'
        :item='item'
        :specialAuthor='true'
        :isShowAllContent='true'
        @toggleReplyStar='toggleReplyStarItem'
        @handlClickReply='handlClickReply')
        div.reply-tip {{isHasMore ? '加载中' : '暂无更多'}}
      div.no-reply(v-else) 还没有回复，就等你了
  reply-input(@publishReply='publishReply')
  delete-dialog(v-show='isShowDeleteFlag'
  @deleteComment='deleteReply')
</template>

<script>
import BScroll from 'better-scroll'
import CommentReply from '@/features/comment_detail/components/commentReply'
import ReplyInput from '@/features/comment_detail/components/replyInput'
import { toast, setHeader, judgeIsLogined, skipLoginPage } from '@/utils/nativeToH5/index'
import DeleteDialog from '@/features/post_bar/components/deleteDialog'

import { getQueryString } from '@/utils/url'
import { getReplyDetail, getReplyList } from './request'
import {
  publishReply,
  deleteReply } from '../comment_detail/request'

import bus from '../comment_detail/bus'
import {
  getStar,
  getUnStar  } from '../post_bar/request'
export default {
  components: {
    CommentReply,
    ReplyInput,
    DeleteDialog
  },
  data() {
    return {
      replyInfo: {},
      list: [],
      scroll: null,
      pageNo: 0,
      replyId: '',
      isShowDeleteFlag: false,
      needDeleteCommentId: '',
      replyItemInfo: {},
      isHasMore: true
    }
  },
  methods: {
    initBScroll() {
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.wrapper, { click: true, tap: true })
        this.scroll.on('scrollEnd', () => {
          // 滚动到底部
          if (this.scroll.y <= (this.scroll.maxScrollY + 50) && this.isHasMore) {
            this.getReplyList()
          }
        })
        this.$refs.wrapper.addEventListener('tap', () => {
          bus.$emit('replyInputBlur')
        }, false)
      })
    },
    async getReplyList() {
      let replyId = getQueryString('replyId')
      let res = await getReplyList(replyId, this.pageNo)
      if (res.code === 100) {
        if (res.data && res.data.length > 0) {
          this.list = this.list.concat(res.data)
          this.pageNo += 1
          this.isHasMore = true
        } else {
          this.isHasMore = false
        }
      }
      this.scroll.refresh()
    },
    async getReplyDetail() {
      let replyId = getQueryString('replyId')
      let res = await getReplyDetail(replyId)
      if (res.code === 100) {
        this.replyInfo = res.data
      }
    },
    initPage() {
      this.getReplyDetail()
      this.getReplyList()
      this.initBScroll()
    },
    async publishReply(content) {
      let parentId
      if (this.replyItemInfo.replyId) {
        parentId = this.replyItemInfo.replyId
      } else {
        parentId = this.replyInfo.replyId
      }
      let res = await publishReply(parentId, content, 2)
      if (res.code === 100) {
        toast({
          content: '回复成功'
        })
        this.pageNo = 0
        this.list = []
        this.getReplyList()
      } else {
        toast({
          content: res.msg
        })
      }
      this.replyItemInfo = {}
    },
    async deleteReply() {
      let res = await deleteReply(this.needDeleteCommentId)
      if (res.code === 100) {
        this.list = this.list.filter(item => {
          return item.replyId !== this.needDeleteCommentId
        })
        this.isShowDeleteFlag = false
        this.needDeleteCommentId = ''
      } else {
        toast({
          content: res.msg
        })
      }
    },
    showPageReload() {
      setHeader({
        title: '回复详情',
        titleColor: '#333333',
        refreshIcon: 0,
        closeIcon: 0,
      })
    },
    toggleReplyStar() {
      judgeIsLogined({
        callback: 'isLoginedToggleReplyStarRD'
      })
    },
    async isLoginedToggleReplyStarRD() {
      if (this.replyInfo.liked) {
        let res = await getUnStar(this.replyInfo.replyId, 2)
        if (res.code === 100) {
          this.replyInfo.liked = false
          this.replyInfo.stars -= 1
          localStorage.setItem('replyDetailInfo', JSON.stringify(this.replyInfo))
        }
        return
      }
      let res = await getStar(this.replyInfo.replyId, 2)
      if (res.code === 100) {
        this.replyInfo.liked = true
        this.replyInfo.stars += 1
        localStorage.setItem('replyDetailInfo', JSON.stringify(this.replyInfo))
      }
    },
    toggleReplyStarItem(item) {
      this.replyItemInfo = item
      judgeIsLogined({
        callback: 'isLoginedToggleReplyStarRDI'
      })
    },
    async isLoginedToggleReplyStarRDI() {
      if (this.replyItemInfo.liked) {
        let res = await getUnStar(this.replyItemInfo.replyId, 2)
        if (res.code === 100) {
          this.replyItemInfo.liked = false
          this.replyItemInfo.stars -= 1
          this.getCorrectReplyList(this.replyItemInfo)
        }
        this.replyItemInfo = {}
        return
      }
      let res = await getStar(this.replyItemInfo.replyId, 2)
      if (res.code === 100) {
        this.replyItemInfo.liked = true
        this.replyItemInfo.stars += 1
        this.getCorrectReplyList(this.replyItemInfo)
      }
      this.replyItemInfo = {}
    },
    getCorrectReplyList(replyItemInfo) {
      console.log(replyItemInfo)
      this.list.map(item => {
        if (item.replyId === replyItemInfo.replyId) {
          item = replyItemInfo
        }
      })
    },
    handlClickReply(item) {
      this.replyItemInfo = item
      judgeIsLogined({
        callback: 'isLoginedHandleReplyInputRDI'
      })
    },
    isLoginedHandleReplyInputRDI() {
      bus.$emit('getReplyFoucs', this.replyItemInfo)
      bus.$emit('clickReplyBtn', this.replyItemInfo)
    },
  },
  mounted() {
    this.initPage()
    setHeader({
      title: '回复详情',
      titleColor: '#333333',
      refreshIcon: 0,
      closeIcon: 0,
    })
    window.isLoginedToggleReplyStarRD = (isLogined) => {
      if (isLogined) {
        this.isLoginedToggleReplyStarRD()
      } else {
        skipLoginPage()
      }
    }
    window.isLoginedToggleReplyStarRDI = (isLogined) => {
      if (isLogined) {
        this.isLoginedToggleReplyStarRDI()
      } else {
        skipLoginPage()
      }
    }
    window.isLoginedHandleReplyInputRDI = (isLogined) => {
      if (isLogined) {
        this.isLoginedHandleReplyInputRDI()
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
@import './index.styl'
</style>
