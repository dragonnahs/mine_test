<template lang="pug">
.welfare__task__sign
  .new__sign__content
    .new__sign__days
      p.new__sign__day__item(
        v-if="showRedPackageStyle === 0"
        class="new__sign__day__item"
        v-for="(item, key) in signList"
        :style="item.is_finish ? bgActive : null"
        :key="key"
        )
        span.day__item__common(
          :style="item.is_finish ? colorActive: null") +{{ item.num }}
        img(
          :src="item.is_finish ? goldActive : goldDefault"
        )
        span.day__item__common.day__item__date {{ item.name }}
      p.new__sign__day__item(
        v-if="showRedPackageStyle === 1"
        class="new__sign__day__item"
        v-for="(item, key) in userTaskRedPackageVOList"
        :style="(Number(item.status) === 1 || Number(item.status) === 2) ? bgActive : null"
        @click="gotoWithdraw(key, item.status)"
        :key="key")
        span.day__item__common(
          :class="[goldStyle(item.status, key) ? 'day__item__gold__active': 'day__item__gold']"
          :style="(Number(item.status) === 1 && (key !== 2 || key !== 6))? colorActive: null") {{ isGoldRedPackage(item.status, key) }}
        img(:class="[((Number(key) === 2 || Number(key) === 6) && Number(item.status) !== 3 && Number(item.status) !== 2) ? 'red_package_default' : ((Number(key) === 2 || Number(key) === 6)) ? 'red_package_active' : '']"
          :src="(Number(key) === 2 || Number(key) === 6)? ((Number(item.status) === 2)?  redPackageGet: (Number(item.status) === 3) ? redPackageExpire : redPackageDefault): ((Number(item.status) === 1) ? goldActive : goldDefault)"
        )
        span.day__item__common.day__item__date {{key + 1}}天
</template>
<script>

export default {
  name: 'Sign',
  props: ['userTaskRedPackageVOList', 'day', 'showRedPackageStyle', 'compareVer'],
  data() {
    return {
      colorActive: {
        color: '#FFB856'
      },
      bgActive: {
        backgroundColor: '#FFF5F1'
      },
      goldActive: require('@/assets/welfare_task/new_sign_active_red.png'),
      goldDefault: require('@/assets/welfare_task/new_sign_default.png'),
      redPackageDefault: require('@/assets/welfare_task/hongbao.png'),
      redPackageExpire: require('@/assets/welfare_task/red_package_expire.png'),
      redPackageGet: require('@/assets/welfare_task/new_red_package_get.png'),
      signList: [
        {
          name: '1天',
          is_finish: false,
          num: 0
        },
        {
          name: '2天',
          is_finish: false,
          num: 0
        },
        {
          name: '3天',
          is_finish: false,
          num: 0
        },
        {
          name: '4天',
          is_finish: false,
          num: 0
        },
        {
          name: '5天',
          is_finish: false,
          num: 0
        },
        {
          name: '6天',
          is_finish: false,
          num: 0
        },
        {
          name: '7天',
          is_finish: false,
          num: 0
        }
      ],
    }
  },
  computed: {
  },
  mounted() {
    this.$nextTick(() => {
      if (!this.day) return
      if (this.day && this.day.alert && this.day.gold && this.compareVer < 0) {
        this.$finishModal('签到任务完成', this.day.gold)
      }
      for (let i = 0; i < this.signList.length; i++) {
        let data = this.signList[i]
        if (i < this.day.weekCheckInDays) {
          data.is_finish = true
        }
        data.num = parseInt(this.day.startWeekGold) + i * 10
      }
    })
  },
  methods: {
    isGoldRedPackage(status, key) {  // 显示红包还是金币设置
      if ((Number(key) === 2 || Number(key) === 6)) {
        if (Number(status) === 2) {
          return '已领取'
        }
        if (Number(status) === 3) {
          return '已过期'
        } else {
          return `0.${key + 1}元`
        }
      } else {
        return `+${10 * Number(key + 1)}`
      }
    },
    goldStyle(status, key) {
      return ((Number(key) === 2 || Number(key) === 6) && (Number(status) === 2) || Number(status) === 3)
    },
    gotoWithdraw(key, status) {
      if (key !== 2 && key !== 6) return
      // 跳转到提现页面
      this.$emit('gotoWithdraw', status, key)
    }
  }
}
</script>
<style  lang="stylus" rel="stylesheet/stylus">
@import '../../../styles/index.styl';
.welfare__task__sign
  padding: 1.87rem 0.27rem 0;
  box-sizing: border-box;
  .new__sign__content
    width: 9.47rem;
    min-height: 3.12rem;
    background: #fff;
    box-shadow: 0rem 0.16rem 0.27rem 0rem #FFF1E5;
    border-radius: 0.43rem;
    position: relative;
    &::before
      content: '';
      position: absolute;
      right: 1.3rem;
      top: -1.1rem;
      size(80px, 58px)
      background: url('../../../assets/welfare_task/new_sign_bg_icon.png') no-repeat center center;
      background-size: 100% 100%;
    .new__sign__record
      height: 0.53rem;
      font-size: 0.37rem;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 0.53rem;
      padding: 0.4rem 0 0.4rem 0.4rem;
      display: flex;
    .new__sign__days
      display: flex;
      flex-direction: row;
      padding: 0.75rem 0.32rem 0;
      box-sizing: border-box;
      justify-content: space-between;
      .new__sign__day__item
        width: 1.01rem;
        min-height: 1.71rem;
        background: #F6F6F6;
        border-radius: 0.11rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        img
          width: 0.64rem;
          height: 0.64rem;
        img.red_package_active
          width: 0.69rem;
          height: 0.8rem;
        img.red_package_default
          animation: pulse 0.2s linear infinite;
          width: 0.69rem;
          height: 0.83rem;
        .day__item__common
          height: 0.45rem;
          font-size: 0.32rem;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #999999;
          line-height: 0.45rem;
          position relative
        .day__item__date
          color: #999999;
          font-weight: 400!important;
          padding-top: 0.03rem;
          transform: scale(0.9);
        &:nth-of-type(3),&:nth-of-type(7)
          .day__item__gold__active
            font-size: 0.27rem;
            transform: scale(0.8);
          .day__item__gold
            &::before
              position: absolute;
              content: '';
              width: 0.59rem;
              height: 0.56rem;
              background: url('../../../assets/welfare_task/new_sign_icon.png') no-repeat center center;
              background-size: 100% 100%;
              top: -0.45rem;
              right: -0.35rem;
@keyframes pulse
  0%
    transform: rotate(10deg);
  25%
    transform: rotate(0deg);
  50%
    transform: rotate(-10deg);
  75%
    transform: rotate(0deg);
  100%
    transform: rotate(10deg);
</style>