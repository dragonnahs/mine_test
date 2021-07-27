<template lang="pug">
#appbox
 img.center_top(:src="require('../../assets/tu_starplan/paincenter_top.png')")
 .oper_btn
   .btn_go(class='bgbtnbox' @click='goAutho') 我要授权
   img.btn_go(:src="require('../../assets/tu_starplan/paincenter_manage.png')" @click='goWorks')
 .content_box
   img.tipimg(:src="require('../../assets/tu_starplan/paintcenter_tips.png')")
   ul.list_box
     li.item_box(v-for="(item,index) in data" :key="index")
       img.boximg(:src="item.imgUrl")
       .desbox {{item.text}}
 .bottom_tipbox 有任何版画授权售卖问题可联系QQ群：680314476
</template>

<script>
import { centerData } from '../tumen_signpainter/commonData'
import { getAuthInfo } from './request.js'
import { getQueryString } from '@/utils/url'
export default {
  data() {
    return {
      data: centerData,
      realNameAuthStatus: 0, // 实名认证状态 0-未认证 1-待审核 2-已认证 3-审核拒绝
    }
  },
  methods: {
    goAutho() {
      if (this.realNameAuthStatus == 3 || this.realNameAuthStatus == 0) {
        window.location.href = (`${window.location.origin}/BKH5-tumen_verified.html?access_token=${getQueryString('access_token') || ''}`)
      } else {
        window.location.href = (`${window.location.origin}/BKH5-tumen_workinformation.html?access_token=${getQueryString('access_token') || ''}`)
      }
    },
    goWorks() {
      window.location.href = (`${window.location.origin}/BKH5-tumen_workmanage.html?access_token=${getQueryString('access_token') || ''}`)
    },
    async init() {
      const { realNameAuthStatus } = await getAuthInfo()
      this.realNameAuthStatus = realNameAuthStatus
    },
  },
  mounted() {
    this.init()
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import './index.styl'
</style>
