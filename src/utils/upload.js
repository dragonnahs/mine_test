import OSS from 'ali-oss'
import { get } from '@/config/axios.config'


export const initOss = async(pic_num) => {
  console.log(pic_num)
  let res = await get('https://cartoon.ibreader.com/api/oss/getResourceUploadToken', {
    params: { pic_num }
  })
  if (res.code === 100) {
    const { accessKeyId, accessKeySecret, bucketName: bucket, endpoint, securityToken: stsToken } = res.data
    let client = new OSS({
      region: 'oss-cn-beijing',
      accessKeyId,
      accessKeySecret,
      stsToken,
      bucket,
      endpoint,
      secure: true,
    })
    return client
  }
}

export const getOneUploadedUrl = async(client, filePath, file, callback) => {
  await client.multipartUpload(filePath, file, {
    headers: { 'x-oss-security-token': client.options.stsToken, 'Connection': 'keep-alive', 'Access-Control-Allow-Origin': '*' }
  }).then(function(res) {
    const url = res && res.name && ('https://bikan-cartoon-res.oss-cn-beijing.aliyuncs.com' + res.name)
    callback(url)
  }).catch(err => {
    console.log(err)
  })
}