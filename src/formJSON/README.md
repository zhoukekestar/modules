## 指定formJSON
使用`data-role='formJSON'`指定formJSON，action和method属性与form类似

## formJSON属性
* `action` 发送请求url
* `method` 表示发送请求方法，默认使用POST，可选值为POST，GET，PUT，DELETE
* `data-target` 传入元素选择器，表示当前的所有处理函数将由目标元素处理（包括onended, _data, onerror）
* `timeout` 数字，表示超时时间，默认为20s

## onended(response, xhr)
onended方法将在form表单异步提交后，成功返回时调用，返回参数
##### Parameters
* `response` AJAX请求返回的response，json格式
* `xhr` AJAX请求对象


## _data(data) -> data
在数据发送之前，可自行再次处理请求的数据
##### Parameters
* `data` 框架自动生成的data对象

##### Returns
* `data` 处理后的data，返回null时，当前请求将会取消


## onerror(xhr)
在请求发生错误执行，即当前AJAX请求的HTTP-Code不是20x
##### Parameters
* `xhr` AJAX请求对象


## _beforeSend(xhr)
在请求发送之前，再次处理AJAX请求信息
##### Parameters
* `xhr` AJAX请求对象

## _done(xhr)
在请求完成后，优先处理xhr
##### Parameters
* `xhr` AJAX请求对象
##### Returns
* `null` 将跳过接下来的onended和onerror方法
* `object` 改写后的xhr对象


## 字段属性扩展
* `key1.key2` 点语法，在属性之间，表示构建一个object对象，如`<input name='a.b' value='v'/>`将输出`{"a" : { "b" : "v" } }`
* `key1.` 点语法，在属性末尾，表示构建一个数组对象，如`<input name='a.' value='v' />`将输出 `{"a" : [ "v" ]}`
* `:bool或:boolean` 表示输出bool类型的数据
* `:number` 表示输出number类型数据
* `:object` 表示以object解析值
* `:datetime` 表示用时间输出时间戳
* `:date` 表示用日期解析输出时间戳

## 事件
* `formJSON-submit`&`submit` 当表单提交时，触发该事件
* `formJSON-ended` 请求正常返回时触发，具体的请求的信息，可查看`target._XMLHttpRequest`
* `formJSON-error` 请求发生错误时触发，具体的请求的信息，可查看`target._XMLHttpRequest`
