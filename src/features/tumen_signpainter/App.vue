<template lang="pug">
#appbox
  .sign_topbox
    img.logo_box(:src="require('../../assets/tu_starplan/sign_painterlogo.png')")
  ul.list_box
    li.item_box(v-for="(item,index) in data" :key="index")
      img.top_log(:src="item.imgUrl")
      .list_tip(v-for="(subItem,subIndex) in item.list" :key="subIndex+'s'") {{subItem}}
  img.okbtn(:src="require('../../assets/tu_starplan/sign_btnok.png')" @click.stop="becomeStar")
  .tip_box
    img.checked_img(:src="require('../../assets/tu_starplan/sign_checked.png')" v-show="checked" @click.stop="checked=false")
    img.checked_img(:src="require('../../assets/tu_starplan/sign_unchecked.png')" v-show="!checked" @click.stop="checked=true")
    span.tip_text(class='commtext') 我已阅读
    span.tip_protocal(class='commtext') 《涂檬星画师协议》
</template>

<script>
import { signData } from './commonData'
import { bePainter } from './request.js'
export default {
  data() {
    return {
      data: signData,
      checked: true
    }
  },
  methods: {
    becomeStar() {
      if (!this.checked) {
        this.$showToast('请阅读并同意涂檬画师协议', 2000, {
          bgColor: '#ffffff',
          color: '#000000'
        })
        return
      }
      this.bePainter()
    },
    // 成为星画师
    async bePainter() {
      const { code, msg } = await bePainter()
      // 成功后跳转到个人中心，就是关闭当前页面
      if (code == 100) {
        window.location.href = 'activity://becomeStarPainter'
      } else {
        this.$showToast(msg, 2000, {
          bgColor: '#ffffff',
          color: '#000000'
        })
      }
    },
  },
  mounted() {},
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import './index.styl'
</style>
