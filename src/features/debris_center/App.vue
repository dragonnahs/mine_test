<template lang="pug">
#debris_app
  P.header_right_record(@click="goToRewardRecord()")
    span 中奖记录
  P.header_right_record_rule(@click="goToActivityRule()")
    span 活动规则
  header
    .header_space(:style="{opacity: opacity}")
    .header_nav
      span.header_back(
        @click="browserBack()"
         v-if="from !== 'tab'"
        :style="{backgroundImage: backgroundImage}")
      | 碎片中心
    .award_list_root
      h3.header_title 我的奖品
      .award_list
        p.click_more_award(@click="goAwardList()") 查看更多
        Award(v-for="item in fragmentItemInfoList"
          :awardInfo="item"
          v-on:getAwardToMailAddress="getAwardToMailAddress")
  .sign_module
    Sign(v-on:openCalendarSignNotice="openCalendarSignNotice"
      v-on:goSignRecord="goSignRecord"
      :imgUrl="imgUrl"
      v-if="checkinRewardInfoList.length !== 0 && isAndroidOSVer > 5"
      :checkinRewardInfoList="checkinRewardInfoList"
      :checkinInfo="checkinInfo")
    SignLow(v-on:openCalendarSignNotice="openCalendarSignNotice"
      v-on:goSignRecord="goSignRecord"
      :imgUrl="imgUrl"
      v-if="checkinRewardInfoList.length !== 0 && isAndroidOSVer < 6"
      :checkinRewardInfoList="checkinRewardInfoList"
      :checkinInfo="checkinInfo")
  .task_module(v-if="chapterTaskInfoList && taskInfoList.length !== 0")
    ContentSlot(
      :title='taskTitle',
      :desc='desc'
      :styles="styles"
      fontColor="#8D3000")
      ul.task_list
        li.single_task(v-for="item in taskInfoList")
          p.task_name {{ item.name }}
          p.task_state(@click="openTask(item)" :style="item.isFinish*1 === 1 ? taskStyle : ''")
            span {{ item.isFinish*1 === 0 ? '待领取' : '已领取'}}
  .signleBook_module(
    v-if="excitationSingleBookInfoVOList.length > 0"
    ref="singleBookRoot")
    ContentSlot(
      title='专享书籍领碎片',
      :desc='singleBookDesc'
      :styles="styles"
      fontColor="#317eb4"
      isShowRight=true
      rightText="每日3枚")
      ul.single_list(ref="singleBookRef")
        li.single_book(
          v-for="item in excitationSingleBookInfoVOList"
          @click="clickSignleBook(item)"
          :key="item.bookId")
          img.single_book_cover(:src="item.bookCoverUrl")
          div.single_book_desc
            span.single_book_title {{item.bookName}}
            span.single_book_info {{ item.intro }}
            span.single_book_class {{ item.classify }}
          p.single_book_btn
            span 去阅读
  .award_center_list
    ContentSlot(
      title='奖励中心',
      :styles="styles"
      fontColor="#8D3000"
      isShowRight=true
      rightText="查看更多"
      @goAwardCenter="goAwardCenter"
      v-if="commentInfoList && commentInfoList.length !== 0")
      .comment(v-for="item in commentInfoList")
        Comment(
          :avatarUrl='item.headImg'
          :userId='item.id'
          :time='item.createTime'
          :awardName='item.tag'
          :awardDesc='item.content'
          :awardImgs="item.imgList"
          v-on:goAwardCenter='goAwardCenter')
  .space_bottom(style="width: 100%; height: 80px")
  .modal_activity(v-show="activityExpired")
    .modal_activity_content(v-if="code === 153")
      h3 对不起，活动已下线，
        br
        | 可以完成其他任务赢金币哦～
      p.count__down {{countDown}}s后跳转任务中心
    .modal_activity_content(v-if="code === 156")
      h3 不太符合参与条件哦～
        br
        | 可以完成其他任务抽取手机～
      p.count__down {{countDown}}s后跳转任务中心
  .award_gift(
    v-if="fragmentPrizeTwoEnable === 1"
    @click="clickAward()")
  .new_person_guidance(v-if="showGuidance")
    Guidance(:taskInfoList="taskInfoList"
      :singleBookGuidance="excitationSingleBookInfoVOList[0]"
      :title='taskTitle'
      :desc='desc'
      @closeGuidance='closeGuidance'
      @scrollStep="scrollStep"
      :styles="styles")
</template>

<script>
import bk from 'bayread-bridge'
import { getQueryString, routerToNative, throttle, nBuryPoint, BROWSER } from '@/utils/index'
import { toast } from '@/utils/nativeToH5/index'
import { getDebrislist } from './request'
export default {
  components: {
    ContentSlot: () => import('./components/content_slot'),
    Comment: () => import('./components/comment'),
    Award: () => import('./components/award'),
    Sign: () => import('./components/sign'),
    SignLow: () => import('./components/sign_low_version'),
    Guidance: () => import('./components/guidance')
  },
  data() {
    return {
      activityId: getQueryString('activityId') || '129',
      from: getQueryString('from') || 'tab',
      position: getQueryString('position') || '',
      styles: {
        padding: '16px 15px 12px',
        boxSizing: 'border-box',
        color: '' },
      todayTotalReadChapterNum: 0,  // 今日阅读章数
      nextTaskNeedNum: 0, // 今日再阅读几章
      chipNum: 0, // 再阅读几章将到账碎片数
      isOpen: false,
      fragmentItemInfoList: [], // 碎片列表
      checkinRewardInfoList: [], // 碎片列表
      taskInfoList: [], // 任务列表
      checkinInfo: { // 签到天数等相关信息
        checkinDays: 0,
        checkinFragmentCount: 0
      },
      commentInfoList: [], // 福利评论列表
      opacity: 0,
      backgroundImage: `url(${require('../../assets/debris_center/debris_back@2x.png')})`,
      taskFinishBg: `url(${require('../../assets/debris_center/finish_task.png')})`,
      taskFinishDefault: `url(${require('../../assets/debris_center/default_task.png')})`,
      rewardNum: 0,
      chapterTaskInfoList: {},
      activityExpired: false,
      isAbled: true,
      code: 156,
      countDown: 5,
      timer: null,
      platform: '',
      singleBookDesc: '看专项书籍领取稀有碎片，阅读满6章必得碎片',
      taskStyle: {
        color: '#8D3000',
        background: '#FFECDB',
        boxShadow: 'none'
      },
      showGuidance: false,
      fragmentPrizeTwoEnable: 0,
      excitationSingleBookInfoVOList: [],  // 专享书籍列表
      isAndroidOSVer: 8
    }
  },
  computed: {
    imgUrl() {
      return !this.isOpen ? require('../../assets/debris_center/off_icon@2x.png') : require('../../assets/debris_center/open_icon@2x.png')
    },
    taskTitle() {
      return `今日阅读${this.todayTotalReadChapterNum}章`
    },
    desc() {
      if (this.nextTaskNeedNum * 1 <= 0) {
        return `已通过阅读到账${this.rewardNum}枚碎片`
      } else {
        return `已通过阅读到账${this.rewardNum}枚碎片，再阅读${this.nextTaskNeedNum}章，到账${this.chipNum}枚`
      }
    }
  },
  created() {
    this.isAndroidOSVer = (BROWSER.isAndroidOSVer.split('.'))[0]
    console.log('OSVer', this.isAndroidOSVer)
    bk.call('getTodayReadTaskChapterNum', {}, data => { // 初始化碎片信息
      const { todayTotalReadChapterNum, nextTaskNeedNum, chipNum   } = JSON.parse(data)
      this.todayTotalReadChapterNum = todayTotalReadChapterNum
      this.nextTaskNeedNum = nextTaskNeedNum
      this.chipNum = chipNum
    })
    bk.call('calendarSignNoticeInit', {}, data => {
      const { isOpen  } = JSON.parse(data)
      // 通知开启初始化
      if (isOpen  * 1 === 0) {
        this.isOpen = false
      } else {
        this.isOpen = true
      }
    })
    bk.register('calendarSignNoticeResume', () => {
      nBuryPoint('H5_DEBRIS_CENTER_OPEN_CALENDAR', { // 开启签到提醒
        'source': this.from,
        'isOpen': 1,
        'activityId': this.activityId
      })
      toast({
        content: '签到提醒开启成功'
      })
      this.isOpen = true
    })
    bk.register('browserPageResume', () => {
      this.InitData('browserResume')
      this.isAbled = true
      bk.call('getTodayReadTaskChapterNum', {}, data => { // 初始化碎片信息
        const { todayTotalReadChapterNum, nextTaskNeedNum, chipNum   } = JSON.parse(data)
        this.todayTotalReadChapterNum = todayTotalReadChapterNum
        this.nextTaskNeedNum = nextTaskNeedNum
        this.chipNum = chipNum
      })
    })
    this.InitData()
  },
  methods: {
    scrollStep(step, val) { // 新手引导滚动引导
      setTimeout(() => {
        if (step === '2') {
          document.documentElement.scrollTop = val
          document.body.scrollTop = val
          return
        }
        if (step === '3') {
          document.documentElement.scrollTop = this.$refs.singleBookRef.offsetTop - val - 10
          document.body.scrollTop = this.$refs.singleBookRef.offsetTop - val - 10
        }
      }, 10)
    },
    clickSignleBook: throttle(function(item) {
      nBuryPoint('H5_DEBRIS_CENTER_CLICK_SINGLE_BOOK', {
        'bookId': item.bookId,
        'source': this.from,
        'activityId': this.activityId
      })
      window.location.assign(`breader://www.bayread.com/bookview/bookread?bookId=${item.bookId}&source=debrisCenter&chapterNum=0`)
    }, 30),
    closeGuidance() { // 关闭引导弹窗
      this.showGuidance = !this.showGuidance
      localStorage.setItem('guidance_step', '3')
      document.getElementsByTagName('html')[0].style.overflowY = 'scroll'
    },
    async InitData(val = '') {
      let { data, code  } = await getDebrislist(this.activityId)
      try {
        if (Number(code) === 153 || Number(code) === 156) {
          this.code = Number(code)
          // 153 表示活动过期, 156 表示进来这个页面的老用户
          this.fragmentItemInfoList = [{
            exchange: 0,
            id: 1,
            rewardGroup: 3,
            rewardType: 3,
            smallImgUrl: 'http://cdn.ibreader.com/group1/M01/82/94/rBH_vl-IEpKAe7XmAAE7-8bxOTs859.png',
            title: '5G手机',
          }, {
            exchange: 0,
            id: 11,
            rewardGroup: 3,
            rewardType: 3,
            smallImgUrl: 'http://cdn.ibreader.com/group1/M01/83/3E/rBH_vl-IGSmAccbEAAEga_dQ9x4796.png',
            title: 'iPad',
            userFragmentCount: 0,
          }]
          this.checkinRewardInfoList = Array(10).fill(1)
          this.activityExpired = true
          const host = window.location.host
          this.timer = setInterval(() => {
            this.countDown = this.countDown - 1
            if (this.countDown < 1) {
              this.countDown = 0
              clearInterval(this.timer)
              if (host === 'increase.ibreader.com') {
                window.location.replace(`https://increase.ibreader.com/#/?navShow=${this.from}`)
                return
              }
              if (host === 'testincrease.ibreader.com') {
                window.location.replace(`http://testtask.ibreader.com/#/?navShow=${this.from}`)
                return
              }
            }
          }, 1000)
        }
        if (val === '') {
          nBuryPoint('H5_DEBRIS_CENTER_ENTER', {  // 进入碎片中心
            'source': this.from,
            'activityId': this.activityId,
            'fragmentPrizeTwoEnable': this.fragmentPrizeTwoEnable, // 二期是否开启 0 -- close  1 -- open
          })
        }
        const {
          checkinRewardInfoList = [],
          checkinInfo = {},
          commentInfoList = [],
          fragmentItemInfoList = [],
          chapterTaskInfoList = {},
          activityId,
          fragmentPrizeTwoEnable,
          fragmentPrizeTwoVersionEnable,
          simpleCheckinRewardInfoList,
          rewardFragmentPrizeMsg
        } = data
        this.fragmentPrizeTwoEnable = Number(fragmentPrizeTwoEnable)
        this.chapterTaskInfoList = chapterTaskInfoList
        if (chapterTaskInfoList) {
          const { taskVOS = []} = chapterTaskInfoList
          this.taskInfoList = taskVOS
        }
        this.activityId = activityId
        this.checkinRewardInfoList = checkinRewardInfoList
        this.checkinInfo = checkinInfo
        this.commentInfoList = commentInfoList
        this.fragmentItemInfoList = fragmentItemInfoList
        this.excitationSingleBookInfoVOList = chapterTaskInfoList.excitationSingleBookInfoVOList || []
        if (this.position === 'singleBook' && this.excitationSingleBookInfoVOList.length !== 0) {
          this.$nextTick(() => {
            setTimeout(() => {
              const NodeList = document.querySelector('.task_list li:last-child')
              console.log('----', NodeList)
              NodeList.scrollIntoView(true)
            }, 1000)
          })
        }
        // 测试代码
        // this.showGuidance = true

        if (checkinInfo) {
          const { fragmentPrizeInfoList=[], checkinGiftBag = null, checkinDays, checkinFragmentCount, fragmentCount } = checkinInfo
          if (this.checkinInfo.alert * 1 === 1) {
            bk.call('showChipRewardDialog', {
              data: fragmentPrizeInfoList,  // 获得的奖励碎片集合
              debrisSign: {
                checkinGiftBag, // 本次访问是否赠送了首次签到礼包  1=赠送礼包，0=没有赠送礼包
                simpleCheckinRewardInfoList,  // 客户端弹窗使用签到奖励信息
                rewardFragmentPrizeMsg, // 客户端弹窗使用奖励明细
                checkinDays,  // 签到天数
                checkinFragmentCount, // 用户连续签到总共获取的碎片数
                fragmentCount, // 用户本次签到获取的碎片数
                url: `${window.location.origin}/BKH5-debris_center_detail_record.html?activityId=${this.activityId}&from=${this.from}`
              }
            }, (data) => {
              const { chipSignDialogDismiss } = JSON.parse(data)
              if (chipSignDialogDismiss * 1 === 1) {
                const guidanceStep = localStorage.getItem('guidance_step')
                if (guidanceStep && guidanceStep === '3') {
                  this.showGuidance = false
                } else if (fragmentPrizeTwoEnable * 1 === 1 && fragmentPrizeTwoVersionEnable * 1 === 1) {
                  localStorage.setItem('guidance_step', '1')
                  this.showGuidance = true
                  document.getElementsByTagName('html')[0].style.overflowY = 'hidden'
                }
              }
            })
          }
        }
        const rewardLists = this.taskInfoList.filter(item => item.isFinish * 1 === 1)
        if (rewardLists.length === 1) {
          this.rewardNum = rewardLists[0].rewardNum
        } else {
          this.rewardNum = rewardLists.reduce((acc, val) => acc + val.rewardNum * 1, 0)
        }
      } catch (error) {
        console.error('error----->', error)
      }
    },
    getAwardToMailAddress(val) {
      nBuryPoint('H5_DEBRIS_CENTER_CLICK_MAILADDRESS', {  // 点击去添加地址页面
        'source': this.from,
        'awardID': val.id,
        'activityId': this.activityId
      })
      const url = `${window.location.origin}/BKH5-debris_mail_address.html?activityId=${this.activityId}&id=${val.id}&activityRecordId=${val.activityRecordId}&from=${this.from}`
      routerToNative(url)
    },
    getSignUrl(index) {
      if (index * 1 > this.checkinInfo.checkinDays * 1) {
        return require(`@/assets/debris_center/sign/default_${index}.png`)
      } else {
        return require(`@/assets/debris_center/sign/active_${index}.png`)
      }
    },
    clickAward: throttle(function() { // 点击浮窗去抽奖
      const url = `${window.location.origin}/BKH5-debris_center_luck_draw.html?activityId=${this.activityId}&from=${this.from}`
      routerToNative(url)
      nBuryPoint('H5_DEBRIS_CENTER_CLICK_AWARD_MODAL')
    }, 30),
    goToActivityRule() {
      nBuryPoint('H5_DEBRIS_CENTER_CLICK_ACTIVITY_RULE')
      const url = `${window.location.origin}/BKH5-debris_center_rule.html?from=${this.from}&platform=${this.platform}&fragmentPrizeTwoEnable=${this.fragmentPrizeTwoEnable}`
      routerToNative(url)
    },
    openCalendarSignNotice: throttle(function() {
      bk.call('handleCalendarSignNotice', {}, (data) => {
        const { isSuccess } = JSON.parse(data)
        // 通知开启初始化
        if (isSuccess * 1 === 0) return
        this.isOpen = !this.isOpen
        if (this.isOpen) {
          nBuryPoint('H5_DEBRIS_CENTER_OPEN_CALENDAR_NOTICE', { // 点击开启日历提醒
            'source': this.from,
            'isOpen': 1,
            'activityId': this.activityId
          })
          toast({
            content: '签到提醒开启成功'
          })
        } else {
          nBuryPoint('H5_DEBRIS_CENTER_CLOSE_CALENDAR_NOTICE', {
            'source': this.from,
            'isOpen': 0,
            'activityId': this.activityId
          })
          toast({
            content: '签到提醒关闭成功'
          })
        }
      })
    }, 30),
    goAwardList() {
      if (!this.isAbled) return
      this.isAbled = !this.isAbled
      // 我的奖品点击更多
      nBuryPoint('H5_DEBRIS_CENTER_CLICK_AWARD_MORE', {
        'source': this.from,
        'activityId': this.activityId
      })
      const url = `${window.location.origin}/BKH5-debris_award_list.html?from=${this.from}&activityId=${this.activityId}`
      routerToNative(url)
    },
    goSignRecord() {
      if (!this.isAbled) return
      this.isAbled = !this.isAbled
      const url = `${window.location.origin}/BKH5-debris_center_sign_record.html?activityId=${this.activityId}&from=${this.from}`
      routerToNative(url)
    },
    goAwardCenter(val) { // 碎片中心奖励中心
      if (!this.isAbled || val !== '查看更多') return
      this.isAbled = !this.isAbled
      nBuryPoint('H5_DEBRIS_CENTER_CLICK_AWARD_CENTER', { // 点击查看更多去奖励中心
        'source': this.from,
        'activityId': this.activityId
      })
      const url = `${window.location.origin}/BKH5-debris_award_center.html?activityId=${this.activityId}&from=${this.from}`
      routerToNative(url)
    },
    browserBack: throttle(function() {
      bk.call('closePageNative')
    }, 30),
    goToRewardRecord() { // 中奖记录点击
      if (!this.isAbled) return
      this.isAbled = !this.isAbled
      nBuryPoint('H5_DEBRIS_CENTER_CLICK_AWARD_RECORD')
      const url = `${window.location.origin}/BKH5-debris_center_award_detail.html?activityId=${this.activityId}&from=${this.from}`
      routerToNative(url)
    },
    openTask: throttle(function(item) {
      nBuryPoint('H5_DEBRIS_CENTER_CLICK_STRAT_TASK', {
        'source': this.from,
        'activityId': this.activityId
      })
      if (item.isFinish * 1 === 0) {
        if (this.from !== 'tab') {
          this.browserBack()
        } else {
          bk.call('goReadBook', {}, () => {
            console.log('去阅读')
          })
        }
      }
    }, 30),
    addScrollHandler: throttle(function() { // 监听滚动
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop >= 60) {
        this.opacity = 1
        this.backgroundImage = `url(${require('../../assets/debris_center/fanhui@2x.png')})`
      } else if (scrollTop < 10) {
        this.opacity = '0.0' + scrollTop * 2
        this.backgroundImage = `url(${require('../../assets/debris_center/debris_back@2x.png')})`
      } else if (scrollTop > 10 && scrollTop < 60) {
        this.opacity = '0.' + scrollTop * 2
        this.backgroundImage = `url(${require('../../assets/debris_center/debris_back@2x.png')})`
      }
    }, 30),
  },
  mounted() {
    // 添加事件监听
    window.addEventListener('scroll', this.addScrollHandler)
    setTimeout(() => {
      this.platform = localStorage.getItem('platformId') || '6'
    }, 100)
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../styles/index.styl';
@import './debris.styl';
</style>
