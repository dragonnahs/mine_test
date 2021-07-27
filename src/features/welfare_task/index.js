import Vue from 'vue'
import App from './App'
import '@/common/index'
import Modal from '@/components/FinishModal/modal.js'
import Toast from '@/components/Toast/toast.js'

Vue.use(Toast)
Vue.use(Modal)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
})
