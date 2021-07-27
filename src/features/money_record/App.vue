<template lang="pug">
#coin__record.coin__record
  .no__coin__list(v-if="walletList.length === 0")
    img(src="@/assets/withdraw/no__coin__record@2x.png")
    p 暂无提现记录
  ul.coin__list(v-if="walletList.length !== 0")
    li(v-for="item in walletList")
      section
        h3.title {{ item.title }}
        p.time {{ item.create_time }}
      p(:class="['coin__num', `coin_${Number(item.status)}`]")
        | {{ tipmsg(item.status) }}
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
    tipmsg(status) {
      switch (Number(status)) {
      case 1:
        return '提交审核'
        break
      case 2:
        return '审核未通过'
        break
      case 3:
        return '转账中'
        break
      case 4:
        return '已到账'
        break
      case 5:
        return '提现失败，请重试'
        break
      }
    },
    getRecordList() {
      post('/api/task/v1/withdraw/records')
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
  size(100%, 100%)
.coin__record
  size(100%, 100%)
.no__coin__list
  height 100%
  display flex
  justify-content center
  align-items center
  flex-direction column
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
  size(100%, 100%)
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
.coin__record li .coin__num
  width 3.2rem
  font-size 0.4rem
  font-family PingFangSC-Medium, PingFang SC
  line-height 0.56rem
  text-align right
.coin__record__desc
  font-size 0.37rem
  font-family PingFangSC-Regular, PingFang SC
  font-weight bold
  color rgba(153, 153, 153, 1)
  line-height 1.6rem
  text-align center
.coin_4
  color #5baa00
.coin_5
  color #f6001e
.coin_3
  color #fc9e03
.coin_2
  color #f6001e
.coin_1
  color #fc9e03
</style>
