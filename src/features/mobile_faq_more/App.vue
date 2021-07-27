<template lang="pug">
#app
  List(
    title=""
    :data="list"
    v-on:clickQuestion="clickQuestion"
  )
</template>
<script>
import List from '../mobile_faq/components/list'
import config from '../mobile_faq/data.js'
import { getQueryString } from '@/utils/url'
import { routerToNative } from '@/utils/native'
import { mBuryPoint } from '@/utils/buryPoint'
export default {
  components: {
    List,
  },
  data() {
    return {
      questionId: getQueryString('questionId') || '',
      classesId: getQueryString('classesId') || '',
      key: getQueryString('key') || '',
      list: [],
      title: ''
    }
  },
  methods: {
    clickQuestion(val) { // 点击问题跳转详情
      mBuryPoint(null, {
        source: 'more_question',
        type: 'click',
        class_id: this.classesId,
        question_id: val.id,
        title: this.title
      })
      const url = `${window.location.origin}/BKH5-mobile_faq_detail.html?key=${this.key}&questionId=${val.id}&classesId=${this.classesId}&from=morequestion`
      routerToNative(url)
    }
  },
  created() {
    if (!config[this.key]) return
    const data = config[this.key].filter(item => item.id === this.classesId)
    document.title = data[0].title
    this.title = data[0].title
    this.list = data[0].list
    mBuryPoint(null, {
      source: 'more_question',
      type: 'open',
      class_id: this.classesId,
      title: data[0].title
    })
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../styles/index.styl';
</style>
