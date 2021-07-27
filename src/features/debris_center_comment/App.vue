<template lang="pug">
  .debris_comment
    HeaderNav(
      title='发表评价'
      :headerSpaceStyle="{height: '68px', background: 'linear-gradient(to right, #F43A3A 10%, #FFC87A)', opacity: 1}"
      :headerNav="{height: '48px', fontSize: '16px', color: '#ffffff'}"
      height='68px'
    )
      img.left_img(
        slot='left'
        src='../../assets/debris_comment/nav_back.png'
        @click='nvaBack'
      )
    .debris_comment_info
      img(:src='info.fragmentPrizeBigImgUrl')
      .debris_comment_info_text {{info.fragmentPrizeTitle}}
    .debris_comment_content
      div.debris_comment_textarea_box
        textarea.debris_comment_textarea(contenteditable="true"
        v-model='comment'
        placeholder='请输入评论内容'
        maxlength='100')
        div.debris_comment_textarea_count {{comment.length}}/100字
    .debris_img_box
      .debris_img_item(
        v-for='(item, index) in imgList'
        :key='item + index'
        v-if='index < 3'
      )
        img(
          :src='item'
        )
        .debris_img_delete(
          @click='deleteImg(index)'
        )
      .debris_img_item.debris_img_upload(v-if='imgList.length < 3')
        img(src='../../assets/debris_comment/debris_comment_photo.png')
        input(
          type='file'
          accept='image/*'
          @change='handleSelectImg'
          ref='uploadImgInput'
        )
    .debris_comment_btn.active(
      v-if='imgList.length > 0 && comment.length > 0'
      @click='submitComment'
    ) 提交
    .debris_comment_btn(
      v-else
    ) 提交


</template>

<script>
import bk from 'bayread-bridge'
import HeaderNav from '@/components/HeaderNav'
import { initOss, getOneUploadedUrl } from '@/utils/upload'
import { getQueryString, throttle, nBuryPoint } from '@/utils'
import { submitComment } from './request'
import { toast } from '@/utils/nativeToH5'
import Exif from 'exif-js'
export default {
  components: {
    HeaderNav
  },
  data() {
    return {
      comment: '',
      imgList: [
      ],
      info: {},
      headerImage: '',
    }
  },
  methods: {
    // 选择图片
    handleSelectImg(e) {
      let files = e.target.files || e.dataTransfer.files
      if (!files.length) return
      this.imgPreview(files[0])
    },
    // 图片上传函数
    async dealUploadImg(file) {
      let client = await initOss(1)
      if (!file) {
        return
      }
      getOneUploadedUrl(client, '/bkh5_debris/' + file.name, file, (url) => {
        if (this.imgList.length < 3) {
          this.imgList.push(url)
        }
        this.$refs.uploadImgInput.value = ''
      })
    },
    // 删除图片
    deleteImg(index) {
      this.imgList.splice(index, 1)
    },
    // 发表评论
    submitComment: throttle(async function() {
      nBuryPoint('H5_DEBRIS_COMMENT_CLICK_POST', {
        activityId: getQueryString('activityId'),
        id: this.info.id
      })
      try {
        let res = await submitComment(this.comment, this.imgList.join(), this.info.id)
        console.log(res, 111)
        if (res.code === 100) {
          toast({
            content: '发布成功'
          })
          bk.call('closePageNative')
        } else {
          this.$showToast(res.msg)
        }
      } catch (error) {
        this.$showToast('网络错误请稍后重试')
      }
    }, 50),
    // 返回上一页面
    nvaBack() {
      bk.call('closePageNative')
    },
    // 将处理过的base64图片转为file
    dataURLtoFile(dataurl, filename) {
	    var arr = dataurl.split(','),
	        mime = arr[0].match(/:(.*?);/)[1],
	        bstr = atob(arr[1]),
	        n = bstr.length,
	        u8arr = new Uint8Array(n)
	    while (n--) {
	        u8arr[n] = bstr.charCodeAt(n)
	    }
	    return new File([u8arr], filename, { type: mime })
    },
    // 处理后的图片上传服务器
    postImg(data, filename) {
      var file = this.dataURLtoFile(data, filename)
      this.dealUploadImg(file)
    },
    // 获取图片信息
    imgPreview(file) {
      let self = this
      let Orientation
      // 去获取拍照时的信息，解决拍出来的照片旋转问题
      Exif.getData(file, function() {
        Orientation = Exif.getTag(this, 'Orientation')
      })
      // 看支持不支持FileReader
      if (!file || !window.FileReader) return

      if (/^image/.test(file.type)) {
        // 创建一个reader
        let reader = new FileReader()
        // 将图片2将转成 base64 格式
        reader.readAsDataURL(file)
        // 读取成功后的回调
        reader.onloadend = function() {
          let result = this.result
          let img = new Image()
          img.src = result
          // 判断图片是否大于100K,是就直接上传，反之压缩图片
          if (this.result.length <= (100 * 1024)) {
            self.headerImage = this.result
            self.postImg(this.result, file.name)
          } else {
            img.onload = function() {
              let data = self.compress(img, Orientation)
              self.headerImage = data
              self.postImg(data, file.name)
            }
          }
        }
      }
    },
    // 处理旋转的图片
    rotateImg(img, direction, canvas) {
      // 最小与最大旋转方向，图片旋转4次后回到原方向
      const min_step = 0
      const max_step = 3
      if (img == null) return
      // img的高度和宽度不能在img元素隐藏后获取，否则会出错
      let height = img.height
      let width = img.width
      let step = 2
      if (step == null) {
        step = min_step
      }
      if (direction == 'right') {
        step++
        // 旋转到原位置，即超过最大值
        step > max_step && (step = min_step)
      } else {
        step--
        step < min_step && (step = max_step)
      }
      // 旋转角度以弧度值为参数
      let degree = step * 90 * Math.PI / 180
      let ctx = canvas.getContext('2d')
      switch (step) {
      case 0:
        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0)
        break
      case 1:
        canvas.width = height
        canvas.height = width
        ctx.rotate(degree)
        ctx.drawImage(img, 0, -height)
        break
      case 2:
        canvas.width = width
        canvas.height = height
        ctx.rotate(degree)
        ctx.drawImage(img, -width, -height)
        break
      case 3:
        canvas.width = height
        canvas.height = width
        ctx.rotate(degree)
        ctx.drawImage(img, -width, 0)
        break
      }
    },
    // 将旋转的图片回复正常，并返回图片
    compress(img, Orientation) {
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext('2d')
      // 瓦片canvas
      let tCanvas = document.createElement('canvas')
      let tctx = tCanvas.getContext('2d')
      let initSize = img.src.length
      let width = img.width
      let height = img.height
      // 如果图片大于四百万像素，计算压缩比并将大小压至400万以下
      let ratio
      if ((ratio = width * height / 4000000) > 1) {
        console.log('大于400万像素')
        ratio = Math.sqrt(ratio)
        width /= ratio
        height /= ratio
      } else {
        ratio = 1
      }
      canvas.width = width
      canvas.height = height
      //        铺底色
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      // 如果图片像素大于100万则使用瓦片绘制
      let count
      if ((count = width * height / 1000000) > 1) {
        console.log('超过100W像素')
        count = ~~(Math.sqrt(count) + 1) // 计算要分成多少块瓦片
        // 计算每块瓦片的宽和高
        let nw = ~~(width / count)
        let nh = ~~(height / count)
        tCanvas.width = nw
        tCanvas.height = nh
        for (let i = 0; i < count; i++) {
          for (let j = 0; j < count; j++) {
            tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh)
            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh)
          }
        }
      } else {
        ctx.drawImage(img, 0, 0, width, height)
      }
      // 修复ios上传图片的时候 被旋转的问题
      if (Orientation != '' && Orientation != 1) {
        switch (Orientation) {
        case 6:// 需要顺时针（向左）90度旋转
          this.rotateImg(img, 'left', canvas)
          break
        case 8:// 需要逆时针（向右）90度旋转
          this.rotateImg(img, 'right', canvas)
          break
        case 3:// 需要180度旋转
          this.rotateImg(img, 'right', canvas)// 转两次
          this.rotateImg(img, 'right', canvas)
          break
        }
      }
      // 进行最小压缩
      let ndata = canvas.toDataURL('image/jpeg', 0.1)
      console.log('压缩前：' + initSize)
      console.log('压缩后：' + ndata.length)
      console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + '%')
      tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0
      return ndata
    },
  },
  mounted() {
    this.info = getQueryString('info') ? JSON.parse(getQueryString('info')) : {}
    this.$nextTick(() => {
      nBuryPoint('H5_DEBRIS_COMMENT', {
        activityId: getQueryString('activityId'),
        id: this.info.id
      })
    })
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../styles/index.styl';
@import './index.styl'
</style>
