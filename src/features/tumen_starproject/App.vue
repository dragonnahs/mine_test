<template lang="pug">
#appbox
 img.topbox(:src="require('../../assets/tu_starplan/star_project.png')")
 .welfarebox
   .welfarelist_logo
     img.logowelfare_box(:src="require('../../assets/tu_starplan/starplan_logo.png')")
   ul.listbox
     li.list_item(v-for='(item,index) in dataList' :key='index' :class="item.font")
      img.commItem(:src="item.src")
   .becomstar_box(ref='showBox')
     img.becomstar_logo(:src="require('../../assets/tu_starplan/becomestar_logo.png')")
   .works_countbox
     .desworks_count 投稿上架作品数量
     .works_count {{counts}}/2作品
   .works_countbox
     .desworks_count 完成手机认证
     .works_count.special_right {{phoneStatus?'已完成':'未完成'}}
   .btn_application(@click.stop="judgeShow")
     img.application_img(:src="require('../../assets/tu_starplan/application_btn.png')")
   .qa_box
     img.aq_logobox(:src="require('../../assets/tu_starplan/starqa_logo.png')")
 .desc_box
   img.tipstars(:src="require('../../assets/tu_starplan/star_des_tip.png')")
   .title_box 1.什么是“涂檬星画师”计划
   .desc_starbox “涂檬星画师”是涂檬为入驻画师提供的一份综合福利计。通过对画师作品综合评估，给予画师对应的涂檬权益，旨在为涂檬入驻画师提供多种变现机会与成长渠道。</br>PS：每份作品可以包含多张图片，建议不同类别的图片分别投稿哦~
   .title_box 2.画师加入“涂檬星画师”计划的前提条件是？
   .desc_starbox 加入涂檬星画师计划，需要在涂檬投稿至少两份作品
   .title_box 3.如何申请成为涂檬星画师？
   .desc_starbox 进入涂檬星画师权益中心确认是否符合入选标准，如申请按钮高亮则表示符合标准。点击申请按钮即可完成涂檬星画师申请流程。
   .title_box 4.成为涂檬星画师的作品有哪些要求
   .desc_starbox 涂檬星画师投稿作品需为申请人本人创作。若涂檬发现申请人投稿了任何非本人创作的作品，则会永久取消该用户的星画师申请权限，必要时会采取封号等行为用以维护涂檬的创作环境。
   .title_box 5.成为涂檬星画师后我享有哪些权益
   .desc_starbox 成为涂檬星画师即可获取专属“星画师”认证，拥有审核快速通道和优先曝光推荐的权益，并且可以享受涂檬给予的多项商业变现渠道。
   .title_box 6.如何得知自己在星画师计划中获取的收益？
   .desc_starbox 涂檬会与符合要求的画师额外签约，在相关合同中明确收益分配细则和打款方式等。
   .title_box 7.成为涂檬星画师后需要稳定更新么？
   .desc_starbox 涂檬会定期复审已签约画师的活跃状态，更倾向于将商单福利分配给有多次投稿行为的星画师。涂檬建议画师每三个月至少投稿一份作品，以提高自身的入选几率。
   .title_box 8.成为涂檬星画师后需要遵守哪些规则？
   .desc_starbox ①遵守涂檬用户协议，保证上传的图片符合国家相关法律法规</br>②所投稿作品均为本人创作（或与彼此认可的画师协同创作）禁止上传他人创作的作品</br>③禁止通过任何形式利用“涂檬星画师”计划谋取不正当利益</br>④对相关协议内容严格保密，不泄露给任意第三方公司。如违反本条，涂檬将保留追究起法律责任的权力。
   .desc_starbox PS：大多数限制与要求本就是投稿时本应做到的事情，各位老师不需要有太多心理负担哦
 .mask_box(v-if="showModal" @touchmove.stop='moveStopPropagation' @click.stop="hiddenModal")
 transition(name='fade')
   .phoneModal_box(@touchmove.stop="moveStopPropagation" v-show="showModal")
     img.close_icon(:src="require('../../assets/tu_starplan/close_modal.png')" @click.stop="hiddenModal")
     input.phoneNumber_box(type="number" v-model="phoneNum" placeholder="请输入手机号")
     .verfiy_codebox
       input.verfiy_input(type="number" v-model="verfiyCode" placeholder="请输入验证码")
       img.send_btn(v-show="!showCount" @click.stop="sendVerfiyCode" :src="require('../../assets/tu_starplan/send_codebtn.png')")
       span.count_downbox(v-show="showCount")
         img.send_btn(:src="require('../../assets/tu_starplan/send_codebtndisable.png')")
         span.down_count 剩余 {{count}} s
     img.bindpohne_btn(v-show="showStatus" @click='bindAuthPhoneNum' :src="require('../../assets/tu_starplan/phone_verbtn.png')")
     img.bindpohne_btn(v-show="!showStatus" :src="require('../../assets/tu_starplan/phone_disablebtn.png')")
</template>

<script>
let timeId = null
import { getAuthInfo, sendMsg, cellphoneAuth } from './request.js'
import { getQueryString } from '@/utils/url'
export default {
  data() {
    return {
      dataList: [
        { src: require('../../assets/tu_starplan/painter_sign.png'), font: 'first_listbox' },
        { src: require('../../assets/tu_starplan/multi_channel.png'), font: '' },
        { src: require('../../assets/tu_starplan/staraudit.png'), font: 'third_listbox' },
        { src: require('../../assets/tu_starplan/starflow.png'), font: '' }
      ],
      counts: 0,
      phoneStatus: false,
      showModal: false,
      phoneNum: '',
      verfiyCode: '',
      showCount: false,
      count: 60,
    }
  },
  computed: {
    showStatus() {
      const phoneOk = this.phoneNum.trim().length===11
      const codeOk =  this.verfiyCode.trim()
      return phoneOk&&codeOk
    }
  },
  methods: {
    judgeShow() {
      if (!this.phoneStatus) {
        this.showModal = true
        return
      }
      if (this.counts < 2) {
        this.$showToast('达到签约标准后才可申请', 2000, {
          bgColor: '#ffffff',
          color: '#000000'
        })
        return
      }
      window.location.href = `${window.location.origin}/BKH5-tumen_signpainter.html?access_token=${getQueryString('access_token') || ''}`
    },
    sendVerfiyCode() {
      if (this.phoneNum.trim().length!==11) {
        this.$showToast('请输入正确的手机号', 2000, {
          bgColor: '#ffffff',
          color: '#000000'
        })
        return
      }
      this.showCount = true
      this.phoneSendMsg()
      timeId = setInterval(() => {
        this.count--
        if (this.count===0) {
          clearInterval(timeId)
          this.count = 60
          this.showCount = false
        }
      }, 1000)
    },
    // 发送验证码
    phoneSendMsg() {
      sendMsg(this.phoneNum.trim())
    },
    moveStopPropagation(e) {
      e.stopPropagation()
    },
    hiddenModal() {
      this.showModal = false
    },
    async init() {
      const { opusNum, phoneAuthStatus } = await getAuthInfo()
      this.phoneStatus = phoneAuthStatus == 1
      this.counts = opusNum
    },
    // 绑定手机号
    async bindAuthPhoneNum() {
      let { code, msg } = await cellphoneAuth(this.phoneNum, this.verfiyCode)
      if (code == 100) {
        this.showModal = false
        this.init()
        this.$showToast('手机号绑定成功', 2000, {
          bgColor: '#ffffff',
          color: '#000000'
        })
      } else {
        this.$showToast(msg, 2000, {
          bgColor: '#ffffff',
          color: '#000000'
        })
      }
    }
  },
  mounted() {
    this.init()
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import './index.styl'
</style>
