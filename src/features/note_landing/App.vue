<template lang="pug">
.message-landing(@click='jumpScheme')
  img(src='../../assets/note_landing/note_landing2.png')
</template>

<script>
import BROWSER from '@/utils/browser'
import { getQueryString } from '@/utils/url'
import { mBuryPoint } from '@/utils/buryPoint'
import { Base64 } from 'js-base64'
export default {
  data() {
    return {
      url: 'breader://www.bayread.com',
      bookUri: 'breader://www.bayread.com/bookview/bookread?bookId=<bookId>&source=msg&userPath=msg,deeplink&chapterNum=0'
    }
  },
  methods: {
    jumpScheme(target) {
      let bid = getQueryString('bid') || ''
      let apkPath = getQueryString('path')
      apkPath = Base64.decode(apkPath)
      if (target === 1) {
        mBuryPoint('8', {
          enterType: 1,
          bookId: bid,
          apkPath
        })
      } else {
        mBuryPoint('8', {
          clickAppDownload: 'clickAppDownload',
          bookId: bid,
          apkPath
        })
      }
      if (!BROWSER.isiOS) {
        this.bookUri = this.bookUri.replace('<bookId>', bid)
        setTimeout(() => {
          window.location = bid ? this.bookUri : this.url
          setTimeout(() => {
            mBuryPoint('8', {
              enterType: 2,
              bookId: bid,
              apkPath
            })
            window.location = apkPath || 'http://dl.ibreader.com/api/download/307'
          }, 2000)
        }, 200)
      }
    }
  },
  mounted() {
    this.jumpScheme(1)
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../styles/index.styl';
@import './index.styl'
</style>
