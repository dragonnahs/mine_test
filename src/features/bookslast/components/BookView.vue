<template lang="pug">
#book_view(@click="routeRead()")
  img.book_cover(:src="book.bookCoverUrl" :onerror="defaultImg")
  .book_about
    span.book_title
      em.title_content {{ book.bookName || '' }}
      em.score(v-if="book.score !== '0.0'") {{ book.score }}
    span.book_desc(v-if="!content") {{ book.intro || '' }}
    span.book_desc.book_desc_author(v-else) {{ book.author || '' }}
    span.book_tag
      em(v-for="(item, key) in tags" :style="tagColors[key]") {{ item }}
</template>
<script>
export default {
  props: ['book', 'content'],
  computed: {
    tags() {
      const { classify, hot, isSerial } = this.book
      let serialValue = ''
      if (isSerial) {
        serialValue = '连载中'
      } else {
        serialValue = '完结'
      }
      return [classify, hot, serialValue].filter(item => item)
    }
  },
  data() {
    return {
      tagColors: [
        {
          color: '#1C586E',
          backgroundColor: '#D6F4FF'
        },
        {
          color: '#56410D',
          backgroundColor: '#FFEFC8'
        },
        {
          color: '#6B341D',
          backgroundColor: '#F9DDD9'
        },
        {
          color: '#1A473E',
          backgroundColor: '#DCEBE8'
        }
      ],
      defaultImg: 'this.src="'+require('../../../assets/bookslast/book_default.png')+'"'
    }
  },
  methods: {
    routeRead() {
      this.$emit('routeRead', this.book)
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
#book_view
  display flex
  flex-direction row
  padding-top 21px
  .book_cover
    font-size 12px
    width 72px
    height 95px
    margin-right 15px
    display inline-block
    border-radius 4px
    box-shadow 0 0 6px 0 rgba(0,0,0,0.10)
  .book_about
    font-size 14px
    flex 1
    display flex
    flex-direction column
    justify-content space-between
    position relative
    .book_title
      font-size 16px
      font-family PingFangSC-Medium, PingFang SC
      font-weight bold
      color #000000
      line-height 18px
      height 18px
      display flex
      flex-direction row
      justify-content space-between
      em.title_content
        max-width 230px
        overflow hidden
        white-space nowrap
        text-overflow ellipsis
      em.score
        color #FF5A00
    .book_desc
      font-size 14px
      font-family PingFangSC-Regular, PingFang SC
      font-weight 400
      color #999999
      line-height 17px
      width 256px
      text-overflow ellipsis
      display -webkit-box
      -webkit-line-clamp 2
      -webkit-box-orient vertical
      overflow hidden
    .book_desc_author
      position absolute
      top 27px
      left 0
      padding-left 20px
      box-sizing border-box
      &:before
        content ''
        position absolute
        left 0
        top 0
        width 16px
        height 16px
        background url('../../../assets/bookslast/bookslast_9.png') no-repeat center center
        background-size cover
    .book_tag
      em
        margin-right 6px
        padding 1px 5px
        line-height normal
        font-size 12px
        transform scale(0.833)
        border-radius 4px
      em:last-child
        margin-right 0
</style>