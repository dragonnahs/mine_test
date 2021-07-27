<template lang="pug">
.header-top.header-top-1(:style="(isNoBook && isShowPlatform) ? style : ''")
  .header-top-done(v-if="endInfo.urgeInfo" :class='{"is-no-book": isNoBook && isShowPlatform}')
    .header-top-book-done(:style="{textAlign: isShowPlatform ? 'center' : 'left'}") 作者正在努力更新中…
    .header-top-book-done-other(:style="{justifyContent: isShowPlatform ? 'center' : 'flex-start'}") {{ title }}
  .header-top-button.header-top-mark-button-fetch-common(
    @click="urgeforbook"
    v-if="endInfo.urgeInfo.status === 0 && !showNotificationResume && !isShowPlatform")
    span.text {{ showNotification ? '开启通知' : '我要催更'}}
  .header-top-mark-button-fetch-common.header-top-mark-button-fetch-success(
    v-if="showNotificationResume && !isShowPlatform"
  ) 已开启
  .header-top-numbers(v-if="endInfo.urgeInfo.status === 1 && !showNotificationResume && !isShowPlatform")
    span.mark-number {{ endInfo.urgeInfo.count }}
    | 人已经催更
</template>
<script>
export default {
  props: ['endInfo', 'showNotification', 'showNotificationResume', 'platform', 'isNoBook'],
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
  computed: {
    title() {
      if (this.showNotificationResume) {
        return '提醒已开启'
      }
      if (this.showNotification) {
        return '开启提醒，第一时间追更！'
      } else {
        return '明日再来看看'
      }
    },
    isShowPlatform() {
      return this.platform === '15'
    }
  },
  methods: {
    urgeforbook() {
      this.$emit('urgeforbook')
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '../index.styl'
</style>