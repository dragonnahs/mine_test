<template lang="pug">
#debris_award
  .debris_award_list
    Award(
      :styles="styles"
      v-for="item in checkinRewardInfoList"
      :awardInfo="item"
      v-on:getAwardToMailAddress="getAwardToMailAddress")
</template>

<script>
import bk from 'bayread-bridge'
import { post } from '@/config/axios.config'
import { toast, closeCurrentPage } from '@/utils/nativeToH5/index'
import Award from '../debris_center/components/award'
import { getQueryString, routerToNative, mBuryPoint } from '@/utils/index'
export default {
  data() {
    return {
      styles: {
        width: '136px',
        minHeight: '115px',
        marginBottom: '16px'
      },
      activityId: getQueryString('activityId') || '128',
      checkinRewardInfoList: [],
      from: getQueryString('from') || ''
    }
  },
  components: {
    Award
  },
  created() {
    bk.register('browserPageResume', () => {
      this.InitData()
    })
  },
  methods: {
    async InitData() {
      let { data, code, msg } = await post('/activity_api/fragmentPrize/getItemList', {
        activityId: this.activityId
      })
      if (code == 153) {
        toast({
          content: msg
        })
        setTimeout(() => {
          closeCurrentPage()
        }, 2000)
        return
      }
      try {
        this.checkinRewardInfoList = data || []
        // this.checkinRewardInfoList[0].userFragmentCount = 9
        // this.checkinRewardInfoList[0].exchange = 1
        const buryData = {
          'eventPage': 'myAward',
          'eventType': 1,
          'activityId': this.activityId
        }
        mBuryPoint('13', buryData)
      } catch (error) {
        console.error('error-----', error)
      }

    },
    getAwardToMailAddress(val) {
      const buryData = {
        'eventPage': 'myAward',
        'eventType': 2,
        'awardID': val.id
      }
      mBuryPoint('13', buryData)
      const url = `${window.location.origin}/BKH5-debris_mail_address.html?activityId=${this.activityId}&id=${val.id}&activityRecordId=${val.activityRecordId}&from=${this.from}`
      routerToNative(url)
    }
  },
  mounted() {
    this.InitData()
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../styles/index.styl';
$width = 72px
$height = 22px
body,html
  size(100%, 100%)
  margin 0
  padding 0
#debris_award
  width 100%
  min-height 100vh
  padding-top 13px
  background linear-gradient(180deg, #FFFAF4 0%, #FFE1C7 100%)
  .debris_award_list
    width 100%
    padding 7px 37px 87px
    box-sizing border-box
    display flex
    flex-direction row
    flex-wrap wrap
    justify-content space-between
    .single_award
      display flex
      flex-direction column
      align-items center
      max-width 136px
      .img_show
        size(110px 134px)
        .img
          width 100%
      .single_award_title
        height 17px
        font-size 12px
        font-family PingFangSC-Medium, PingFang SC
        font-weight 500
        color #8D3E1B
        line-height 17px
        text-align center
        padding 5px 0 10px
      .single_award_progress
        width $width
        height $height
        border-radius 11px
        box-sizing border-box
        border 1px solid #FCAB1B
        margin 0 auto
        position relative
        .default_progress
          display inline-block
          absolute(top 0 left 0)
          z-index 12
          .active_progress
            absolute(top -1px left -1px)
            z-index 10
            height 22px
            display inline-block
            background linear-gradient(245deg, #FFA34B 0%, #F44004 71%, #FF5537 100%)
            border-radius 11px
          .progress_count
            font-size 12px
            text-align center
            line-height 22px
            display inline-block
            absolute(top -1px left -1px)
            width $width
            height $height
            z-index 15
            i
              font-style normal
          .progress_get_now
            color #ffffff
            font-weight bold
            padding-left 10px
            &:before
              content ''
              size(34px 35px)
              absolute(top -6px left 0)
              background url('../../assets/debris_center/award_icon.png') no-repeat center center
              background-size 100% 100%
              animation pulse 2s linear infinite
              @keyframes pulse
                0%
                  transform scale(0.9)
                50%
                  transform scale(1.2)
                100%
                  transform scale(0.9)
</style>
