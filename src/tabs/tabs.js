!( function( factory ) {
    if ( typeof define === "function" && define.amd ) {
        define([ "jquery" ], factory );
    } else {
        var init = factory( jQuery );
        init();
    }
}(function($){

    var init = function() {
        $("[data-role='tabs']").each(function () {
            var witdh = 100 / $(this).find('.tabs-list > li').length;
          $(this).find('.tabs-list > li').css('width', witdh + '%');

            var $this = $(this);
            var active_tab = $this.find(".tabs-list > li.active").data("href");

            // No active tab find. First child element set to active.
            if (active_tab === undefined)
                active_tab = $(this).find(".tabs-list > li").eq(0).data("href");

            $this
                .find(".tabs-content > div").hide().end()
                .find(active_tab).show();

            $this.find(".tabs-list > li").click(function () {

                var active_tab = $(this).data("href");
                $this
                    .find(".tabs-list > li").removeClass("active").end()
                    .find(".tabs-content > div").hide().end()
                    .find(active_tab).show();
                $(this).addClass("active");
            });

        });
    };
    return init;
}));
