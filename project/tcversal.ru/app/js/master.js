(function ($) {
	'use strict'

	$(document).ready(function () {
		
		// красиво разделяем все числа тонким пробелом по разрядам
		var numbers = $('.catalog-item__price-number')
		$(numbers).each(function() {
			var number = $(this).html()
			number = number.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1&nbsp;')
			$(this).html(number)
		})
		
		// анимируем числа на баннере главной страницы при загрузке
		$('.js-animated-number').each(function() {
			console.log('test')
			console.log($(this))
			console.log($(this).text())
			var numberToAnimate = $(this).text()
			$(this).animate({ num: numberToAnimate /* искомое минус начало */ }, {
				duration: 3000,
				step: function (num){
					this.innerHTML = (num).toFixed(0)
				}
			});
		});

		
	}())
}(window.jQuery))