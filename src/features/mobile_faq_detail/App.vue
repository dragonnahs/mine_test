<template lang="pug">
#app
  .content
    h4.title {{ questionObj[0].question }}
    p.desc
      | {{ questionObj[0].anwser }}
      span.list(
        v-if="questionObj[0].anwserlist.length !== 0"
        v-for="val in questionObj[0].anwserlist"
        ) {{ val }}
    p.contact
      span 问题没有解决？
      span.contact__customer(@click="callOnline") 联系客服
        span.icon__arrow
</template>

<script>
import { post } from '@/config/axios.config'
import config from '../mobile_faq/data.js'
import {
  mBuryPoint,
  compareVersion,
  getCookie,
  getQueryString,
  getUrlParamsByObject,
  routerToNative
} from '@/utils/index'
export default {
  data() {
    return {
      clickFlag: true,
      questionId: getQueryString('questionId') || '',
      classesId: getQueryString('classesId') || '',
      key: getQueryString('key') || '',
      questionObj: [{
        question: '',
        anwser: '',
        anwserlist: []
      }],
      userInfo: {},
      version: localStorage.getItem('version')  // 真实版本
    }
  },
  methods: {
    callOnline() {  // 点击跳转在线客服
      if (!this.clickFlag) return
      mBuryPoint(null, {
        source: 'question_detail',
        type: 'online_click'
      })
      const vId = getCookie('vId')
      const sessionId = getCookie('sessionid') // sessionId 存在～说明用户已经登录
      const { username, nickname, phoneNum } = this.userInfo
      const params = {
        sysnum: '97eed5af7ee44513b227658750dc0981',
        channelid: '2',
        partnerid: sessionId ? sessionId : vId,
        uname: username,
        realname: nickname,
        tel: phoneNum,
        type: '3',
        msg_flag: '0',
        level_msg_flag: '1',
        feedback_flag: '1',
        photo_flag: compareVersion('1.38.0', this.version) !== -1 ? '1' : '0',
        to_customsys_open_style: '0',
        // leave_customsys_flag: '1',
        agent_mode_flag: '1',
        top_bar_flag: '0',
        guide_flag: '1',
        time: '2880',
        artificial: true
      }
      const url = `https://chat.sobot.com/chat/h5/v2/index.html${getUrlParamsByObject(params)}`
      routerToNative(url)
      this.clickFlag = false
      setTimeout(() => {
        this.clickFlag = true
      }, 2000)
    }
  },
  created() {
    post('/api/user/userInfoQuickApp').then(res => {
      if (!res.data) return
      const { vipInfo, userInfo } = res.data
      this.userInfo = { ...vipInfo, ...userInfo }
    })
    mBuryPoint(null, {
      source: 'question_detail',
      from: getQueryString('from'),
      type: 'open',
      class_id: this.classesId,
      question_id: this.questionId
    })
    if (this.key === 'common') {
      this.questionObj = config[this.key].filter(item => item.id === this.questionId)
    }
    if (this.key === 'classes') {
      const data = config[this.key].filter(item => item.id === this.classesId)
      this.questionObj = data[0].list.filter(val => val.id === this.questionId)
    }
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../styles/index.styl';
body, html
  size(100%, 100%)
  background #F5F5F5
#app
  padding 10px
  box-sizing border-box
  .content
    width 100%
    background #ffffff
    min-height 100px
    padding 0 10px
    box-sizing border-box
    border-radius 4px
    .title
      font-size 15px
      font-family PingFangSC-Medium,PingFang SC
      font-weight bold
      color #333333
      line-height 21px
      padding 15px 0
      background #ffffff
      border-bottom 1px solid #E8EDED
    p.desc,p.contact
      font-size 15px
      font-family PingFangSC-Regular,PingFang SC
      // font-weight bold
      color rgba(102,102,102,1)
      line-height 21px
      padding 15px 0 50px 0
      border-bottom 1px solid #E8EDED
      .list
        display inline-block
    p.contact
      text-align center
      padding 27px 0 37px 0
      border-bottom none
      .contact__customer
        color #FFB250
        .icon__arrow
          margin-left 4px
          size(10px 11px)
          display inline-block
          background url(../../assets/mobileFaq/xiangyouhui@3x.png) no-repeat center center
          background-size 100% 100%
</style>
