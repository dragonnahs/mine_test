const glob = require('glob')
// const shell = require('shelljs')
let { sourcemap } = require('../.sentryrc.js')
let paths = []
let allFiles = glob.sync('./dist/Breader_Task_H5/js/*')
paths.push(...allFiles.filter(item => sourcemap.some(source => item.includes(source))))
