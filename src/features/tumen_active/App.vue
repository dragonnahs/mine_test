<template lang="pug">
#tumenactive
  .active_img
    img.back_activeImg(:src='isClassPc ? require("../../assets/tu_show/pc_activeImg.jpeg"):require("../../assets/tu_show/background_tumen.jpeg")')
  .toast_modalbox(v-if='showModalToast')
    div(:class='[isClassPc?"context_pcbox":"content_box"]')
      div(:class='[isClassPc?"tip_pctextbox":"tip_textbox"]') 当前活动已结束
      div(:class='[isClassPc?"btnpc_closebox":"btn_closebox"]' @click='closeModal()') 知道了
</template>

<script>
export default {
  data() {
    return {
      showModalToast: false,
      isClassPc: false,
    }
  },
  methods: {
    getQuery() {
      if (window.location.search) {
        let paramsObj= this.changeSearchToObj(window.location.search)
        let nowDate = new Date().getTime()
        if (paramsObj.activetyEndTime) {
          if (nowDate-(+paramsObj.activetyEndTime)>0) this.showModalToast = true
        }
        paramsObj.title&&(document.title=decodeURIComponent(paramsObj.title))
      }
    },
    changeSearchToObj(search) {
      let $_REQUEST = new Object()
      let aParams = search.substr(1).split('&')
      let k = 0
      while (k<aParams.length) {
        let aParam = aParams[k].split('=')
        $_REQUEST[aParam[0]] = aParam[1]
        k++
      }
      return $_REQUEST
    },
    closeModal() {
      this.showModalToast = false
    },
    judgePcMobile() {
      var ua = navigator.userAgent,
        isWindowsPhone = /(?:Windows Phone)/.test(ua),
        isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
        isAndroid = /(?:Android)/.test(ua),
        isFireFox = /(?:Firefox)/.test(ua),
        isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
        isPhone = /(?:iPhone)/.test(ua) && !isTablet,
        isPc = !isPhone && !isAndroid && !isSymbian
      return {
        isTablet,
        isPhone,
        isAndroid,
        isPc
      }
    }
  },
  created() {
    if (this.judgePcMobile().isPc) this.isClassPc = true
  },
  mounted() {
    this.getQuery()
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import './index.styl'
</style>
