## HOW-TO
* Run command `node app.js`
* Open browser & visit `localhost:3000`
* Demo is in `public` directory

## 开始
* 打开cmd命令，运行命令`node app.js`
* 打开游览器，访问`localhost:3000`

## ajaxUpload.v2.js（样例请看`./public/index.v2.html`）
* data-height 指定图片高度，如：data-height='100'，指定data-height或data-width后，data-max-height、data-min-width等指定范围的参数将失效
* data-width 指定图片宽度

* data-max-height 指定最大图片高度，如：data-max-height='100'
* data-min-height 指定最小图片高度
* data-max-width 指定最大图片宽度
* data-min-width 指定最小图片宽度

* data-max-size 指定最大文件大小（支持K和M），如：data-max-size='1M'、data-max-size='100K'
* data-min-size 指定最小文件大小
* data-accept 指定文件类型，如：data-accept='image/gif,image/jpeg'
* data-multiple 指定是否支持多图上传

* onFileSizeError方法，文件大小不符合时将调用，`onFileSizeError = function(name, size, minSize, maxSize)`
* onImageSizeError方法，图片尺寸不符合时将调用，`onImageSizeError = function(name, width, height)`
