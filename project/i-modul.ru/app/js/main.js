(function ($) {
	'use strict'
	
	$(document).ready(function() {
			
		// скрипты для стилизации меню
		$('.js-menu').slinky({
			title: true
		})
		$('.slinky-menu a.next, .slinky-menu a.back').on('click', function(){
			$('html, body').animate({ scrollTop: $('.js-menu').offset().top }, 300)
			return false
		})
		
		// скрипты для разворачивания или сворачивания меню
		$('.js-menu-bars').on('click', function(){
			$('.js-menu-bars').slideUp(function() {
				$('.js-menu-close').slideDown()
			})
			$('.js-menu').slideDown()
			$('.js-overlay').addClass('overlay--under-menu')
			$('.js-overlay').fadeIn(400)
			return false
		})
		$(document).on("click", ".js-menu-close, .js-overlay.overlay--under-menu", function(){
			$('.js-menu-close').slideUp(function() {
				$('.js-menu-bars').slideDown()
			})
			$('.js-menu').slideUp()
			$('.js-overlay').fadeOut(400, function() {
				$('.js-overlay').removeClass('overlay--under-menu')
			})
			return false
		})
		
		// скрипт для открытия/закрытия модалки
		$('.js-call-modal').on('click', function(){
			$('.js-overlay').addClass('overlay--under-modal')
			$('.js-overlay').fadeIn()
			var modal = $( $(this).attr('href') )
			modal.fadeIn()
			modal.addClass('modal--active')
			return false
		})
		$(document).on("click", ".js-modal-close, .js-overlay.overlay--under-modal", function(){
			var modal = $('.modal--active')
			modal.fadeOut(400, function() {
				modal.removeClass('modal--active')
			})
			$('.js-overlay').fadeOut(400, function() {
				$('.js-overlay').removeClass('overlay--under-modal')
			})
			return false
		})
	
		// слайдер с акциями на главной странице + слайдер с изображениями товара на странице товара
		$('.js-slider').slick({
			dots: true,
			dotsClass: 'slider-dots',
			arrows: false,
			infinite: true,
			lazyLoad: 'ondemand',
			fade: true,
			cssEase: 'linear',
			adaptiveHeight: true,
			mobileFirst: true
		})
		
		// кнопка "показать ещё" на странице каталога
		$('.js-cat-more').on('click', function(){
			$('.catalog__show-more').hide('slow')
			$('.catalog__list--rest').show('slow')
			return false
		})
		
		if ($('body').hasClass('body--catalog-section')) {
			// скрипты для фильтра цен в виде слайдера с инпутами
			$(function(){
				var priceSlider = $(".filter__price-slider").slider({
					range: true,
					min: 10,
					max: 35300,
					values: [ 7950, 35300 ],
					slide: function( event, ui ) {
						$(".filter__price-input[data-price=0]").val(ui.values[0])
						$(".filter__price-input[data-price=1]").val(ui.values[1])
					}
				})
				$(".filter__price-input").draggable()
				$(".filter__price-input").on("input", function() {
					var $this = $(this)
					priceSlider.slider("values", $this.data("price"), $this.val())
				})
			})
		}
	
		
		if ($('body').hasClass('body--catalog-product')) {
			// слайдер с "другими товарами этого раздела"
			$('.js-other-product-slider').slick({
				dots: false,
				arrows: false,
				infinite: true,
				lazyLoad: 'ondemand',
				slidesToShow: 1,
				slidesToScroll: 1,
				mobileFirst: true,
				adaptiveHeight: true,
				centerMode: true
			})
			$('.product__other-products .slick-slide').innerHeight( $('.product__other-products .slick-track').innerHeight() )
			
			var resizeTimer;
			$(window).on('resize', function(e) {
				$('.product__other-products .slick-slide').innerHeight( "auto" )
				clearTimeout(resizeTimer);
				resizeTimer = setTimeout(function() {
					$('.product__other-products .slick-slide').innerHeight( $('.product__other-products .slick-track').innerHeight() )
				}, 500);
			});
		}
	
		
		if ($('body').hasClass('body--cart')) {
			// скрипты для увеличения/уменьшения кол-ва товаров в корзине
			$('.quantity__minus').click(function () {
				var $input = $(this).parent().find('input');
				var count = parseInt($input.val()) - 1;
				count = count < 1 ? 1 : count;
				$input.val(count);
				$input.change();
				return false;
			});
			$('.quantity__plus').click(function () {
				var $input = $(this).parent().find('input');
				$input.val(parseInt($input.val()) + 1);
				$input.change();
				return false;
			});
			
			// скрипт для удаления товара из корзины
			$('.js-delete-product').click(function () {
				$(this).parents(".cart-item").fadeOut(400, function() {
					$(this).remove()
				})
				return false
			});
			
			// скрипт для показа формы заказа по клику на кнопку "начать оформление"
			$('.js-do-order').click(function () {
				$('.js-order-wrap').fadeIn()
				$('html, body').animate({ scrollTop: $('.js-order-wrap').offset().top }, 300)
				return false
			});
			
			// скрипты для показа тех или иных полей в зависимости от вида выбранного лица
			$('.js-fizlico').click(function () {
				$('.js-yurpole').fadeOut()
				$('.js-kompaniya').prop('required', false)
			});
			$('.js-yurlico').click(function () {
				$('.js-yurpole').fadeIn()
				$('.js-kompaniya').prop('required', true)
			});
			
			// скрипты для показа/скрытия поля адреса для доставки, если нажали на доставку курьером
			$('.js-kurier').click(function () {
				$('.js-dostavka').fadeIn()
			});
			$('.js-samovyvoz').click(function () {
				$('.js-dostavka').fadeOut()
			});
		}
	
		
		if ($('body').hasClass('body--contact')) {
			// скрипт для карты
			var myMap,
				myMapId,
				myMapCenter,
				placemarkFortuna1,
				placemarkFortuna2,
				placemarkGorodMasterov,
				placemarkVersal,
				placemarkBaykal,
				placemarkMegahoum,
				placemarkSaturn,
				placemarkGeoObjectId,
				placemarkGeoObject
			
			myMapId = "js-map"
			myMapCenter = [52.414034063285364,104.08212961230464]
			
			ymaps.ready(init)
			
			function init(){
				
				myMap = new ymaps.Map (myMapId, {
					center: myMapCenter,
					zoom: 9,
					controls: []
				})
				
				placemarkFortuna1 = new ymaps.Placemark([52.29567934111087,104.29316180157461],
					{
						iconContent: 'г. Иркутск, ул. Октябрьской революции, 1 к3',
						balloonContent: 'ТЦ «Фортуна-Стройматериалы», пав. № 13<br>г. Иркутск, ул. Октябрьской революции, 1 к3<br>8 (950) 057-14-00<br>зимой пн–вс с 9:00 до 19:00<br>летом пн–вс с 9:00 до 20:00'
					},{
						preset: 'islands#blueStretchyIcon'
					})
				placemarkFortuna2 = new ymaps.Placemark([52.295291228304066,104.2949213306884],
					{
						iconContent: 'г. Иркутск, ул. Октябрьской революции, 1 к3',
						balloonContent: 'ТЦ «Фортуна-Стройматериалы», пав. № 69<br>г. Иркутск, ул. Октябрьской революции, 1 к3<br>8 (3952) 43-18-91<br>зимой пн–вс с 9:00 до 19:00<br>летом пн–вс с 9:00 до 20:00'
					},{
						preset: 'islands#blueStretchyIcon'
					})
					
				placemarkGorodMasterov = new ymaps.Placemark([52.305377571875226,104.29389250000004],
					{
						iconContent: 'г. Иркутск, ул. Шевцова, 4',
						balloonContent: 'ТЦ «Город Мастеров», пав. № 1а<br>г. Иркутск, ул. Шевцова, 4<br>8 (3952) 400-666<br>пн–сб с 9:00 до 18:00<br>вс с 9:00 до 17:00'
					},{
						preset: 'islands#blueStretchyIcon'
					})
				placemarkVersal = new ymaps.Placemark([52.233695571919405,104.30241749999993],
					{
						iconContent: 'г. Иркутск, ул. Академическая, 31',
						balloonContent: 'ТЦ «Версаль» пав. № 16<br>г. Иркутск, ул. Академическая, 31<br>8 (3952) 50-02-85<br>зимой пн–вс с 9:00 до 20:00<br>летом пн–вс с 9:00 до 21:00'
					},{
						preset: 'islands#blueStretchyIcon'
					})
					
				placemarkBaykal = new ymaps.Placemark([52.2501985815683,104.41149285048328],
					{
						iconContent: 'г. Иркутск, Байкальский тракт, 11',
						balloonContent: 'ТЦ «Байкал», пав. № 124<br>г. Иркутск, Байкальский тракт, 11<br>8 (3952) 66-02-61<br>зимой пн–вс с 10:00 до 18:00<br>весной–летом пн–вс с 9:00 до 19:00'
					},{
						preset: 'islands#blueStretchyIcon'
					})
					
				placemarkMegahoum = new ymaps.Placemark([52.26672107191864,104.22303349999993],
					{
						iconContent: 'г. Иркутск, ул. Сергеева, 3Б/1',
						balloonContent: 'ТЦ «МегаХоум» пав. № 4<br>г. Иркутск, ул. Сергеева, 3Б/1<br>8 (904) 133-95-20<br>пн–вс с 10:00 до 20:00'
					},{
						preset: 'islands#blueStretchyIcon'
					})
					
				placemarkSaturn = new ymaps.Placemark([52.546012071721314,103.91313249999996],
					{
						iconContent: 'г. Ангарск, 125-й промквартал, ст. 1',
						balloonContent: 'ТЦ «Сатурн», пав. № 43/6<br>г. Ангарск, 125-й промквартал, ст. 1<br>8 (902) 515-84-00<br>пн–пт с 10:00 до 17:00<br>сб–вс с 10:00 до 16:00'
					},{
						preset: 'islands#blueStretchyIcon'
					})

				var zoomControl = new ymaps.control.ZoomControl
				
				myMap.panes.get('ground').getElement().style.filter = 'grayscale(100%)'
				
				var geoObjects = new ymaps.GeoObjectCollection({}, {
					preset: "islands#blueCircleIcon",
					strokeWidth: 4,
					geodesic: true
				})
				
				geoObjects.add(placemarkFortuna1)
				geoObjects.add(placemarkFortuna2)
				geoObjects.add(placemarkGorodMasterov)
				geoObjects.add(placemarkVersal)
				geoObjects.add(placemarkBaykal)
				geoObjects.add(placemarkMegahoum)
				geoObjects.add(placemarkSaturn)
				
				myMap.geoObjects.add(geoObjects)
				
				myMap.behaviors.disable('scrollZoom')
				// myMap.behaviors.disable('drag')
				// myMap.behaviors.enable('multiTouch')
				myMap.controls.add(zoomControl)
				
				
				$("[data-mark-id]").click(function(eventObject) {
					if (!$(eventObject.target).is('a')) {
						$('html,body').animate( { scrollTop: $('#js-map').offset().top }, 300 )
						placemarkGeoObjectId = parseFloat($(this).data("markId"))
						placemarkGeoObject = geoObjects.get(placemarkGeoObjectId)
						myMap.setCenter(placemarkGeoObject.geometry.getCoordinates())
						myMap.setZoom(14)
					}
				})
				
				$(".js-map-cover").click(function(eventObject) {
					$(this).css("opacity","1")
				})
				
			}
		}
	})
				
}(window.$))