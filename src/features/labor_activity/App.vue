<template lang="pug">
#labor(v-if='isShow')
  .labor(v-if='!over')
    .labor-rule(@click='isShowRule=true') 活动规则
    div.labor-top
      img(src='@/assets/labor_activity/title.png')
    div.labor-money-box
      .labor-money-tip
        span 排名前1000名瓜分
        | 十万现金红包
      .labor-members(v-show='isOrNotStartActivityFlag')
        | 参与人数：{{participantsTotal}}
      .labor-money-number(:class='{"is-show": !isOrNotStartActivityFlag}') ¥100000
    div.labor-ranking(v-if='isOrNotStartActivityFlag')
      div.labor-end-active-count-time
        span.tip 活动倒计时：
        span.time {{endCountTimeData.day}}
        span 天
        span.time {{endCountTimeData.hour}}
        span 时
        span.time {{endCountTimeData.min}}
        span 分
        span.time {{endCountTimeData.sec}}
        span 秒
      div.labor-ranking-th.labor-ranking-list-item
        div.first 排名
        div.second 用户信息
        div.third 邀请人数
        div.forth 时长
      div.labor-ranking-list
        div.labor-ranking-list-item(v-for='(item, index) in records')
          div.first(v-if='index == 0')
            img(src='@/assets/labor_activity/ranking_one.png')
          div.first(v-else-if='index == 1')
            img(src='@/assets/labor_activity/ranking_two.png')
          div.first(v-else-if='index == 2')
            img(src='@/assets/labor_activity/ranking_three.png')
          div.first(v-else) {{index+1}}
          div.second
            img(:src='item.headImage')
            div
              | {{item.userName}}
          div.third
            div {{item.lowerUserNum}}人
          div.forth
            div {{item.readTime}}
      div.labor-ranking-list-item.labor-ranking-end(v-if='joined')
        div.first {{myInfo.rank >= 999 ? '999+' : myInfo.rank}}
        div.second
          img(:src='myInfo.headImage')
          div
            | {{myInfo.userName}}
        div.third
          div {{myInfo.lowerUserNum}}人
        div.forth
          div {{myInfo.readTime}}
    div.labor-begin-active-count-time(v-if='!isOrNotStartActivityFlag')
      | 活动开始倒计时 <br>
      span {{day}}天
      span {{hour}}时
      span {{min}}分
      span {{sec}}秒
    div.labor-enter-ranking(v-if='isOrNotStartActivityFlag && (myInfo.rank > 1000) && needInviteNum > 0') 距离前1000名大概需邀请{{needInviteNum}}人
    div.labor-now-attend-btn(v-if='isOrNotStartActivityFlag && !joined' @click='handleJoinLaborActivity') 立即参加
    div.labor-now-attend-btn(v-if='isOrNotStartActivityFlag && joined' @click='handleGoShareFriend') 邀请好友参加挑战赛
    div.labor-no-start-btn(v-if='!isOrNotStartActivityFlag') 立即参加
    div.labor-notice(v-if='isOrNotStartActivityFlag')
      div.labor-notice-content
        | 1、本活动只计算有效阅读时长 <br>
        | 2、本活动在点击报名之后开始计算有效时长 <br>
        | 3、活动期间被邀请需在个人中心填写邀请码，则被视为成功邀请,每邀请一人增加30分钟时长<br>
        | 4、活动结束后奖励会在5个工作日内进行发放 <br>
        | 5、本活动唯一解释权归官方所有
    div.labor-commend
      div.labor-commend-list
        div.labor-commend-list-item(v-for='item in commendList' :key='item.bookId' @click='handleGoBookDetail(item.bookId)')
          img(:src='item.imgUrl')
      div.labor-commend-btn(@click='handleGoBookRanking')
        | 查看更多
        img(src='@/assets/labor_activity/more_icon.png')
    div.labor-rule-pop(v-if='isShowRule')
      div.labor-rule-pop-box
        div.labor-rule-pop-close(@click='isShowRule=false')
        div.labor-rule-pop-title 活动规则
        div.labor-rule-pop-content
          | 1、本活动只计算有效阅读时长 <br>
          | 2、每邀请一位好友参加 增加30分钟阅读时长<br>
          | 3、本活动在点击报名之后开始计算有效时长 <br>
          | 4、活动期间被邀请需在个人中心填写邀请码，则被视为成功邀请 <br>
          | 5、活动结束后奖励会在5 个工作日内进行发放 <br>
          | 6、活动结束后，领取奖励成功后，奖励金额会自动提取至微信余额<br>
          | 7、本活动唯一解释权归官方所有
  .labor(v-else)
    div.labor-top
      img(src='@/assets/labor_activity/title.png')
    .labor-draw(v-if='reward > 0')
      div.labor-draw-title 恭喜您成功瓜分
      div.labor-draw-number {{reward}}元
      div.labor-draw-btn(v-if='!isAlreadyGet' @click='handleWidthdrawMoney') 立即领取
      div.labor-already-draw-btn.labor-draw-btn(v-else) 已经领取
    .labor-draw-fail(v-else)
      div.labor-draw-fail-title 本次活动已结束
      div.labor-draw-fail-number 您没有参与本次活动或未进入本次活动前一千名，暂时无法领取奖励
    div.labor-wechat-pop(v-if='!isAlreadyBindingWechat')
      div.labor-wechat-pop-box
        div.labor-wechat-close(@click='isAlreadyBindingWechat=true')
        div.labor-wechat-title 对不起您还没有绑定微信
        div.labor-wechat-tip 点击下方按钮绑定微信，提现至微信余额
        div.labor-wechat-btn(@click='handleBandingWechat') 立即绑定
</template>

<script>
import { mBuryPoint } from '@/utils/buryPoint'
import { commendList } from './variable'
import { countDown } from '@/utils/utils.js'
import { jumpBookRanking, jumpBookDetail, routerToNative, bindingWechat } from '@/utils/native.js'
import { initPageFetch, joinLaborActivityFetch, withdrawMoneyFetch } from './request'
export default {
  data() {
    return {
      commendList,
      day: '00',
      hour: '00',
      min: '00',
      sec: '00',
      isOrNotStartActivityFlag: true, // 是否已经开始活动
      isShowRule: false,
      endTimeDur: 0, // 距离活动结束时间
      joined: false,
      myInfo: {},
      participantsTotal: 0,
      records: [],
      needInviteNum: 0,
      over: false, // 活动是否已经结束
      reward: 0, // 获得的奖励
      isAlreadyGet: false, // 已经领取奖励
      isAlreadyBindingWechat: true, // 是否已经绑定微信
      isShow: false, // 页面加载完成之后显示
      endCountTimeData: {
        day: '00',
        hour: '00',
        min: '00',
        sec: '00'
      }
    }
  },
  methods: {
    beginCountDown(time) {
      countDown(time, ({ day, hour, min, sec }) => {
        this.day = day
        this.hour = hour
        this.min = min
        this.sec = sec
      })
    },
    isStartedActivity() {
      const st = '2020/05/01 00:00:00'
      return new Date(st).getTime() - new Date().getTime()
    },
    init() {
      mBuryPoint(1, { enterShareLandPage: 'enterShareLandPage' })
      this.getPageInfo()
      if (this.isStartedActivity() < 0) {
        this.isOrNotStartActivityFlag = true
      } else {
        this.isOrNotStartActivityFlag = false
        this.beginCountDown(this.isStartedActivity())
      }
    },
    async getPageInfo() {
      try {
        let res = await initPageFetch()
        if (res.code === 100) {
          const { endTime, joined, myInfo, participantsTotal, records, needInviteNum, over, reward, withdraw } = res.data
          this.endTimeDur = endTime - new Date().getTime()
          this.joined = joined
          this.myInfo = myInfo || {}
          this.participantsTotal = participantsTotal
          this.records = records
          this.needInviteNum = needInviteNum || 0
          this.over = over
          this.reward = reward ? (reward - 0) : 0
          this.isAlreadyGet = withdraw
          this.dealEndCountTime(this.endTimeDur)
        }
        this.isShow = true
      } catch (err) {
        this.isShow = true
      }
    },
    handleBandingWechat() {
      this.isAlreadyBindingWechat = true
      bindingWechat()
    },
    async handleWidthdrawMoney() {
      mBuryPoint(1, { clickWithdrawal: 'clickWithdrawal' })
      const res = await withdrawMoneyFetch()
      if (res.code === 100) {
        this.isAlreadyGet = true
        this.$showToast('恭喜您！领取成功，请关注微信余额动态.', 5000)
      } else if (res.code === 511) {
        this.isAlreadyBindingWechat = false
      } else {
        this.$showToast('领取失败，请稍后重试。', 5000)
      }
    },
    async handleJoinLaborActivity() {
      mBuryPoint(1, { clickShareLandPage: 'clickShareLandPage' })
      const res = await joinLaborActivityFetch()
      if (res.code === 100) {
        this.getPageInfo()
      }
    },
    handleGoShareFriend() {
      mBuryPoint(1, { sharePageClick: 'sharePageClick' })
      routerToNative('https://increase.ibreader.com/#/share')
      // routerToNative('http://testtask.ibreader.com/#/share')
    },
    handleGoBookRanking() {
      jumpBookRanking()
    },
    handleGoBookDetail(bookId) {
      mBuryPoint(1, { clickShareLandPageBook: bookId })
      jumpBookDetail({ bookId })
    },
    dealEndCountTime(endTimeDur) {
      countDown(endTimeDur, (obj) => {
        this.endCountTimeData = obj
      })
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
