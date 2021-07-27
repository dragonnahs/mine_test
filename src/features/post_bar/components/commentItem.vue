<template lang="pug">
  #comment-item(@click='handleGoCommentDetail')
    div.author
      img(v-if='commentInfo.headUlr' :src='commentInfo.headUlr' :onerror='errorImg')
      img(v-else :src='defaultUserImg')
      span {{commentInfo.name}}
    div.title(v-if='title') {{title}}
    div.content1 {{isShowMore ? content : this.commentInfo.content}}
      span.content-more(v-if='isShowMore' @click.stop='isShowMore = !isShowMore') 更多
    //- div.img(v-if='commentInfo.image' :style='{backgroundImage: `url(${commentInfo.image})`}')
      //- img(:src='commentInfo.image')
    div.comment-info
      div.left
        span.time {{getTime}}
        span.delete(v-if='commentInfo.mine'
        @click.stop='deleteShowComment') 删除
      div.right
        div.reply
          img(src='@/assets/community/reply_icon.png')
          span {{commentInfo.replyNum > 999 ? '999+' : (commentInfo.replyNum || 0)}}
        div.star(@click.stop='toggleStar')
          img(src='@/assets/community/unstar.png' v-if='!commentInfo.liked')
          img(src='@/assets/community/star.png' v-else)
          span {{commentInfo.stars > 999 ? '999+' : (commentInfo.stars || 0)}}
</template>
<script>
import { skipUrl } from '@/utils/nativeToH5/index'
import { semanticsDate } from '@/utils/utils.js'
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
    },
    toggleStar() {
      this.$emit('toggleStar', this.commentInfo)
    },
    handleGoCommentDetail() {
      skipUrl({
        skipUrl: `${window.location.origin}/BKH5-comment_detail.html?commentId=${this.commentInfo.commentId}`
      })
    }
  },
  computed: {
    content() {
      let content = this.commentInfo.content
      if (content.length > 65) {
        this.isShowMore = true
        return content.substring(0, 65) + '...'
      }
      this.isShowMore = false
      return content
    },
    title() {
      let title = this.commentInfo.title
      if (title.length > 40) {
        return title.substring(0, 40) + '...'
      }
      return title
    },
    getTime() {
      let time = semanticsDate(this.commentInfo.time)
      return time
    }
  }
}
</script>

<style lang="stylus">
@import './commentItem.styl'
</style>