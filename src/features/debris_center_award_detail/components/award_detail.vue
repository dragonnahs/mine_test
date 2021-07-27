<template>
  <div class="award_detail">
    <div class="award_detail_cover">
      <img :src="info.fragmentPrizeBigImgUrl" alt=" ">
    </div>
    <div class="award_detail_title">
      {{info.fragmentPrizeTitle}}
    </div>
    <div class="award_detail_time">中奖时间：{{momentDate(info.createTime)}}</div>
    <div class="award_detail_bottom">
      <div class="award_detail_progress">进度: {{statusText}}</div>
      <div class="award_detail_btn">
        <div class="award_detail_btn_email" v-if="info.needPost != 0" @click="goMailAddress">邮寄地址</div>
        <div class="award_detail_btn_post" v-if="!info.haveComment && fragmentPrizeTwoEnable === 1 && info.needPost != 0" @click="goDebrisComment">评论</div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  props: {
    info: {
      default: {}
    },
    fragmentPrizeTwoEnable: {
      type: Number
    }
  },
  data() {
    return {}
  },
  methods: {
    goMailAddress() {
      const { userRealName, userPhone, userAddress, id } = this.info
      this.$emit('goMailAddress', {
        userRealName,
        userPhone,
        userAddress,
      }, id)
    },
    momentDate(time) {
      return moment(time).format('YYYY-MM-DD')
    },
    // 跳转碎片评论
    goDebrisComment() {
      this.$emit('goDebrisComment', {
        fragmentPrizeBigImgUrl: this.info.fragmentPrizeBigImgUrl,
        fragmentPrizeTitle: this.info.fragmentPrizeTitle,
        id: this.info.id
      })
    }
  },
  computed: {
    statusText() {
      const status = this.info.status
      if (status == 0) {
        return '不可兑换'
      } else if (status == 1) {
        return '待领取'
      } else if (status == 2) {
        return '待审核'
      } else if (status == 3) {
        return '已发货'
      } else if (status == 4) {
        return '已领取'
      } else {
        return '已领取'
      }
    }
  }
}
</script>
<style lang="stylus">
.award_detail
  width 335px
  margin 0 auto 20px
  .award_detail_cover
    width 100%
    height 252px
    background #ffffff
    box-shadow 0px 0px 4px 0px rgba(235,235,235,0.5)
    border-radius 10px
    overflow hidden
    margin-bottom 18px
    img
      width 100%
      height 100%
      border none
  .award_detail_title
    font-size 18px
    color #333333
    font-weight bold
    background linear-gradient(236deg, #FFC87A 0%, #F43A3A 100%)
    -webkit-background-clip text
    -webkit-text-fill-color transparent
    display inline
  .award_detail_time
    font-size initial
    color #666666
    margin 18px 0
    font-weight 500
  .award_detail_bottom
    font-size initial
    color #666666
    font-weight 500
    display flex
    align-items center
    justify-content space-between
    .award_detail_btn
      display flex
      font-weight 400
      .award_detail_btn_email
        background #F4F4F4
        width 68px
        height 24px
        line-height 24px
        text-align center
        border-radius 24px
      .award_detail_btn_post
        background #F4F4F4
        width 68px
        height 24px
        line-height 24px
        text-align center
        border-radius 24px
        margin-left 8.5px

</style>