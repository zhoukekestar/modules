## How-to export my moduels
* Edit `css.config.json`
* Edit `require.config.js`
* Edit `Gruntfile.js` to select the module which you want to export.
* cmd & run `> npm install `
* cmd & run `> grunt `

## src keywords
* alert confirm prompt, 增强游览器原生显示
* alert message, 显示消息
* city select, 城市选择, 多级联动
* checkbox, like, radio, 选择框, 赞, iOS开关
* load page, single page, web application, 加载页面, 单页面应用
* simple paging, 简单分页
* pull to refresh, pull to load, load more, 下拉刷新, 下拉加载
* rich text editor, ueditor for nodejs, 富文本编辑器, 百度ueditor
* simple upload, 简单的上传（基于jquery-fileupload）, 简化上传代码

## src
* 模块源码，代码都是模块化的，
* 一个一个看就行，会比较轻松，不需要一下全看懂。
* 看懂了怎么用后，有空写点说明？写个demo？补充一下？
* 发现bug，提交一下，讨论一下？

## 留言
* 建议看一下[这篇文章](http://isux.tencent.com/half-package-web-components-for-design.html)，非常好

## 想法
<pre>
  1、对框架的看法：
    前端的js框架多种多样，最流行的莫过于angularjs和react了，还有kissy，YUI（有点走下坡路呢），不过，我觉得，这种框架都是对原有html标准的破坏，比如react有自己的jsx语法（虽然和html类似，但和标准相去甚远），还有angularjs有自己的好多属性，比如ng-app,ng-model之类的。
    不得不承认，学习任何框架都是有成本的，但前段框架变化又太过于频繁，这学习成本更是沉重。
    我一直都不太喜欢框架，更倾向于js模块和组件（有点工具类的感觉，要用到什么，就加载什么），是那种低耦合，不依赖于框架本身的模块和组件，不是那种基于react、kissy的模块或组件，而是能够直接拿来就能在游览器上跑的组件（当然，可能会依赖requirejs等模块加载工具）

  2、对js标准的看法：
    我希望我编写js代码的时候，我能“正常的编码”，而不考虑各种兼容。比如，我会写一个`event.js`：

    当`navigator.appVersion.indexOf("MSIE 8") !== -1`的时候会执行
    ```js
    Element.prototype.addEventListener = function (name, callback) {
      this.attachEvent('on' + name, callback);
    }
    ```
    去兼容IE8，然后其他地方，我就“正常”地编码了，直接写addEvnetListener就行，不用考虑兼容。而不是像其他人一样，写一个addEvent方法，然后其他模块都调用addEvent方法，不用标准的addEventListener方法，我总感觉addEvent方法是多余的，感觉有点“污染环境”。

    再比如，相对ajax方法，我会写一个
    ```js
    if (!window.XMLHttpRequest) {
      window.XMLHttpRequest = function() {
        return new ActiveXObject('Microsoft.XMLHTTP');
      }
    }
    ```
    而其他人会去写一个ajax方法，然后其他模块都调用ajax方法去使用ajax，不用W3C的标准方法new XMLHttpRequest().

    我希望能正常编写，而不正常的游览器加载一些脚本，把不正常磨平就行了。
    我不知道这样的编码方式好不好，这是我想问的。因为我看到的所有的框架，包括大牛的编码不是这样的。都是添加一个额外的方法，然后把标准放一边，而我是想把标准通过兼容脚本而把“标准”成为“标准”。

  3、对css标准的看法：
    我希望我编写css的时候，我也能正常编码，而不靠各种兼容，这跟js的思想是一样的
    比如我会写formValidator.js，去支持各种其他游览器不支持的属性，然后我就可以这样写了
    &lt;input name="abc" placeholder="6个字符" value="123456" pattern="^[0-9]{6}$"&gt;
    &lt;input name="abc" value="123456" required minlength="6" maxlength="10"&gt;

    有些情况，我甚至会增强一些属性（这和标准有些出入，但也无奈之举，有些时候W3C的标准跟不上需求的变化，所以就。。。。）
    &lt;input type="email" name="emial" placeholder="email" data-msg='{"email":"emial格式错了啦"}'&gt;

  4、对标准增强的看法：
    对原有标准的增强，但不破坏原有系统的api，一般情况，想要加功能，就应该添加一个方法，而我不这么想，任何库、组件，如果学习曲线越陡，越容易被抛弃，
    所以，我想扩展原有系统的api，当然，对于不知情的情况下，不能对他们的代码造成不必要的困扰，所以要兼容原有系统的api

    比如：对于系统的alert方法，添加一个参数用于增强效果展示
      ```js
      var _alert = window.alert;
      window.alert = function(msg, option) {/* Code here*/}
      ```
      1）简单调用，没有额外的代码块需要执行的情况下。调用`alert('your message', false)`函数直接调用即可，后面的false参数表示不使用系统原生的弹出框
      2）alert后还有代码块需要执行，使用`alert('your message', callback-function)`，在callback-function中加入需要执行的代码（同步实现不了，只能callback了）
      效果大概是这样的：
    https://github.com/zhoukekestar/modules/blob/master/src/alert/demo.gif
</pre>
