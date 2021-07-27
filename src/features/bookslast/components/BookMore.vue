<template lang="pug">
#book_more
  header
    h4 {{ title }}
    span.exchange_another_book(
      v-if="isExchange && mId === '' && expGroup === 'B'"
      @click="refreshHandler"
      ) 换一换
  content(v-if="booklist.length < 3  || isExchange")
    BookView(
      v-for="item in booklist"
      :book="item"
      :key="item.bookId"
      :content="content"
      @routeRead="routeRead")
  content(v-if="booklist.length > 2 && !isExchange")
    .book_more_three
      .book_item(v-for="(item, key) in booklist" @click="routeRead(item)" :key="item.bookId" v-if="key < 3")
        img.img(:src="item.bookCoverUrl" :onerror="defaultImg")
        p.book_item_bookname {{ item.bookName }}
        p.book_item_hot {{ item.hot }}
</template>
<script>
import BookView from './BookView.vue'
export default {
  components: {
    BookView
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    isExchange: {
      type: Boolean,
      default: false
    },
    booklist: {
      type: Array,
      default: () => {
        return []
      }
    },
    content: {
      type: String,
      default: ''
    },
    mId: {
      type: String,
      default: ''
    },
    expGroup: {
      type: String,
      default: 'B'
    }
  },
  data() {
    return {
      defaultImg: 'this.src="'+require('../../../assets/bookslast/book_default.png')+'"'
    }
  },
  methods: {
    routeRead(book) {
      this.$emit('handleGoBookDetail', book)
    },
    refreshHandler() {
      this.$emit('refreshHandler')
    }
  },
  mounted() {}
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
#book_more
  padding 20px 16px 10px
  header
    display flex
    flex-direction row
    justify-content space-between
    align-items center
    h4
      font-size 18px
      font-weight bold
      color #000
    .exchange_another_book
      color #666666
      font-size 12px
  .book_more_three
    display flex
    flex-direction row
    justify-content space-between
    .book_item
      width 90px
      display inline-block
      padding-top 20px
      .img
        width 100%
        height 120px
        border-radius 4px
      .book_item_bookname
        width 100%
        text-overflow ellipsis
        white-space nowrap
        overflow hidden
        font-size 12px
        font-family PingFangSC-Regular, PingFang SC
        font-weight bold
        color #000000
      p.book_item_hot
        font-size 12px
        font-family PingFangSC-Regular, PingFang SC
        color #999999
</style>