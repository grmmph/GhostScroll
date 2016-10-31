"use strict";

/**
 * Main JS file for GhostScroll behaviours
 */

/* Globals jQuery, document */
(function ($) {
  initialize();
	$(window).resize(onViewportChange);
	$(window).scroll(onViewportChange);

	function initialize() {
    hideFixedNav();
		setupJumpHandlers();
		fontAwesomeDecorators();
		fontAwesomeReplacement();

    function hideFixedNav() {
      $(".fixed-nav").hide();
    }

		function setupJumpHandlers() {
			$('#header-arrow').click( function () {
				var $first = $(".post").first();
				smoothScroll($first);
			});

			$('.fn-item, .btn').click(function (evt) {
        var $this = $(this);
				var href = $this.attr("href");

        // We don't want to prevent a link from working if it is external.
        if (href.slice(0,1) === "#") {
          evt.preventDefault();
          var title = $this.text();
          window.history.pushState(title, title, href);
          smoothScroll($(href))
        }
			});

			$('.fn-item').click(function (evt) {
        var $this = $(this);
        var href = $this.attr("href");

        // We don't want to prevent a link from working if it is external.
        if (href.slice(0,1) === "#") {
          evt.preventDefault();
          var title = $this.text();
          window.history.pushState(title, title, href);
          smoothScroll($(href))
        }
      });
		}

    // TODO: Do this with psuedoclasses in the CSS
		function fontAwesomeDecorators() {
			$('ul > li').before('<span class="bult fa fa-asterisk icon-asterisk"></span>');
			$('blockquote p').prepend('<span class="quo icon-quote-left"></span>');
			$('blockquote p').append('<span class="quo icon-quote-right"></span>');
		}

		function fontAwesomeReplacement() {
			// // Matches
			// @fa-singleword@
			// @fa-dash-separated-words@
			// // Does *not* match
			// \@fa-escaped@
			// @fa-space separated@
			// @fa-Invalid-Case@
			// @fa-Invalid-(H^R@
			// @fa-will-match@@fa-will-not-match@
			//
			// Note: JS doesn't support negative lookbehinds. Thus to permit
			// escaped examples (\@fa-foo@) we capture the preceeding
			// character. This shouldn't pose a problem except in the event of
			// adjacent font-awesome characters (that are not space separated).
			// See last example above.
			var reg = /([^\\])@(fa-[-a-z]+)@/g;

			var $posts = $("#posts-wrapper")
			$posts.html($posts.html().replace(reg, "$1<i class='fa $2'></i>"));
		}
	}
	
  var $sitehead = $('#site-head');
  var isDisplayingNav = false;
  var delayedHide;
	function onViewportChange() {
    var shouldDisplay = shouldDisplayNav();
    if (shouldDisplay) {
      highlightActiveSection();
    }
    if (didShowNavChange()) {
      conditionallyShowNav();
    }
    isDisplayingNav = shouldDisplay;

    function shouldDisplayNav() {
      var isTooNarrow = $(window).width() < 500;
      var shouldDisplay = !isTooNarrow && !isElementInViewport($sitehead);
      return shouldDisplay;
    }

    function didShowNavChange() {
      var stateDidChange = (shouldDisplay !== isDisplayingNav);
      return stateDidChange;
    }

		function conditionallyShowNav() {
      var $fixedNav = $(".fixed-nav");

      if(shouldDisplay) {
        $fixedNav.show();
      }
      else {
        // See `.fixed-nav` from `assets/sass/main.scss`
        var transitionTime = 400;
        delayedHide = setTimeout(function() {
          $fixedNav.hide();
        }, transitionTime)
      }

			var navOpacity = shouldDisplay ? 1 : 0;
			$fixedNav.css("opacity", navOpacity);
		}

		function highlightActiveSection() {
			$(".post-holder").each(function () {
				var $this = $(this);
				var postId = $this.attr("id");
				var $thisNavLink = $(".fn-item[href='#" + postId + "']");
				var $previousArrow = $(this).prev('.post-holder').find('.post-after');

				if(isElementInViewport($this)) {
					$thisNavLink.addClass('active');
					$previousArrow.fadeOut('slow');
				} else {
					$thisNavLink.removeClass('active');
					$previousArrow.fadeIn('slow');
				}
			});
		}

		function isElementInViewport($element) {
			var scrollPosition = $(window).scrollTop();
			var topOfElement = $element.offset().top;
			var bottomOfElement = topOfElement + $element.height();

			var isAboveElement = topOfElement > scrollPosition;
			var isBelowElement = scrollPosition >= bottomOfElement;

			return (!isAboveElement && !isBelowElement);
		}
	}

	function smoothScroll ($element) {
		$('html, body').animate({
			scrollTop: $element.offset().top
		}, 400);
	}

}(jQuery));
