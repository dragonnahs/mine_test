<template lang="pug">
  div.video-item
    div.video-item-player
      video-player(:playerOptions='playerOptions'
      :rankInfo='rankInfo'
      :playerList='playerList'
      v-if='playerOptions.poster'
      ref='videoItemPlayer')
    div.video-item-tip
      div.video-item-left
        | {{rankInfo.name}}:&nbsp;
        span {{rankInfo.votes}}获票
      div.video-item-vote(@click='handleToggleShowVote') 投票
</template>
<script>
import VideoPlayer from './videoPlayer'
import { mBuryPoint } from '@/utils/buryPoint'
export default {
  components: {
    VideoPlayer
  },
  props: ['playerList', 'rankInfo'],
  data() {
    return {
      playerOptions: {}
    }
  },
  mounted() {
    this.playerOptions = {
      height: 183,
      width: 325,
      muted: false,
      language: 'zh-CN',
      // playbackRates: [1.0],
      notSupportedMessage: '此视频暂无法播放，请稍后再试',
      aspectRatio: '325:183',
      sources: [{
        type: 'video/mp4',
        src: this.rankInfo.video
      }],
      preload: 'none',
      poster: this.rankInfo.image,
      controlBar: {
        fullscreenToggle: false  // 全屏按钮
      }
    }
  },
  methods: {
    handleToggleShowVote() {
      mBuryPoint('7', {
        clickType: 4
      })
      this.$emit('handleToggleShowVote', this.rankInfo)
    },
    pauseChildVideo(target) {
      this.$refs.videoItemPlayer.pauseChildVideo(target)
    }
  }
}
</script>
<style lang="stylus">
.video-item
  width 345px
  height 235px
  box-sizing border-box
  background #ffffff
  border-radius 6px
  padding 6px 10px
  margin 0 auto 20px
  .video-item-player
    width 100%
    height 183px
    border-radius 3px
    overflow hidden
  .video-item-tip
    display flex
    justify-content space-between
    margin-top 10px
    position relative
    .video-item-left
      font-size 15px
      color #333333
      span
        font-size 12px
        color #8174FB
    .video-item-vote
      width 144px
      height 52px
      line-height 52px
      border-radius 52px
      font-size 28px
      color #ffffff
      background #8174FB
      transform scale(0.5)
      transform-origin right top
      position absolute
      right 0
</style>
