<template lang="pug">
#app_oppp
  img(src="@/assets/oppo_activity_rebate/oppo.png")
  button.btn(@click="routeToRecharge")
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    routeToRecharge() {
      window.location.href = 'breader://common/recharge'
    }
  },
  mounted() {},
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../styles/index.styl';
body,html
  size(100%, 100%)
#app_oppp
  width 100%
  position relative
  img
    width 100%
  .btn
    absolute(left 0 bottom 50px)
    size(100%, 48px)
</style>
