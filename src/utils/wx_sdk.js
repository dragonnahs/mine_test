// H5页面调用微信的功能，依赖微信sdk

/**
 * 微信sdk初始化
 * @param {Object} wxJson 微信sdk的api初始化
 */
export const wxInit = async(wxJson={}) => {
  let { appId: wxAppId, timestamp: wxTimestamp, nonceStr: wxNonceStr, signature: wxSignature, debug: wxDebug=false } = wxJson
  wx.config({
    debug: wxDebug,
    appId: wxAppId,
    timestamp: wxTimestamp,
    nonceStr: wxNonceStr,
    signature: wxSignature,
    jsApiList: [
      'onMenuShareTimeline',
      'onMenuShareAppMessage'
    ]
  })
}

/**
 * 微信的分享朋友圈和分享好友的初始化
 * @param {Object} wxJson 微信分享相关数据
 */
export const wxShareMoentsAndFriend = async(wxJson={}) => {
  try {
    // title,出入的分享标题，url,传入的分享链接,desc,分享的描述,debug,是否打开调试默认不打开
    let { title: wxTitle, content, url: wxUrl, desc: wxDesc, imgUrl: wxImgUrl } = wxJson
    console.log(wxJson)
    wx.ready(function() {
      // 分享到朋友圈
      wx.onMenuShareTimeline({
        title: content,
        link: wxUrl,
        imgUrl: wxImgUrl,
        success() {
          console.log('分享成功')
        },
        cancel() {
          console.log('取消')
        }
      })
      // 分享给朋友
      wx.onMenuShareAppMessage({
        title: wxTitle,
        desc: wxDesc,
        link: wxUrl,
        imgUrl: wxImgUrl,
        type: '',
        dataUrl: '',
        success() {
          console.log('分享成功')
        },
        cancel() {
          console.log('取消分享')
        }
      })
    })
    wx.error(function(res) {
      console.log(res)
    })
  } catch (error) {
    console.log(error)
  }
}

/**
 * @param {Object} wxJson 传入的对象
 * scope=snsapi_base的时候是默认授权，scope=snsapi_userinfo是需要用户手动授权
 * url是分享页面的地址，在分享页面调用该方法，跳转到微信授权页面，授权后重定向到
 * 当前的分享页面
 * 授权成功后的回调地址会携带code参数，通过code调用后台接口获取access_token和openid
 */
export const wxAuthorize = (wxJson = {}) => {
  let { appid: wxAppid, url, state = '', scope='snsapi_base' } = wxJson
  url = encodeURIComponent(url)
  let result = 'https://open.weixin.qq.com/connect/oauth2/authorize?' +
  'appid=' + wxAppid +
  '&redirect_uri=' + url +
  '&response_type=code' +
  '&scope=' + scope +
  '&state=' + state + '#wechat_redirect'
  window.location.href = result
}