<template lang="pug">
  header(
    ref='header'
    :style="{height}"
  )
    .header_space(
      :style="{opacity: opacity, ...headerSpaceStyle}"
      ref='headerSpace'
    )
    .header_nav(
      :style="{...headerNav}"
    )
      div.left
        <slot name='left'></slot>
      | {{title}}
      div.right
        <slot name='right'></slot>
</template>

<script>
import { throttle } from '@/utils/index'
export default {
  props: {
    headerSpaceStyle: {
      default() {
        return {
          height: '68px',
          backgroundColor: '#FECC9D'
        }
      }
    },
    headerNav: { // header_nav的相关参数
      default() {
        return {
          height: '48px',
          fontSize: '16px'
        }
      }
    },
    title: { // 页面title
      default: ''
    },
    height: { // header_space高度加缓冲高度
      default: '108px'
    }
  },
  data() {
    return {
      opacity: 0
    }
  },
  created() {
    window.addEventListener('scroll', this.addScrollHandler)
  },
  mounted() {
    // this.addScrollHandler()
  },
  methods: {
    addScrollHandler: throttle(function() { // 监听滚动
      if (this.$refs.header) {
        let scrollTop =
            document.documentElement.scrollTop || document.body.scrollTop
        let heightDiff = this.$refs.header.offsetHeight - this.$refs.headerSpace.offsetHeight
        this.opacity =  scrollTop * (1/heightDiff) > 1 ? 1 : scrollTop * (1/heightDiff)
      }
    }, 30),
  }
}
</script>

<style lang="stylus">
@import './index.styl'
</style>