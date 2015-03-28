;( function( factory ) {
	if ( typeof define === "function" && define.amd ) {
		define("paging", [ "jquery" ], factory );
	} else {
		factory( jQuery );
	}
}(function($){
	$.fn.paging = function(options) {
		options = $.extend({
			total: 1,
			pagesize: 10,
			current: 1,
			showitem: 5, // if 6, it will show 7 items.
			debug: false,
			onselect: function(){},
		}, options);
		
		// Init total
		if (options.total == null || typeof options.total != "number" || !Number.isInteger(options.total) || options.total < 1 ) options.total = 1;
		if (typeof options.total == "string") options.total = parseInt(options.total);

		// Init current
		if (options.current == null) 			options.current = 1;
		if (typeof options.current == "string") options.current = parseInt(options.current);
		
		var totalPage 	= Math.ceil(options.total / options.pagesize),
			halfitem 	= Math.floor(options.showitem / 2),
			startPage 	= (options.current - halfitem) > 1 ? (options.current - halfitem) : 1,
			endPage 	= (options.current + halfitem) > totalPage ? totalPage : (options.current + halfitem),
			html 		= "<ul>",
			pre 		= (options.current - 1) > 1 ? (options.current - 1) : 1,
			next 		= (options.current + 1) > totalPage ? totalPage : (options.current + 1);
		
		
		if (startPage == 1) {
			totalPage > (startPage + options.showitem) ? (endPage = startPage + options.showitem - 1) : (endPage = totalPage);
		}
		
		if (endPage == totalPage) {
			(totalPage - options.showitem) <= 0 ? (startPage = 1) : (startPage = totalPage - options.showitem + 1);
		}

		for (var i = startPage; i <= endPage; i = i + 1)
		{
			if (i == options.current)
				html += "<li class='active' data-num='" + i + "'>" + i + "</li>";
			else
				html += "<li data-num='" + i + "'>" + i + "</li>";
		}
		html += "</ul>";
		
		// Add html to DOM.
		$(this).append(html);
		$("ul", this)
			.prepend("<li class='first-child' data-num='1'>&lt;&lt;</li><li data-num='" + pre + "'>&lt;</li>")
			.append("<li data-num='" + next + "'>&gt;</li><li class='last-child' data-num='" + totalPage + "'>&gt;&gt;</li>");
		
		// Disabled some element if its equal current pagenum.
		$("li", this).each(function(){
			if ( $(this).data("num") == options.current)
				$(this).addClass("disabled");
		});
		
		
		// Bind click for each li element.
		$("li", this).each(function() {
			$(this).click(function() {
				
				// Only not equal current page can trigger the event.
				if ($(this).data("num") != options.current)
					options.onselect($(this).data("num"));
			})
		});
	}
	
	return $;
}));