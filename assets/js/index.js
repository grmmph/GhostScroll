"use strict";

/**
 * Main JS file for GhostScroll behaviours
 */

var $sitehead = $('#site-head');

/* Globals jQuery, document */
(function ($) {
	$(document).ready(initialize);
	$(window).resize(onViewportChange);
	$(window).scroll(onViewportChange);

	function initialize() {
		setupJumpHandlers();
		fontAwesomeDecorators();
		fontAwesomeReplacement();

		function setupJumpHandlers() {
      // TODO: replace buttons with user set navigator
			$('.btn.first, #header-arrow').click( function () {
				var $first = $(".post").first();
				smoothScroll($first);
			});

			$('.btn.last').click( function () {
				var $last = $(".post").last();
				smoothScroll($last);
			});

			$('.fn-item').click(function (evt) {
				evt.preventDefault();
        // TODO: update URL with deep link
				var slug = $(this).attr("href");
				smoothScroll($(slug))
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
	
	function onViewportChange() {
		conditionallyShowNav();
		highlightActiveSection();

		function conditionallyShowNav() {
      var isTooNarrow = $(window).width() < 500;
      var shouldDisplayNav = !isTooNarrow && !isElementInViewport($sitehead);
			var navOpacity = shouldDisplayNav ? 1 : 0;

			$(".fixed-nav").css("opacity", navOpacity);
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
