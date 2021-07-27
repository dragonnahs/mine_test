<template lang="pug">
ul.ad__banner
  li.banner__item(
    v-for="(item, key) in adBannerLists.slice(0, 2)"
    @click="startTask(item)"
    :key="key"
    :style="{'width': adBannerLists.length < 2 ? '100%' : '48%'}")
    img.img(:src="item.img || item.pic")
</template>
<script>
export default {
  props: ['adBannerLists'],
  methods: {
    startTask(item) {
      this.$emit('startTask', item)
    }
  },
  mounted() {}
}
</script>
<style lang="stylus">
@import '../../../styles/index.styl';
ul.ad__banner
  margin-top 30px
  padding 0 18px
  box-sizing border-box
  display flex
  flex-direction row
  justify-content space-around
  li.banner__item
    height 86px
    border-radius 12px
    .img
      size(100%, 100%)
      border-radius 10px
</style>