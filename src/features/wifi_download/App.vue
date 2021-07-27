<template lang="pug">
#wifi__download
  .img
    img(src="../../assets/wifi_download/wifi_download.jpg")
    button.btn(@click="downloadWifi()")
</template>

<script>
export default {
  data() {
    return {
      command: ''
    }
  },
  methods: {
    showToastCallbak(str) {
      const toast = this.$createToast({
        txt: str,
        time: 2000,
        type: 'txt',
        $events: {
          timeout: () => {}
        }
      })
      toast.show()
    },
    downloadWifi() {
      window.location.href =
        'http://dl.ibreader.com/api/download/319'
      this.then(() => {
        setTimeout(() => {
          this.showToastCallbak('下载成功')
          this.showToastCallbak(data.msg)
        }, 1000)
      }).catch(err => {
        this.showToastCallbak(err)
      })
    }
  },
  mounted() {},
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../styles/index.styl';
body,html
  size(100%, 100%)
#wifi__download
  size(100%, 100%)
  .img
    width 100%
    position relative
    img
      display inline-block
      width 100%
    .btn
      absolute(bottom 20px, left 0, right 0)
      width 200px
      height 140px
      margin 0 auto
</style>
