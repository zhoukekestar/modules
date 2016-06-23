## 代码块与取值
* `<% console.log('code'); %>` 使用`<%`和`%>`将js代码包裹，类似EJS
* `<%="code"%>` 使用`<%=%>`将值输出

## 注释
* 使用`<!--  comments  -->`注释
* 使用`/* */`注释

## 引用根对象
* `obj` 使用`obj`引用当前传入对象

## _updateBy(data)
用于更新指定位置的html

## _appendBy(data)
用于指定位置后添加相应的html

## _htmlBy(data)
用于直接输出模板html

## `data-holder`及`_holder`
* `data-holder` 指定元素data-holder属性（元素选择器），来指定模板生成后的插入位置
* `_holder` 对元素的_holder赋值元素，来指定模板生成后的插入位置

## 事件监听
* `reload` 重新初始化所有template元素，已初始化完成将跳过
* `template-reload` 重新初始化所有template元素，已初始化完成将跳过
* `template-reload-it` 在template元素上分发`template-reload-it`事件，将重新初始化该元素
