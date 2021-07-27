<template lang="pug">
#app
  .topup
    img.img(src="../../assets/buyVip/vip.png")
    p.btn(@click="buyNow()")
</template>

<script>
import { getQueryString } from '@/utils/url'
import { get } from '@/config/axios.config'
export default {
  data() {
    return {
      source: getQueryString('source') || '',
    }
  },
  methods: {
    buyNow() {
      console.log('点击购买')
      window.location = 'breader://usercenter/vip'
    },
  },
  mounted() {
    console.log('source', this.source)
    get(`/api/operation/statistics?source=${this.source}&type=vip`)
      .then(() => {
        console.info('埋点成功')
      })
      .catch(err => {
        console.error('error ----->', err)
      })
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../styles/index.styl';
body,html
  size(100%, 100%)
  background rgb(218, 43, 42)
#app
  size(100%, 100%)
  .topup
    position relative
    background rgb(218, 43, 42)
    .img
      width 100%
    .btn
      position absolute
      top 335px
      background none
      width 210px
      height 64px
      left 80px
      border none
</style>
