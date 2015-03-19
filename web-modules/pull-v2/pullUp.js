//
;( function( factory ) {
	if ( typeof define === "function" && define.amd ) {
		define([ "jquery" ], factory );
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