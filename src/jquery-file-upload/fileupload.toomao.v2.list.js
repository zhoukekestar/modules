(function($){
	$.fn.toomaoUploadList = function(option){
		var defaults = {
			submit:		"submit", 
			hadPics:	[],
			done:		function(d){},
			afterDel:	function(d){},
			running:	function(){},
			height:		110,
            width:		110
		}
		var settings = $.extend(defaults, option); 
		
		var $this = $(this);
   		
		// 对控件进行初始化
		$this.html('<div class="filupload-list-add fileupload-warp" style="float:left; margin-left:10px;"><!-- 这个是虚拟的加号，负责点击后添加一个上传按钮，本身不能上传文件 --></div>');
   		$this.children(".filupload-list-add")
   				.wrap('<div style="overflow-x: scroll;overflow-y: hidden;height: 130px;"></div>')
   				.wrap('<div class="fileupload-list" style="height:100px;"></div>');
   			
   		// 获得上传图片的总张数
   		function getTotalNum()
   		{
   			return $this.find(".fileupload-list-item").length;
   		}
   		
   		// 获得上传图片的已上传数
   		function getOkNum()
   		{
   			return $this.find(".progress-done").length;
   		}
   		
   		// 但操作完后的函数
   		// 上传张数和总张数相等会回调options.done函数
   		function allDone()
   		{
   			var total = getTotalNum();
   			var ok	 = getOkNum();
   			
   			if (total == ok)
   			{
   				var urls = new Array();
   				$this.find("input.fileupload").each(function(index){
   					urls[index] = $(this).attr("href");
   				});
   				settings.done(urls);
   			}
   		}
   		// 执行删除操作的的函数
   		function afterDelOne()
   		{
   			$this.find(".fileupload-list-item").each(function(){
   				var html = $(this).html();
   				if (html.trim().length == 0)
   					$(this).remove();
   			});
   			changeLength();
   			settings.afterDel();
   		}
   		
   		// 点击上传按钮时，单独判断
   		$("#" + settings.submit).click(function(){
   			allDone();
   		});
   		
   		
   		function isFull()
   		{
   			var isfull = true;
			$this.find(".fileupload-list .fileupload-list-item .fileupload-warp").each(function(){
				if (!$(this).hasClass("fileupload-done"))
				{
					isfull = false;
				}
			});
			return isfull;
   		}
   			
   		// 点击添加按钮时，需要自动生成一个上传按钮
		$this.find(".filupload-list-add").click(function(){
			
			if (!isFull())
			{
				alert("您还有一个空余的位置选择。");
				return;
			}
			
			var tempid = $.tools.generateMixed(10);
			template = '<div class="fileupload-list-item" style="float:left;margin-left: 10px;" id="'+tempid+'"></div>';
			$(this).before(template);
			
			$("#" + tempid).toomaoUpload({
	            submit: settings.submit,
	            addListener:false,
	            single: false,
	            done: function(){
	            	allDone();
	            },
	         	afterDel:function()
	            {
	         		afterDelOne();
	            },
	            height:settings.height,
	            width:settings.width,
	            running:function(d){
	            	settings.running(d, tempid);
	            }
	        });
			changeLength();
			$("#" + tempid).find("input.fileupload").click();
		});
		
		// 当列表插入一个上传框时，需要将改变长度
		$this.find(".fileupload-list").change(function(){
			changeLength();
		});
		
		// 调整上传列表长度
		function changeLength()
		{
			var len = $this.find(".fileupload-list .fileupload-list-item").length;
			var len = len * 110 + 120;
			$this.find(".fileupload-list").css({"min-width": len + "px"});
			$this.find(".fileupload-list").parent().scrollLeft(len);
		}
		
		// 添加已有的图片至列表
		(function(){
			var pics = settings.hadPics;
			var $addEle = $this.find(".filupload-list-add");
			for (var i = 0; i < pics.length; i++)
			{
				
				var tempid = $.tools.generateMixed(10);
				template = '<div class="fileupload-list-item" style="float:left;margin-left: 10px;" id="'+tempid+'"></div>';
				$addEle.before(template);
				
				$("#" + tempid).toomaoUpload({
		            addListener:false,
		            single: false,
		            hadPic:pics[i],
		            afterDel:function()
		            {
		         		afterDelOne();
		            },
		        });
			}
			changeLength();
		})();
	}
})(jQuery);