<template lang="pug">
#app
  .mobile__faq__common
    List(
      title="常见问题"
      classStyle="default__list"
      :data="commondatas"
      v-on:clickQuestion="clickQuestion"
    )
    List(
      title="问题分类"
      classStyle="list__class"
      :data="classesdatas"
      v-on:clickQuestion="clickQuestion"
    )
  .mobile__footer__space
  .mobile__faq__footer
    p.button.faq__phone(@click="callPhone") 电话客服
    p.button.faq__online(@click="callOnline") 在线客服
</template>

<script>
import { post } from '@/config/axios.config'
import List from './components/list'
import config from './data.js'
import {
  mBuryPoint,
  getCookie,
  compareVersion,
  getUrlParamsByObject,
  routerToNative
} from '@/utils/index'
export default {
  components: {
    List,
  },
  data() {
    return {
      clickFlag: true,
      commondatas: config.common,
      classesdatas: config.classes,
      userInfo: {},
      appVersion: localStorage.getItem('appVersion'),
      version: localStorage.getItem('version')  // 真实版本
    }
  },
  methods: {
    clickQuestion(val) { // 点击问题跳转详情
      let routeurl
      if (val.key === 'common') {
        mBuryPoint(null, {
          source: 'help_center',
          type: 'common',
          question_id: val.id
        })
        routeurl = `${window.location.origin}/BKH5-mobile_faq_detail.html?key=${val.key}&questionId=${val.id}&from=helpcenter`
      }
      if (val.key === 'classes') {
        mBuryPoint(null, {
          source: 'help_center',
          type: 'class',
          class_id: val.id,
        })
        routeurl = `${window.location.origin}/BKH5-mobile_faq_more.html?key=${val.key}&classesId=${val.id}`
      }
      routerToNative(`${routeurl}`)
    },
    callPhone() { // 吊起电话
      mBuryPoint(null, {
        source: 'help_center',
        type: 'phone_click'
      })
      window.location='tel:01052132489'
    },
    callOnline() { // 跳转在线客服
      if (!this.clickFlag) return
      mBuryPoint(null, {
        source: 'help_center',
        type: 'online_click'
      })
      const vId = getCookie('vId')
      const sessionId = getCookie('sessionid') // sessionId 存在～说明用户已经登录
      const { username, nickname, phoneNum } = this.userInfo
      const userID = sessionId ? sessionId : vId
      const params = {
        sysnum: '97eed5af7ee44513b227658750dc0981',
        channelid: '2',
        partnerid: sessionId ? sessionId : vId,
        uname: username,
        realname: nickname,
        tel: phoneNum,
        params: '{"版本号":"'+ this.appVersion +'","用户ID":"'+ userID +'"}',
        type: '3', // 客服接待模式  1 -- 仅机器人客服  2 -- 仅人工客服 3 -- 机器人优先  4 -- 人工优先
        msg_flag: '0', // 结束会话是否显示留言窗口  1 -- off  0 -- on
        level_msg_flag: '1', // 控制面板中留言按钮 1 -- on   1 -- off
        feedback_flag: '1',  // 评价按钮 1 -- on  0 -- off
        photo_flag: compareVersion('1.38.0', this.version) !== -1 ? '1' : '0',  // 上传附件按钮 1 -- on  0 -- off 仅H5
        to_customsys_open_style: '0', // 转人工时跳第三方页面按钮 1 -- on 0 -- off
        // leave_customsys_flag: '1', // 是否开启留言转第三方系统  1 -- on 0 -- off  仅H5
        agent_mode_flag: '1', // 指定客服接待模式, 1 -- 客服不在线则正常提示 0 --客服不在线则接到其他客服
        top_bar_flag: '0', // 是否显示聊天页面顶部返回栏 1 -- on 0 -- off  仅H5
        guide_flag: '1', // 是否开启机器人引导问题 1 -- on  0 -- off
        time: '2880', // 用户可查看聊天记录的事件单位，单位：分钟
        artificial: true
      }
      const url = `https://chat.sobot.com/chat/h5/v2/index.html${getUrlParamsByObject(params)}`
      routerToNative(url)
      this.clickFlag = false
      setTimeout(() => {
        this.clickFlag = true
      }, 2000)
    },
  },
  created() {},
  mounted() {
    mBuryPoint(null, { // 进入帮助中心的埋点
      source: 'help_center',
      type: 'open'
    })
    post('/api/user/userInfoQuickApp').then(res => {
      if (!res.data) return
      const { vipInfo, userInfo } = res.data
      this.userInfo = { ...vipInfo, ...userInfo }
    })
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../styles/index.styl';
body,html
  size(100%, 100%)
#app
  size(100%, 100%)
  .mobile__faq__common
    .list__class
      // display grid
      // grid-template-columns 1fr 1fr
      display flex
      flex-wrap wrap
      flex-direction row
      li.item
        width 42%
        &:nth-of-type(odd)
          padding-right 19px
          border-right 1px solid #E8EDED
        &:nth-of-type(even)
          padding-left 27px
        &:last-child
          border-bottom 1px solid #E8EDED
  .mobile__footer__space
    size(100%, 64px)
  .mobile__faq__footer
    display flex
    flex-direction row
    padding 10px 20px
    background #ffffff
    fixed(bottom 0 left 0 right 0)
    border-top 1px solid #E8EDED
    .button
      font-size 15px
      line-height 43px
      text-align center
      font-weight bold
      color #ffffff
      background #FFB250
      size(150px, 43px)
      border 1px solid rgba(232,237,237,1)
      border-radius 12px
      position relative
      padding-left 20px
      box-sizing border-box
      &:first-child
        margin-right 35px
    .faq__phone
      &:before
        content ''
        size(21px, 21px)
        background red
        absolute(top 11px left 29px)
        background url('../../assets/mobileFaq/dianhuakefu@3x.png') no-repeat center center
        background-size 100% 100%
    .faq__online
      &:before
        content ''
        size(21px, 21px)
        background red
        absolute(top 11px left 29px)
        background url('../../assets/mobileFaq/zaixiankefu@3x.png') no-repeat center center
        background-size 100% 100%
</style>
