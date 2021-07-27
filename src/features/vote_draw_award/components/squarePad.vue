<template>
  <div class="home">
    <div class="draw">
      <template v-for="(item,index) in awardList">
        <div class="draw-item"
        :class="{'selected-draw-item': selectList[activeIndex]==index}"
        :key="index">
          <img :src="item.imgUrl" alt="">
          <div class="draw-item-text">{{item.title}}</div>
        </div>
        <div
        class="draw-btn"
        @click="handleClickDraw"
        :key="index+20"
        v-if="index === 3"></div>
      </template>
    </div>
  </div>
</template>
<script>
import { drawAward } from '../request'
import { getQueryString } from '@/utils/url'
import { toast } from '@/utils/nativeToH5/index'
import { mBuryPoint } from '@/utils/buryPoint'
export default {
  props: ['drawCount', 'awardList', 'buttonId'],
  data() {
    return {
      activeIndex: 0,
      selectList: [0, 1, 2, 4, 7, 6, 5, 3],
      clickFlag: true,
      selectedIndex: 0
    }
  },
  mounted() {},
  methods: {
    async handleClickDraw() {
      if (this.drawCount <= 0) {
        this.$emit('toggleShowFailPop')
        return
      }
      if (!this.clickFlag) {
        return
      }
      mBuryPoint('7', {
        clickType: 2
      })
      this.clickFlag = false
      await this.getSelectIndex()
      if (this.selectedIndex < 0) {
        return
      }
      this.dealPos()
    },
    dealPos() {
      let timer
      let endNum = 8*3 + this.selectedIndex - this.activeIndex
      timer = setInterval(() => {
        this.activeIndex += 1
        if (this.activeIndex > 7) {
          this.activeIndex = 0
        }
        endNum--
        if (endNum <= 0) {
          this.clickFlag = true
          clearInterval(timer)
          this.$emit('handleDrawAward')
          this.$emit('dealDrawCount', this.drawCount - 1)
        }
      }, 50)
    },
    async getSelectIndex() {
      let res = await drawAward(getQueryString('activityId'), this.buttonId)
      if (res.code !== 100) {
        this.selectedIndex = -1
        toast({
          content: res.msg || '网络不给力，请重试!'
        })
        return
      }
      let awardArr = res.data.drawLotteryList || []
      this.$parent.awardInfo = awardArr[0]
      let index = this.awardList.findIndex(item => {
        return item.id === awardArr[0].id
      })
      this.selectedIndex = this.selectList.findIndex(item => item === index)
    }
  }
}
</script>
<style lang='stylus'>
@import './squarePad.styl'
</style>