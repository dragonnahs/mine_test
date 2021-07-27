/**
 *
 * 封装全局的完成弹窗
 */

import finishmodal from './modal.vue'

export default {
  install(Vue) {
    let ModalConstructor = Vue.extend(finishmodal)
    let modalInstance
    const initialModal = () => {
      modalInstance = new ModalConstructor()
      let modalEl = modalInstance.$mount().$el
      document.body.appendChild(modalEl)
    }

    Vue.prototype.$finishModal = (title, coin, time) => {
      if (!modalInstance) initialModal()
      if (typeof title === 'string') {
        modalInstance.title = title
      }
      if (coin !== 0) {
        modalInstance.coin = coin
      }
      modalInstance.initialModal(time)
    }
    Vue.prototype.$clearModal = () => {
      modalInstance.clear()
    }
  }
}