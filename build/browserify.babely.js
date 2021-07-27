var fs = require('fs')
var path = require('path')
var browserify = require('browserify')
var babelify = require('babelify')
var UglifyJS = require('uglify-js')
var rgex = /^(chunk-vendors)|(chunk-swiper)\.[\w]/
var bableFileArray = []


function resolve(dir) {
  return path.join(__dirname, '..', dir)
}
function getFiles(url, ext) {
  fs.readdir(url, function(err, files) {
    if (err) {
      return console.error(err, 'getFileNameError')
    }
    files.forEach(function(file) {
      var stats = fs.statSync(url + file)
      if (stats && stats.isFile()) {
        if (path.extname(url + file) === ext) {
          if (rgex.test(file)) {
            bableFileArray.push(path.basename(file, ext))
          }
        }
      } else if (stats && stats.isDirectory()) {
        getFile(url + file + '/', ext)
      }
    })
    compileJs(url)
  })
}

// 查找是否含有版本文件夹
function dealFile(dir) {
  let url = null
  const list = fs.readdirSync(dir)
  if (list.length === 1) {
    url = `${dir}/${list[0]}/js/`
  } else {
    url = 'dist/Breader_Task_H5/js/'
  }
  getFiles(url, '.js')
}

dealFile('dist/Breader_Task_H5')

function compileJs(url) {
  bableFileArray.map(function(item) {
    dealCompile(url, item)
  })
}

// 编译处理打包之后的 js 文件
function dealCompile(url, item) {
  browserify({ debug: false })
    .transform(babelify)
    .require(resolve(`/${url}/${item}.js`), { entry: true })
    .bundle(function(res) {
      console.log(res, 456)
      fs.unlink(resolve(`/${url}/${item}.js`), function() {
        try {
          var readerStream = fs.createReadStream(resolve(`/dist/${item}.js`))
          var writerStream = fs.createWriteStream(resolve(`/${url}/${item}.js`))
          readerStream.pipe(writerStream)
          readerStream.on('end', function() {
            console.log('/${url}/${item}.js', `/${url}/${item}.js`)
            fs.writeFileSync(resolve(`/${url}/${item}.js`), UglifyJS.minify(fs.readFileSync(resolve(`/${url}/${item}.js`), 'utf-8')).code)
          })
          console.log('结束')
          fs.unlink(resolve(`/dist/${item}.js`), function(errunlink) {
            try {
              console.log('success delete')
            } catch (errortetx) {
              console.log(errunlink, errortetx, 'delecopyError')
            }
          })
        } catch (err) {
          console.log(err, 'deleteFileError')
        }
      })
    })
    .on('error', function(err) {
      console.log('Error' + err.message)
    })
    .pipe(fs.createWriteStream(`dist/${item}.js`))
}

