<template lang="pug">
  #native-to-h5
    div.title.bold 设置了导航栏的内容,传入的参数是: <br/>
    div {{JSON.stringify(headerOptions)}}
    div.line
    div.close.bold(@click='handleClosePage') 关闭当前页面
    div.line
    div.go-back.bold(@click='handleGoBack') 返回按钮
    div {{JSON.stringify(goBackOptions)}}
    div.line
    div.toast.bold(@click='handleToast') 吐司提示
    div {{JSON.stringify(toastOptions)}}
    div.line
    div.share.bold(@click='handleShare(0)') 分享qq
    div.share.bold(@click='handleShare(1)') 分享微信
    div.share.bold(@click='handleShare(2)') 分享朋友圈
    div {{JSON.stringify(shareOptions)}}
    div.line
    div.skip(@click='skipUrl') 跳转到贴吧首页
    div.skip(@click='skipUrlOld') 原来的scheme跳转首页
</template>

<script>
import { setHeader,
  closeCurrentPage,
  goBack,
  toast,
  shareMenu,
  skipUrl
} from '@/utils/nativeToH5/index.js'
export default {
  data() {
    return {
      headerOptions: {
        title: '自定义标题',
        titleColor: '#EEEEEE',
        rightText: '发布',
        rightTextColor: '#FF5A00',
        bgColor: '#709EB2',
        iconType: 1,
        refreshIcon: 0,
        closeIcon: 0,
        callback: 'titleCallBack'
      },
      goBackOptions: {
        step: 1
      },
      toastOptions: {
        content: '测试吐司提示'
      },
      shareOptions: {
        platform: 1,
        title: '分享的标题',
        desc: '分享的描述',
        icon: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1590472859426&di=c3fdbc1a28fd8e8f5bc2b866a189b734&imgtype=0&src=http%3A%2F%2Fimg02.tooopen.com%2Fimages%2F20150410%2Ftooopen_sy_117771445821.jpg',
        url: 'http://www.baidu.com',
        type: 1
      }
    }
  },
  methods: {
    initPage() {
      setHeader(this.headerOptions)
    },
    handleClosePage() {
      closeCurrentPage()
    },
    handleGoBack() {
      goBack(this.goBackOptions)
    },
    handleToast() {
      toast(this.toastOptions)
    },
    handleShare(target) {
      this.shareOptions.platform = target
      shareMenu(this.shareOptions, function(isSuccess) {
        toast({ content: `分享后的回调: ${isSuccess}` })
      })
    },
    showPage() {
      console.log('showpage调用')
      toast({ content: 'callRouterReload：显示页面' })
    },
    titleCallBack() {
      console.log('titlecallback调用')
      toast({ content: 'titleCallBack：点击头部按钮' })
    },
    skipUrl() {
      skipUrl({ skipUrl: 'http://testincrease.ibreader.com/BKH5-post_bar.html' })
    },
    skipUrlOld() {
      window.location.href = `breader://common/browser?url=${encodeURIComponent('http://www.baidu.com')}`
    }
  },
  mounted() {
    this.initPage()
    window.showPageReload = this.showPage
    window.titleCallBack = this.titleCallBack
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../styles/index.styl';
@import './index.styl'
</style>
