<template>
<div class="subject_book" @click="handleClickBook">
  <img :src="bookInfo.bookCoverUrl" class="book_cover" alt=" " @error='errorImg'>
  <div class="book_info">
    <div class="book_name">{{bookInfo.bookName}}</div>
    <div class="book_desc">{{dealDesc}}</div>
    <div class="book_bottom">
      <div class="book_tag_status">
        <span class="book_tag book_item">{{bookInfo.classify}}</span>
        <span  class="book_status book_item">{{bookInfo.isSerial ? '连载':'完结'}}</span>
      </div>
      <div class="book_read">去阅读</div>
    </div>
  </div>
</div>
</template>
<script>
export default {
  props: {
    bookInfo: Object
  },
  data() {
    return {
      defaultImg: require('@/assets/special_subject/book_default.png')
    }
  },
  methods: {
    handleClickBook() {
      this.$emit('handleClickBook', this.bookInfo)
    },
    errorImg(e) {
      if (e && e.type === 'error') {
        e.target.src = this.defaultImg
      }
    }
  },
  computed: {
    dealDesc() {
      let result = this.bookInfo.intro || ''
      if (result.length > 50) {
        result = result.substring(0, 50) + '...'
      }
      return result
    }
  }
}
</script>
<style lang="stylus">
.subject_book
  width 355px
  height 130px
  background rgba(255, 255, 255, 1)
  border-radius 12px
  box-sizing border-box
  padding 15px 0 15px 11px
  display flex
  font-family PingFangSC-Medium, PingFang SC
  margin 0 auto 15px
  .book_cover
    width 74.2px
    height 100px
    border-radius 6px
    margin-right 9px
    background url('../../../assets/special_subject/book_default.png') no-repeat 100%/contain
  .book_info
    flex 1
    position relative
    .book_name
      width 250px
      font-size 14px
      font-weight 500
      line-height 19px
      color rgba(22, 22, 22, 1)
      white-space nowrap
      text-overflow ellipsis
      overflow hidden
    .book_desc
      font-size 12px
      color rgba(153, 153, 153, 1)
      font-weight 400
      margin 5px 0 6px
      width 250px
      line-height 17px
    .book_bottom
      display flex
      box-sizing border-box
      align-items center
      justify-content space-between
      position absolute
      bottom -4px
      width 200%
      transform scale(0.5)
      transform-origin left bottom
      .book_tag_status
        font-size 0
        .book_item
          padding 8px 14px
          border-radius 10px
          background rgba(240, 240, 240, 1)
          font-size 20px
          color rgba(153, 153, 153, 1)
          font-weight 400
          margin-right 18px
          display inline-block
          line-height 1
      .book_read
        width 140px
        height 52px
        line-height 52px
        background rgba(177, 139, 115, 1)
        border-radius 166px 0 0 166px
        font-size 28px
        font-weight 500
        color #ffffff
        text-align center
</style>