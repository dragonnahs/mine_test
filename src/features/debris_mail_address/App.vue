<template lang="pug">
.debris_mail_address
  .debris_mail_address_item
    .debris_mail_address_item_title 姓名
    input.debris_mail_address_item_input(placeholder='' v-model='userRealName')
  .debris_mail_address_item
    .debris_mail_address_item_title 联系电话
    input.debris_mail_address_item_input(type='tel' maxlength=11 v-model='userPhone')
  .debris_mail_address_detail
    .debris_mail_address_detail_title 邮寄地址
    textarea.debris_mail_address_detail_textarea(placeholder='详细地址，请精确至门牌号' v-model='userAddress')
  .debris_mail_address_btn(@click='submit' v-if='isShowBtn') 提交
  .debris_mail_address_btn.is_disabled(v-else) 已提交
  .debris_mail_address_rule
    .debris_mail_address_rule_title 注意事项:
    .debris_mail_address_rule_content
      | 请认真填写您的地址，若因地址有误造成的未收到货品，造成的后果，由用户自行承担

</template>

<script>
import { closeCurrentPage } from '@/utils/nativeToH5/index'
import { getQueryString } from '@/utils/url'
import { submitMailAddress } from './request'
import { mBuryPoint } from '@/utils/index'
export default {
  data() {
    return {
      userRealName: '',
      userPhone: '',
      userAddress: '',
      isShowBtn: true
    }
  },
  methods: {
    async submit() {
      if (!this.userRealName) {
        this.$showToast('请输入真实姓名')
        return
      }
      if (!this.userPhone) {
        this.$showToast('请输入手机号')
        return
      }
      if (!this.userAddress) {
        this.$showToast('请输入详细地址')
        return
      }
      this.submitMailAddress()
    },
    async submitMailAddress() {
      mBuryPoint(13, {
        eventPage: 'mailAddress',
        eventType: 2,
        source: getQueryString('from'),
        eventPos: 'submit',
        activityId: getQueryString('activityId')
      })
      let res = await submitMailAddress({
        activityId: getQueryString('activityId') || '', // 活动ID
        // exchangeRecordId: getQueryString('exchangeRecordId') || '',
        activityRecordId: getQueryString('activityRecordId') || '', // 兑换记录ID
        userRealName: this.userRealName,
        userPhone: this.userPhone,
        userAddress: this.userAddress
      })
      if (res.code == 100) {
        closeCurrentPage()
      } else {
        this.$showToast(res.msg || '提交失败')
      }
    },
    initPage() {
      let userInfo = getQueryString('userInfo') ? JSON.parse(getQueryString('userInfo')) : null
      console.log(userInfo)
      if (userInfo) {
        this.userRealName = userInfo.userRealName
        this.userPhone = userInfo.userPhone
        this.userAddress = userInfo.userAddress
        this.isShowBtn = false
      }
    }
  },
  mounted() {
    mBuryPoint(13, {
      eventPage: 'mailAddress',
      eventType: 1,
      source: getQueryString('from'),
      activityId: getQueryString('activityId')
    })
    this.initPage()
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../styles/index.styl';
@import './index.styl'
</style>
