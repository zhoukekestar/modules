/* ========================================================================
 * web-modules: jquery.form.js v1.0.0
 * ========================================================================
 * Copyright 2014-2015 zhoukekestar.
 * ======================================================================== */


;define(["alertMsg"], function($){
	var validator = {

		// Form validation: type=[email,number,cellphone]
		type: function(ele, msg){

      var value = $(ele).val();

      // @see https://github.com/jzaefferer/jquery-validation/blob/master/src/core.js
      switch ($(ele).attr("type")){
        case undefined    : return "";
        case "email"      : return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value) ? "" : msg.email;
        case "number"     : return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value) ? "" : msg.number;
        case "cellphone"  : return /^[1][3,4,5,7,8][0-9]{9}$/.test(value) ? "" : msg.cellphone;
        case "integer"    : return /^\d+$/.test(value) ? "" : msg.integer;
        case "url"        : return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value) ? "" : msg.url;
        default           : return "";
      }

		},
		// Form validation: required.
		required: function(ele, msg){
			if (
				($(ele).attr("required") !== undefined) &&
				($(ele).val() === null || $(ele).val() === undefined || $(ele).val() === "")
			   )
				return msg.required;
			return "";
		},
		// Form validation: pattern.
		pattern: function(ele, msg){
			if ($(ele).attr("pattern") === undefined)
				return "";
			var reg = new RegExp($(ele).attr("pattern"));
			return reg.test($(ele).val()) ? "" : msg.pattern;
		},
		// Form validation: data-equalto=[selector].
		equalto: function(ele, msg){
			if ($(ele).data("equalto") === undefined)
				return "";
			if ($($(ele).data("equalto")).val() === $(ele).val())
				return "";
			return msg.equalto;
		},
    minlength: function(ele, msg){
      var l = $(ele).attr('minlength');
      if (l === undefined)
        return "";
      l = Number(l);
      if ($(ele).val().length >= l) {
        return "";
      } else {
        return msg.minlength.replace("{1}", l);
      }
    },
    maxlength: function(ele, msg){
      var l = $(ele).attr('maxlength');
      if (l === undefined)
        return "";
      l = Number(l);
      if ($(ele).val().length <= l) {
        return "";
      } else {
        return msg.maxlength.replace("{1}", l)
      }
    },
		// Form validation: data-func=[func].
		func: function(ele, msg){
			if ($(ele).data("func") === undefined)
				return "";
			else
			{
				var func = validator[$(ele).data("func")];
				return func(ele, msg);
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
    },
    error: function(ele){
      if ($(ele).parents('.form-group').length === 0) {
        $(ele).removeClass('has-success').addClass('has-error');
      } else {
        $(ele).parents('.form-group').removeClass('has-success').addClass('has-error');
      }
    },
    success: function(ele) {
      if ($(ele).parents('.form-group').length === 0) {
        $(ele).removeClass('has-error').addClass('has-success');
      } else {
        $(ele).parents('.form-group').removeClass('has-error').addClass('has-success');
      }
    },
    validForm: function(ele) {
      var returnMsg = "";

      $(ele).find("input[type!='hidden'], textarea").each(function(){
        var msg = $.extend({}, validator.defaultMsg, $(this).data('msg'));
        var tempMsg;
        var ele = $(this)[0];

        if (returnMsg !== "") return;

        // check type
        tempMsg = validator.type(ele, msg);
        if (tempMsg !== "") {
          returnMsg = tempMsg;
          validator.error(ele)
          return;
        }

        // check required
        tempMsg = validator.required(ele, msg);
        if (tempMsg !== "") {
          returnMsg = tempMsg;
          validator.error(ele)
          return;
        }

        // check equalto
        tempMsg = validator.equalto(ele, msg);
        if (tempMsg !== "") {
          returnMsg = tempMsg;
          validator.error(ele)
          return;
        }

        // check pattern
        tempMsg = validator.pattern(ele, msg);
        if (tempMsg !== "") {
          returnMsg = tempMsg;
          validator.error(ele)
          return;
        }

        // check custom function
        tempMsg = validator.func(ele, msg);
        if (tempMsg !== "") {
          returnMsg = tempMsg;
          validator.error(ele)
          return;
        }

        // check custom function
        tempMsg = validator.minlength(ele, msg);
        if (tempMsg !== "") {
          returnMsg = tempMsg;
          validator.error(ele)
          return;
        }

        // check custom function
        tempMsg = validator.maxlength(ele, msg);
        if (tempMsg !== "") {
          returnMsg = tempMsg;
          validator.error(ele)
          return;
        }

        validator.success(ele);

      })

      return returnMsg;
    },
    extend: function(name, func) {
      validator[name] = func;
    }
	};

	return validator;
});
