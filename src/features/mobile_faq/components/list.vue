<template lang="pug">
#mobile__faq
  h2.title(:class="title ? '' : 'hide' ") {{ title }}
  ul.list(:class="classStyle ? classStyle : ''")
    li.item(v-for="val in data" @click="clickQuestion(val)")
      | {{ val.question || val.title }}
      span.icon
</template>
<script>
export default {
  props: ['title', 'classStyle', 'data'],
  methods: {
    clickQuestion(val) {
      this.$emit('clickQuestion', val)
    }
  },
}
</script>
<style lang="stylus">
@import '../../../styles/index.styl';
.title
  background rgba(245,245,245,1)
  font-size 13px
  color #969A99
  font-weight bold
  line-height 18px
  padding 10px 20px
.hide
  display none
.list
  display flex
  flex-direction column
  padding 0 20px
  li.item
    font-size 15px
    color #333333
    line-height 21px
    padding 15px 0
    border-bottom 1px solid #E8EDED
    display flex
    align-items center
    justify-content space-between
    &:last-child
      border none
    span.icon
      color #cfcfcf
      float right
      display inlin-block
      size(8.18px, 13.18px)
      background url('../../../assets/mobileFaq/icon_go.png') no-repeat center center;
      background-size 100% 100%
</style>
