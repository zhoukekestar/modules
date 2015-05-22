/* ========================================================================
 * web-modules: jquery.form.js v1.0.0
 * ========================================================================
 * Copyright 2014-2015 zhoukekestar.
 * ======================================================================== */


;define(["alertMsg"], function($){
	var validFunc = {
		// Form validation: type=[email,number,cellphone]
		type: function(ele){
			if ($(ele).attr("type") == undefined)
				return true;
			var t = $(ele).attr("type");
			var reg;
			if (t === "email")
				reg = /((([a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?/;
			else if (t === "number")
			{
				if ($(ele).val() === "") return false;
				reg = /-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?/;
			}
			else if (t === "cellphone")
				reg = /^[1][3,4,5,7,8][0-9]{9}$/;
			else if (t === "integer")
				reg = /^\d+$/;
			else if (t === "url")
				reg = /(https?|ftp):\/\/(((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?/;
			else
				reg = /^.*$/;
			return reg.test($(ele).val());
		},
		// Form validation: required.
		required: function(ele){
			if (
				($(ele).attr("required") !== undefined) &&
				($(ele).val() === null || $(ele).val() === undefined || $(ele).val() === "")
			   )
				return false;
			return true;
		},
		// Form validation: pattern.
		pattern: function(ele){
			if ($(ele).attr("pattern") === undefined)
				return true;
			var reg = new RegExp($(ele).attr("pattern"));
			return reg.test($(ele).val());
		},
		// Form validation: data-equalto=[selector].
		equalto: function(ele){
			if ($(ele).data("equalto") === undefined)
				return true;
			if ($($(ele).data("equalto")).val() === $(ele).val())
				return true;
			return false;
		},
		// Form validation: data-func=[func].
		func: function(ele){
			if ($(ele).data("func") === undefined)
				return true;
			else
			{
				var func = validFunc[$(ele).data("func")];
				return func(ele);
			}
		},
		// Show Error message
		error: function(ele, msg){

			$(ele).removeClass("has-success").addClass("has-error").find(".input-tooltip").html(msg).show();
		},
		// Show Success message
		success: function(ele){
			$(ele).removeClass("has-error").addClass("has-success").find(".input-tooltip").hide();
		}
	};
	$.formValidator = {};
	$.formValidator.addMethod = function(name, func)
	{
		validFunc[name] = func;
	};

	// Form validation.
	function validInput(ele){
		var group = $(ele).parents(".form-group")[0];
		// required
		if (!validFunc.required(ele))
		{
			validFunc.error(group, "必须填写");
			return false;
		}

		// type
		// pattern
		// equalto
		// func
		if (!validFunc.type(ele) ||
			!validFunc.pattern(ele) ||
			!validFunc.equalto(ele) ||
			!validFunc.func(ele))
		{
			var msg = $(ele).data("msg-err");
			if (msg === undefined)
				validFunc.error(group, "请输入正确的值");
			else
				validFunc.error(group, msg);
			return false;
		}

		validFunc.success(group);
		return true;
	}

	// Form validation init.
    $.formValidator.init = function() {
        $("form[data-role='H5Form']").find("input[type!='hidden']").each(function () {
            // Get group
            var group = $(this).parents(".form-group")[0];

            //Add input-tooltip
            $(group).append("<span class='input-tooltip'></span>");

            // hide
            $(group).find(".input-tooltip").hide();

            // valid
            $(this).blur(function () {
                validInput(this);
            });
        });
    }

	return validInput;
});
