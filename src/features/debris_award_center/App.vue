<template lang="pug">
.debris_award_center
  .debris_award_center_item(v-for='(item,index) in list' :key='index')
    Comment(:avatarUrl='item.headImg' :time='item.createTime'
    :awardName='item.tag' :awardDesc='item.content'
    :awardImgs='item.imgList'
    :userId='item.id')
</template>

<script>
import Comment from '../debris_center/components/comment'
import { getDebrisCommentList } from './request'
import { getQueryString } from '@/utils/url'
import { toast, closeCurrentPage } from '@/utils/nativeToH5/index'
import { mBuryPoint } from '@/utils/index'
export default {
  components: {
    Comment
  },
  data() {
    return {
      list: [],
    }
  },
  methods: {
    async initPage() {
      let res = await getDebrisCommentList(getQueryString('activityId')||'')
      console.log(res)
      if (res.code == 100) {
        this.list = res.data
      } else if (res.code == 153) {
        toast({
          content: res.msg
        })
        setTimeout(() => {
          closeCurrentPage()
        }, 2000)
      }
    }
  },
  mounted() {
    mBuryPoint(13, {
      eventPage: 'awardCenter',
      eventType: 1,
      activityId: getQueryString('activityId')
    })
    this.initPage()
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../styles/index.styl';
@import './index.styl'
</style>
