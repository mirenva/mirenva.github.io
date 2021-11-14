$((function() {

    const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const isMobile = () => getWindowWidth() <= 991;

    let windowWidth = getWindowWidth();

    svg4everybody();

    if (isMobile()) {
        $('.tabs__list').on('click', '.tabs__list-item:not(.active-tab)', (function() {
            const elemPosition = $(this).offset().left + $(this).outerWidth();
            const curNavWidht = $('.tabs__list-box').outerWidth();
            let curNavLiWidht = 0;

            $('.tabs__list-box .tabs__list-item').each((function(index, el) {
                curNavLiWidht += $(el).outerWidth(!0);
            }));

            if (curNavWidht < curNavLiWidht && 0 === $('.tabs__list-box').scrollLeft()) {
                $('.tabs__list-box').scrollLeft(elemPosition - curNavWidht + 10)
            } else {
                $('.tabs__list-box').scrollLeft(elemPosition - curNavWidht + $('.tabs__list-box').scrollLeft())
            }
        }));
    }

    $('.tabs__list').on('click', '.tabs__list-item:not(.active-tab)', (function() {
        $(this).addClass('active-tab').siblings().removeClass('active-tab').closest('.tabs').find('.tabs__content').removeClass('active-tab').eq($(this).index()).addClass('active-tab');
    }));

    $('.prod-options__item').on('click', (function(event) {
        $(this).toggleClass('active').siblings().removeClass('active');
    }));

    function youtubeContent() {
        $('.video__item').each((function() {
            let $this = $(this), youtubeImgSrc = '//img.youtube.com/vi/' + $this.data('youtube') + '/hqdefault.jpg';
            $this.html(`\n              <div class="video__item-mask">\n              <svg class="svg__youtube" height="100%" version="1.1" viewBox="0 0 68 48" width="100%"><path class="svg__youtube-fill" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#212121" fill-opacity="0.8"></path><path d="M 45,24 27,14 27,34" fill="#fff"></path></svg>\n              <img src="${youtubeImgSrc}" alt="image">\n              </div>\n              `);
        }));
    }
    youtubeContent();
    $('.video__item').on('click', (function() {
        var $this = $(this), dataYoutube = $this.data('youtube');
        youtubeContent();
        $this.html('<iframe class="video__item-iframe" src="https://www.youtube.com/embed/' + dataYoutube + '?autoplay=1&rel=0&showinfo=0" frameborder="0" allowfullscreen></iframe>');
    }));

    new Swiper('.prod-gallery', {
        navigation: {
            nextEl: '.prod-gallery-box .sl-btn--next',
            prevEl: '.prod-gallery-box .sl-btn--prev'
        },
        pagination: {
            el: '.prod-gallery__dots',
            clickable: !0
        }
    });

    $('.accordion__title').click((function() {
        var $this = $(this);
        $this.next('.accordion__content').stop(!0, !0).slideToggle('50');
        $this.parent().toggleClass('accordion__item--active');
        $this.parent().siblings('.accordion__item').children('.accordion__content').stop(!0, !0).slideUp('50');
        $this.parent().siblings('.accordion__item').removeClass('accordion__item--active');
    }));

    new Swiper('.main-slider', {
        loop: !0,
        navigation: {
            nextEl: '.main-slider__next',
            prevEl: '.main-slider__prev'
        }
    });

    const $scrollToTargetTriggers = $('.js-scroll-to-target');
    $scrollToTargetTriggers.length && $scrollToTargetTriggers.on('click', (function(event) {
        event.preventDefault();
        var target = $(this).attr('data-target');
        $('html, body').stop().animate({
            scrollTop: $(target).offset().top
        }, 600);
    }));

    $('[data-fancybox]').fancybox({
        backFocus: !1,
        autoFocus: !1,
        hash: !1,
        wheel: !1,
        mobile: {
            clickSlide: 'close',
            clickOutside: 'close',
            dblclickOutside: 'close',
        },
    });

    function truncateTexts() {
        $('.js-truncate-text').each(function() {
            const $this = $(this);
            const truncateLength = isMobile() ? $this.data('truncateLengthMobile') : $this.data('truncateLengthDesktop');
            $this.text( truncateString($this.text(), truncateLength) );
        });
        $('.js-truncate-text-and-show-more').each(function() {
            const $this = $(this);
            const text = $this.text();
            const truncateLength = isMobile() ? $this.data('truncateLengthMobile') : $this.data('truncateLengthDesktop');

            if (text.length > truncateLength) {
                $this.text( truncateString(text, truncateLength) );
                $this.next('.js-scroll-to-full-product-desc').css({'display':'inline'});
            }
        });
    }
    truncateTexts();
    function truncateString(str, neededLength) {
        if (str.length <= neededLength) {
            return str;
        }

        const subString = str.substr(0, neededLength-1);

        return subString.substr(0, subString.lastIndexOf(' ')) + '...';
    }
    $('.js-scroll-to-full-product-desc').on('click', (function() {
        const $descTab = $('#descTab');

        $('html, body').stop().animate({
            scrollTop: $descTab.offset().top,
        }, 600);

        $descTab.click();
    }));
    $('.js-show-full-product-desc').on('click', (function() {
        const $this = $(this);
        const $textContainer = $this.siblings('.text-block');
        const $textContainerOverlap = $this.siblings('.tabs__content-overlap');

        $textContainer.css('max-height', '').removeClass('text-block--partially-hidden');
        $textContainerOverlap.hide();
        $this.slideUp();
    }));

    const $productDescription = $('.js-product-description-tab .text-block');
    if ($productDescription) {
        const descHeight = $productDescription.outerHeight(true);
        $productDescription.css('max-height', descHeight / 2).addClass('text-block--partially-hidden');
    }

    function animateItem(selector, animateClass, animateStartPoint, animateIncrement) {
        var animCount = animateStartPoint;
        $(selector).each((function(index, el) {
            $(el).css('animation-delay', animCount + 's').animated(animateClass);
            animCount += animateIncrement;
        }));
    }
    if (screen.width > 768) {
        animateItem('.bot-form__img img', 'fadeInRight', 0, 0);
        animateItem('.foot .sub-nav__item', 'fadeInLeft', 0, .1);
        animateItem('.collage__gallery-item', 'fadeInLeft', 0, .1);
        animateItem('.row--why-we [class*="col-"]:nth-child(3n+1)', 'fadeInLeft', 0, .1);
        animateItem('.row--why-we [class*="col-"]:nth-child(3n - 1)', 'fadeInUp', 0, .1);
        animateItem('.row--why-we [class*="col-"]:nth-child(3n)', 'fadeInRight', 0, .1);
    }



    $(document).on('click', '.dropdown.has-mega-menu', (function(event) {
        const target = event.target;
        const targetTagName = target.tagName;

        if (targetTagName === 'A' || $(target).parents('.column.has-submenu').length) {
            event.stopPropagation();
        } else {
            if ($(this).children('.mega-menu').is(':visible')) {
                const $submenus = $('.column.has-submenu');
                $submenus.removeClass('active');
                $submenus.children('ul').slideUp();
            } else {
                const $menus = $('.dropdown.has-mega-menu');
                $menus.removeClass('active');
                $menus.children('.mega-menu').slideUp();
            }

            $(this).toggleClass('active');
            $(this).children('.mega-menu').slideToggle();
        }
    }));
    $(document).on('click', '.column.has-submenu', (function(event) {
        const targetTagName = event.target.tagName;

        if (targetTagName === 'A') {
            event.stopPropagation();
        } else {
            if (!$(this).children('ul').is(':visible')) {
                const $submenus = $('.column.has-submenu');
                $submenus.removeClass('active');
                $submenus.children('ul').slideUp();
            }

            $(this).toggleClass('active');
            $(this).children('ul').slideToggle();
        }
    }));



    const $mainMenuTrigger = $('.js-toggle-main-menu');
    const $mainMenuBurger = $('.js-main-menu-burger');
    const $mainMenuNav = $('.js-main-menu-nav');
    const $catalogMenuTrigger = $('.js-toggle-catalog-menu');
    const $catalogMenuBurger = $('.js-catalog-menu-burger');
    const $catalogMenuNav = $('.js-catalog-menu-nav');
    const $headerBack = $('.header__background');

    $mainMenuTrigger.length && $mainMenuTrigger.on('click', (function() {
        if ($mainMenuNav.is(':visible')) {
            closeMenu($mainMenuBurger, $mainMenuNav);
            hideHeaderBack();
        } else {
            showHeaderBack();
            closeMenu($catalogMenuBurger, $catalogMenuNav);
            openMenu($mainMenuBurger, $mainMenuNav);
        }
    }));
    $catalogMenuTrigger.length && $catalogMenuTrigger.on('click', (function() {
        if ($catalogMenuNav.is(':visible')) {
            closeMenu($catalogMenuBurger, $catalogMenuNav);
            hideHeaderBack();
        } else {
            showHeaderBack();
            closeMenu($mainMenuBurger, $mainMenuNav);
            openMenu($catalogMenuBurger, $catalogMenuNav);
        }
    }));
    $headerBack.length && $headerBack.on('click', (function(event) {
        closeMenu($mainMenuBurger, $mainMenuNav);
        closeMenu($catalogMenuBurger, $catalogMenuNav);
        hideHeaderBack();
    }));

    function showHeaderBack() {
        $headerBack.stop(!0, !0).fadeIn(300);
    }
    function hideHeaderBack() {
        $headerBack.stop(!0, !0).fadeOut(50);
    }
    function openMenu($burger, $nav) {
        $burger.addClass('open');
        $nav.stop(!0, !0).slideDown(300);
    }
    function closeMenu($burger, $nav) {
        $burger.removeClass('open');
        $nav.stop(!0, !0).slideUp(50);
    }



    let isDesktopSet = false;
    let isMobileSet = false;

    $(window).resize((function() {
        windowWidth = getWindowWidth();

        if (isMobile()) {
            if (!isMobileSet) {
                setMobileElems();
            }
        } else {
            if (!isDesktopSet) {
                setDesktopElems();
            }
            refreshVar();
        }

        scrollListener();
    }));

    const $headerMobileLogo = $('.header__mobile-logo');
    let $headerMobileLogoHeight = $headerMobileLogo.outerHeight(true);

    const $catalogNav = $('.catalog-nav');
    let navPos, navHeight;
    function refreshVar() {
        navPos = $catalogNav.offset().top;
        navHeight = $catalogNav.outerHeight(!0);
    }

    function setDesktopElems() {
        $('.header__mobile-logo').css('display','');
        $('.header__top').css('display','');
        $('.catalog-nav').css('display','');

        $('<div class="catalog-nav--clone"></div>').insertBefore('.catalog-nav').css('height', navHeight).hide();
        $('.header__top .main-phones').insertAfter('.header__mid-box .logo');
        $('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 451.846 257.565"><path d="m 225.92225,257.5655 c -8.098,0 -16.195,-3.092 -22.369,-9.263 L 9.26925,54.0165 c -12.359,-12.359 -12.359,-32.397 0,-44.751 12.354,-12.354 32.388,-12.354 44.748,0 l 171.905,171.915 171.906,-171.909 c 12.359,-12.354 32.391,-12.354 44.744,0 12.365,12.354 12.365,32.392 0,44.751 l -194.281,194.286 c -6.177,6.172 -14.274,9.257 -22.369,9.257 z"/></svg>').appendTo('.navigation .dropdown > a');

        $('.header__mid .main-phones + .header__top .nav').remove();
        $('.navigation .dropdown > a + .nav-arrow.nav-arrow--menu').remove();
        $('.mega-menu-bar .column.has-submenu h3 .nav-arrow.nav-arrow--submenu').remove();

        isDesktopSet = true;
        isMobileSet = false;
    }

    function setMobileElems() {
        closeMenu($mainMenuBurger, $mainMenuNav);
        closeMenu($catalogMenuBurger, $catalogMenuNav);
        hideHeaderBack();

        $('.header__mid .main-phones').insertAfter('.header__top .nav');
        $('<span class="nav-arrow nav-arrow--menu">' +
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 451.846 257.565">' +
            '<path d="m 225.92225,257.5655 c -8.098,0 -16.195,-3.092 -22.369,-9.263 L 9.26925,54.0165 c -12.359,-12.359 -12.359,-32.397 0,-44.751 12.354,-12.354 32.388,-12.354 44.748,0 l 171.905,171.915 171.906,-171.909 c 12.359,-12.354 32.391,-12.354 44.744,0 12.365,12.354 12.365,32.392 0,44.751 l -194.281,194.286 c -6.177,6.172 -14.274,9.257 -22.369,9.257 z"/>' +
            '</svg>' +
            '</span>').insertAfter('.navigation .dropdown > a');
        $('.mega-menu-bar .column.has-submenu').each((function(index, el) {
            $('<span class="nav-arrow nav-arrow--submenu">' +
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 451.846 257.565">' +
                '<path d="m 225.92225,257.5655 c -8.098,0 -16.195,-3.092 -22.369,-9.263 L 9.26925,54.0165 c -12.359,-12.359 -12.359,-32.397 0,-44.751 12.354,-12.354 32.388,-12.354 44.748,0 l 171.905,171.915 171.906,-171.909 c 12.359,-12.354 32.391,-12.354 44.744,0 12.365,12.354 12.365,32.392 0,44.751 l -194.281,194.286 c -6.177,6.172 -14.274,9.257 -22.369,9.257 z"/>' +
                '</svg>' +
                '</span>').appendTo($(el).children('h3'));
        }));

        $('.catalog-nav--clone').remove();
        $('.header__top .main-phones + .header__mid-box .logo').remove();
        $('.navigation .dropdown > a svg').remove();

        isMobileSet = true;
        isDesktopSet = false;
    }

    if (isMobile()) {
        setMobileElems();
    } else {
        setDesktopElems();
        refreshVar();
    }

    $(window).on('scroll load', scrollListener);

    function scrollListener() {
        if (isMobile()) {
            if ($(window).scrollTop() > $headerMobileLogoHeight) {
                $headerMobileLogo.slideUp();
            } else {
                $headerMobileLogo.slideDown();
            }

            $('.catalog-nav').removeClass('catalog-nav--fixed');
            $('.catalog-nav--clone').hide();
        } else {
            if ($(window).scrollTop() >= navPos) {
                $('.catalog-nav').addClass('catalog-nav--fixed');
                $('.catalog-nav--clone').show();
            } else {
                $('.catalog-nav').removeClass('catalog-nav--fixed');
                $('.catalog-nav--clone').hide();
            }
        }
    }

    $('.preloader').length && $('.preloader').delay(200).fadeOut(500);
}));