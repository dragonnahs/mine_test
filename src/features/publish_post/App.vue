<template lang="pug">
#publish
  div.score-box
    div.score-tip 为本书评个分:
    div.score-five
      div.score-item(v-for='item in 5'
      :key='item'
      :class='{"active": item <= score, "is-half-star": isHalfStar && item === Math.ceil(score)}'
      @click='handleScore(item)')
  div.title
    input(placeholder='好的标题会更有吸引力哟' v-model='title')
  div.box(:class='{"active": false}')
    div.publish-textarea-box
      div.publish-textarea(contenteditable="true"
      ref='textarea'
      @keyup='handleInput')
      div.publis-textarea-input {{comment.length}}/120字
    //- div.upload(@click='handleUpload' v-show='false')
    //-   div.input
    //-     input(type='file' ref='upload' accept='image/*' @change='handleSelectImg')
    //- div.upload-img(@click='handleUpload')
    //- div(@click='handlePublish') fabu
</template>

<script>
import { publishPost } from './request'
import { initOss, getOneUploadedUrl } from '@/utils/upload'
import { closeCurrentPage, setHeader, toast } from '@/utils/nativeToH5/index'

import { getQueryString } from '@/utils/url'
import { mBuryPoint } from '@/utils/buryPoint'
import { nSensorPoint } from '@/utils/index'
export default {
  data() {
    return {
      score: 5,
      content: '',
      uploadFile: '',
      title: '',
      comment: '',
      imgUrl: ''
    }
  },
  methods: {
    handleScore(target) {
      if (this.score - target <= 0 && this.score - target > -1) {
        this.score -= 0.5
      } else {
        this.score = target
      }
      console.log(this.score * 2, 2222)
    },
    handleInput(e) {
      if (e.target.innerText.length > 120) {
        let tempInnerText = e.target.innerText.substring(0, 120)
        if (this.isHasImg()) {
          e.target.innerText = tempInnerText
          document.execCommand('insertHTML', false, `<img src='${this.imgUrl}' width=80 />`)
        } else {
          e.target.innerText = tempInnerText
        }
        this.$refs.textarea.blur()
      }
      this.comment = e.target.innerText
      if (!this.isHasImg()) {
        this.$refs.upload.value = null
      }
    },
    handleUpload() {
      if (this.isHasImg()) {
        toast({
          content: '无法上传，已存在图片'
        })
        return
      }
      this.$refs.upload.click()
    },
    async handleSelectImg(e) {
      console.log(e, 33)
      let client = await initOss(1)
      const file = e.target.files[0]
      if (!file) {
        return
      }
      let src
      src = URL.createObjectURL(file)
      this.uploadFile = file
      this.deleteImgEle()
      this.$refs.textarea.focus()
      this.keepLastIndex(this.$refs.textarea)
      // document.execCommand('InsertImage', false, src)
      document.execCommand('insertHTML', false, `<img src='${src}' style="width: 100%" />`)
      getOneUploadedUrl(client, '/bkh5_community/' + file.name, file, (url) => {
        this.imgUrl = url
      })
    },
    deleteImgEle() {
      let childs = this.$refs.textarea.childNodes
      let result = Array.from(childs).filter(ele => {
        return ele.nodeName === 'IMG'
      })
      if (result.length > 0) {
        this.$refs.textarea.removeChild(result[0])
      }
    },
    isHasImg() {
      let childs = this.$refs.textarea.childNodes
      let result = Array.from(childs).filter(ele => {
        return ele.nodeName === 'IMG'
      })
      return result.length !== 0
    },
    async handlePublish() {
      let bookId = getQueryString('bookId')
      if (!this.isHasImg()) {
        this.imgUrl = ''
      }
      console.log(this.imgUrl, bookId, 22222)
      let res = await publishPost({ bookId, comment: this.comment, score: this.score * 2, title: this.title, image: this.imgUrl })
      // window.location.href = window.location.origin + '/BKH5-post_bar.html' + window.location.search
      if (res.code === 100) {
        toast({
          content: '发布成功'
        })
        closeCurrentPage()
      } else {
        toast({
          content: res.msg
        })
      }
    },
    keepLastIndex(obj) {
      var range
      if (window.getSelection) {
        obj.focus()
        range = window.getSelection()
        range.selectAllChildren(obj)
        range.collapseToEnd()
      } else if (document.selection) {
        range = document.selection.createRange()
        range.moveToElementText(obj)
        range.collapse(false)
        range.select()
      }
    }
  },
  computed: {
    isHalfStar() {
      return this.score.toString().indexOf('.') > -1
    }
  },
  mounted() {
    let bookId = getQueryString('bookId')
    mBuryPoint('6', {
      enterBookCommentEdit: 'enterBookCommentEdit',
      bookId
    })
    nSensorPoint('Comment_Page_View', {
      lw_book_id: bookId,
    })
    setHeader({
      title: '编辑帖子',
      titleColor: '#333333',
      rightText: '发布',
      rightTextColor: '#FF6C00',
      refreshIcon: 0,
      closeIcon: 0,
      callback: 'titleCallBack'
    })
    this.$refs.textarea.onpaste = (event) => {
      var e = event || window.event
      e.preventDefault()
      var text = (e.originalEvent || e).clipboardData.getData('text/plain')
      document.execCommand('insertHTML', false, text)
      this.comment = this.$refs.textarea.innerText
      console.log(this.comment)
    }
    window.ibreader.prohibitPull()
    window.titleCallBack = this.handlePublish
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../styles/index.styl';
@import './index.styl'
</style>
