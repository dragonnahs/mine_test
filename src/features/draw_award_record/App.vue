<template lang="pug">
.record(v-if='loaded')
  .no-record(v-if='recordList.length === 0')
    img(src='../../assets/draw_award_record/no_record.png')
    div.no-record-tip 暂无中奖记录～
  .record-list(v-else)
    .record-item(v-for='item in recordList')
      div.left
        div.desc {{item.description}}
        div.time {{item.create_time}}
      div.right +{{item.amount}}金币
</template>

<script>
import { getAwardRecord } from './request'
export default {
  data() {
    return {
      recordList: [],
      loaded: false
    }
  },
  methods: {
    init() {
      this.getAwardRecord()
    },
    async getAwardRecord() {
      try {
        let res = await getAwardRecord()
        this.loaded = true
        if (res.code === 100) {
          this.recordList = res.data.list
        }
      } catch (err) {
        this.loaded = true
      }
    }
  },
  mounted() {
    this.init()
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../styles/index.styl';
@import './index.styl';
</style>
