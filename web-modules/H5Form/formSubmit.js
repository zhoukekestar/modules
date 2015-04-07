
!define(["formValidator"], function(validInput){
    // Form submit util function
    $.fn.formSubmit = function(o){

        // ---Default Setting.---
        var options = {
            type: "post",
            url: "",
            dataType:"jsonp",
            async: true,
            data: "",
            success: function(d){

                // specfic code
                if (d.code != undefined && d.code == 0)
                    options.afterSuccess(d);
            },
            afterSuccess:function(d){},
            error: function(d){$.alertMsg(d.status + " 网络错误");},
            proxy: ""
        };

        // Before submit form, valid this form.
        var validOK = true;
        $(this).find("input").each(function(){

            var temp = validInput(this);
            if (temp == false)
                validOK = false;

        });
        if (!validOK){
            $.alertMsg("请正确填写表单");
            return;
        }

        // Get first selected form
        var firstForm = $(this)[0];


        // ---Form Setting.---
        // Get first selected form's data, set its value to options.
        // 1. data-method
        // 2. data-action
        // 3. data-data-type
        // 4. data-async
        // 5. data-proxy
        if ($(firstForm).attr("method") != undefined) 		options.type 	= $(firstForm).attr("method");
        if ($(firstForm).attr("action") != undefined) 		options.url 	= $(firstForm).attr("action");
        if ($(firstForm).data("data-type") != undefined)	options.dataType = $(firstForm).data("data-type");
        if ($(firstForm).data("async") != undefined) 		options.async 	= $(firstForm).data("async");
        if ($(firstForm).data("proxy") != undefined)		options.proxy	= $(firstForm).data("proxy");
        // Get form's data
        options.data = $(this).serialize();

        // ---The User Setting.---
        // The input options(o) is primary!!
        if (typeof o == "function") {
            options = $.extend(options, {
               success: o
            });
        } else {
            options = $.extend(options, o);
        }


        if (options.proxy == undefined || options.proxy == "") {
            $.ajax({
                type 	: options.type,
                url 	: options.url,
                dataType: options.dataType,
                async 	: options.async,
                data	: options.data,
                success : options.success,
                error 	: options.error
            });
        } else {

            // If use proxy
            // POST to proxy
            $.ajax({
                type 	: "POST",
                url 	: options.proxy,
                dataType: options.dataType,
                async 	: options.async,
                data	: {
                    //"proxy": encodeURIComponent(options.url + "?" + options.data)
                    "proxy": options.url + "?" + options.data
                },
                success : options.success,
                error 	: options.error
            });
        }

    };

    return $.formValidator.init;
});