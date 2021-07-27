<template lang="pug">
  #app
    .app-content 我是测试页面
</template>

<script>

export default {
  name: 'app',
  components: {},
  data() {
    return {}
  },
  methods: {

  },
  created() {},
  mounted() {
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../styles/index.styl'

html, body
  width 100%
  height 100%
#app
  size(100%, 100%)
  background red
  .app-content
    font-size 44px
    color white
</style>
