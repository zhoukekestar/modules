
### _Fix
* Fix browser's compatibility.
* Code your js as no IE exist. Code once by W3C api, run everywhere (include IE).
* 修复游览器兼容性
* 按照W3C标准编写一次，到处运行（包括IE）
* “正常编码”，IE不支持addEventListener，只支持attachEvent？就用addEventListener就行，按照W3C的标准写一套代码就行，其他就交给兼容代码去解决就行了。

### _IE
* CSS hacks for IE.
* IE游览器CSS的hack.

### _lib
Base libraries for modules like: jQuery.

### alert
![alert](./alert/demo.gif)

### alertMsg
Alert message.<br>
![alertMsg](./alertMsg/demo.gif)

### baseCSS
Base CSS

### baseUtils
Base utils.

### citySelect
Select city for China.<br>
![citySelect](./citySelect/demo.gif)

### confirm
![confirm](./confirm/demo.gif)

### CSS-Controls
* checkbox <br> ![checkbox](./CSS-Controls/checkbox/demo.gif)
* like <br> ![like](./CSS-Controls/like/demo.gif)
* radio <br>  ![radio](./CSS-Controls/radio/demo.png)
* switch <br> ![switch](./CSS-Controls/switch/demo.gif)

### loadpage
* Load page <br> ![loadpage](./loadpage/demo.gif)

### paging
* ![paging](./paging/demo.gif)

### prompt
![prompt](./prompt/demo.gif)

### pull
* Pull to refresh. <br> ![pull](./pull/demo.gif)

### pull-v2
* Pull to refresh `version 2`. <br> ![pull-v2](./pull-v2/demo.gif)


### editor -> ueditor for nodejs

* Step 1: `npm install`
* Step 2: `node app.js` <br> ![ueditor](./editor/ueditor/demo.gif)
* ueditor-local 用于本地测试使用，图片将保存在本地。确保UEditor能够使用。
* ueditor-proxy 用于项目实践使用，使用nodejs作为代理，将上传的图片转发到统一的图片服务器上传接口，并解析对应的结果，返回统一的格式给UEditor。


### upload
* Run command `node app.js`
* Open browser & visit `localhost:3000`
* Demo is in `public` directory
* Preview <br> ![upload](./upload/demo.gif)


### jquery2navtive.html
* jQuery to navtive list.
* TODO: remove jquery denpency on modules.

* 将jQuery转换成native的javascript的参考列表
* 需要做：将模块中的jQery依赖移除
