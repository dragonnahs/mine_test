import Vue from 'vue'
import App from './App'
import '@/common/index'
import 'babel-polyfill'
import Es6Promise from 'es6-promise'
import Toast from '@/components/Toast/toast.js'

Vue.use(Toast)
require('es6-promise').polyfill()
Es6Promise.polyfill()


/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
})
