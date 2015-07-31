If you do not know how to start. See demo at first.<br>
如果怎么操作，先看一下demo样例。

## Edit requirejs.config.js File.

#### CASE 1. AMD module.
* step 1. Just add it to "paths" like:
```json
paths: {
  citySelect : 'citySelect/citySelect'
}
```
* Step 2. Add your exclude list (maybe `jquery`)
```json
_exclude: {
    alertMsg : ['jquery']
}
```

#### CASE 2. NO AMD module.
* Step 1. Add it to "paths" like:
```json
paths: {
  jweixin : "_lib/jweixin-1.0.0"
}
```
* Step 2. Edit `shim` node to add its exports OR dependencies like:
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
* Step 3. Add your exclude list (maybe `jquery`)
```json
_exclude: {
    jqueryCookie : ['jquery']
}
```


## Edit Gruntfile.js
* Step 1. Add your module name (Defined on requirejs.config.js) to namelist & set it true.
```js
var namelist = {
  jqueryCookie: true
};
```

## Export your js.
```bash
> grunt release
```
OR
```bash
> npm run grunt
```

### Export instruction.
* Need node & npm environment at first.
* Method 1: Install npm, then use `grunt` to export.
* Method 2: Use `npm run grunt` to export.

### 输出说明
* 需要至少安装node, npm.
* 方法1：安装Grunt，直接使用`grunt`命令进行输出
* 方法2：使用`npm run grunt`命令进行输出
