<template lang="pug">
#signrecord__root.signrecord__root
  .record__day__top
    .day__top__title
      span 已连续
      span.top__title__day {{ checkInDays.slice(0, 1) }}
      span.top__title__day {{ checkInDays.slice(1, 2) }}
      span.top__title__day(v-if="checkInDays > 99") {{ checkInDays.slice(2, 3) }}
      span 天签到
  .record__list__bottom
    .record__list__bottom__top
      .record__list
        p.no__sign__record(v-if="signlists.length === 0")
          img(src="@/assets/task/nosignrecord@3x.png")
          span.no__sign__record__desc 还没有签到记录哦
        ul(v-if="signlists.length !== 0")
          li.record__list__title
            p 日期
            p 签到状态
          li(
              v-for="(item, key) in signlists"
              :key="key"
              :style="item.status === 0 ? 'color:#999999' : 'color:#F43A3A'")
            p {{ momentDate(item.time) }}
            p {{ item.status === 0 ? "未签到" : "已签到" }}
</template>

<script>
import moment from 'moment'
import { getQueryString } from '@/utils/index'
import { post } from '@/config/axios.config'
export default {
  data() {
    return {
      remainingCheckInNum: 2,
      checkInDays: '00',
      signlists: [],
      taskId: getQueryString('taskId') || 1
    }
  },
  methods: {
    momentDate(time) {
      return moment(time).format('YYYY-MM-DD')
    },
    getLists(taskId) {
      post('/task_api/task/record', {
        taskId
      }).then(res => {
        const { extraResultList, extraData } = res.data
        this.signlists = extraResultList
        this.remainingCheckInNum = extraData.remainingCheckInNum
        if (extraData.checkInDays < 10) {
          this.checkInDays = `0${extraData.checkInDays}`
        } else {
          this.checkInDays = extraData.checkInDays.toString()
        }
      })
    }

  },
  mounted() {
    this.getLists(this.taskId)
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../styles/index.styl';
body, html
  size(100%, 100%)
.signrecord__root
  size(100%, 100%)
  position relative
.record__day__top
  background url("../../assets/task/sign_record_bg.png") no-repeat center bottom
  background-size 100%
  min-height 6.35rem
  position relative
.day__top__title
  font-size 0.48rem
  color #ffffff
  text-align center
  line-height 1.47rem
  padding-top 1.31rem
  height 1.47rem
.day__top__title span
  display inline-block
  font-size 0.48rem
  line-height 0.67rem
  font-weight 500
.day__top__title .top__title__day
  width 1.09rem
  display inline-block
  color #ff5a00
  font-size 0.96rem
  line-height 1.47rem
  background url("../../assets/task/bg__day@3x.png") no-repeat center center
  background-size 100%, 100%
  margin 0 3px
.day__bottom__amount
  width 7.73rem
  height 1.01rem
  background rgb(253, 137, 37)
  font-size 0.43rem
  color rgba(255, 255, 255, 1)
  line-height 1.01rem
  text-align center
  margin 0 auto
  border-radius 0.6rem
  margin-top 0.53rem
.day__bottom__amount span
  font-weight bold
  font-size 0.48rem
  line-height 0.59rem
.record__list__bottom
  position absolute
  top 4.05rem
  left 0.37rem
.record__list__bottom__top
  width 9.28rem
  margin 0 auto
  min-height 12.35rem
  background rgba(255, 255, 255, 1)
  // box-shadow 5px 5px 8px 0px rgba(255, 119, 65, 0.02), -5px 5px 8px 0px rgba(255, 119, 65, 0.02)
  border-radius 0.37rem
  padding 0 0.53rem 0 0.56rem
  box-sizing border-box
.record__list li
  display flex
  flex-direction row
  padding 0.41rem 0 0.39rem
  border-bottom 0.03rem solid #f5f5f5
.record__list li:last-child
  border-bottom none
.record__list li p
  flex 1
  text-align center
  font-size 0.43rem
  font-weight 400
  line-height 0.59rem
  height 0.59rem
.record__list .record__list__title p
  height 0.67rem
  font-size 0.48rem
  font-family PingFangSC-Medium, PingFang SC
  font-weight bold
  color rgba(51, 51, 51, 1)
  line-height 0.72rem
.record__list ul
  min-height 7.06rem
.record__list__bottom__desc h6
  height 0.53rem
  font-size 0.37rem
  font-family PingFangSC-Regular, PingFang SC
  font-weight 400
  color rgba(102, 102, 102, 1)
  line-height 0.53rem
  padding 0.77rem 0 0.27rem 0
.record__list__bottom__desc p
  height 0.45rem
  font-size 0.32rem
  font-family PingFangSC-Regular, PingFang SC
  font-weight 400
  color rgba(153, 153, 153, 1)
  line-height 0.45rem
.no__sign__record
  display flex
  justify-content center
  align-items center
  min-height 12.35rem
  flex-direction column
.no__sign__record img
  size(2.17rem, 1.71rem)
.no__sign__record .no__sign__record__desc
  font-size 0.37rem
  font-family PingFangSC-Regular, PingFang SC
  font-weight 400
  color rgba(102, 102, 102, 1)
  line-height 0.67rem
  padding-top 0.4rem
.record__day__back
  position absolute
  top 0.4rem
  left 0.37rem
  font-size 0.35rem
  color #ff8900
  line-height 0.64rem
  width 1.33rem
  height 0.59rem
  text-align center
  z-index 9999
  background rgba(255, 255, 255, 1)
  border-radius 0.29rem
  opacity 0.79
</style>
