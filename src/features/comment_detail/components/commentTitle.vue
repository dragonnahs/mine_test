<template lang="pug">
  #comment-main
    div.author
      img(v-if='commentInfo.headUlr' :src='commentInfo.headUlr' :onerror='errorImg')
      img(v-else :src='defaultUserImg')
      span {{commentInfo.name}}
    div.comment-title(v-if='commentInfo.title') {{commentInfo.title}}
    div.comment-content {{isShowMore?content:this.commentInfo.content}}
      span.more(v-show='isShowMore' @click='handleShowMore') 更多
    img.comment-img(v-if='commentInfo.image' :src='commentInfo.image')
    div.comment-tip
      div.tip-left
        span.comment-time {{getDateFormat}}
        span.comment-delete(v-if='commentInfo.mine' @click='deleteShowComment') 删除
      div.tip-right(@click='handleStar')
        img(src='@/assets/community/unstar.png' v-if='!commentInfo.liked')
        img(src='@/assets/community/star.png' v-else)
        | {{commentInfo.stars > 999 ? '999+' : commentInfo.stars}}
</template>

<script>
import { semanticsDate } from '@/utils/utils'
export default {
  props: {
    commentInfo: Object
  },
  data() {
    return {
      isShowMore: true,
      defaultUserImg: require('../../../assets/community/user_default_img.png'),
      errorImg: 'this.src="'+require('../../../assets/community/user_default_img.png')+'"'
    }
  },
  methods: {
    deleteShowComment() {
      this.$parent.isShowDeleteFlag = true
      this.$parent.needDeleteCommentId = this.commentInfo.commentId
      this.$parent.isCommentDelete = true
    },
    handleShowMore() {
      this.isShowMore = !this.isShowMore
    },
    handleStar() {
      this.$emit('toggleStar')
    },
  },
  computed: {
    content() {
      let content = this.commentInfo.content
      if (content.length > 200) {
        this.isShowMore = true
        return content.substring(0, 200) + '...'
      }
      this.isShowMore = false
      return content
    },
    getDateFormat() {
      return semanticsDate(this.commentInfo.time)
    }
  }
}
</script>
<style lang="stylus" scoped>
@import './commentTitle.styl'
</style>