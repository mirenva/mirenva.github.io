(function ($) {
	'use strict'
	
	/////////////////////////////////////////////////////////////////
	//  Карта в подвале главной страницы
	//  Загружаем только тогда, когда приближаемся к концу страницы
	/////////////////////////////////////////////////////////////////
	var currentPage = window.location.pathname,
		initVar = false // костыль, но яндекс в понятном виде не даёт проверять инициализацию
	
	if (currentPage == '/project/trans-ls.ru/otslezhivanie-gruzov/'
	 || currentPage == '/project/trans-ls.ru/otslezhivanie-gruzov/index.html'
	 || currentPage == '/project/trans-ls.ru/otslezhivanie-gruzov/index2.html')
	{

		$(window).scroll(function(event) {
			if ( $(window).scrollTop() >= ($('#airportMap').offset().top - 2000) && initVar != true ) {
				mapInit()
				initVar = true
			}
		})

		var currentPage = window.location.pathname
			
		function mapInit() {
		
			ymaps.ready(function () {

				var myMapAirport = new ymaps.Map("airportMap", {
					center: [52.2691855965723,104.37572490731812],
					zoom: 15,
					controls: []
				})

				var placemark = new ymaps.Placemark([52.266657994585486,104.37572490731812], {
					iconCaption: 'IKT грузовой терминал',
					balloonContent: 'Иркутский аэропорт IKT. Грузовой терминал'
				},{
					preset: 'islands#nightIcon'
				})

				var zoomControl = new ymaps.control.ZoomControl({
					options: {
						position: { left: 8, bottom: 40 },
						size: 'small'
					}
				})

				myMapAirport.behaviors.disable('scrollZoom')
				myMapAirport.controls.add(zoomControl)
				myMapAirport.geoObjects.add(placemark)

			})

		}
		
	} else {

		$(window).scroll(function(event) {
			if ( $(window).scrollTop() >= ($('#mainMap').offset().top - 2000) && initVar != true ) {
				mapInit()
				initVar = true
			}
		})
			
		function mapInit() {

			ymaps.ready(function () {

				// Создание экземпляра карты и его привязка к созданному контейнеру.
				var myMap = new ymaps.Map("mainMap", {
					center: [52.25431244456342,104.33709169169232],
					zoom: 17,
					controls: []
				}),

				// Создание макета балуна на основе Twitter Bootstrap.
				MyBalloonLayout = ymaps.templateLayoutFactory.createClass(
					'<div class="popover  bs-popover-top  map__balloon" role="tooltip">' +
						'<a class="close  map__balloon-close" href="#">&times;</a>' +
						'<div class="arrow  map__balloon-arrow"></div>' +
						'$[[options.contentLayout observeSize]]' +
					'</div>',
				{
					// Строит экземпляр макета на основе шаблона и добавляет его в родительский HTML-элемент
					build: function () {
						this.constructor.superclass.build.call(this)

						this._$element = $('.popover', this.getParentElement())

						this.applyElementOffset()

						this._$element.find('.close')
							.on('click', $.proxy(this.onCloseClick, this))
					},
					// Удаляет содержимое макета из DOM
					clear: function () {
						this._$element.find('.close')
							.off('click')

						this.constructor.superclass.clear.call(this);
					},
					// Метод будет вызван системой шаблонов АПИ при изменении размеров вложенного макета
					onSublayoutSizeChange: function () {
						MyBalloonLayout.superclass.onSublayoutSizeChange.apply(this, arguments)

						if(!this._isElement(this._$element)) {
							return
						}

						this.applyElementOffset()

						this.events.fire('shapechange')
					},
					// Сдвигаем балун, чтобы "хвостик" указывал на точку привязки
					applyElementOffset: function () {
						this._$element.css({
							left: -(this._$element[0].offsetWidth / 2),
							top: -(this._$element[0].offsetHeight + this._$element.find('.arrow')[0].offsetHeight/2)
						});
					},
					// Закрывает балун при клике на крестик, кидая событие "userclose" на макете
					onCloseClick: function (e) {
						e.preventDefault();

						this.events.fire('userclose')
					},
					// Используется для автопозиционирования (balloonAutoPan)
					getShape: function () {
						if(!this._isElement(this._$element)) {
							return MyBalloonLayout.superclass.getShape.call(this);
						}

						var position = this._$element.position()

						return new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([
							[position.left, position.top], [
								position.left + this._$element[0].offsetWidth,
								position.top + this._$element[0].offsetHeight + this._$element.find('.arrow')[0].offsetHeight
							]
						]))
					},

					// Проверяем наличие элемента (в ИЕ и Опере его еще может не быть)
					_isElement: function (element) {
						return element && element[0] && element.find('.arrow')[0];
					}
				}),

				// Создание вложенного макета содержимого балуна.
				MyBalloonContentLayout = ymaps.templateLayoutFactory.createClass(
					'<div class="popover-inner  map__balloon-inner">' +
						'<img class="map__balloon-logo" src="https://mirenva.github.io/project/trans-ls.ru/app/img/logo-1.png">' +
						'<div class="map__balloon-contact  map__balloon-contact--address">' +
							'<i class="fas  fa-map-marker-alt  map__balloon-icon"></i>' +
							'<span class="map__balloon-text">' +
								'ул.&nbsp;Байкальская, дом&nbsp;№252, корпус&nbsp;А, офис&nbsp;6' +
							'</span>' +
						'</div>' +
						'<div class="map__balloon-contact">' +
							'<i class="fas  fa-phone  map__balloon-icon"></i>' +
							'<span class="map__balloon-text">' +
								'<a href="tel:+7(3952)96-65-12">+7&nbsp;<b>(3952)</b>&nbsp;96&#8209;65&#8209;12</a><br>' +
								'<a href="tel:+7(914)926-65-12">+7&nbsp;<b>(914)</b>&nbsp;926&#8209;65&#8209;12</a>' +
							'</span>' +
						'</div>' +
						'<div class="map__balloon-contact">' +
							'<i class="far  fa-clock  map__balloon-icon"></i>' +
							'<span class="map__balloon-text">' +
								'Часы работы:<br>' +
								'с&nbsp;10:00 до&nbsp;18:00' +
							'</span>' +
						'</div>' +
					'</div>'
				),

				// Создание метки с пользовательским макетом балуна.
				placemark = window.placemark = new ymaps.Placemark([52.25312066521271, 104.33704877634806], {
					iconCaption: '«Транс Логистик Сервис»'
				}, {
					preset: 'islands#nightIcon',
					balloonShadow: false,
					balloonLayout: MyBalloonLayout,
					balloonContentLayout: MyBalloonContentLayout,
					balloonPanelMaxMapArea: 0
				})

				var zoomControl = new ymaps.control.ZoomControl({
					options: {
						position: { left: 8, bottom: 40 },
						size: 'small'
					}
				})
				
				myMap.behaviors.disable('scrollZoom')
				myMap.controls.add(zoomControl)
				myMap.geoObjects.add(placemark)
				placemark.balloon.open()
			})

		}
	}
	

	if (currentPage == '/project/trans-ls.ru/'
	 || currentPage == '/project/trans-ls.ru/index.html'
	 || currentPage == '/project/trans-ls.ru/avtoperevozki/'
	 || currentPage == '/project/trans-ls.ru/avtoperevozki/index.html'
	 || currentPage == '/project/trans-ls.ru/aviaperevozki/'
	 || currentPage == '/project/trans-ls.ru/aviaperevozki/index.html'
	 || currentPage == '/project/trans-ls.ru/zhdperevozki/'
	 || currentPage == '/project/trans-ls.ru/zhdperevozki/index.html') {
	
		/////////////////////////////////////////////////////////////////
		//  Скрипт для стилизации выпадающего списка в калькуляторе на главной странице
		/////////////////////////////////////////////////////////////////
		$('select').selectize({
			openOnFocus: false,

			onInitialize: function () {
				var that = this;

				this.$control.on("click", function () {
					that.ignoreFocusOpen = true;
					setTimeout(function () {
						that.ignoreFocusOpen = false;
					}, 50)
				})
			},

			onFocus: function () {
				if (!this.ignoreFocusOpen) {
					this.open()
				}
			}
		})
		
		
		/////////////////////////////////////////////////////////////////
		//  Скрипт для появления датапикера в калькуляторе на главной странице
		/////////////////////////////////////////////////////////////////
		$.datepicker.setDefaults($.datepicker.regional['ru']);
		$( ".datepicker" ).datepicker({
			minDate: new Date()
		})
		/* Russian (UTF-8) initialisation for the jQuery UI date picker plugin. */
		/* Written by Andrew Stromnov (stromnov@gmail.com). */
		$( function() {
			( function( factory ) {
				if ( typeof define === "function" && define.amd ) {

					// AMD. Register as an anonymous module.
					define( [ "../widgets/datepicker" ], factory )
				} else {

					// Browser globals
					factory( jQuery.datepicker )
				}
			}( function( datepicker ) {

			datepicker.regional.ru = {
				closeText: "Закрыть",
				prevText: "&#x3C;Пред",
				nextText: "След&#x3E;",
				currentText: "Сегодня",
				monthNames: [ "Январь","Февраль","Март","Апрель","Май","Июнь",
				"Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь" ],
				monthNamesShort: [ "Янв","Фев","Мар","Апр","Май","Июн",
				"Июл","Авг","Сен","Окт","Ноя","Дек" ],
				dayNames: [ "воскресенье","понедельник","вторник","среда","четверг","пятница","суббота" ],
				dayNamesShort: [ "вск","пнд","втр","срд","чтв","птн","сбт" ],
				dayNamesMin: [ "Вс","Пн","Вт","Ср","Чт","Пт","Сб" ],
				weekHeader: "Нед",
				dateFormat: "dd.mm.yy",
				firstDay: 1,
				isRTL: false,
				showMonthAfterYear: false,
				yearSuffix: "" }
			datepicker.setDefaults( datepicker.regional.ru )

			return datepicker.regional.ru

			} ) )
		} )
	
	}
		
		
}(window.$))