<template lang="pug">
.reward__root
  ul.root__four(:style="stylejustify")
    li.adList__li(
      v-for="(item, key) in lists"
      @click="startTask(item)"
      ref="adList__li"
      :key="key")
      img.img(
        :src="item.icon || item.pic"
        :style="item.icon || item.pic ? '' : 'visibility: hidden'")
      p.title {{ item.name || item.title }}
      p.layer(v-if="item.maxLimit && item.maxLimit - item.finishTimes < 1")
        | 明日
        br
        | 开启
      p.nums(v-if="item.isMulti && item.maxLimit !== item.finishTimes") {{item.maxLimit - item.finishTimes}}
</template>
<script>
export default {
  props: ['adTaskLists'],
  data() {
    return {
      stylejustify: {
        justifyContent: 'space-around'
      },
      lists: []
    }
  },
  methods: {
    startTask(item) {
      this.$emit('startTask', item)
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.adTaskLists.length > 3) {
        this.lists = this.adTaskLists.slice(0, 8)
        this.stylejustify.justifyContent = 'flex-start'
      }
    })
  }
}
</script>
<style lang="stylus">
@import '../../../styles/index.styl';
.reward__root
  margin-top 30px
  padding 0 18px
  box-sizing border-box
  .root__four
    display flex
    flex-wrap wrap
    .adList__li
      width 25%
      min-height 79px
      text-align center
      margin 7.5px 0 0
      position relative
      img.img
        size(48px,48px)
        display inline-block
      .title
        font-size 12px
        color #666
      .layer
        absolute(top 0 left 50%)
        z-index 888
        font-size 12px
        size(48px, 48px)
        margin-left -24px
        background rgba(0, 0, 0, 0.5)
        color #ffffff
        padding-top 6px
        box-sizing border-box
        border-radius 24px
      .nums
        absolute(top 0 right 14px)
        size(16px, 16px)
        font-size 12px
        color #ffffff
        background #d72323
        border-radius 8px
        text-align center
        z-index 777
</style>