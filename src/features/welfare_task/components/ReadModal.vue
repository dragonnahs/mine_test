<template lang="pug">
.read__modal
  .modal__content__adInfo
    span.modal__close(@click="closeModal()")
    .ad__content
      p.txt 您需要先领取30个资讯红包才能签到哦
      span.button(@click="goReadAd") 去看资讯
</template>
<script>
export default {
  data() {
    return {}
  },
  methods: {
    closeModal() {
      this.$emit('closeModal')
    },
    goReadAd() {
      this.$emit('goReadAd')
    }
  }
}
</script>
<style lang="stylus">
.read__modal {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgb(0, 0, 0);
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.modal__content__adInfo {
  width: 8.13rem;
  height: 6.77rem;
  background: url("../../../assets/welfare_task/bg.png") no-repeat center center;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}
.modal__content__adInfo img {
  width: 100%;
}
.modal__content__adInfo .modal__close {
  position: absolute;
  right: 0.53rem;
  top: 1.63rem;
  display: inline-block;
  width: 0.37rem;
  height: 0.37rem;
  background: url("../../../assets/welfare_task/guanbi-12@2x.png") no-repeat
    center center;
  background-size: 100% 100%;
}
.modal__content__adInfo .ad__content {
  position: absolute;
  top: 3.4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.modal__content__adInfo .txt {
  text-align: center;
  width: 5.23rem;
  font-size: 0.43rem;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 0.59rem;
}
.modal__content__adInfo .button {
  display: inline-block;
  text-align: center;
  border: none;
  width: 4.85rem;
  height: 1.04rem;
  margin-top: 0.53rem;
  background: linear-gradient(
    180deg,
    rgba(250, 217, 97, 1) 0%,
    rgba(247, 107, 28, 1) 100%
  );
  border-radius: 0.52rem;
  font-size: 0.4rem;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 600;
  color: rgba(255, 255, 255, 1);
  line-height: 1.04rem;
}
</style>