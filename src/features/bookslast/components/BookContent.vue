<template lang="pug">
.bookslast-content
  .edit-push(v-if="boostList.length > 0")
    h4.edit-push-icon {{boostTitle}}
    .edit-push-books
      div(v-for="item in boostList"
          :key="item.bookId"
          class="edit-push-book-item"
          @click="handleGoBookDetail(item)")
        img(:src="item.bookCoverUrl"  :onerror="defaultImg")
        .edit-push-bookname {{item.bookName}}
        .edit-push-hot {{ item.popularity }}
  .book_test_A_content
    BookMore(
      title="读完本书的人还在读"
      isExchange=true
      :booklist='bookItem'
      :mId="mId"
      :content="content"
      :expGroup="expGroup"
      v-if="bookItem.length !== 0"
      @refreshHandler="refreshHandler"
      v-on:handleGoBookDetail="handleGoBookDetail"
    )
  .content-book-video(v-if="content")
    div(style="position: relative;background: #ffffff;")
      p.content-title {{ contentTitle }}
      p.content {{ content }}
  .bottom_parent(v-if="content")
    p.right(@click="addShelfAndRead") 加入书架并继续阅读
</template>
<script>
export default {
  props: ['bookInfo',
    'boostList',
    'boostTitle',
    'endCategoryBook',
    'contentTitle',
    'content',
    'mId',
    'showtip',
    'showTag',
    'expGroup',
    'platform'],
  components: {
    BookMore: () => import('./BookMore.vue')
  },
  computed: {
    bookItem() {
      if (JSON.stringify(this.endCategoryBook) === '{}') {
        return []
      } else {
        return [this.endCategoryBook]
      }
    }
  },
  mounted() {
  },
  data() {
    return {
      styles: {
        borderTop: '0.16rem solid #ffffff'
      },
      defaultImg: 'this.src="'+require('../../../assets/bookslast/book_default.png')+'"'
    }
  },
  methods: {
    handleGoBookDetail(item) {
      this.$emit('handleGoBookDetail', item)
    },
    refreshHandler() {
      this.$emit('refreshHandler')
    },
    addShelf() {
      this.$emit('addShelf')
    },
    addShelfAndRead() {
      this.$emit('addShelfAndRead')
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '../index.styl'
</style>