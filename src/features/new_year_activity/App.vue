<template lang="pug">
.new_year_activity
  img.bg(src='../../assets/new_year_activity/new_year_bg.png')
  .rule_btn(
    @click='toggleRulePop'
  ) 活动规则
  img.new_year_award_bg(
    src='../../assets/new_year_activity/new_year_award_btn.png'
    @click='goLuckDraw'
  )
  .new_year_book
    .new_year_book_toggle
      .new_year_book_toggle_item(
        :class="{'male_item_active': isMale}"
        @click='toggleSex(true)'
      )
        img(
          src='../../assets/new_year_activity/male_btn.png'
          v-if='!isMale'
        )
      .new_year_book_toggle_item(
        :class="{'female_item_active': !isMale}"
         @click='toggleSex(false)'
      )
        img(
          v-if='isMale'
          src='../../assets/new_year_activity/female_btn.png'
        )
    .new_year_book_box
      Swiper(
        :options='swiperOptions'
        ref="mySwiper"
      )
        SwiperSlide(
          v-for='item in bookList'
          :key='item.bookId'
        )
          .book_info(
            @click='goBookDetail(item)'
          )
            img.book_cover(
              :src='item.bookCover'
            )
            .book_info_right
              .book_name {{item.bookName}}
              .book_intro {{item.introduction}}
              .book_tags
                .book_tag_item(
                  v-for='innerItem in item.tagList'
                  :key='innerItem'
                ) {{innerItem}}


  .new_year_rule_pop(v-show='isShowRule' ref='pop')
    .new_year_rule_bg
      .new_year_rule_close(
        @click.stop='toggleRulePop'
      )
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import { maleBookList, femaleBookList } from './data'
import { jumpBookDetail, skipUrl } from '@/utils'
import { buryingPoint } from '@/utils/nativeToH5'
const isProd = process.env.VUE_APP_DEVELOP_ENV === 'false'
export default {
  components: {
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      isShowRule: false,
      isMale: true, // 是不是男性
      swiperOptions: {
        loop: true,
        speed: 300,
        autoplay: true,
        slidesPerView: 1.2
      },
      bookList: maleBookList
    }
  },
  methods: {
    // 打开关闭规则
    toggleRulePop() {
      this.isShowRule = !this.isShowRule
    },
    // 切换性别
    toggleSex(flag) {
      if (this.isMale !== flag) {
        this.isMale = flag
        this.bookList = flag ? maleBookList : femaleBookList
        buryingPoint({
          eventName: 'H5_NEW_YEAR_ACTIVITY_TOGGLE_SEX',
          map: {
            isProd,
            isMale: flag
          }
        })
      }
    },
    // 跳转书籍详情
    goBookDetail(target) {
      buryingPoint({
        eventName: 'H5_NEW_YEAR_ACTIVITY_CLICK_BOOK',
        map: {
          isProd,
          bookId: target.bookId
        }
      })
      jumpBookDetail({
        bookId: target.bookId,
        source: 'new_year_activity/new_year_activity',
        userPath: 'new_year_activity,new_year_activity'
      })
    },
    // 跳转新运大转盘
    goLuckDraw() {
      buryingPoint({
        eventName: 'H5_NEW_YEAR_ACTIVITY_CLICK_LUCK_DRAW',
        map: {
          isProd
        }
      })
      let url = 'http://activities.ibreader.com/#/luck?activityId=122&source=new_year_activity'
      if (window.location.hostname !== 'increase.ibreader.com') {
        url = 'http://test.activities.ibreader.com/#/luck?activityId=122&source=new_year_activity'
      }
      skipUrl({
        skipUrl: url
      })
    }
  },
  mounted() {
    buryingPoint({
      eventName: 'H5_NEW_YEAR_ACTIVITY_LOAD',
      map: {
        isProd
      }
    })
  },
  watch: {
    isShowRule() {
      let func = function(e) {
        e.stopPropagation()
        e.preventDefault()
      }
      if (this.isShowRule) {
        document.body.style.overflow = 'hidden'
        this.$refs.pop.addEventListener('touchmove', func, false)
      } else {
        document.body.style.overflow = ''
        this.$refs.pop.removeEventListener('touchmove', func, false)
      }
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.$swiper
    }
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../styles/index.styl';
@import './index.styl'
</style>
