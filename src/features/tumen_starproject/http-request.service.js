import axios from 'axios'

export class HttpRequestService {
  constructor() {
    this._redirected = false
  }

  static delete(params) {

    if (!this.handleRequest(params)) {
      return new Promise((resolve, reject) => {
        reject()
      })
    }
    return this.apiAxios(params, 'DELETE')
  }

  static get(params) {

    if (!this.handleRequest(params)) {
      return new Promise((resolve, reject) => {
        reject()
      })
    }
    return this.apiAxios(params, 'GET')
  }

  static post(params) {


    if (!this.handleRequest(params)) {
      return new Promise((resolve, reject) => {
        reject()
      })
    }
    return this.apiAxios(params, 'POST')
  }

  static put(params) {


    if (!this.handleRequest(params)) {
      return new Promise((resolve, reject) => {
        reject()
      })
    }
    return this.apiAxios(params, 'PUT')
  }

  static handleRequest(params) {
    let hasAuthorization = false
    if (!params.headers) {
      params.headers = [{ name: 'Content-Type', value: 'application/json' }]
    } else {
      let hasContentType = false
      for (let i = 0; i < params.headers.length; i++) {
        if (params.headers[i].name === 'Content-Type') {
          hasContentType = true
        }
        if (params.headers[i].name === 'Authorization') {
          hasAuthorization = true
        }
      }
      if (!hasContentType) {
        params.headers.push({
          name: 'Content-Type',
          value: 'application/json',
        })
      }
    }
    if (!params.skipValidation && !hasAuthorization) {
      params.headers.push({ name: 'X-Client', value: 'version=103.1.0.3.1031000' })
      params.headers.push({ name: 'Access-Control-Allow-Origin', value: '*' })
    }
    let headers = {}
    if (params.headers) {
      params.headers.forEach((element) => {
        headers[element.name] = element.value
      })
    }
    params.headers = headers

    this._redirected = false
    return true
  }

  static apiAxios(params, httpMethod) {
    axios.defaults.timeout = 10000
    const promise = new Promise((resolve, reject) => {
      if (params) {
        params = filterNull(params)
      }
      const options = {
        method: httpMethod,
        url: params.url,
        data: httpMethod === 'POST' || httpMethod === 'PUT' ? params.body : null,
        params: httpMethod === 'GET' || httpMethod === 'DELETE' ? params.params : null,
        withCredentials: false,
        headers: params.headers,
      }
      axios(options)
        .then((res) => {
          if (res && res.status >= 200 && res.status < 400) {
            if (!res.data) {
              let tem = res.data
              res.data = {}
              res.data.data = tem
              res.data.message = `Response data is ${tem}`
              resolve(res.data)
              return
            }
            if (!res.data.data) {
              res.data.data = {}
            }
            if (res.data.code || res.data.errCode) {
              res.data.data.code = res.data.errCode || res.data.code
            }
            if (res.data.message || res.data.errMessage) {
              res.data.data.message = res.data.message || res.data.errMessage
            }
            if (res.data.body) {
              res.data.data = Object.assign(res.data.data, res.data.body)
            }
            resolve(res.data.data)
          } else {
            handleError(res.data, reject)
          }
        })
        .catch((err) => {
          handleError(err, reject)
        })
    })

    return promise

    function filterNull(o) {
      for (const key in o) {
        if (o[key] === null||o[key]==='') {
          delete o[key]
        }
        if (toType(o[key]) === 'string') {
          o[key] = o[key].trim()
        } else if (toType(o[key]) === 'object') {
          o[key] = filterNull(o[key])
        } else if (toType(o[key]) === 'array') {
          o[key] = filterNull(o[key])
        }
      }
      return o
    }

    function toType(obj) {
      return {}.toString
        .call(obj)
        .match(/\s([a-zA-Z]+)/)[1]
        .toLowerCase()
    }

    function handleError(err, reject) {
      resolveError(err)
      if (Object.prototype.toString.call(err) === '[object String]') {
        reject(err)
      } else if (Object.prototype.toString.call(err) === '[object Error]') {
        reject(err.message)
      } else {
        reject(err.response && err.response.data ? err.response.data : err.response)
      }
    }

    function resolveError(err) {
      console.log('error as follows:')
      console.log(err)
    }
  }
}
