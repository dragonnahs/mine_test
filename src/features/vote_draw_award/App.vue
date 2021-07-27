<template lang="pug">
.vote-draw
  .vote-tip 还有
    span {{drawCount}}
    | 次抽奖机会
  .vote-square
    square-pad(@handleDrawAward='handleDrawAward'
  :drawCount='drawCount'
  :awardList='awardList'
  :buttonId='buttonId'
  ref='squarePad'
  @dealDrawCount='dealDrawCount'
  @toggleShowFailPop='toggleShowFailPop')
  .vote-draw-rule
    .vote-draw-title 活动规则
    div.vote-draw-rule-content
      p 1、每成功进行一次投票可进行抽奖一次
      p 2、金币为虚拟商品概不退款
      p 3、本活动结束后7个工作日内，发放所有实物奖励
      p 4、活动中有任何疑问，可咨询客服服务
      p 5、本活动拒绝一切作弊，一旦发现取消活动资格
      p 6、本活动唯一解释权归官方平台所有
  .vote-draw-record(@click='handleGoWalletRecord') 中奖记录
  winning-pop(v-if='isShowSuccessPop'
  :awardInfo='awardInfo'
  @toggleShowSuccessPop='toggleShowSuccessPop')
  draw-fail(v-if='isShowFailPop'
  @toggleShowFailPop='toggleShowFailPop')
</template>

<script>
import WinningPop from './components/winningPop'
import SquarePad from './components/squarePad'
import DrawFail from './components/drawFail'
import { getQueryString } from '@/utils/url'
import { getAwardInfo } from './request'
import { skipUrl } from '@/utils/nativeToH5/index'
import { mBuryPoint } from '@/utils/buryPoint'
export default {
  components: {
    SquarePad,
    WinningPop,
    DrawFail
  },
  data() {
    return {
      isShowSuccessPop: false,
      isShowFailPop: false,
      drawCount: 0,
      awardList: [],
      awardInfo: {},
      buttonId: ''
    }
  },
  mounted() {
    this.init()
    mBuryPoint('7', {
      enterType: 2
    })
  },
  methods: {
    init() {
      this.getAwardInfo()
    },
    async getAwardInfo() {
      let res = await getAwardInfo(getQueryString('activityId'))
      if (res.code === 100) {
        this.awardList = res.data.drawLotteryVOList
        this.buttonId = res.data.drawCoinList.length > 0 && res.data.drawCoinList[0].id
        this.dealDrawCount(res.data.available || 0)
        console.log(this.awardList)
      }
    },
    handleDrawAward() {
      this.isShowSuccessPop = true
    },
    toggleShowSuccessPop() {
      this.isShowSuccessPop = !this.isShowSuccessPop
    },
    toggleShowFailPop() {
      this.isShowFailPop = !this.isShowFailPop
    },
    dealDrawCount(value) {
      this.drawCount = value
    },
    handleGoWalletRecord() {
      skipUrl({
        skipUrl: `${window.location.origin}/BKH5-draw_award_record.html`
      })
    },
    drawAwardButtonMethod() {
      this.$refs.squarePad.handleClickDraw()
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../styles/index.styl';
@import './index.styl';
</style>
