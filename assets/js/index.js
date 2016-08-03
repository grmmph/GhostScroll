/**
 * Main JS file for GhostScroll behaviours
 */

var $post = $('.post');
var $fnav = $('.fixed-nav');
var $postafter = $('.post-after');
var $sitehead = $('#site-head');

/* Globals jQuery, document */
(function ($) {
	"use strict";
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

        $(window).scroll( function () {
            var w = $(window).scrollTop();
            var g = $sitehead.offset().top;
            var h = $sitehead.offset().top + $sitehead.height()-100;
            
            // parallax stuff
            var paralex = 30 + w/13 + "%";
            $sitehead.css("background-position-y", paralex);

            // fade out fixed-nav
            if(w >= g && w<=h) {
                $('.fixed-nav').fadeOut('fast');
            } else if($(window).width()>500) {
                $('.fixed-nav').fadeIn('fast');
            }

            // highlight appropriate fixed-nav element
            $post.each(function () {
                var f = $(this).offset().top;
                var b = $(this).offset().top + $(this).height();
                var t = $(this).parent('.post-holder').index();
                // fixed-nav active post
                var i = $(".fn-item[item_index='"+t+"']");
                // previous arrow
                var a = $(this).parent('.post-holder').prev('.post-holder').find('.post-after');

                // deprecated
                $(this).attr('item_index', t);

                // fade in/out elements
                if(w >= f && w<=b) {
                    i.addClass('active');
                    a.fadeOut('slow');
                } else {
                    i.removeClass('active');
                    a.fadeIn('slow');
                }
            });
        });

		$('ul li').before('<span class="bult fa fa-asterisk icon-asterisk"></span>');
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
