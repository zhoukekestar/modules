## 组件简介
* _fixDesktop : 桌面端的游览器兼容
* _fixMobile  : 手机端的游览器兼容
* _lib        : 第三方库文件
* alert       : 游览器alert增强
* baseUtils.logForBrowser: 游览器异常日志记录
* citySelect  : 城市多级联动选择
* clearable   : 输入框清空按钮
* confirm     : 确定框选择
* CSS-Controls: 选择框、点赞按钮、单选框、开关按钮样式优化
* deletable   : ios样式的删除按钮
* editor      : 富文本编辑器
* events      : 增加手机端事件（左划、右划、长按）
* formJSON    : json表单，以json格式ajax提交表单
* formValidator: 表单字段校验
* imageView   : 无聊的图片放大功能
* lazyload    : 图片的懒加载（包括背景图片）
* loadingPage : “加载中”页面
* loadpage    : 理想化的单页组件，受jquery mobile启发（还不够成熟）
* menu        : 菜单组件
* paging      : 分页组件
* pull & pull-v2: 下拉刷新
* shareWX     : 微信分享组件
* tabs        : tab组件
* template    : 模板组件
* toast       : 提示消息组件
* upload      : 上传组件

## src
* 模块源码，代码都是模块化的，
* 一个一个看就行，会比较轻松，不需要一下全看懂。
* 看懂了怎么用后，有空写点说明？写个demo？补充一下？
* 发现bug，提交一下，讨论一下？

## Polyfills Projects
* [Modernizr](https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-Browser-Polyfills)
* [ieBetter.js](https://github.com/zhoukekestar/ieBetter.js)
* [polyfill-service](https://github.com/Financial-Times/polyfill-service)

## 个人观点
1、对框架的看法：

  前端的js框架多种多样，最流行的莫过于angularjs和react了，还有kissy，YUI（有点走下坡路呢），不过，我觉得，这种框架都是对原有html标准的破坏，比如react有自己的jsx语法（虽然和html类似，但和标准相去甚远），还有angularjs有自己的好多属性，比如ng-app,ng-model之类的。

  不得不承认，学习任何框架都是有成本的，但前段框架变化又太过于频繁，这学习成本更是沉重。

  我一直都不太喜欢框架，更倾向于js模块和组件（有点工具类的感觉，要用到什么，就加载什么），是那种低耦合，不依赖于框架本身的模块和组件，不是那种基于react、kissy的模块或组件，而是能够直接拿来就能在游览器上跑的组件（当然，可能会依赖requirejs等模块加载工具）

2、对HTML标准的看法：

  我希望我编写HTML的时候，我也能正常编码，而不靠各种兼容，这跟polyfill的思想是一样的

  比如我会写`formValidator.js`，去支持各种其他游览器不支持的属性，然后我就可以这样写了

  `<input name="abc" placeholder="6个字符" value="123456" pattern="^[0-9]{6}$">`

  `<input name="abc" value="123456" required minlength="6" maxlength="10">`

  有些情况，我甚至会增强一些属性（这和标准有些出入，但也无奈之举，有些时候W3C的标准跟不上需求的变化，所以就在原有标准之上进行扩展增强）

  `<input type="email" name="emial" placeholder="email" data-msg='{"email":"emial格式错了啦"}'>`

3、组件化看法

  1) 组件UI应独立于js之外，而不是由js提供各种接口去改变UI样式，也可以参考[这篇文章](http://isux.tencent.com/half-package-web-components-for-design.html)

  2) LESS JAVASCRIPT, MORE HTML, AUTO-INIT.
  组件高内聚，在组件之外少写组件相关代码（包括初始化，所以，组件需要自动初始化），也需要有重新初始化接口。只需标明元素使用哪种组件，组件就应自动初始化该元素。

  3) 元素中心化
  为了方便调用，更自然地去写js代码，同时将原生js代码中的各种原有属性加以利用（跟RESTful中，将HTTP status加以利用类似），
  也可以省去组件初始化的显示调用。一个是以组件为中心，元素为辅助，另一个是以元素为中心，组件为辅助，这两者，我更喜欢后者，将元素从组件边缘移至组件中心。

  组件参数设置 VS 元素参数设置
  将以下代码
  ```js
  <div id='upload-btn' data-url='/upload'></div>
  var ext = ajaxUpload('#upload-btn', {
    success: function(d) {
    },
    abort: function() {
    }
  });
  // 所有操作围绕ext变量展开
  // 需要显式调用组件的初始化
  ```
  改成
  ```js
  <div data-url='/upload' data-role='ajaxUpload'>upload</div>
  var btn = document.querySelector('#upload-btn');
  btn.onsuccess = function(d) {
  }
  btn.onabort = function() {
  }
  // 所有操作围绕btn元素展开
  // 忽略组件的初始化，也无需关注组件是否初始化正确或成功，只需针对元素
  ```
  在写组件的过程中，从
  ```js

  var ajaxUpload = function(ele, o) {
    var ele = (typeof ele === 'string') ? document.querySelector(ele) : ele,
        options = $.extend({
          /* default options */
        }, o)

    /* init code */

  }

  ```
  改成
  ```js
  document.addEventListener('click', function(e) {

    var target = e.target;
    if (target.getAttribute('data-role') === 'ajaxUpload') {

      if (target.inited === undefined) {
        target.inited = true;
        /* init code */
      }
    }
  })

  // OR

  window.addEventListener('load', function(){

    var ele = document.querySelector('[data-role="ajaxUpload"]');

    /* init code */

  })
  ```
