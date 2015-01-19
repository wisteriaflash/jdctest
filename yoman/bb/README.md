#generater - jdc


### 安装

* [下载脚手架](https://github.com/wisteriaflash/generator-jdc)
* 进入脚手架文件夹，运行命令：`npm link`
* yoman脚手架使用：`yo jdc`



### 如何使用


1. grunt启动：`grunt`
2. 图片压缩：`grunt imagemin`—— 压缩img文件夹下的文件。
3. build发布：`grunt build`

PS：grunt linveload监听所有`scss、js、html`文件，`scss`文件会自动编译为`css`文件。



### js/css压缩block

ex - `css`：

  <!-- build:css button/base.min.css -->
  <link rel="stylesheet" href="base1.css">
  <link rel="stylesheet" href="base2.css">
  <!-- endbuild -->

* 上述代码会将`base1`,`base2`两个css文件合并、压缩为base.min.css。
* 该段代码，会自动被替换为` <link rel="stylesheet" href="base.min.css">`
* 注意：在生成css文件路径前，需要将组件名写上，例如`button/base.min.css`。


ex - `js`:

  <!-- build:js button/c.min.js -->
  <script src="a.js"></script>
  <script src="b.js"></script>
  <!-- endbuild -->
  
* 上述代码会将`a.js`,`b.js`两个js文件合并、压缩为c.min.js。
* 该段代码，会自动被替换为` <script src="c.min.js"></script>`
* 注意：在生成js文件路径前，需要将组件名写上，例如`button/c.min.js`。

**注意：所有css/js文件均需要卸载block块中，否则buildi发布完，dist文件夹中会没有该文件。**

### 组件结构
* 新的组件，需要在`src`文件夹中新建相关组件文件夹，js/css文件均直接在组件文件夹中，不再创建`js/css`等子文件夹。
* 组件相关图片：如果图片不多，建议直接放在组件文件夹中即可。如果图片文件较多，则需要创建`img`子文件夹。
* **组件的文件结构，参见`popup`- 弹层组件。**



### 其他

* bower：使用`bower`来，来管理js框架等资源文件的版本等，依赖文件见配置文件`bower.json`，安装的资源文件安装见'bower_components'。
* npm镜像：建议使用淘宝npm镜像，以保证npm安装顺畅，设置方法如下：
  * `npm config set registry https://registry.npm.taobao.org`
  * `npm info underscore` （如果上面配置正确这个命令会有字符串response）