!( function( factory ){
	if (typeof define === "function" && define.amd ) {
		define( [ "jquery" ], factory );
	} else {
		factory( jQuery );
	}
}( function($){
	var citySelect = function( options ){
		options = $.extend( {
			$this: null,
			data: [],
			selected:[],
			valname: "v",
			showname: "n",
			arrname: "s"
		}, options );

		function nextSelect($ele, data, arr, count)
		{
			if (data == undefined || data == null || data.length == 0)
				return;
			var html = '<option value="-1">--请选择--</option>';
			for (var i = 0; i < data.length; i++)
			{
				var item = data[i];
				html += '<option value="' + item[options.valname] + '">'+ item[options.showname] + '</option>';
			}
			$( $ele[count] ).append(html).show();;
			$( $ele[count] ).change(function(){

				for (var i = count + 1, max = $ele.length; i < max; i++)
				{
					$( $ele[i] ).find("option").unbind("change").remove();
					$( $ele[i] ).hide();
				}
				if ($(this).val() == -1)
					return;
				var curArr = arr;
				var curCount = count;
				curArr.push($(this).val());
				curCount++;

				for (var i = 0, max = data.length; i < max; i++)
				{
					if (data[i][options.valname] == $(this).val())
					{
						var temp =  data[i][options.arrname];
						nextSelect($ele, temp, curArr, curCount);
					}
				}
			});
		}

		options.$this.hide();
		nextSelect(options.$this, options.data, [], 0);
		for (var i = 0; i < options.selected.length; i++)
		{
			$( options.$this[i] ).find("option[value="+ options.selected[i]+"]").attr("selected", true).trigger("change");
	    }
	};

	$.fn.citySelect = function(selected){
		var $this = $(this);
		$.getJSON("city.min.json", function(json){
			citySelect({
				$this: $this,
				data: json,
				selected:selected
			});
		});
	};
  return $;
}));
