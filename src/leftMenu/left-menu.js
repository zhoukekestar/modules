;(function(factory){
	if (typeof define === 'function' && define.amd) {
	    define([ 'jquery' ], factory);
	} else {
	    factory(jQuery);
	}
}(function($){
    $.fn.leftMenu = function(options)
    {
        options = $.extend({
            "iframe":""
        }, options);
        
        $this = $(this);
        
        // 添加右箭头
        $this.find("span strong").addClass("triangle-right");
        // 隐藏子菜单
        $this.find(".has-sub .sub-menu").hide();
        
        /*含有子菜单的时候，显示隐藏子菜单*/
        $this.find(".main-menu .has-sub span").click(function(){
        	var s = $(this).next("ul.sub-menu").css("display");
    		// 改变箭头方向
        	if(s == "none"){
    			$(this).find("strong").removeClass("triangle-right").addClass("triangle-down");
    		}else{
    			$(this).find("strong").removeClass("triangle-down").addClass("triangle-right");
    		}
    		$(this).next(".sub-menu").slideToggle();
        });
        
        /*一级菜单点击的时候*/
        $this.find(".main-menu .no-sub").click(function(){
            $(options.iframe).attr("src", $(this).data("url"));
            
            $this.find(".main-menu .no-sub, .sub-menu li").removeClass("sub-active main-active");
            $(this).addClass("main-active");
        });
        
        /*二级子菜单点击的时候*/
        $this.find(".sub-menu li").click(function(){
            $(options.iframe).attr("src", $(this).data("url"));
            
            $this.find(".main-menu .no-sub, .sub-menu li").removeClass("sub-active main-active");
            $(this).addClass("sub-active");
        });
        
        //获取url中的特定参数
        function getParams(name) {
        	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        	var r = window.location.search.substr(1).match(reg);
        	if (r != null)
        		return unescape(r[2]);
        	return null;
        }
        
        // 根据页面传递的p的参数，将从左导航中选取菜单
        var p = getParams("p");
        if (p != null)
        {
            $this.find(".main-menu .no-sub, .sub-menu li").each(function(index){
                if (p == index)
                {
                    $(this).click();
                    if ($(this).parent().hasClass("sub-menu"))
                        $(this).parent().prev().click();
                    return;
                }
            });
        }
        
    };
    
}));
