## 模块简介🎈
| 文件名 | 说明 | 重要度(10) |
| ----- | ----- | ----- |
| _fixDesktop | 桌面端的游览器兼容 | 5 |
| _fixMobile  | 手机端的游览器兼容 | 5 |
| _lib        | 第三方库文件 | 3 |
| alert       | 游览器alert增强 | 3 |
| baseUtils.logForBrowser| 游览器异常日志记录 | 7 |
| citySelect  | 城市多级联动选择 | **8** |
| clearable   | 输入框清空按钮 | 7 |
| confirm     | 确定框选择美化 | 3 |
| CSS-Controls| 选择框、点赞按钮、单选框、开关按钮样式美化 | 4 |
| datetime    | bootstrap-datetime | 5 |
| deletable   | ios样式的删除按钮 | 5 |
| editor      | 富文本编辑器 | 6 |
| events      | 增加手机端事件（左划、右划、长按） | 5 |
| formJSON    | JSON表单异步提交 | **9** |
| formValidator| 表单字段校验 | **8** |
| imageView   | 图片全屏查看 | 4 |
| lazyload    | 图片的懒加载（包括背景图片） | **9** |
| loadingPage | “加载中”动画（屏蔽交互） | 7 |
| loadpage    | 理想化的单页模块，受jquery mobile启发（还不够成熟） | 4 |
| menu        | 菜单（未完善） | 4 |
| paging      | 分页模块 | **8** |
| panel       | panel（未完善） | 3 |
| popup       | 全屏弹出 | 3 |
| preview     | 图片预览 | 3 |
| prompt      | 输入弹框 | 3 |
| pull & pull-v2| 下拉刷新 | 3 |
| shareWX     | 微信分享 | **8** |
| sort        | 排序（未完成）  | 2 |
| tabs        | tab模块 | **8** |
| template    | 模板模块 | **9** |
| toast       | 提示消息模块 | 6 |
| tooltip     | tooltip 提示模块 | 6 |
| upload      | 图片上传 | 6 |
| views       | 简单的单页应用框架 | 7 |
| webcom      | 组件化框架（借鉴polymer（为主）和react的组件化思路） | **9** |
| jquery2native | jquery转native参考列表 | **9** |

## src
* 模块源码，代码都是模块化的，
* 一个一个看就行，会比较轻松，不需要一下全看懂。
* 看懂了怎么用后，有空写点说明？写个demo？补充一下？
* 发现bug，提交一下，讨论一下？

## Polyfills Projects
* [Modernizr](https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-Browser-Polyfills)
* [ieBetter.js](https://github.com/zhoukekestar/ieBetter.js)
* [polyfill-service](https://github.com/Financial-Times/polyfill-service)
* [webcomponents](http://webcomponents.org/polyfills/)

## WebComponents
You should use [webcomponents](https://github.com/zhoukekestar/webcomponents) to build your next web application !!

[This project](https://github.com/zhoukekestar/webcomponents) is a components project for those modules.

## 个人观点
#### 1、对框架的看法：

  前端的js框架多种多样，最流行的莫过于angularjs和react了，还有kissy，YUI（有点走下坡路呢），不过，我觉得，这种框架都是对原有html标准的破坏，比如react有自己的jsx语法（虽然和html类似，但和标准相去甚远），还有angularjs有自己的好多属性，比如ng-app,ng-model之类的。

  不得不承认，学习任何框架都是有成本的，但前段框架变化又太过于频繁，这学习成本更是沉重。

  我一直都不太喜欢框架，更倾向于js模块和组件（有点工具类的感觉，要用到什么，就加载什么），是那种低耦合，不依赖于框架本身的模块和组件，不是那种基于react、kissy的模块或组件，而是能够直接拿来就能在游览器上跑的组件（当然，可能会依赖requirejs等模块加载工具）

#### 2、对HTML标准的看法：

  我希望我编写HTML的时候，我也能正常编码，而不靠各种兼容，这跟polyfill的思想是一样的

  比如我会写`formValidator.js`，去支持各种其他游览器不支持的属性，然后我就可以这样写了

  `<input name="abc" placeholder="6个字符" value="123456" pattern="^[0-9]{6}$">`

  `<input name="abc" value="123456" required minlength="6" maxlength="10">`

  有些情况，我甚至会增强一些属性（这和标准有些出入，但也无奈之举，有些时候W3C的标准跟不上需求的变化，所以就在原有标准之上进行扩展增强）

  `<input type="email" name="emial" placeholder="email" data-msg='{"email":"emial格式错了啦"}'>`

#### 3、组件化看法

  **1) 组件UI的CSS化**

  组件UI应独立于js之外，而不是由js提供各种接口去改变UI样式，也可以参考[这篇文章](http://isux.tencent.com/half-package-web-components-for-design.html)

  **2) LESS JAVASCRIPT, MORE HTML, AUTO-INIT.**

  组件高内聚，在组件之外少写组件相关代码（包括初始化，所以，组件需要自动初始化），也需要有重新初始化接口。只需标明元素使用哪种组件，组件就应自动初始化该元素。

  **3)  LESS DEP-JS, MORE NAT-JS.**

  更少的依赖代码，更多的原生JS，弱化模块依赖。比如：src/webcom模块，组件内部使用setAttribute这个原生函数去设置组件绑定数据。这样做的好处是：
  1、当模块没有加载成功时，数据已加载时，调用setAttribute设置数据，这样会调用原生方法，代码不会报错，没有模块依赖，（模块加载后通过getAttribute获取数据来初始化）
  2、当模块加载完成，数据延时的情况（setAttribute后来才调用），模块内部需要重写setAttribute方法，这样，当调用setAttribute函数时就能及时更新组件内部数据了。
  3、当这样写模块后，模块加载和数据加载都能异步，没有先后顺序，弱化了依赖。
  如果是传统的调用方法，大致这样：
  ```js
  module.loaded(function(){
      getDate(function(d){
          module.config(d); // DEP-JS, 依赖于模块的代码及函数（config函数依赖于模块，原生并没有）
      })
  })
  ```
  根据上述原则后，大致这样：
  ```js
  getData(function(d) {
    element.setAttribute(d);
    // NAT-JS, 由于1、自动初始化，2、无模块依赖，3、数据先行调getAttribute，数据后行重写setAttribute
  })
  ```
  ```js
  // module
  (function(){

    var init = function(element) {

      // Override setAttribute
      element.setAttribute = function(name, value) {

        // Do something with value on element.
        return Element.prototype.getAttribute.call(this, name);
      }

      // If you have data, auto run setAttribute again.
      if (element.getAttribute('data')) {
        element.setAttribute(element.getAttribute('data'));
      }
    }

    // AUTO-INIT
    document.readyState is complete then init
  })();
  ```


  **3) 元素中心化**

  要说html,js,css哪个更强大，很多人都觉得js最强大，所以好多模块代码都需要js去做各种事情，但我觉得html更强大，html是一种融合剂，将本身、js和css结合起来。
  所以html是我的最佳，自然而然也觉得元素中心化是最好的，而且代码质量更容易掌控。

  元素为中心，所以的初始化和设置都围绕元素展开。

  **组件参数设置 VS 元素参数设置**
  ```js
  <div id='upload-btn' data-url='/upload'></div>

  var ext = ajaxUpload('#upload-btn', {
    success: function(d) {},
    abort: function() {},
    beforeSend: function() {}
  });

  // 所有操作围绕ext变量展开
  // 需要显式调用组件的初始化，模块强依赖
  ```

  VS

  ```js
  <div data-url='/upload' data-role='ajaxUpload'>upload</div>

  var btn = document.querySelector('#upload-btn');
  btn.onsuccess = function(d) {}
  btn.onabort = function() {}
  btn._beforeSend = function() {}

  // 所有操作围绕btn元素展开
  // 忽略组件的初始化，也无需关注组件是否初始化正确或成功，只需针对元素，也可弱化依赖
  ```


  **变量中心化组件 VS 元素中心化组件**

  ```js

  var ajaxUpload = function(ele, o) {
    var ele = (typeof ele === 'string') ? document.querySelector(ele) : ele,
        options = $.extend({
          /* default options */
        }, o)

    /* init code */

  }

  ```

  VS

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

## 共鸣文章
* 声明：很多观点自己想出来的，然后在网上一找，诶~还真有类似想法的人和公司，不错，至少这条路是对的。
* [面向设计的半封装web组件开发](http://isux.tencent.com/half-package-web-components-for-design.html)
* [顺势而为，HTML发展与UI组件设计进化](http://isux.tencent.com/development-of-ui-components-based-on-native-html.html)，该文章我也非常赞同，
不过我对js的封装不太一样，我觉得这种ui初始化对开发人员透明，对于给出的[demo](http://isux.tencent.com/wp-content/uploads/2015/12/20151221162207754.html)，开发人员只需要引入js就行了，后续如何初始化，初始化的参数有哪些，开发人员都不用关心。
这也是我设计组件时为何一定要自动初始化的原因。
