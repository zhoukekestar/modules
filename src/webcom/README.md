# Attention!
请使用[riot](http://riotjs.com/)代替。

## 使用组件时可配置属性
* `data-is` 指定使用的组件名称
* `data-bind` 指定组件绑定数据
* `data-bind-show` 时候显示绑定的数据，默认为false，绑定数据的将会被`data-was-hidden-by-webcom`代替

## 创建webcom组件
* `data-register='list'` 在webcom指定注册的名字
* `data-run='template-updated'` 在模板更新后执行的script

```html
<div data-register='list'>
  <script type='text/html' data-role='template'>
    <ul>
      <% list.forEach(function(li) { %>
        <li><%=li%></li>
      <% }) %>
    </ul>
  </script>
  <style>
    .list li {
      color: #f00;
    }
  </style>
  <link rel="stylesheet" href="demo.css">
  <script>
    console.log('This message comes from list.html.')
  </script>
  <script data-run='template-updated'>
    console.log(this, this === webcom);
    console.log('template-updated.');
  </script>
  <script src='demo.js'></script>
</div>
<div data-register='list2'>
  <p>
    hello list2!
  </p>
</div>
```
