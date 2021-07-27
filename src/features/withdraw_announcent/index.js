import Vue from 'vue'
import App from './App'
import '@/common/index'
import 'babel-polyfill'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
})
