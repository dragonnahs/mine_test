export class HttpOptions {
  constructor(url = null, body = null, headers = null) {
    this.url = url
    this.body = body
    this.params = null
    this.headers = headers
    this.skipValidation = false
    this.success = null
    this.fail = null
    this.baseUrl = null
  }
}