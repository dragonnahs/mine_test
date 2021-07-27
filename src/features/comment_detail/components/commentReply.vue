<template lang="pug">
  div.reply-item(:class='{"hide-border": !isShowBorder}'
  @click='goReplyDetailPage')
    div.top
      div.top-left
        img(v-if='item.headUlr' :src='item.headUlr' :onerror='errorImg')
        img(v-else :src='defaultUserImg')
        div.user-info
          div.user-name(v-if='specialAuthor')
            span {{item.name}}
            span 回复
            span {{item.parentUserName}}
          div.user-name(v-else) {{item.name}}
          div.time {{getDateFormat}}
    div.middle
      div.reply-content(:class='{"ellipsis": !isShowAllContent}') {{item.content}}
    div.bottom(v-if='item.subReplyList && item.subReplyList.length > 0')
      div.reply-list-item(v-for='innerItem in item.subReplyList' :key='innerItem.id')
        span {{innerItem.userName}}
        span 回复
        span {{innerItem.parentUserName}}
        span : {{innerItem.content}}
      div.reply-list-more(v-if='item.count > 2') 共{{item.count}}条回复>
    div.new-bottom
      div.reply-delete(@click.stop='deleteShowComment')
        span(v-if='item.mine && isShowDelete') 删除
        span(v-else)
      div.new-bottom-right
        div.reply-btn(v-if='isShowReply' @click.stop='handlClickReply')
        div.top-right(@click.stop='toggleReplyStar')
          img(src='@/assets/community/unstar.png' v-if='!item.liked')
          img(src='@/assets/community/star.png' v-else)
          | {{item.stars > 999 ? '999+' : item.stars}}
</template>
<script>
import { semanticsDate } from '@/utils/utils'
export default {
  props: {
    item: Object,
    isShowReply: {
      default: true,
      type: Boolean
    },
    isShowBorder: {
      default: true,
      type: Boolean
    },
    specialAuthor: {
      default: false,
      type: Boolean
    },
    isShowAllContent: {
      default: false,
      type: Boolean
    },
    isShowDelete: {
      default: true,
      type: Boolean
    }
  },
  data() {
    return {
      defaultUserImg: require('../../../assets/community/user_default_img.png'),
      errorImg: 'this.src="'+require('../../../assets/community/user_default_img.png')+'"'
    }
  },
  methods: {
    deleteShowComment() {
      this.$parent.isShowDeleteFlag = true
      this.$parent.needDeleteCommentId = this.item.replyId
      this.$parent.isCommentDelete = false
    },
    async toggleReplyStar() {
      this.$emit('toggleReplyStar', this.item)
    },
    handlClickReply() {
      this.$emit('handlClickReply', this.item)
    },
    goReplyDetailPage() {
      if (this.$parent.goReplyDetailPage && typeof this.$parent.goReplyDetailPage === 'function') {
        console.log(1111)
        this.$emit('goReplyDetailPage', this.item.replyId)
      }
    }
  },
  computed: {
    getDateFormat() {
      return semanticsDate(this.item.time)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import './commentReply.styl'
</style>