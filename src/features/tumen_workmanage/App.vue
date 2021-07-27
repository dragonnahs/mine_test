<template lang="pug">
#appbox
 .listbox(v-if="!showNodata" ref='listWrap')
  .list_item(v-for="(item,index) in dataList" :key="index")
   img.leftImg.default_img(:src="item.coverUrl" @load='imgLoaded' @error="imgError($event)")
   .rightBox
    .titleTop {{item.opusName}}
    .statusBox(:class="[item.authStatus==1? 'success' : item.authStatus==0 ? 'wait':'faile']") {{item.authStatus==0 ? '待审核': item.authStatus==1?'已授权':'授权失败'}}
  .bottom_tip(v-show='isAllLoaded')
    | 已全部加载
 .nodata_box(v-else)
  .nocontent
   img.no_img(:src="require('../../assets/tu_starplan/no_data.png')")
   .tips_nodata 暂无授权作品,请返回上页,进行作品授权
</template>

<script>
import { opusList } from './request.js'
import { debounce } from '@/utils/utils.js'
export default {
  data() {
    return {
      dataList: [],
      page: 1,
      size: 10,
      isFinished: false,
      isAllLoaded: false
    }
  },
  computed: {
    showNodata() {
      return this.dataList.length===0
    }
  },
  methods: {
    imgError(event) {
      const img=event.srcElement
      img.src=require('../../assets/tu_starplan/error_img.png')
      img.onerror=null
    },
    imgLoaded(event) {
      console.log(event.target.complete)
      if (event.target.complete) {
        event.target.classList.remove('default_img')
      }
    },
    async opusList() {
      if (this.isFinished) {
        return
      }
      const { code, data } = await opusList(this.page)
      if (code == 100) {
        this.dataList = this.dataList.concat(data.list || [])
        this.isFinished = data.list ? data.list.length == 0 : true
        this.isAllLoaded = data.list && data.list.length === 0
        this.$nextTick(() => {
          this.page += 1
        })
      }
    },
    // 滚动
    addScrollHandler: debounce(function() { // 监听滚动
      const ele = this.$refs.listWrap
      // 获取距离顶部的距离
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      // 获取可视区的高度
      var windowHeight = document.body.clientHeight || document.documentElement.clientHeight
      // 获取滚动条的总高度
      var scrollHeight = ele.scrollHeight

      console.log(scrollTop, windowHeight, scrollHeight)
      if (scrollTop + windowHeight + 50 >= scrollHeight) {
        this.opusList()
      }
    }, 100),
  },
  mounted() {
    this.opusList()
    window.addEventListener('scroll', this.addScrollHandler)
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import './index.styl'
</style>
