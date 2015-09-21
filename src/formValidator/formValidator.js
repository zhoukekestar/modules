(function() {

  var validator = {

    // Form validation: type=[email,number,cellphone]
    type: function(ele, msg) {

      var value = ele.value;

      // @see https://github.com/jzaefferer/jquery-validation/blob/master/src/core.js
      switch (ele.getAttribute("type")) {
        case undefined:
          return "";
        case "hidden":
          return "";
        case "submit":
          return "";
        case "email":
          return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value) ? "" : msg.email;
        case "number":
          return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value) ? "" : msg.number;
        case "cellphone":
          return /^[1][3,4,5,7,8][0-9]{9}$/.test(value) ? "" : msg.cellphone;
        case "integer":
          return /^\d+$/.test(value) ? "" : msg.integer;
        case "url":
          return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value) ? "" : msg.url;
        default:
          return "";
      }

    },
    // Form validation: required.
    required: function(ele, msg) {
      if ( ele.getAttribute("required") && !ele.value )
        return msg.required;
      return "";
    },
    // Form validation: pattern.
    pattern: function(ele, msg) {
      if (!ele.getAttribute("pattern"))
        return "";
      var reg = new RegExp(ele.getAttribute("pattern"));
      return reg.test(ele.value) ? "" : msg.pattern;
    },
    // Form validation: data-equalto=[selector].
    equalto: function(ele, msg) {
      if (!ele.getAttribute("data-equalto"))
        return "";
      var ele = document.querySelector(ele.getAttribute("data-equalto"));
      if (ele && ele.value === ele.value)
        return "";
      return msg.equalto;
    },
    minlength: function(ele, msg) {
      var l = ele.getAttribute('minlength');
      if (!l)
        return "";
      l = +l;
      if (ele.value.length >= l) {
        return "";
      } else {
        return msg.minlength.replace("{1}", l);
      }
    },
    maxlength: function(ele, msg) {
      var l = ele.getAttribute('maxlength');
      if (!l)
        return "";
      l = +l;
      if (ele.value.length <= l) {
        return "";
      } else {
        return msg.maxlength.replace("{1}", l)
      }
    },
    defaultMsg: {
      email: "邮箱地址错误",
      number: "数字格式错误",
      cellphone: "手机号错误",
      integer: "请输入整数",
      url: "请输入正确的网址",
      required: "必须填写",
      pattern: "请输入正确的值",
      equalto: "输入值不同",
      fun: "请输入正确的值",
      minlength: "最小长度为{1}",
      maxlength: "最大长度为{1}"
    }
  }


  var validIt = function() {
    var validMsg = JSON.parse(this.getAttribute('data-validMsg')),
        key,
        msg = {},
        returnMsg;

    for (key in validator.defaultMsg) {
      msg[key] = validator.defaultMsg[key];
    }
    for (key in validMsg) {
      msg[key] = validMsg[key];
    }

    returnMsg =
      // check type
      validator.type(this, msg) ||

      // check required
      validator.required(this, msg) ||

      // check equalto
      validator.equalto(this, msg) ||

      // check pattern
      validator.pattern(this, msg) ||

      // check custom function
      validator.minlength(this, msg) ||

      // check custom function
      validator.maxlength(this, msg);

    return returnMsg;

  }
  var inputHandler = function(target) {

    var namespace = '_';
    var msg = validIt.call(target) || (target[namespace + 'checkValidity'] && target[namespace + 'checkValidity'].call(target));

    if (msg) {
      target[namespace + 'invalid'] = true;
      target[namespace + 'invalidationMessage'] = msg;

      var e = new Event('invalid', {
        bubbles: true
      });
      e.invalidationMessage = msg;
      target.dispatchEvent(e);

    } else {

      target[namespace + 'invalid'] = false;
      target[namespace + 'invalidationMessage'] = '';
    }

    msg = msg || '';
    return msg;
  }

  /**
   * Event bind
   */
  // document.body.addEventListener('blur', function(e) {
  //   inputHandler(e.target);
  // })

  // document.body.addEventListener('input', function(e) {

  //     inputHandler(e.target);

  // });

  document.body.addEventListener('submit', function(e) {
    var inputs = [].slice.apply(e.target.querySelectorAll('input, textarea'));
    var isValid = true;

    for (var i = 0, max = inputs.length; i < max; i++) {
      inputHandler(inputs[i]) === '' || (isValid = false);

      if (!isValid)
        break;
    }

    if (!isValid) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

}());
