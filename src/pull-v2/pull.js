//
;( function( factory ) {
	if ( typeof define === "function" && define.amd ) {
		define("pullUp", [ "jquery" ], factory );
	} else {
		factory( jQuery );
	}
}(function($){
			
	$.fn.pullUp = function(callback){
		var eleH = $(this)[0].offsetTop,
			winH = $(window).height(),
			loading = false,
			$this = $(this);

		// 监听滚动事件
		$(window).scroll(function(){

			if ($(window).scrollTop() + winH >= eleH && loading == false)
			{
				loading = true;
				callback($this, function(){						
					loading = false;
					eleH = $this[0].offsetTop;
				});
			}
		});
		
		// 但正在加载，却没有加载成功的时候，可以通过定时函数来保证再次加载
		setInterval(function(){
			
			if ($(window).scrollTop() + winH >= eleH && loading == false)
			{
				loading = true;
				callback($this, function(){						
					loading = false;
					eleH = $this[0].offsetTop;
				});
			}
			
		}, 500);
	}
	
	return $;
}));


;( function( factory ) {
	if ( typeof define === "function" && define.amd ) {
		define("pullDown", [ "jquery" ], factory );
	} else {
		factory( jQuery );
	}
}(function($){
$.fn.pullDown = function(options){
	
	options = $.extend({
		status: ["tip", "ready", "loading"],
		pullDown: ".pull-down-fresher",
		addTransition: {
			"transition": "top 1s",
			"-webkit-transition": "top 1s",
		},
		zIndex: 99,
		removeTransition: {
			"transition": "",
			"-webkit-transition": ""
		},
		tipH: 10,
		readyH: 130,
		loadingH: 80,
		loading: function(callback){callback();}
	}, options);
	
	var o = null, // original point
		$this = $(this),
		draging = false,
		c; // current point
		
	
	$(this)
		.bind("touchstart", function(e){
			
		
			// 删除过渡效果，下拉过程中，下拉多少距离要实时响应，不能有过渡效果
			$this.find(options.pullDown).css(options.removeTransition);
			o = {
				X: e.originalEvent.touches[0].clientX,
				Y: e.originalEvent.touches[0].clientY,
				
				// 只取第一次的值，第一次是最正确的，以免由于多次触碰而导致 值的改变
				oX: o == null ? $this.find(options.pullDown)[0].offsetLeft : o.oX,
				oY: o == null ? $this.find(options.pullDown)[0].offsetTop : o.oY
			};
			
			// 只有当窗口在顶部的时候，才能拖动
			if ($(window).scrollTop() == 0)
			{
				draging = true;
			}
			
		})
		.bind("touchmove", function(e){
			
			c = {
				X: e.originalEvent.touches[0].clientX,
				Y: e.originalEvent.touches[0].clientY,
			}
			
			// 符合拖动条件，则进行css处理
			if (draging == true)
			{
				try{
					// 如果是下拉的，阻止默认行为
					if (c.Y > o.Y)
						e.preventDefault();
					
					// 下拉高度达到相应高度，显示ready状态
					if (c.Y - o.Y > options.readyH) {
						
						$this.find(options.pullDown)
						.removeClass(options.status[0] + " " + options.status[2])
						.addClass(options.status[1]);
						
					// 下拉高度达到相应高度的，显示tip状态
					} else if (c.Y - o.Y > options.tipH) {
						$this.find(options.pullDown)
						.removeClass(options.status[1] + " " + options.status[2])
						.addClass(options.status[0]);
					}
					
					// 实时改变当前的高度 ，大块div移动的性能极差
					/*$this.css({
						top: (c.Y - o.Y + o.oY) + "px",
					});*/
					
					$this.find(options.pullDown).css({
						top: (c.Y - o.Y + o.oY) + "px",
					});
				} catch(e){
					console.log(e);
				}
			}
			
		})
		.bind("touchend", function(e){

			// 符合拖动条件的
			if (draging == true){
				try {
						
					
					
					// 达到相应高度的，显示正在加载
					if (c.Y - o.Y > options.readyH) {
						$this.find(options.pullDown)
						.removeClass(options.status[0] + " " + options.status[1])
						.addClass(options.status[2]);
						
					// 不符合高度的，清除样式
					} else {
						
						$this.find(options.pullDown)
						.removeClass(options.status[0] + " " + options.status[1] + " " + options.status[2])
					}
	
					// 添加过渡效果
					$this.find(options.pullDown).css(options.addTransition);
					$this.css({
						"z-index": options.zIndex
					});
					
					// 正在加载的
					if ($this.find(options.pullDown).hasClass("loading")) {
						
						// 调整为正在加载的高度
						$this.find(options.pullDown).css({
							top: ( o.oY + options.loadingH ) + "px",	
						});
						
						
						options.loading(function(){
							
							// 恢复原有的高度，清除样式，恢复原有draging条件
							$this.find(options.pullDown).css({
								top: o.oY + "px",	
							});
							
							$this.find(options.pullDown)
							.removeClass(options.status[0] + " " + options.status[1] + " " + options.status[2]);
							
							draging = false;
						});
					} else {
						
						// 恢复原有的高度，清除样式，恢复原有draging条件
						$this.find(options.pullDown).css({
							top: o.oY + "px",	
						});
						
						$this.find(options.pullDown)
						.removeClass(options.status[0] + " " + options.status[1] + " " + options.status[2]);
						
						draging = false;
					}
				} catch (e){
					console.log(e);
					draging = false;
				}
				
			}
		});
	}

	return $;
	
}));