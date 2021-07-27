<template>
  <div
    style="position: fixed;z-index: 500;width: 100%;height: 100%;top: 0;left: 0;"
    v-show="title.length > 0">
    <div class="finish_parent" >
      <p class="finish-title">{{title}}</p>
      <p class="finish-content">{{btntext}}</p>
      <img style="width: 3.57rem;margin: auto;" src="@/assets/welfare_task/getcoin.gif">
      <p class="finish-state">+{{coin}}金币</p>
    </div>
  </div>
</template>
<script>
let timeoutId = null
export default {
  data() {
    return {
      title: '',
      coin: 0,
      btntext: '任务完成',
    }
  },
  methods: {
    initialModal(time = 2500) {
      this.clearTimeoutHandler()
      this.setTimeoutHandler(time)
    },
    clear() {
      this.title = ''
      this.coin = 0
      this.clearTimeoutHandler()
    },
    clearTimeoutHandler() {
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
    },
    setTimeoutHandler(time) {
      timeoutId = setTimeout(this.clear, time)
    },
  }
}
</script>
<style lang="stylus">
.finish_parent {
    position: relative;
    padding: 0.3rem;
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 8px;
    margin: auto;
    width: 5.23rem;
    min-height: 5.87rem;
    top: 5.5rem;
    text-align: center;
}

.finish-title {
    font-size: 0.48rem;
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 0.67rem;
    margin: auto;
    text-align: center;
    margin-top: 0.2rem;
    font-weight: 400;
}

.finish-content {
    font-size: 0.4rem;
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    text-align: center;
    margin-top: 0.1em;
    font-weight: 400;
}

.finish-state {
    font-size: 0.59rem;
    font-family: PingFang-SC-Heavy;
    font-weight: 800;
    color: rgba(255, 194, 12, 1);
    text-align: center;
    margin-top: 0.2rem;
}
</style>