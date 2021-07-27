import Vue from 'vue'
import App from './App'
import '@/common/index'
import Toast from '@/components/Toast/toast.js'

Vue.use(Toast)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
})
