<template lang="pug">
#appbox
 .main_content
  .inputbox
   .lablebox 作品名称
   input.comminput(type="text" v-model="projectName" placeholder="单行输入")
  .inputbox
   .lablebox 预期收益
   input.comminput(type="number" v-model="income" placeholder="单行输入")
   .unitTip 元/张
  .inputbox
   .lablebox 售卖版数
   input.comminput(type="number" v-model="saleCount" placeholder="单行输入")
  .uploadTip
   div 作品上传 {{getCount}}/9
   .imgLimit jpg或png格式,最多上传9张作品,单张不超过5M
  .uploadcontent
   .uploadfile(v-for="(item) in imgList" :key="item.id")
    img.bgup(:src="item.imgurl")
    img.deleteImg(:src="require('../../assets/tu_starplan/mw_delete.png')" @click.stop="deleteImg(item)")
   .uploadfile(v-show="showUpload")
    img.bgup(:src="require('../../assets/tu_starplan/mw_upload.png')")
    input.filebox(type="file" :multiple="true" @change="uploadFile($event)" accept="image/jpeg,image/jpg,image/png,image/svg")
 .authbtn
  img.authok_btn(:src="require('../../assets/tu_starplan/mw_authbtn.png')" v-show="btnStatus" @click='eSign')
  img.authok_btn(:src="require('../../assets/tu_starplan/mw_authbtndisabled.png')" v-show="!btnStatus")
 .uploadprogress_modal(v-show="showProgress")
   span 正在努力上传中...
 .uploadprogress_modal(v-show="isESign")
   span 页面跳转中...
</template>

<script>
import WorksServerApi from '../tumen_starproject/apiconfig'
import { getOssClinet, initSettingSubmit, getUploadApi } from './oss'
import { eSign } from './request.js'
const MAXSIZE = 5 * 1024 * 1024
export default {
  data() {
    return {
      projectName: '',
      income: '',
      saleCount: '',
      uploadImgData: [],
      uploadProgress: undefined,
      isESign: false, // 是否点击过授权
    }
  },
  computed: {
    showUpload() {
      return this.uploadImgData.length < 9
    },
    imgList() {
      return this.uploadImgData
    },
    getCount() {
      return this.uploadImgData.length
    },
    showProgress() {
      return this.uploadProgress>=0&&this.uploadProgress<100
    },
    btnStatus() {
      return this.projectName.trim()&&this.income.trim()&&this.saleCount.trim()&&this.uploadImgData.length
    }
  },
  methods: {
    async uploadFile(e) {
      if (e.target && e.target.files && e.target.files.length) {
        let originFiles = e.target.files
        let filelists = Array.from(originFiles).filter(item => {
          return item.size < MAXSIZE
        })
        filelists = filelists.slice(0, 9 - this.uploadImgData.length)

        if (filelists.length == 0) {
          this.$showToast('超过5M的图片无法上传,请检查后再试', '2000')
          return
        }
        const params = { pic_num: filelists.length }
        const res = await WorksServerApi.getOssAuth(params)
        this.uploadProgress = 0
        if (res&&res.code===100) {
          const client = getOssClinet(res.data)
          const uploader = {
            fileStats: {
              totalFilesNum: 0,
              totalFilesSize: 0,
              uploadFinishedFilesNum: 0,
              curFileSize: 0,
            },
          }
          uploader.fileStats.totalFilesNum = filelists.length
          const { fileData, totalSize } = await initSettingSubmit(filelists)
          uploader.fileStats.totalFilesSize = totalSize
          const x =[]
          fileData.forEach((item) => {
            x.push(new Promise(async(resolve) => {
              const { completeFile, prosses } = await getUploadApi(item.file, item.filePath, client, uploader)
              resolve({ completeFile, id: item.id, width: item.width, height: item.height })
              this.uploadProgress = prosses
            }))
          })
          Promise.all(x).then((allData) => {
            allData.forEach((item) => {
              const imgurl = `https://${item.completeFile.bucket}.oss-cn-beijing.aliyuncs.com/${item.completeFile.name}`
              this.uploadImgData.push({ id: item.id, width: item.width, height: item.height, imgurl })
            })
            if (originFiles.length > filelists.length) {
              this.$showToast('超过5M的图片无法上传,请检查后再试', '2000')
            }
          })
        }
      }
    },
    deleteImg(item) {
      this.uploadImgData= this.uploadImgData.filter((sub) => sub.id!==item.id)
    },
    async eSign() {
      if (this.isESign) {
        return
      }
      this.isESign = true
      let res = this.uploadImgData.map(item => {
        return item.imgurl
      })
      const { code, data, msg } = await eSign(this.projectName, this.income, this.saleCount, res)
      if (code == 100) {
        window.location.href = data.signUrl
      } else {
        this.$showToast(msg)
      }
      this.isESign = false
    }
  },
  mounted() {},
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import './index.styl'
</style>
