<template lang="pug">
  .content
    button(
      @click='handleNative'
      :style='{ background: color1 }'
    ) 点击调用native方法
    div demo按钮解释： (客户端需要定一个名为‘handleDemoName’方法供前端调用，第二个为参数为传递的参数： {id: 1}, 第三个参数为回调：callback)回调成功的话会改变按钮颜色
    div web调用native端方法说明： {{str1}}

    div(
      :style='{ background: color2 }'
    ) 原始颜色为黄色，如果native调用成功的话，会改变当前元素颜色为红色
    div 解释： (前端注册了一个名为‘changeColor’的方法，第二个参数是回调函数)
    div native调用web函数说明：{{str2}}
    div 我们这边参考的是： https://github.com/lzyzsd/JsBridge
</template>

<script>
import bk from 'bayread-bridge'
export default {
  data() {
    return {
      str1: 'bk.call(\'调用app内的函数名\', 参数, 回调函数)',
      color1: 'yellow',
      color2: 'yellow',
      str2: 'bk.register(\'native要调用函数名\', 回调函数)'
    }
  },
  created() {
    this.init()
    window.addEventListener('message', function() {
      bk.call('shareGame')
    })
  },
  methods: {
    handleNative() {
      bk.call('handleDemoName', {
        id: '1'
      }, () => {
        console.log('回调函数')
        this.color1 = 'red'
      })
    },
    init() {
      bk.register('changeColor', () => {
        this.color2 = red
      })
    }
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../styles/index.styl';
.content
  font-size 0.5rem
  div
    margin-top 10px
</style>
