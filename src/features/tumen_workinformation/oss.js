import OSS from 'ali-oss'

export function initSettingSubmit(fileList) {
  const length = fileList.length
  const x = []
  const regt = /^[0-9a-zA-Z_]{1,}$/g
  for (let i = 0; i < length; i++) {
    const file = fileList[i]
    const index1 = file.name.lastIndexOf('.')
    const index2 = file.name.length
    let fileName = file.name.substring(0, index1)
    const sufffix = file.name.substring(index1, index2)
    fileName = fileName.replace(/<script.*?>.*?<\/script>/gi, '')
    fileName = regt.test(fileName) ? fileName : Math.round(Math.random() * 10000)
    const url =fileName +'_' +new Date().getTime() +'_' +Math.round(Math.random() * 10000) +sufffix
    file.id = 'WU_LI_' + Math.round(Math.random() * 100000) + '_' + new Date().getTime()
    file.filePath = 'tumen_img/' + url
    x.push(
      new Promise((resolve) => {
        const url = window.URL || window.webkitURL
        let img = new Image() // 手动创建一个Image对象
        img.src = url.createObjectURL(file) // 创建Image的对象的url
        img.onload = function() {
          resolve({ file, filePath: file.filePath, id: file.id, width: this.width, height: this.height, })
          img = null
        }
      })
    )
  }
  return new Promise((resolve) => {
    Promise.all(x).then(allData => {
      let totalSize = 0
      allData.forEach((item) => {
        totalSize += item.file.size
      })
      resolve({ fileData: allData, totalSize })
    })
  })
}

export function getOssClinet(setting) {
  const bucket = setting.bucketName // 这些找后台拿
  const region = 'oss-cn-beijing'
  const accessKeyId = setting.accessKeyId
  const accessKeySecret = setting.accessKeySecret
  const endpoint = setting.endpoint
  const stsToken = setting.securityToken
  const client = new OSS({
    region,
    accessKeyId,
    accessKeySecret,
    stsToken,
    bucket,
    endpoint,
    secure: true,
  })
  return client
}

export function getUploadApi(file, filePath, client, uploader) {
  return new Promise((resolve) => {
    client.multipartUpload(filePath, file, {
      progress,
      headers: {
        'x-oss-security-token': client.stsToken,
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      },
    }).then((res) => {
      uploader.fileStats.uploadFinishedFilesNum++ // 已成功上传数 + 1
      uploader.fileStats.curFileSize += file.size // 当前已上传的文件大小
      let prosses =
          (uploader.fileStats.curFileSize / uploader.fileStats.totalFilesSize).toFixed(2) *
          100
      if (uploader.fileStats.totalFilesNum === uploader.fileStats.uploadFinishedFilesNum) {
        console.log('上传完成！')
      }
      resolve({ completeFile: res, prosses })
      client.putACL(res.name, 'public-read')
    })
      .catch((err) => {
        console.log(err)
      })
  })
}

function progress(p) {
  // p百分比 0~1
  return function(done) {
    let progressBar = (p * 100).toFixed(2)
    console.log(progressBar)
    done()
  }
}
