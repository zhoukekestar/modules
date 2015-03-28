$(function () {

    function getObjectURL(file) {
        var url = null;
        if (window.createObjectURL != undefined) { // basic
            url = window.createObjectURL(file);
        } else if (window.URL != undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file);
        }
        return url;
    }

    $.fn.toomaoUpload = function (options) {
        var def = {
        	hadPic:		"",
            single: 	true,//当该值为true时，删除当前input将会自动重新创建一个新的input
            addListener:true,//当该值为true时，会额外监听上传按钮的click事件
            submit: 	"submit",
            done: 		function(){},
            afterDel:	function(){},
            running:	function(){},
            notDoneButClick:function(){},
            height:		110,
            width:		110
        };
        options = $.extend(def, options);

        // 当前div是否设置默认值
        if (options.hadPic != "")
        {
        	var picurl = options.hadPic;
        	$(this).html($.fn.toomaoUpload_template(picurl));
        }
        else
            $(this).html($.fn.toomaoUpload_template());
        
        
        // 从服务器端获取json配置
        var jsonConfig = undefined;
        if (jsonConfig == undefined)
            $.ajax({
                url: "/toomao/uploadConfig",
                data: {
                    "id": "20140917"
                },
                success: function (json) {
                    jsonConfig = json;
                },
                dataType: "json",
                async: false
            });
        // 当前div
        var $this = $(this);
        // 该父级为input的父级
        var $parent = $(this).find(".fileupload-warp");
        
        // 当选择完图片，将当前图片显示到网页上，并将其调整位置为居中
        $parent.find("input.fileupload").change(function () {
        	 $.fn.toomaoUpload_imgadjust($parent, this);
		});

        function delPic()
        {
            if (confirm("确定删除吗？"))
            {
                $parent.remove();
                // 当为单个上传的时候，需要重新初始化
                if (options.single)
                {
                    $("#" + options.submit).unbind("click");
                    options = $.extend(options,{hadPic:""});
                    $this.toomaoUpload(options);
                }
                options.afterDel();
            }
        }
        // 长按图片触发的事件
        $parent.bind( "taphold", function(event){
        	delPic();
        });
        
        $parent.find(".pic-del").click(function(){
           delPic(); 
        });
        
        
        // 绑定submit的click事件，已经上传的图片，或者已经有的图片
        if (options.addListener)
        {
        	 $("#" + options.submit).click(function () {
             	if ($parent.children(".progress").hasClass("progress-done"))
             		options.done($parent.children("input.fileupload").attr("href"));
             	else
             		options.notDoneButClick();
             });
        }
       
        
        
        // 图片上传主程序代码，通过jquery file upload上传
        if (options.hadPic == "")
        {
        	$parent.find("input.fileupload").fileupload({
        		url: jsonConfig.uploadUrl + "?height=" + options.height + "&width=" + options.width,
        		dataType: 'json',
        		add: function (e, data) {
        			$("#" + options.submit).click(function () {
        				if (!$parent.children(".progress").hasClass("progress-done"))
        					data.submit();
        			});
        		},
        		done: function (e, data) {
        			$.each(data.result.files, function (index, file) {
        				file = jsonConfig.visitUrl + file;
        				
        				$parent.children(".progress").css("width", "100%");
        				$parent.children(".progress").addClass("progress-done");
        				$parent.children("input.fileupload").attr("href", file);
        				options.done(file);
        			});
        		},
        		progressall: function (e, data) {
        			var progress = parseInt(data.loaded / data.total * 100, 10);
        			
        			options.running(progress);
        			progress = (100 - progress);
        			$parent.children(".progress").css("width", progress + "%");
        			progress = progress / 100 * 0.5;
        			
        			$parent.children(".progress").css("background-color", "rgba(107, 107, 107, "+ progress+")");
        		}
        		
        	});  
        }
    }
    
    $.fn.toomaoUpload_template = function(pic)
    {
        var template = "";
        if (pic == undefined)
        {
            // input template
        	template = '<input data-role="none" class="fileupload" id="'+ $.tools.generateMixed(10) +'" formenctype="multipart/form-data" type="file" name="files[]">';
        	//add pro span
        	template = '<span data-role="none" class="progress"></span>' + template;
        	// add del span
        	
        	template = template + '<span class="pic-del">删除</span>';
        	// add warp div
        	template = '<div data-role="none" class="fileupload-warp">' + template + '</div>';
        }
    	else
    	{
    	    // input template
    	    template = '<input data-role="none" class="fileupload" id="'+ $.tools.generateMixed(10) +'" formenctype="multipart/form-data" type="file" name="files[]" href="' + pic + '">';
            // add pro span
            template = '<span data-role="none" class="progress progress-done" style="width: 100%; background-color: rgba(107, 107, 107, 0);"></span>' + template;
            // add del span
            template = template + '<span class="pic-del">删除</span>';
            // add warp div
            template = '<div data-role="none" class="fileupload-warp fileupload-done" style="background-image: url('+ pic + '); background-size: 100%; ">' + template + '</div>';
    	}
        return template;
    }
    
    $.fn.toomaoUpload_imgadjust = function($parent,$this)
    {
    	$parent.children(".progress").css("width", "100%");
        var imgsrc = getObjectURL($this.files[0]);
        var img = new Image();
        img.src = imgsrc;
        img.onload = function()
        {
        	$parent
        	.css("background-image", "url('" + imgsrc + "')")
     		.addClass("fileupload-done");
        	
        	var imgH = img.height;
        	var imgW = img.width;
        	// 当图片比较长的时候
        	if (imgW > imgH)
        	{
        		imgH = 100 * imgH / imgW;
        		$parent
            	.css("background-size", "100px "+ imgH + "px");
        		imgH = (100 - imgH)/2;
        		$parent
            	.css("background-position-y", imgH + "px");
        	}
        	// 当图片比较高的时候
        	else
        	{
        		imgW = 100 * imgW / imgH;
        		$parent
            	.css("background-size",  imgW + "px 100px");
        		imgW = (100 - imgW)/2;
        		$parent
            	.css("background-position-x", imgW + "px")
        	}
        	
        };
    }
    
    $.fn.toomaoUpload_url = function () {
        
        return $(this).find("input.fileupload").attr("href");
    }
});