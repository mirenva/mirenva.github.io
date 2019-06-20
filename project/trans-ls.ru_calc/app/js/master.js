(function ($) {
	'use strict'
	
	/////////////////////////////////////////////////////////////////
	//  Скрипт для появления датапикера в калькуляторе на главной странице
	/////////////////////////////////////////////////////////////////
	$.datepicker.setDefaults($.datepicker.regional['ru']);
	$( ".datepicker" ).datepicker({
		minDate: new Date()
	})
	//  Русификация датапикера
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
	
	
	/////////////////////////////////////////////////////////////////
	//  Скрипты для расчёта в калькуляторе
	/////////////////////////////////////////////////////////////////
	$(document).ready(function() {
		"use strict"
		
		var option
		
		// Подгрузка данных по городам из json-словаря
		$.ajax({
			url: "https://mirenva.github.io/project/trans-ls.ru_calc/app/json/cities.json",
			cache: false,
			success: function(data){
				// записываем полученные данные в переменную
				var cities = data

				// формируем из данных кучу option'ов
				var options = []
				$.each(cities, function(key, elem){
					options.push("<option id='city" + key +
								 "' value='city" + key +
								 "' data-transit='" + elem.isTransit +
								 "' data-awb='" + elem.AWB +
								 "' data-min='" + elem.MIN +
								 "' data-n='" + elem.N +
								 "' data-m1='" + elem.M1 +
								 "' data-m2='" + elem.M2 +
								 "' data-m3='" + elem.M3 +
								 "' data-m4='" + elem.M4 +
								 "' data-g='" + elem.G +
								 "'>" + elem.name + "</option>")
				})
				
				// и подсовываем их в select
				$("#cityTo").append(options)

				// + скрипт для стилизации выпадающего списка
				$('.calculator__field--select').selectize({
					create: false,
					onInitialize: function () {
						var s = this;
						this.revertSettings.$children.each(function () {
							$.extend(s.options[this.value], $(this).data())
						})
					},
					onChange: function (value) {
						option = this.options[value]
						
						// скрываем предыдущий результат, если он был
						$("#resultWrap").fadeOut("fast")
						$(".calculator__form-comment").fadeOut("fast")
						
						calculateDebounced()
					}
				})
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(jqXHR)
				console.log(textStatus)
				console.log(errorThrown)
			}
		})
		
		
		// Ниже сам расчёт
		const coefficient = 1.2
		var form = $("#calculator"),
			weight,
			volume,
			cityOption,
			minWeight,
			tariff,
			awb,
			booking,
			bookingS7,
			fuelCharge,
			airportCharge
			
			
		// если кто-то стал менять поля в форме калькулятора
		$("#weight, #volume").on('input', function () {
			// скрываем предыдущий результат, если он был
			$("#resultWrap").fadeOut("fast")
			$(".calculator__form-comment").fadeOut("fast")
			
			calculateDebounced()
		})
		
		// Функция расчёта стоимости авиадоставки
		function calculate() {
			console.groupCollapsed("Начинаем расчёт стоимости авиадоставки")
			
			// валидируем данные в форме
			if ( validateForm(form) ) {
				var result
				
				// запоминаем выбранный option в select'е с городом
				cityOption = option
				
				// забираем значение объёма груза из соотв. поля
				volume = $("#volume").val()
				
				// забираем значение веса груза из соотв. поля и проверяем его в соотв. функции
				weight = checkWeight( $("#weight").val(), volume, cityOption )
				console.log("Рассчитали вес: " + weight)
				console.groupEnd()
				
				// вычисляем значение тарифа в зависимости от города
				tariff = getTariff(weight, cityOption)
				console.log("Рассчитали тариф: " + tariff)
				console.groupEnd()
				
				// забираем значение AWB из выбранного option и вычисляем его
				awb = getAWB( cityOption.awb )
				console.log("Рассчитали AWB: " + awb)
				console.groupEnd()
				
				// вычисляем booking
				booking = getBooking( weight )
				console.log("Рассчитали бронирование: " + booking)
				console.groupEnd()
				
				// вычисляем bookingS7
				bookingS7 = getBookingS7( cityOption.awb )
				console.log("Рассчитали бронирование S7: " + bookingS7)
				console.groupEnd()
				
				// вычисляем fuelCharge
				fuelCharge = getFuelCharge( weight, cityOption.awb )
				console.log("Рассчитали топливный сбор: " + fuelCharge)
				console.groupEnd()
				
				// вычисляем airportCharge
				airportCharge = getAirportCharge( weight )
				console.log("Рассчитали сбор аэропорта: " + airportCharge)
				console.groupEnd()
				
				// по волшебной формуле от клиента вычисляем результат
				result = ( weight * tariff + awb + booking + bookingS7 + fuelCharge + airportCharge ) * coefficient
				console.log("Рассчитали результат! — " + result)
				// и «причёсываем» его
				result = beautifyResult(result)
				
				// выводим результат  в html
				$("#resultPrice").html("<span>" + result + "&nbsp;<i class='fas  fa-ruble-sign  calculator__price-icon'></i>")
				
				$("#resultWrap").fadeIn("fast")
				
				// добавляем предупреждение о транзитном аэропорте
				if (cityOption.transit) {
					$("#commTransit").fadeIn("fast")
				}
				
				// выводим предупреждение о неидеальности расчёта
				$("#commCalc").fadeIn("fast")
				
				//отображаем кнопку
				$("#checkout-btn").fadeIn("fast")
			}
			console.groupEnd()
		}
		
		
		// Функция для откладывания вызова калькуляции. Удобно, что калькуляция не будет происходить при повторном вызове, а будет ещё раз отложена
		const calculateDebounced = debounce(calculate, 1000)
		
		
		/**
		 * Функция для валидации данных, введённых в форму
		 * @param  {[object Object]} f		Форма
		 * @return {[boolean]} 				Всё ли с ней в порядке
		 */
		function validateForm(f) {
			console.group("Проводим валидацию введённых данных")
			var error = false	// предварительно ошибок нет
			
			// проверяем, заполнены ли все нужные поля
			f.find('#cityTo, #weight, #volume').each( function(){
				var inputVal = $.trim( $(this).val() )
				if ( !(inputVal) ) {
					console.log("Найдено пустое поле, расчёт пока не нужен")
					error = true
					console.groupEnd()
					return false
				}
			})
			if (error) { return false }
			else {
				f.find('#weight, #volume').each( function(){
					var inputVal = $(this).val(),
						inputId = $(this).attr('id'),
						decimal = 1
					
					// проверяем, правильно ли заполнены числовые поля
					if ( isNaN(inputVal) ) {
						alert("Введите числовое значение!")
						console.log("Введено нечисловое значение")
						console.groupEnd()
						error = true
					}
					
					if (error) { return false }
					else {
						// заменяем запятые на точки для правильности расчётов
						inputVal.replace(/,/, '.')
						
						if ( inputId == 'weight' ) {
							// если вес — округляем до 0,5 вверх
							decimal = (inputVal % 1 == 0) ? 0 : 1
							
							inputVal = (Math.round(inputVal*2) / 2).toFixed(decimal)
							$(this).val( inputVal )
						} else if ( inputId == 'volume' ) {
							// если объём — просто округляем до двух знаков
							$(this).val( round(inputVal, 2) )
						}
					}
				})
			}
			
			console.log("Отлично, работаем дальше")
			console.groupEnd()
			return true
		}
		
		
		/**
		 * Функция для проверки веса на соответствие минимальному весу и объёмному весу
		 * @param  {[number]} w				Вес груза, переданный из поля в форме
		 * @param  {[number]} v				Объём груза, переданный из поля в форме
		 * @param  {[object Object]} opt	Выбранный option из select'а в форме
		 * @return {[number]} w				Полученный правильный вес груза
		 */
		function checkWeight(w, v, opt) {
			console.group("Запуск функции checkWeight()")
			var minW = opt.min,
				Mv = v * 167 // Mv — объёмный вес, 167 — магическая константа от клиента
			
			// проверяем, не меньше ли наш вес чем объёмный вес
			if (w < Mv) {
				console.log("Вес меньше объёмного веса!")
				w = Mv
			}
			// но при этом вес всё равно не должен быть меньше минимального
			if (w < minW) {
				console.log("Вес меньше минимального веса!")
				w = minW
			}
			
			return w
		}
		
		
		/**
		 * Функция для расчёта тарифа
		 * @param  {[number]} w				Вес груза, переданный из поля в форме
		 * @param  {[object Object]} opt	Выбранный option из select'а в форме
		 * @return {[number]} t				Полученный тариф
		 */
		function getTariff(w, opt) {
			console.group("Запуск функции getTariff()")
			var min = opt.min,
				n = opt.n,
				m1 = opt.m1 ? opt.m1 : n,
				m2 = opt.m2 ? opt.m2 : n,
				m3 = opt.m3 ? opt.m3 : n,
				m4 = opt.m4 ? opt.m4 : n,
				gCode = opt.g,
				g,
				t
			
			if (gCode) {
				// если тариф — тяжеловес, то тариф автоматом считается по G
				console.log("G есть. Тариф — тяжеловес!")
				g = getG(gCode, n)
				t = g
			} else {
				// если не тяжеловес, то проверяем на вес (тут немножко хитрый switch)
				console.log("G нет. Тариф — не тяжеловес!")
				switch (true) {
					case w <= min:
						t = n
						break
					case w > min && w <= 100:
						t = m1
						break
					case w > 100 && w <= 300:
						t = m2
						break
					case w > 300 && w <= 500:
						t = m3
						break
					case w > 500:
						t = m4
						break
					default:
						break
				}
			}
			
			return t
		}
		
		
		/**
		 * Функция для расчёта параметра G
		 * @param  {[number]} gCode		Значение G из словаря
		 * @param  {[string]} n			Значение нормального веса из словаря
		 * @return {[number]} g			Полученный параметр  G
		 */
		function getG(gCode, n) {
			console.group("Запуск функции getG()")
			var g
				
			// в зависимости от значения gCode, смотрим, чему будет равняться значение g
			switch (gCode) {
				case "N+5":
					g = n + 5
					break
				case "N+10":
					g = n + 10
					break
				case "120%":
					g = n / 100 * 120
					break
				case "150%":
					g = n / 100 * 150
					break
				case "180%":
					g = n / 100 * 180
					break
				default:
					break
			}
			
			console.log("Рассчитали G: " + g)
			console.groupEnd()
			return g
		}
		
		
		/**
		 * Функция для расчёта параметра AWB
		 * @param  {[number]} awbCode	Код AWB, переданный от города из формы
		 * @return {[number]} awb		Полученный параметр AWB
		 */
		function getAWB(awbCode) {
			console.group("Запуск функции getAWB()")
			var awb
			
			// в зависимости от значения awbCode из словаря, смотрим, чему будет равняться значение awb
			switch (awbCode) {
				case "SU":
				case "СУ":
					awb = 15
					break
				case "C7":
				case "S7":
					awb = 250
					break
				case "У6":
					awb = 350
					break
				default:
					awb = 0
					break
			}
			
			return awb
		}
		
		
		/**
		 * Функция для расчёта параметра бронирования
		 * @param  {[number]} w		Правильный рассчитанный вес груза
		 * @return {[number]} b		Полученный параметр бронирования
		 */
		function getBooking(w) {
			console.group("Запуск функции getBooking()")
			var b
			b = w * 1.5
			if (b < 150) b = 150
			return b
		}
		
		
		/**
		 * Функция для расчёта параметра бронирования S7
		 * @param  {[number]} awbCode	Код AWB, переданный от города из формы
		 * @return {[number]} bS7		Полученный параметр бронирования S7
		 */
		function getBookingS7(awbCode) {
			console.group("Запуск функции getBookingS7()")
			var bS7
			
			// в зависимости от значения awbCode из словаря, смотрим, чему будет равняться значение bS7
			switch (awbCode) {
				case "C7":
				case "S7":
					bS7 = 210
					break
				default:
					bS7 = 0
					break
			}
			return bS7
		}
		
		
		/**
		 * Функция для расчёта топливного сбора
		 * @param  {[number]} w			Правильный рассчитанный вес груза
		 * @param  {[number]} awbCode	Код AWB, переданный от города из формы
		 * @return {[number]} f			Полученный топливный сбор
		 */
		function getFuelCharge(w, awbCode) {
			console.group("Запуск функции getFuelCharge()")
			var f
			
			// в зависимости от значения awbCode из словаря, смотрим, как высчитывать значение f
			switch (awbCode) {
				case "SU":
				case "СУ":
				case "C7":
				case "S7":
					f = w * 3
					break
				default:
					f = 0
					break
			}
			return f
		}
		
		
		/**
		 * Функция для расчёта агентского сбора
		 * @param  {[number]} w		Правильный рассчитанный вес груза
		 * @return {[number]} a		Полученный агентский сбор
		 */
		function getAirportCharge(w) {
			console.group("Запуск функции getAirportCharge()")
			var a
			a = 5 * w + 450 // 450 — магическая константа от клиента
			return a
		}
		
		
		/**
		 * Функция для превращения результата в красивую строку
		 * @param  {[number]} r		Рассчитанный результат
		 * @return {[string]} bR	Полученный «красивый» результат
		 */
		function beautifyResult(r) {
			var bR
			bR = round(r, 0) // вначале округляем до целого
			bR = Math.ceil(bR / 10) * 10 // затем округляем в сторону большего десятка
			bR = bR.toLocaleString() // затем превращаем в красивую строку с отступами между разрядами
			return bR
		}
		
		
		/**
		 * Функция от Jack L Moore, которая правильно округляет дробные числа
		 * @param  {[number]} value			Само дробное число
		 * @param  {[number]} decimals		Количество знаков после запятой
		 * @return {[number]} Number		Полученное округлённое число
		 */
		function round(value, decimals) {
			return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
		}
		
		
		/**
		 * Функция debounce откладывает вызов функции f на ms миллисекунд.
		 * Честно стырено отсюда https://learn.javascript.ru/task/debounce
		 * @param  {[Object function]} f	Само дробное число
		 * @param  {[Object date]} ms		Количество знаков после запятой
		 * @return {[Object function]} 		Полученное округлённое число
		 */
		function debounce(f, ms) {
			let timer = null

			return function (...args) {
				const onComplete = () => {
					f.apply(this, args);
					timer = null;
				}

				if (timer) {
					clearTimeout(timer);
				}

				timer = setTimeout(onComplete, ms);
			}
		}
		
		
		/**
		 * Открытие модального окна с формой заявки по клику на кнопку в калькуляторе
		 */
		$('.call-checkout').on('click', function () {
			$.fancybox.open({
				src  : '#calc-form',
				type : 'inline',
				opts : {
					beforeShow : function() {
						if ( !$.trim( $('#date').val() ) ) {
							$('.calculation-date').closest('p').remove()
						} else {
							$('.calculation-date').text( $('#date').val() )
						}
						$('.calculation-city-to').text( option.text )
						$('.calculation-weight').text( $('#weight').val() )
						$('.calculation-volume').text( $('#volume').val() )
						$('.calculation-price').text( $('#resultPrice').text())
						
						$('.calculation').show()
						$('.calculation p.hidden').show()
					}
				}
			})
		})
	})
	
		
	/////////////////////////////////////////////////////////////////
	//  Валидация и отправка форм
	/////////////////////////////////////////////////////////////////
	$("[data-mailform]").submit(function(){ // пeрeхвaтывaeм всe при сoбытии oтпрaвки
		var form = $(this), // зaпишeм фoрму, чтoбы пoтoм нe былo прoблeм с this
			result = $('.modal--result'), // результат
			button = form.find('button[type="submit"]'), // кнопка отправки
			mailHandler = '/app/post/mail-handler.php', // путь дo php-oбрaбoтчикa
			url = form.find('input[name="url"]'), // поле, куда запишем текущую страницу
			opd = form.find('input[name="opd"]'), // для проверки галочки о согласии
			error = false // прeдвaритeльнo oшибoк нeт
		
		url.val(window.location.href) // запишем адрес страницы, где мы сейчас
		
		if (opd.is(":checked")) { // проверяем, стоит ли галочка о согласии
			opd.val('yasss') // если да, то пишем value для php-обработчика
		} else {
			result.html('Необходимо дать своё согласие на обработку данных!') // если нет, то кричим!
			$.fancybox.open( result )
			setTimeout(function () { $.fancybox.close() }, 5000)
			error = true
		}
			
		form.find('input[required], textarea[required]').each( function(){ // прoбeжим пo кaждoму обязательному пoлю в фoрмe
			if ($(this).val() == '') { // eсли нaхoдим пустoe
				result.html('Зaпoлнитe обязательное пoлe "'+$(this).attr('placeholder')+'"!') // гoвoрим зaпoлняй!
				$.fancybox.open( result )
				setTimeout(function () { $.fancybox.close() }, 5000)
				error = true
			}
		})
		
		if ( form.find('input[name="form-id"]').val() == 'calculation' ) {
			$('.calculation-text').val( $('.calculation').text() )
			console.log($('.calculation-text').val())
		}
		
		if (!error) { // eсли oшибки нeт
			var data = form.serialize() // пoдгoтaвливaeм дaнныe
			console.log(data)
			$.ajax({ // инициaлизируeм ajax зaпрoс
			   type: 'POST', // oтпрaвляeм в POST фoрмaтe, мoжнo GET
			   url: mailHandler, // путь дo php-oбрaбoтчикa
			   dataType: 'json', // oтвeт ждeм в json фoрмaтe
			   data: data, // дaнныe для oтпрaвки
			   beforeSend: function(data) { // сoбытиe дo oтпрaвки
					button.attr('disabled', 'disabled') // нaпримeр, oтключим кнoпку, чтoбы нe жaли пo 100 рaз
				  },
			   success: function(data){ // сoбытиe пoслe удaчнoгo oбрaщeния к сeрвeру и пoлучeния oтвeтa
					if (data['error']) { // eсли oбрaбoтчик вeрнул oшибку
						result.html(data['error'])
						$.fancybox.open( result ) // пoкaжeм eё тeкст
						setTimeout(function () { $.fancybox.close() }, 5000)
						console.error('Обработчик писем вернул ошибку! Текст ошибки: ' + data['error'])
					} else { // eсли всe прoшлo oк
						form[0].reset() // чистим форму
						$.fancybox.close() // закрываем активное окошко
						result.html('<h3>Спасибо за заявку!</h3><p>Наш менеджер свяжется с вами в ближайшее время!</p>')
						$.fancybox.open( result ) // выводим сообщение, чтo всe oк
						grecaptcha.execute('zdes_kluch_kapchi').then(function(token) {
						   $('.google_token').each(function(){
								$(this).val(token)
						   })
						})
						setTimeout(function () { $.fancybox.close() }, 5000)
					}
				 },
			   error: function (xhr, ajaxOptions, thrownError) { // в случae нeудaчнoгo зaвeршeния зaпрoсa к сeрвeру
					result.html('Ошибка!<br>' + xhr.status + '<br>' + thrownError) // пoкaжeм oтвeт сeрвeрa и тeкст oшибки
					$.fancybox.open( result )
					setTimeout(function () { $.fancybox.close() }, 5000)
				 },
			   complete: function(data) { // сoбытиe пoслe любoгo исхoдa
					button.prop('disabled', false) // в любoм случae включим кнoпку oбрaтнo
				 }
			})
		}
		
		return false // вырубaeм стaндaртную oтпрaвку фoрмы
	})
	
	/////////////////////////////////////////////////////////////////
	//  Скрипт для получения токена капчи
	//  Для данной версии закомменчен, ибо мешает работать калькулятору :о)
	/////////////////////////////////////////////////////////////////
	/*grecaptcha.ready(function() {
		grecaptcha.execute('zdes_kluch_kapchi').then(function(token) {
		   $('.google_token').each(function(){
				$(this).val(token)
		   })
		})
	})*/
	
	
}(window.$))
