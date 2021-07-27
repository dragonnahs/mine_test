<template lang="pug">
.special_subject
  .subject_top
    img(:src='coverUrl' v-if='coverUrl' alt=' ')
  .subject_list
    Book(
      v-for='item in subjectInfo.bookInfoVOList'
      :key='item.bookId'
      :bookInfo='item'
      @handleClickBook='handleClickBook')
</template>

<script>
import Book from './components/book'
import { getTopicList } from './request'
import { getQueryString } from '@/utils/url.js'
import { mBuryPoint } from '@/utils/buryPoint'
export default {
  components: {
    Book
  },
  data() {
    return {
      subjectInfo: {},
      source: '',
      topicId: '',
      coverUrl: '', // 地址栏携带的顶部图片地址
    }
  },
  mounted() {
    console.log(11)
    this.init()
  },
  methods: {
    init() {
      console.log(window.location.href)
      let topicId = getQueryString('topicId')
      let source = getQueryString('source')
      this.coverUrl = window.decodeURI(getQueryString('coverUrl'))
      this.source = source
      this.topicId = topicId
      this.getTopicList(topicId)
    },
    async getTopicList(topicId) {
      let res = await getTopicList(topicId)
      console.log(res)
      if (res.code === 100) {
        this.subjectInfo = res.data || {}
      } else {
        this.$showToast(res.msg)
      }
      this.$nextTick(() => {
        document.title = this.subjectInfo.name || '专题活动'
        let temp = this.subjectInfo.bookInfoVOList || []
        temp = temp.map(item => {
          return item.bookId
        })
        mBuryPoint('15', {
          path: this.source,
          source: this.source,
          topic_id: this.topicId,
          bookIds: temp.join(','),
          eventType: 1
        })
      })

    },
    handleClickBook(target) {
      mBuryPoint('15', {
        path: this.source,
        source: this.source,
        topic_id: this.topicId,
        bookId: target.bookId,
        eventType: 2
      })
      window.location.assign(`breader://bookview/bookread?bookId=${target.bookId}&source=${this.source}/topicId_${this.topicId}&userPath=${this.source},topicId_${this.topicId}&chapterNum=0`)
      // window.location.assign(`breader://bookstore/bookDetails?bookId=${target.bookId}&source=${this.source}/topicId_${this.topicId}&userpath=${this.source},${this.topicId}`)
    }
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../styles/index.styl';
@import './index.styl';
</style>
