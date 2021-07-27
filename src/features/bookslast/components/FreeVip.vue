<template lang="pug">
.header-top.header-top-2(:style="(isNoBook && isShowPlatform) ? style : ''" v-if="(isShowPlatform && endInfo.vipExperienceCardInfo.status === 0) || !isShowPlatform")
  .header-top-done(v-if="endInfo.vipExperienceCardInfo.status === 0" :class='{"is-no-book": isNoBook && isShowPlatform}')
    .header-top-book-done(:style="{textAlign: isShowPlatform ? 'center' : 'left'}") 本书已完结
    .header-top-book-done-other(:style="{justifyContent: isShowPlatform ? 'center' : 'flex-start'}") 恭喜你读完一本书
      span.mark-vpi(v-if="platform !== '15'") ，送你3天会员卡！
  .header-top-mark-button-fetch-common.header-top-mark-button-fetch(
    v-if="endInfo.vipExperienceCardInfo.status === 0 &&!vipExperienceCardInfoControl && !isShowPlatform "
    @click="receiveforbook"
    )
      span.text 领取会员卡
  .header-top-mark-button-fetch-common.header-top-mark-button-fetch-success(
    v-if="vipExperienceCardInfoControl && !isShowPlatform"
  ) 已领取
  .header-top-book-desc-done(
    v-if="endInfo.vipExperienceCardInfo.status === 1 && !isShowPlatform"
    ) 本书已完结，去阅读更多好书吧
    //- img(src="@/assets/bookslast/bookslast_7.png")
</template>
<script>
export default {
  props: ['bookInfo', 'vipExperienceCardInfoControl', 'endInfo', 'mId', 'platform', 'isNoBook'],
  data() {
    return {
      style: {
        display: 'flex',
        justifyContent: 'center',
        alignItem: 'center',
        height: '100vh',
        paddingTop: '0',
        paddingBottom: '0',
        boxSize: 'border-box'
      }
    }
  },
  methods: {
    receiveforbook() {
      this.$emit('receiveforbook')
    },
  },
  computed: {
    isShowPlatform() {
      return this.platform === '15'
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '../index.styl'
</style>