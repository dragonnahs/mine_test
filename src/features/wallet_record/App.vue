<template lang="pug">
#coin__record.coin__record
  .no__coin__list(v-if="walletList.length === 0")
    img(src="@/assets/withdraw/no__coin__record@2x.png")
    p 暂无金币流水记录
  ul.coin__list(v-if="walletList.length !== 0")
    li(v-for="(item, key) in walletList")
      section
        h3.title {{ item.description }}
        p.time {{ item.create_time }}
      p.coin__num_1(:style="item.add === 0 ? 'color:#666666' : ''")
        | {{ item.add === 0 ? "-" : "+" }}{{ item.amount }}金币
  .coin__record__desc(v-if="walletList.length !== 0") 系统只保留最近100条流水数据
</template>

<script>
import { post } from '@/config/axios.config'
export default {
  data() {
    return {
      walletList: []
    }
  },
  methods: {
    getRecordList() {
      post('/api/task/v1/wallet/user/records')
        .then(res => {
          this.walletList = res.data.list
        })
        .catch(err => {
          console.log('error ---> ', err)
        })
    }
  },
  mounted() {
    this.getRecordList()
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../styles/index.styl';
body,html
  width 100%
  height 100%
.coin__record
  width 100%
  height 100%
.no__coin__list
  height 100%
  display flex
  justify-content center
  align-items center
  flex-direction: column
.no__coin__list img
  width 5.49rem
  height 4.11rem
  display inline-block
.no__coin__list p
  font-size 0.37rem
  line-height 0.53rem
  font-weight bold
  color rgba(153, 153, 153, 1)
.coin__record
  width 100%
  height 100%
.coin__list
  min-height calc(100% - 1.6rem)
  padding 0 0.4rem
.coin__record li
  display flex
  justify-content space-between
  align-items center
  min-height 1.68rem
.coin__record li .title
  font-size 0.43rem
  line-height 0.53rem
  color #333333
  font-weight bold
  padding-bottom 0.11rem
.coin__record li .time
  font-size 0.32rem
  line-height 0.45rem
  font-weight bold
  font-family PingFangSC-Regular, PingFang SC
.coin__record li .coin__num_1
  width 3rem
  font-size 0.4rem
  font-family PingFangSC-Medium, PingFang SC
  line-height 0.56rem
  color #f26d2b
  text-align right
.coin__record__desc
  font-size 0.37rem
  font-family PingFangSC-Regular, PingFang SC
  font-weight bold
  color rgba(153, 153, 153, 1)
  line-height 1.6rem
  text-align center
</style>
