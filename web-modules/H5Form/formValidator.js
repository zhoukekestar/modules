/* ========================================================================
 * web-modules: jquery.form.js v1.0.0
 * ========================================================================
 * Copyright 2014-2015 zhoukekestar.
 * ======================================================================== */


;define(["alertMsg"], function($){
	var validator = {

		// Form validation: type=[email,number,cellphone]
		type: function(ele){

      var value = $(ele).val();
      var msg = validator.msg;
      switch ($(ele).attr("type")){
        case undefined    : return "";
        case "email"      : return /email/.test(value) ? "" : msg.email;
        case "number"     : return /-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?/.test(value) ? "" : msg.number;
        case "cellphone"  : return /^[1][3,4,5,7,8][0-9]{9}$/.test(value) ? "" : msg.cellphone;
        case "integer"    : return /^\d+$/.test(value) ? "" : msg.integer;
        case "url"        : return /url/.test(value) ? "" : msg.url;
        default           : return "";
      }

		},
		// Form validation: required.
		required: function(ele){
			if (
				($(ele).attr("required") !== undefined) &&
				($(ele).val() === null || $(ele).val() === undefined || $(ele).val() === "")
			   )
				return validator.msg.required;
			return "";
		},
		// Form validation: pattern.
		pattern: function(ele){
			if ($(ele).attr("pattern") === undefined)
				return "";
			var reg = new RegExp($(ele).attr("pattern"));
			return reg.test($(ele).val()) ? "" : validator.msg.pattern;
		},
		// Form validation: data-equalto=[selector].
		equalto: function(ele){
			if ($(ele).data("equalto") === undefined)
				return "";
			if ($($(ele).data("equalto")).val() === $(ele).val())
				return "";
			return validator.msg.equalto;
		},
		// Form validation: data-func=[func].
		func: function(ele){
			if ($(ele).data("func") === undefined)
				return "";
			else
			{
				var func = validator[$(ele).data("func")];
				return func(ele);
			}
		},
    msg: {
      email: "邮箱地址错误",
      number: "数字格式错误",
      cellphone: "手机号错误",
      integer: "请输入整数",
      url: "请输入正确的网址",
      required: "必须填写",
      pattern: "请输入正确的值",
      equalto: "输入值不同",
      fun: "请输入正确的值"
    },
    error: function(){

    },
    success: function() {

    },
    validForm: function(ele) {
      var msg = "";
      $(ele).find("input[type!='hidden']").each(function(){
        var tempMsg;
        var ele = $(this)[0];

        if (msg !== "") return;

        // check type
        tempMsg = validator.type(ele);
        tempMsg !== "" ? (msg = tempMsg) : "";

        // check required
        tempMsg = validator.required(ele);
        tempMsg !== "" ? (msg = tempMsg) : "";

        // check equalto
        tempMsg = validator.equalto(ele);
        tempMsg !== "" ? (msg = tempMsg) : "";

        // check pattern
        tempMsg = validator.pattern(ele);
        tempMsg !== "" ? (msg = tempMsg) : "";

        // check custom function
        tempMsg = validator.func(ele);
        tempMsg !== "" ? (msg = tempMsg) : "";

      })

      return msg;
    },
    extend: function(name, func) {
      validator[name] = func;
    }
	};

	return validator;
});
