import Vue from 'vue'
import App from './App'
import 'babel-polyfill'
import '@/common/index'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
})
