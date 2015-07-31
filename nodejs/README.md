## console
* 使用方法：使用require引用后即可，会覆盖系统的console对象，使用时，正常编写代码即可
```js
require('console.js')
console.log('hello log')
console.info('hello info')
console.warn('hello warn')
console.error('hello err')
```
* 解决nodejs中无法输出行号的无奈，输出样例为：
```js
[16:40:59] (g:\svn\www.toomao.com\app.js:52:11) Local. Listen 3000.
```
* 可重定向日志输出到日志系统进行统一管理（使用http方法post到指定接口即可）
* 可屏蔽指定文件的输出，类似于log4j中的功能，以下代码会输出所有文件的log信息，但会屏蔽`consoleTest.js`的info信息
```js
// Run test/consoleTest.js
require('../lib/console.js')([], ['consoleTest.js'])
console.log('hello log') // It will show in console.
console.info('hello info') // It will be blocked.
```

## jquery-core
* jquery的核心代码，直接引用即可

## render
* 重写express的render方法，并重新设置options。
* 该模块适合设置项目的公共参数。如后台api接口参数等。

## reqFilter（请求过滤判断）
* 判断是否为ajax请求
* 判断是否是手机访问

## viewEngine（自定义模板引擎）
* 基于jade的自定义模板引擎
* 加入任何想加的规则即可

## wechat
* 微信接口的工具类
* 获取accessToken，并自动超时刷新
* 微信签名

## xmlBodyParser
* xml解析

## utils
* 格式化日期
* md5加密
* sha1加密
* hmacSha1加密，对接腾讯云可能会用到
