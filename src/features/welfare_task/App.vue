<template lang="pug">
.welfare__task
  .sign__model
    Sign(
      v-if="day"
      :userTaskRedPackageVOList="userTaskRedPackageVOList"
      :day="day"
      :compareVer="compareVer"
      :showRedPackageStyle="showRedPackageStyle"
      @gotoWithdraw="gotoWithdraw"
    )
  .readAdTask(v-if="showReadAd")
    p.read__desc 您本日还没有签到成功，马上去资讯平台领红包吧，满30个就可以签到哦～
    button.btn(@click="goReadAd('txt')") 去看资讯
  DayWelfare(
    v-if="excitationUserTaskVOList.length !== 0"
    :excitationUserTaskVOList="excitationUserTaskVOList"
    :receivedCoin="receivedCoin"
    :totalCoin="totalCoin"
    :readChapterCount="readChapterCount"
  )
  ExtraWelfare(
    v-if="singleBookLists.length !== 0"
    :singleBookLists="singleBookLists"
    :showReadPercent="showReadPercent"
    @routerToRead="routerToRead"
  )
  DayTask(
    v-if="dayTaskLists.length !== 0"
    :dayTaskLists="dayTaskLists"
    @openTask="openTask"
    ref='dayTask'
  )
  AdTask(
    v-if="adTaskLists.length > 0"
    :adTaskLists="adTaskLists"
    v-on:startTask="startTask"
  )
  AdBanner(
    v-if="adBannerLists.length > 0"
    :adBannerLists="adBannerLists"
    v-on:startTask="startTask"
  )
  .task_rule(v-show="showRule")
    p 温馨提示：
    p 1.完成任务后可在【我的】页面中进入【我的钱包】查看金币流水
    p 2.【我的钱包】中点击页面右上角【提现】按钮可进行提现。
  ReadModal(
    v-if="day && day.dialog"
    @goReadAd="goReadAd"
    @closeModal="closeModal"
  )
</template>

<script>
import { routerToNative, throttle, getCookie, compareVersion, nBuryPoint, getQueryString, nSensorPoint } from '@/utils/index'
import { setHeader } from '@/utils/nativeToH5/index'
import { getTaskLists, getFourAdLists, getAdBannerLists, getSingleBookList, getServiceAreaTaskList, getTaskFinish, getUserInfo } from './request.js'
import bk from 'bayread-bridge'
import { debounce } from '@/utils/utils.js'

let minFun
const isProd = process.env.VUE_APP_DEVELOP_ENV === 'false'
export default {
  name: 'welfareTask',
  components: {
    Sign: () => import('./components/Sign'),
    DayWelfare: () => import('./components/DayWelfare'),
    ExtraWelfare: () => import('./components/ExtraWelfare'),
    DayTask: () => import('./components/DayTask'),
    AdTask: () => import('./components/AdTask'),
    AdBanner: () => import('./components/AdBanner'),
    ReadModal: () => import('./components/ReadModal'),
  },
  data() {
    return {
      userTaskRedPackageVOList: [], // 新人签到
      showRedPackageStyle: 0, // 是否是新签到模式
      day: null,
      adTaskLists: [],  // 8个小icon广告列表
      adBannerLists: [],  // 双图的banner列表
      clickFlag: true,
      showReadAd: false,  // 是否显示看广告补签
      readChapterCount: 0,  // 阅读章数
      chapterCoinRate: 0, // 单章兑换金币汇率
      historyReadChapter: 0,  // 历史阅读章节数
      dayTaskLists: [], // 每日任务列表
      singleBookLists: [], // 单书激励任务列表
      excitationUserTaskVOList: [
        // {
        //   rewardNum: 0,
        //   isFinish: 1,
        //   totalReadChapter: 0
        // }, {
        //   rewardNum: 20,
        //   isFinish: 1,
        //   totalReadChapter: 10
        // }, {
        //   rewardNum: 30,
        //   isFinish: 1,
        //   totalReadChapter: 15
        // }, {
        //   rewardNum: 40,
        //   isFinish: 0,
        //   totalReadChapter: 20
        // }
      ],  // 当日连续阅读进度
      totalCoin: 0,
      receivedCoin: 0,
      showReadPercent: 0,
      showRule: false, // 展示温馨提示
      isOpen: 0,
      userInfoBO: {},
      userInfo: null,
      taskId: 1,
      from: getQueryString('from') || 'tab',
      compareVer: null,
      isInScreen: false, // 判断是否在屏幕中
    }
  },
  methods: {
    isLogin() { // 通过有无sessionId 判断这个用户有没有登录
      const sid = getCookie('sessionid') === null ? '' : getCookie('sessionid')
      if (sid === null || typeof sid === 'undefined' || sid === '') {
        return false
      } else {
        return true
      }
    },
    gotoWithdraw: throttle(function(status) { // 点击跳转提现
      if (!this.isLogin()) {  // 判断用户是否登录 isBindPhone - false 表示登录页面
        window.location = 'breader://common/login?isBindPhone=false'
        return
      }
      if ((this.userInfo && (this.userInfo.phoneNum === null || this.userInfo.phoneNum === ''))) {
        // 判断是否绑定手机号
        window.location = 'breader://common/login?isBindPhone=true'
        return
      }
      bk.call('buryingPoint', {
        eventName: 'H5_WELFARE_CLICK_READPACKAGE',
        map: {
          isProd,
          status
        }
      })
      if (Number(status) === 1 || Number(status) === 0) {
        let withdrawUrl =  `${window.location.origin}/#/withdraw`
        if (window.location.origin === 'http://testincrease.ibreader.com') {
          withdrawUrl = 'http://testtask.ibreader.com/#/withdraw'
        }
        routerToNative(withdrawUrl)
        return
      }
      if (Number(status) === 3) {
        this.$showToast('该红包已过期，第7天记得来哦！')
        return
      }
      if (Number(status) === 2) {
        this.$showToast('您已经领取过了哦！')
      }
    }, 30),
    openTask: throttle(function(item) { // 开启阅读任务ren
      if (item.scheme === 'breader://app/systemspeed') {
        bk.call('buryingPoint', {
          eventName: 'H5_WELFARE_CLICK_TASK_SYSTEMSPEED',
          map: {
            taskId: item.id,
            registerDay: this.userInfoBO && this.userInfoBO.registerDay,
            from: 'welfarePage',
            isFinish: item.isFinish,
            isProd
          }
        })
        bk.call('goSystemSpeed', {
          isFinish: item.isFinish,
          taskId: item.id,
          rewardNum: item.rewardNum
        }, () => {
          console.log('WIFI 功能跳转')
        })
        return
      }
      bk.call('buryingPoint', {
        eventName: 'H5_WELFARE_CLICK_TASK',
        map: {
          taskId: item.id,
          registerDay: this.userInfoBO && this.userInfoBO.registerDay,
          from: 'welfarePage',
          isProd
        }
      })
      nSensorPoint('welfare_item_click', {
        'sign_in_days': this.day && this.day.checkInDays,
        'button_name': '阅读激励金币'
      })
      if (item.isFinish * 1 === 0) {
        if (item.subType === 4) {
          bk.call('handleCalendarSignNotice', {
            registerDay: this.userInfoBO && this.userInfoBO.registerDay
          }, (data) => {
            const { isSuccess } = JSON.parse(data)
            // 通知开启初始化
            if (isSuccess * 1 === 0) return
            this.isOpen = 1
          })
          return
        }
        getTaskFinish(item.id, this.readChapterCount, this.historyReadChapter).then(res => {
          if (res * 1 === 100) {
            bk.call('calendarSignNoticeInit', {}, data => {
              const { isOpen  } = JSON.parse(data)
              // 通知开启初始化
              if (isOpen  * 1 === 0) {
                this.isOpen = 0
              } else {
                this.isOpen = 1
              }
            })
            getServiceAreaTaskList(this.readChapterCount, this.chapterCoinRate).then(res => {
              this.dayTaskLists = []
              this.dayTaskLists = res.taskVOS
              this.excitationUserTaskVOList = res.excitationUserTaskVOList.slice()
            })
          } else {
            bk.call('goReadBook', {}, () => {
              console.log('去阅读')
            })
          }
        })

      }
    }, 30),
    routerToRead(val, key) { // 点击单书阅读激励
      window.location.assign(`breader://www.bayread.com/bookview/bookread?bookId=${val.bookId}&source=welfareTask&chapterNum=0`)
      bk.call('buryingPoint', {
        eventName: 'H5_WELFARE_CLICK_SINGLE_TASK',
        map: {
          key,
          bookId: val.bookId,
          registerDay: this.userInfoBO && this.userInfoBO.registerDay,
          isProd
        }
      })
    },
    goReadAd(type = '') {  // 去看资讯完成补签
      bk.call('buryingPoint', {
        eventName: 'H5_WELFARE_CLICK_SIGN_AD',
        map: {
          isProd,
          type  //  txt 表示点击固定文案部分。''表示点击弹窗
        }
      })
      nSensorPoint('ElementClick', {
        'lw_element_name': 'sign_in_lucky_prize_enter',
        'lw_public_page_name': 'task_page'
      })
      window.location.href = 'breader://action/luckyPrize?new=1'
    },
    closeModal() {  // 关闭看资讯弹窗
      this.day.dialog = false
    },
    startTask(val) {  // 开始做广告任务
      if (val.maxLimit) {
        if (val.maxLimit - val.finishTimes < 1) {
          this.$showToast('今日次数已用完，明日再来～')
          return
        }
      }
      bk.call('buryingPoint', {
        eventName: 'H5_WELFARE_CLICK_AD',
        map: {
          isProd,
          scheme: val.scheme
        }
      })
      nSensorPoint('welfare_item_click', {
        'sign_in_days': this.day && this.day.checkInDays,
        'button_name': '8个icon'
      })
      window.location.assign(val.scheme)
      this.clickFlag = false
      setTimeout(() => {
        this.clickFlag = true
      }, 2000)
    },
    async InitData() {  // 初始化数据
      const { excitationUserTaskVOList, taskVOS, receivedCoin, totalCoin, userInfoBO } = await getServiceAreaTaskList(this.readChapterCount, this.chapterCoinRate)
      if (taskVOS.length !== 0 && taskVOS[0].subType === 4) {
        taskVOS[0].isFinish = this.isOpen
      }
      this.dayTaskLists = taskVOS
      this.excitationUserTaskVOList = excitationUserTaskVOList || []
      this.userInfoBO = userInfoBO
      this.receivedCoin = receivedCoin
      this.totalCoin = totalCoin

      const data = await getSingleBookList()
      try {
        this.singleBookLists = data && data.excitationSingleBookInfoVOList || []
        this.showReadPercent = data && data.showReadPercent || 0
      } catch (error) {
        console.error('error ---> ', error)
      }
      bk.call('buryingPoint', {
        eventName: 'H5_WELFARE_TASK_ENTER',
        map: {
          isProd,
          signleBook: this.singleBookLists.length !== 0 ? 1 : 0,  // 1 表示有单书激励
          readMotivation: this.dayTaskLists.length !== 0 ? 1 : 0  // 1 表示有阅读激励
        }
      })
      // 在进入页面时先调用一次判断元素是否在可是区域内
      this.$nextTick(() => {
        this.handleScroll()
      })
    },
    titleCallBack() { // 点击右上角签到记录页面
      bk.call('buryingPoint', {
        eventName: 'H5_WELFARE_CLICK_SIGN_RECORD',
        map: {
          isProd,
        }
      })
      nSensorPoint('welfare_item_click', {
        'button_name': '签到记录',
        'sign_in_days': this.day && this.day.checkInDays
      })
      const url = `${window.location.origin}/BKH5-sign_record.html?taskId=${this.taskId}`
      routerToNative(url)
    },
    async initTask() {
      let data = await getTaskLists()
      this.day = null
      setTimeout(() => {
        if (!data) return
        const signday = data.filter(item => item.type === 3) || [{}]
        const { extraData = null, showRedPackageStyle, userTaskRedPackageVOList = null, id = 1 } = signday[0]
        this.day = extraData
        this.taskId = id
        this.showRedPackageStyle = showRedPackageStyle
        this.userTaskRedPackageVOList = userTaskRedPackageVOList
        const {
          conditionStatus,
          alert,
          gold=null
        } = this.day || {}

        const version = localStorage.getItem('version')
        this.compareVer = compareVersion('1.54.2', version)
        if (this.compareVer >= 0 && gold && alert) {
          // 新增高于1.54.0版本走端上签到弹窗，将gold 传递给端上
          bk.call('taskCenterSignSuccess', { coin: gold })
        }
        if (conditionStatus * 1 === 2) {
          this.showReadAd = true
          nSensorPoint('ElementExposure', {
            'lw_element_name': 'sign_in_lucky_prize_enter',
            'lw_public_page_name': 'task_page'
          })
        } else {
          this.showReadAd = false
        }
      }, 0)
    },
    handleScroll() {
      // 滑动曝光
      if (!this.$refs.dayTask) {
        return
      }
      const ele = this.$refs.dayTask.$refs.specialItem && this.$refs.dayTask.$refs.specialItem[0]
      if (ele) {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        let offsetTop = ele.offsetTop
        let h = document.documentElement.clientHeight || document.body.clientHeight
        if (offsetTop > scrollTop && offsetTop - scrollTop < h && !this.isInScreen) {
          bk.call('buryingPoint', {
            eventName: 'H5_WELFARE_WIFI_SPEED_EXPOSURE',
            map: {
              isProd,
            }
          })
          this.isInScreen = true
        }
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', minFun)
  },
  mounted() {
    minFun = debounce(() => {
      this.handleScroll()
    }, 100)
    // getUserInfo()
    window.addEventListener('scroll', minFun)
  },
  async created() {
    nBuryPoint('H5_WELFARE_TASK', { // 新福利页面曝光
      'source': this.from
    })
    window.titleCallBack = this.titleCallBack
    bk.call('getTodayReadMotivationChapterNum  ', {}, data => { // 初始化碎片信息
      const { readChapterCount, chapterCoinRate, historyReadChapter } = JSON.parse(data)
      this.readChapterCount = readChapterCount
      this.chapterCoinRate = chapterCoinRate
      this.historyReadChapter = historyReadChapter
    })
    bk.register('browserPageResume', () => {
      const version = localStorage.getItem('version')
      if (compareVersion('1.53.2', version) >= 0) {
        this.initTask()
      }
      this.InitData()
    })
    bk.call('calendarSignNoticeInit', {}, data => {
      const { isOpen  } = JSON.parse(data)
      // 通知开启初始化
      if (isOpen  * 1 === 0) {
        this.isOpen = 0
      } else {
        this.isOpen = 1
      }
    })
    bk.register('calendarSignNoticeResume', () => {
      this.isOpen = 1
    })
    await this.initTask()
    if (this.showRedPackageStyle * 1 === 0) {
      setHeader({
        title: '福利中心',
        rightText: '签到记录',
        rightTextColor: '#999999',
        titleColor: '#444444',
        bgColor: '#ffffff',
        callback: 'titleCallBack'
      }, () => {})
    }
    this.InitData()
    this.adTaskLists = await getFourAdLists()
    this.adBannerLists = await getAdBannerLists()
    this.userInfo = await getUserInfo()
    this.showRule = true
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../styles/index.styl';
@import './index.styl';
</style>
