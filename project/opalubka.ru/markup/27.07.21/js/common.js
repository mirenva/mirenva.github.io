$((function() {
    svg4everybody();
    var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    window.innerWidth <= 991 && $(".tabs__list").on("click", ".tabs__list-item:not(.active-tab)", (function() {
        let curNavWidht = $(".tabs__list-box").outerWidth(), curNavLiWidht = 0, elemPosition = $(this).offset().left + $(this).outerWidth();
        $(".tabs__list-box .tabs__list-item").each((function(index, el) {
            curNavLiWidht += $(el).outerWidth(!0);
        }));
        curNavWidht < curNavLiWidht && (0 == $(".tabs__list-box").scrollLeft() ? $(".tabs__list-box").scrollLeft(elemPosition - curNavWidht + 10) : $(".tabs__list-box").scrollLeft(elemPosition - curNavWidht + $(".tabs__list-box").scrollLeft()));
    }));
    $(".tabs__list").on("click", ".tabs__list-item:not(.active-tab)", (function() {
        $(this).addClass("active-tab").siblings().removeClass("active-tab").closest(".tabs").find(".tabs__content").removeClass("active-tab").eq($(this).index()).addClass("active-tab");
    }));
    $(".prod-options__item").on("click", (function(event) {
        $(this).toggleClass("active").siblings().removeClass("active");
    }));
    function youtubeContent() {
        $(".video__item").each((function() {
            let $this = $(this), youtubeImgSrc = "//img.youtube.com/vi/" + $this.data("youtube") + "/hqdefault.jpg";
            $this.html(`\n              <div class="video__item-mask">\n              <svg class="svg__youtube" height="100%" version="1.1" viewBox="0 0 68 48" width="100%"><path class="svg__youtube-fill" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#212121" fill-opacity="0.8"></path><path d="M 45,24 27,14 27,34" fill="#fff"></path></svg>\n              <img src="${youtubeImgSrc}" alt="image">\n              </div>\n              `);
        }));
    }
    youtubeContent();
    $(".video__item").on("click", (function() {
        var $this = $(this), dataYoutube = $this.data("youtube");
        youtubeContent();
        $this.html('<iframe class="video__item-iframe" src="https://www.youtube.com/embed/' + dataYoutube + '?autoplay=1&rel=0&showinfo=0" frameborder="0" allowfullscreen></iframe>');
    }));
    new Swiper(".prod-gallery", {
        navigation: {
            nextEl: ".prod-gallery-box .sl-btn--next",
            prevEl: ".prod-gallery-box .sl-btn--prev"
        },
        pagination: {
            el: ".prod-gallery__dots",
            clickable: !0
        }
    });
    $(".accordion__title").click((function() {
        var $this = $(this);
        $this.next(".accordion__content").stop(!0, !0).slideToggle("50");
        $this.parent().toggleClass("accordion__item--active");
        $this.parent().siblings(".accordion__item").children(".accordion__content").stop(!0, !0).slideUp("50");
        $this.parent().siblings(".accordion__item").removeClass("accordion__item--active");
    }));
    $(document).on("click", ".nav-arrow--menu", (function(event) {
        $(this).parents("li").toggleClass("active");
        $(this).parents("li").children(".mega-menu").slideToggle();
    }));
    $(document).on("click", ".nav-arrow--submenu", (function(event) {
        $(this).parents(".column").toggleClass("active");
        $(this).parents(".column").children("ul").slideToggle();
    }));
    $(window).on("load resize", (function(event) {
        (windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) <= 991 ? $(".header__mid .main-phones").insertAfter(".header__top .nav") : $(".header__top .main-phones").insertAfter(".header__mid-box .logo");
    }));
    new Swiper(".main-slider", {
        loop: !0,
        navigation: {
            nextEl: ".main-slider__next",
            prevEl: ".main-slider__prev"
        }
    });
    if (windowWidth > 991) $('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 451.846 257.565"><path d="m 225.92225,257.5655 c -8.098,0 -16.195,-3.092 -22.369,-9.263 L 9.26925,54.0165 c -12.359,-12.359 -12.359,-32.397 0,-44.751 12.354,-12.354 32.388,-12.354 44.748,0 l 171.905,171.915 171.906,-171.909 c 12.359,-12.354 32.391,-12.354 44.744,0 12.365,12.354 12.365,32.392 0,44.751 l -194.281,194.286 c -6.177,6.172 -14.274,9.257 -22.369,9.257 z"/></svg>').appendTo(".navigation .dropdown > a"); else {
        $('<span class="nav-arrow nav-arrow--menu"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 451.846 257.565"><path d="m 225.92225,257.5655 c -8.098,0 -16.195,-3.092 -22.369,-9.263 L 9.26925,54.0165 c -12.359,-12.359 -12.359,-32.397 0,-44.751 12.354,-12.354 32.388,-12.354 44.748,0 l 171.905,171.915 171.906,-171.909 c 12.359,-12.354 32.391,-12.354 44.744,0 12.365,12.354 12.365,32.392 0,44.751 l -194.281,194.286 c -6.177,6.172 -14.274,9.257 -22.369,9.257 z"/></svg></span>').insertAfter(".navigation .dropdown > a");
        $(".mega-menu-bar .column").each((function(index, el) {
            $(el).find("ul").length && $('<span class="nav-arrow nav-arrow--submenu"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 451.846 257.565"><path d="m 225.92225,257.5655 c -8.098,0 -16.195,-3.092 -22.369,-9.263 L 9.26925,54.0165 c -12.359,-12.359 -12.359,-32.397 0,-44.751 12.354,-12.354 32.388,-12.354 44.748,0 l 171.905,171.915 171.906,-171.909 c 12.359,-12.354 32.391,-12.354 44.744,0 12.365,12.354 12.365,32.392 0,44.751 l -194.281,194.286 c -6.177,6.172 -14.274,9.257 -22.369,9.257 z"/></svg></span>').appendTo($(el).children("h3"));
        }));
    }
    $(".scroll-to-target").length && $(".scroll-to-target").on("click", (function(event) {
        event.preventDefault();
        var target = $(this).attr("data-target");
        $("html, body").stop().animate({
            scrollTop: $(target).offset().top
        }, 600);
    }));
    $("[data-fancybox]").fancybox({
        touch: !1,
        backFocus: !1,
        autoFocus: !1
    });
    $(".hamburger--js").on("click", (function(event) {
        $(".catalog-nav").stop(!0, !0).slideUp(50);
        $(this).toggleClass("open");
        $(".header__top").stop(!0, !0).slideToggle(300);
    }));
    $(".catalog-toggle").on("click", (function(event) {
        $(".hamburger--js").removeClass("open");
        $(".header__top").stop(!0, !0).slideUp(50);
        $(".catalog-nav").stop(!0, !0).slideToggle(300);
    }));
    function animateItem(selector, animateClass, animateStartPoint, animateIncrement) {
        var animCount = animateStartPoint;
        $(selector).each((function(index, el) {
            $(el).css("animation-delay", animCount + "s").animated(animateClass);
            animCount += animateIncrement;
        }));
    }
    if (screen.width > 768) {
        animateItem(".bot-form__img img", "fadeInRight", 0, 0);
        animateItem(".foot .sub-nav__item", "fadeInLeft", 0, .1);
        animateItem(".collage__gallery-item", "fadeInLeft", 0, .1);
        animateItem(".row--why-we [class*='col-']:nth-child(3n+1)", "fadeInLeft", 0, .1);
        animateItem(".row--why-we [class*='col-']:nth-child(3n - 1)", "fadeInUp", 0, .1);
        animateItem(".row--why-we [class*='col-']:nth-child(3n)", "fadeInRight", 0, .1);
    }
    if (windowWidth >= 992) {
        $(window).resize((function() {
            windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            refreshVar();
        }));
        var navPos, navHeight;
        function refreshVar() {
            navPos = $(".catalog-nav").offset().top;
            navHeight = $(".catalog-nav").outerHeight(!0);
        }
        refreshVar();
        $('<div class="catalog-nav--clone"></div>').insertBefore(".catalog-nav").css("height", navHeight).hide();
        $(window).on("scroll load", (function(event) {
            if ($(window).scrollTop() >= navPos) {
                $(".catalog-nav").addClass("catalog-nav--fixed");
                $(".catalog-nav--clone").show();
            } else {
                $(".catalog-nav").removeClass("catalog-nav--fixed");
                $(".catalog-nav--clone").hide();
            }
        }));
    }
    $(".preloader").length && $(".preloader").delay(200).fadeOut(500);
}));