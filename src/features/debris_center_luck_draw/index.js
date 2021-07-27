import Vue from 'vue'
import App from './App'
import '@/common/index'
import LuckDraw from 'vue-luck-draw'


Vue.use(LuckDraw)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
})
