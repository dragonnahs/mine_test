<template lang="pug">
.day__task
  .day__task__title 待完成福利
  ul.task__list
    template(
      v-for="(item, key) in dayTaskLists"
    )
      li.task__item(
        :key="key"
        @click="openTask(item)"
        v-if="item.scheme !== 'breader://app/systemspeed'")
        span.task__item__title {{ item.name }}
        span.task__item__gold__common(
          :class="(item.isFinish === 1 && item.scheme !== 'breader://app/systemspeed') ? 'task__item__gold__finish' : 'task__item__gold' "
          )
          span.txt {{ item.isFinish === 1 ? (key === 0 ? '已完成' : item.scheme === 'breader://app/systemspeed' ? '立即清理' : '已领取') : `${item.rewardNum}金币` }}
      li.task__item.task__item__special(
        :key="key"
        ref='specialItem'
        @click="openTask(item)"
        v-else)
        span.task__item__title {{ item.name }}
        span.task__item__gold__special
          span.special__txt(v-if='item.isFinish !== 1') +{{ item.rewardNum }}

</template>
<script>
export default {
  props: ['dayTaskLists'],
  data() {
    return {}
  },
  methods: {
    openTask(item) {
      this.$emit('openTask', item)
    }
  },
  mounted() {}
}
</script>
<style lang="stylus">
@import '../../../styles/index.styl';
span
  margin 0
  padding 0
.day__task
  margin-top 30px
  padding 0 20px
  box-sizing border-box
  .day__task__title
    font-size 16px
    font-family PingFangSC-Medium, PingFang SC
    font-weight bold
    color #000000
    line-height 22px
    padding-bottom  15px
  ul.task__list
    li.task__item
      padding 0 16px
      margin-bottom 12px
      box-sizing border-box
      display flex
      justify-content space-between
      align-items center
      height 56px
      background #ffffff
      box-shadow 0px 0px 6px 0px rgba(223, 223, 223, 0.5)
      border-radius 10px
      font-size 14px
      &.task__item__special
        height 86px
        padding-right 30px
        .task__item__gold__special
          width 64px
          height 64px
          border-radius 50%
          background-image url('../../../assets/welfare_task/speed_icon.gif')
          background-size 100% 100%
          background-position center
          position relative
          .special__txt
            position absolute
            width 48px
            height 24px
            background-image url('../../../assets/welfare_task/special_item_txt_icon.png')
            background-size 100% 100%
            background-position center
            font-size 10px
            color #ffffff
            top 0
            left 60%
            box-sizing border-box
            padding-left 20px
            display flex
            align-items center

      span.task__item__title
        color #666666
        line-height 56px
        padding-top 2px
        box-sizing border-box
      span.task__item__gold__common
        size(87px 25px)
        border-radius 4px
        color #ffffff
        position relative
        padding-right 7px
        box-sizing border-box
        font-size initial
        &::after
          content ''
          absolute(right -8px top 3px)
          size(18px 18px)
        .txt
          font-size 14px
          line-height 25px
          width 100%
          // box-sizing border-box
          display inline-block
          text-align center
      span.task__item__gold
        background #FF5933
        &::after
          background url('../../../assets/welfare_task/task_default_icon.png') no-repeat center center
          background-size 100% 100%
      span.task__item__gold__finish
        background #999999
        opacity 0.4
        &::after
          background url('../../../assets/welfare_task/task_finish_icon.png') no-repeat center center
          background-size 100% 100%
</style>