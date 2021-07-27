<template lang="pug">
#app
  header
    .header_left
      p 当前金币
      p.coin_all
        span {{ walletInfo.available }}
        span.amount 约{{ walletInfo.cash }}元
      .coin_num
        .coin_num_left
          span 今日金币
          span.coin_common {{ walletInfo.today }}
        .coin_num_right
          span 累计获取金币
          span.coin_common  {{ walletInfo.total }}
    .header_right
      span(@click="goToWithDraw()") 立即提现
      span(@click="gotoRecord()") 金币流水
  h2.mall_title 金币商城
  img.mall_img(@click="goMall()" src="@/assets/withdraw/mall_bg.png")
</template>

<script>
import { getWalletInfo, getMallUrl } from './request'
import { routerToNative } from '@/utils/native'
import { mBuryPoint } from '@/utils/buryPoint'
import BROWSER from '@/utils/browser'
export default {
  data() {
    return {
      walletInfo: {
        available: '0',
        today: '0',
        cash: '0',
        total: '0',
      },
      isiOS: BROWSER.isiOS
    }
  },
  created() {
    window.callRouterReload = this.callRouterReload
  },
  methods: {
    callRouterReload() {
      getWalletInfo()
    },
    gotoRecord() {
      // 跳转金币流水
      // let routerUrl = `${window.location.origin}/#/walletrecord`
      // if (window.location.origin === 'http://testincrease.ibreader.com') {
      //   routerUrl = 'http://testtask.ibreader.com/#/walletrecord'
      // }
      let routerUrl = `${window.location.origin}/BKH5-wallet_record.html`
      mBuryPoint('clickWalletWater')
      routerToNative(routerUrl)
    },
    goToWithDraw() {
      // 跳转提现页面
      let withdrawUrl =  `${window.location.origin}/#/withdraw`
      if (window.location.origin === 'http://testincrease.ibreader.com') {
        withdrawUrl = 'http://testtask.ibreader.com/#/withdraw'
      }
      mBuryPoint('clickMoney')
      routerToNative(withdrawUrl)
    },
    goMall() {
      // 跳转积分商城
      let appType = 0, transfer = 0
      if (this.isiOS) {
        appType = 1
        transfer = 1
      }
      getMallUrl(appType, transfer).then(res => {
        if (res.data.loginUrl) {
          const { loginUrl } = res.data
          mBuryPoint('clickWalletMall')
          routerToNative(loginUrl)
        }
      })
    }
  },
  mounted() {
    getWalletInfo(res => {
      mBuryPoint('enterWallet')
      // 初始化数据
      if (res.code === 100) {
        this.walletInfo = { ...res.data }
      } else {
        // console.log('errrr', res.msg)
        this.$showToast(res.msg)
      }
    })
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../styles/index.styl';
body, html
  size(100%, 100%)
#app
  size(100%, 100%)
  padding 0 20px 18px
  box-sizing border-box
  header
    size(100%, 168px)
    background url('../../assets/withdraw/wallet_money_bg.png') no-repeat center center
    background-size 100% 100%
    margin-top 20px
    padding 29px 0 0 20px
    box-sizing border-box
    display flex
    flex-direction row
    line-height 0
    position relative
    p, .coin_all span, .coin_num span
      font-size 14px
      font-weight 400
      color:rgba(255,255,255,1);
      line-height 20px
    p.coin_all
      display flex
      // align-items center
      height 40px
      span
        font-size 28px
        font-weight 400
        color rgba(255,255,255,1)
        line-height 40px
      span.amount
        display inline-block
        margin-top 8px
        line-height 17px
        padding 2px 7px 1px 6px
        height 17px
        margin-left 4px
        font-size 12px
        border-radius 10px
        border-bottom-left-radius 0
        background rgba(233,26,14,1)
    .coin_num
      margin-top 15px
      display flex
      flex-direction row
      font-size 14px
      font-family PingFangSC-Regular,PingFang SC
      font-weight 400
      color rgba(255,255,255,1)
      line-height 20px
      .coin_num_left,.coin_num_right
        display flex
        flex-direction column
        padding-bottom 5px
        .coin_common
          font-size 16px
          line-height 22px
      .coin_num_left
        padding-right 20px
        position relative
        &::after
          content ''
          absolute(right 0 top 0)
          size(1px 38px)
          background rgba(255,255,255, 0.23)
      .coin_num_right
        padding-left 20px
    .header_right
      absolute(right -6px top 56px)
      display flex
      flex-direction column
      span
        display block
        margin-bottom 23px
        height 24px
        background rgba(255,255,255,1)
        box-shadow 0px 2px 4px 0px rgba(120,120,120,0.29),0px 1px 6px 0px rgba(0,0,0,0.1)
        border-radius 4px
        font-size 13px
        font-family PingFangSC-Medium,PingFang SC
        font-weight bold
        color rgba(255,128,37,1)
        line-height 27.5px
        padding 0px 8px
  h2.mall_title
    font-size 18px
    font-weight bold
    color rgba(28,23,23,1)
    line-height 25px
    padding 20px 0 15px
  img.mall_img
    width 100%
</style>
