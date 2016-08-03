"use strict";

/**
 * Main JS file for GhostScroll behaviours
 */

var $post = $('.post');
var $sitehead = $('#site-head');

/* Globals jQuery, document */
(function ($) {
	function smoothScroll (el) {
		$('html, body').animate({
			scrollTop: el.offset().top
		}, 400);
	}

	$(document).ready(function(){

		$('.btn.first, #header-arrow').click( function () {
            var $first = $post.first();
			smoothScroll($first);
		});
		$('.btn.last').click( function () {
            var $last = $post.last();
			smoothScroll($last);
		});

        $('.fn-item').click(function (evt) {
            evt.preventDefault();
            var slug = $(this).attr("href");
            smoothScroll($(slug))
        });

        function conditionallyShowNav() {
            var navOpacity = shouldDisplayNav() ? 1 : 0;
            $(".fixed-nav").css("opacity", navOpacity);

            function shouldDisplayNav() {
                var isTooNarrow = $(window).width() < 500;
                return (!isTooNarrow && !isElementInViewport($sitehead));
            }
        }

        function highlightActiveSection() {
            $(".post-holder").each(function () {
                var $this = $(this);
                var postId = $this.attr("id");
                var thisNavLink = $(".fn-item[href='#" + postId + "']");
                var previousArrow = $(this).prev('.post-holder').find('.post-after');

                if(isElementInViewport($this)) {
                    thisNavLink.addClass('active');
                    previousArrow.fadeOut('slow');
                } else {
                    thisNavLink.removeClass('active');
                    previousArrow.fadeIn('slow');
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

        $(window).resize(function() {
            conditionallyShowNav();
            highlightActiveSection();
        });

        $(window).scroll( function () {
            conditionallyShowNav();
            highlightActiveSection();
        });

        $('ul > li').before('<span class="bult fa fa-asterisk icon-asterisk"></span>');
		$('blockquote p').prepend('<span class="quo icon-quote-left"></span>');
		$('blockquote p').append('<span class="quo icon-quote-right"></span>');
	});
	
    // Replace post text with font-awesome fonts
	$post.each(function () {
		var postText = $(this).html();
		var fa  = [];
		for(var i=0; i < icons.length; i++) {
			fa[i]       = {};
			fa[i].str   = "@"+ icons[i]+ "@";
			fa[i].icon  = icons[i];
			fa[i].int   = postText.search(fa[i].str);

			if(fa[i].int > -1 ) { 
				fa[i].count = postText.match(new RegExp(fa[i].str,"g")).length;
				for(var j=0; j < fa[i].count; j++) {
					$(this).html($(this).html().replace(fa[i].str, "<i class='fa "+fa[i].icon+"'></i>"))
				}
			}
		}
	});
	

}(jQuery));
