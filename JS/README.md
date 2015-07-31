## Edit requirejs.config.js File.
### If your module is AMD module, just add it to "paths" like:
```json
citySelect: 'citySelect/citySelect'
```
then ...over!

### If your module is not AMD module, add it to "paths" like:
```json
jweixin: "_lib/jweixin-1.0.0"
```
 then you should edit "shim" node to add its exports & dependencies like:
```json
jweixin: {
  exports: "wx"
}
```
OR
```json
jqueryCookie: {
  deps: ["jquery"]
}
```


##　Edit Gruntfile.js
* Add your module name (Defined on requirejs.config.js) to namelist.
```js
var namelist =
[
  "jqueryCookie"
];
```
* Add your module's dependencies to excludeList to min module.
```js
var excludeList =
[
  ["jquery"] // jqueryCookie
];
```

## Export your js
```bash
> grunt release
```

### 输出说明
* 需要至少安装node, npm.
* 方法1：安装Grunt，直接使用grunt命令进行输出
* 方法2：使用npm run grunt 命令进行输出
