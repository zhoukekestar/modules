!(function(factory) {
  if (typeof define === "function" && define.amd) {
    define([ "jquery" ], factory);
  } else {
    var init = factory(jQuery);
    init();
  }
}(function($) {

  var Init = function() {

		// Popup page
    $("[data-role='popup']").hide().each(function() {

      var $this = $(this);
      var closeAnimate = $this.find(".popup-close").data("transition");

      if (closeAnimate == undefined)
        closeAnimate = "bounceOutLeft";

      $this.find(".popup-close,a").click(function() {

        $this
				.addClass("animated " + closeAnimate)
				.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
  $(this).removeClass("animated " + closeAnimate).hide();
});
      });
    });


		// Popup button
    $("[data-rel='popup']").each(function() {

			//
      $(this).click(function() {
        var selector = $(this).data("href");
        var animate = $(this).data("transition");
        if (animate == undefined)
          animate = "bounceInLeft";
        $(selector)
					.show()
					.addClass("animated " + animate)
					.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
  $(this).removeClass("animated " + animate);
});
      });
    });


		// Back button
    $("[data-rel='back']").click(function() {
      history.back();
    });
  };

  return Init;

}));