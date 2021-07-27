<template lang="pug">
#tuapp
  transition(name="fade" v-if="isshow")
    .tu__root
      header.tu__header
        img.avator(:src="avatarUrl")
        span.name {{ nickname }}
  main.tu__main
    swiper(ref="mySwiper" :options="swiperOptions")
      swiper-slide(v-for="item in imgs")
        img(:src="item")
      .swiper-button-prev(slot="button-prev")
      .swiper-button-next(slot="button-next")
  .tu__space
  transition(name="fade")
    .tu__footer(v-if="isshow")
      .tu__footer__content
        p.number_all
          span {{ currentIndex }}
          | /
          span.imgsnums {{ imgs && imgs.length || 0 }}
          | {{ title }}
        p.icon
          span(v-for="item in tags") {{'#'}}{{ item }}
      ul
        li(v-for="item in navdatas")
          img(:src="item.imgurl")
          p.desc {{ item.desc }}
  .Modal(v-show="isGuide" @click="ledModal()")
    .btn
      p Got it
</template>

<script>
import axios from 'axios'
import { getQueryString } from '@/utils/url'
import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
export default {
  data() {
    const _this = this
    return {
      swiperOptions: {
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          type: 'fraction'
        },
        loop: false,
        speed: 300,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        // autoplay: {
        //   delay: 3000,
        //   stopOnLastSlide: true,
        //   disableOnInteraction: false,
        // },
        on: {
          click() {
            const currentX = Number(this.touches.currentX).toFixed(1)
            const ClientWidth = document.body.clientWidth
            // console.log('==========', this, currentX, document.body.clientWidth, ClientWidth/2 - 100)
            if (this.isBeginning && currentX < (ClientWidth/2 - 100)) {
              _this.$showToast('This is the first illustration', '2000')
            }
            if (this.isEnd && currentX > (ClientWidth/2 + 100)) {
              _this.$showToast('This is the last illustration', '2000')
            }
            if (currentX > (ClientWidth/2 - 100) && currentX <  (ClientWidth/2 + 100)) {
              _this.isshow = !_this.isshow
            }
          },
          slideChangeTransitionEnd() {
            _this.currentIndex = this.realIndex * 1 + 1
          }
        }
      },
      navdatas: [
        {
          imgurl: require('@/assets/tu_show/dianzan-5@2x.png'),
          desc: '0'
        }, {
          imgurl: require('@/assets/tu_show/SBitmap@2x.png'),
          desc: '0'
        }, {
          imgurl: require('@/assets/tu_show/shoucang@2x.png'),
          desc: '0'
        }, {
          imgurl: require('@/assets/tu_show/sanjiao_right@2x.png'),
          desc: '下一组'
        }, {
          imgurl: require('@/assets/tu_show/Bitmap@2x.png'),
          desc: '弹幕'
        }
      ],
      isshow: true,
      currentIndex: 1,
      isGuide: true,
      imgs: [],
      nickname: null,
      avatarUrl: null,
      title: null,
      tags: [],
      uid: getQueryString('uid') || 41806892,
      pid: getQueryString('pid') || 84112407
    }
  },
  components: {
    Swiper,
    SwiperSlide
  },
  directives: {
    swiper: directive
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.$swiper
    }
  },
  methods: {
    clickDoc() {
      this.isshow = !this.isshow
    },
    ledModal() {
      this.isGuide = false
    },
  },
  created() {
    if (window.localStorage.getItem('isModalShow')) {
      this.isGuide = false
    } else {
      window.localStorage.setItem('isModalShow', false)
    }
  },
  mounted() {
    axios({
      method: 'POST',
      url: '/pixiv_tumeng/v1/works/preview',
      data: {
        uid: this.uid,
        pid: this.pid
      }
    }).then(res => {
      const { nickname, title, tags, avatarUrl, images, tumengStars, tumengComments, tumengLikes } = res.data.data
      this.imgs = images
      this.nickname = nickname
      this.title = title
      this.avatarUrl = avatarUrl
      this.tags = tags
      this.navdatas[0].desc = tumengStars
      this.navdatas[1].desc = tumengComments
      this.navdatas[2].desc = tumengLikes
    })
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import './index.styl'
</style>
