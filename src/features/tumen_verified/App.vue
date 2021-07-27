<template lang="pug">
#appbox
  .tip_box 个人信息将进行加密处理,只用于涂檬认证
  .main_content
    .input_box
     .lablebox 姓名
     input.inputbox(type='text' v-model="name" placeholder='请输入姓名')
    .input_box
     .lablebox 身份证号
     input.inputbox(type='text' v-model="idCardNumber" placeholder='请输入身份证号')
    .ID_box
     .title_tip 身份证上传
     .ID_main
       .idcommon_box
        .bgID
         img.posovie_id(:src="require('../../assets/tu_starplan/id_positive.png')" v-show="!pUrl")
         img.posovie_id(:src="pUrl" v-show="pUrl")
         .tipupload
          .uptip 点击上传
            span.active 正面
          input.fileUploadbox(type="file" accept="image/jpeg,image/jpg,image/png,image/svg" @change="uploadEvent($event,'p')")
       .idcommon_box
        .bgID
         img.posovie_id(:src="require('../../assets/tu_starplan/id_opposition.png')" v-show="!oUrl")
         img.posovie_id(:src="oUrl" v-show="oUrl")
        .tipupload
          .uptip 点击上传
            span.active 反面
          input.fileUploadbox(type="file" accept="image/jpeg,image/jpg,image/png,image/svg" @change="uploadEvent($event,'o')")
  .btn_ok
    img.btn_img(:src="require('../../assets/tu_starplan/verfiy_okbtn.png')" v-show="showOk" @click='goAuth')
    img.btn_img(:src="require('../../assets/tu_starplan/verfiy_disablebtn.png')" v-show="!showOk")
</template>

<script>
import { realNameAuth } from './request.js'
import { initOss, getOneUploadedUrl } from '@/utils/upload'
import { getQueryString } from '@/utils/url'
export default {
  data() {
    return {
      name: '',
      idCardNumber: '',
      pUrl: '',
      oUrl: ''
    }
  },
  computed: {
    showOk() {
      const nameStatus = this.name.trim() && this.pUrl && this.oUrl && this.idCardNumber.trim()
      return nameStatus
    }
  },
  methods: {
    async uploadEvent(e, type) {
      let client = await initOss(1)
      const file = e.target.files[0]
      if (!file) {
        return
      }
      getOneUploadedUrl(client, '/bkh5_tumen_verified/' + file.name, file, (url) => {
        if (type === 'p') {
          this.pUrl = url
        } else {
          this.oUrl = url
        }
      })
    },
    // 实名认证
    async goAuth() {
      const { code, msg } = await realNameAuth(this.name, this.pUrl, this.oUrl, this.idCardNumber)
      if (code == 100) {
        window.location.href = (`${window.location.origin}/BKH5-tumen_workinformation.html?access_token=${getQueryString('access_token') || ''}`)
      } else {
        this.$showToast(msg)
      }
    }
  },
  mounted() {},
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import './index.styl'
</style>
