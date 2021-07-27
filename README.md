# Breader_Task_H5

### 项目介绍

- 负责为原生的项目提供内嵌 H5 页面
- 包含功能性页面
- 包含运营活动页

### 项目目录

```bash
# |-- src
#    |-- assets
#        |-- task 资源文件
#        |-- ...
#   |-- common
#       |-- axiosConfig.js
#       |-- faskClick.js
#        |-- htmlClass.js
#        |-- index.js
#        |-- index.pug
#    |-- components
#        |-- tab
#        |-- ...
#    |-- features 路由组件
#    |-- mixin
#    |-- styles 样式文件
#    |-- utils 工具资源
#       |-- animation.js
#        |-- browser.js
#        |-- crop.js
#        |-- dom.js
#        |-- domain.js
#        |-- evn.js
#        |-- log.js
#        |-- native.js
#        |-- string.js
#        |-- url.js
#        |-- utils.js
# |-- static
# |-- template
# |-- static  静态资源
# |-- public
```

### 开发规范
  需求分支基于master去创建feature/*
  feature/* 开发完成之后合并到develop 进行测试，
  develop测试通过后将feature/*分支合并到master
  基于master 打tag上线,这里是通过git push origin tag的版本号来自动部署上线的，完事后，还要把master分支推送下

### 常用命令

```bash
# 开发本地开发服务器
$ npm run dev
# build 测试环境项目
$ npm run dev-build
# build 生产环境项目
$ npm build
# 输入webpack配置文件
$ npm run inspect > webpack.js
```

