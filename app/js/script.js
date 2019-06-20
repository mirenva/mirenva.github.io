//микро-библиотека для создания функции closest() (взята тут https://github.com/jonathantneal/closest)
!function(e){"function"!=typeof e.matches&&(e.matches=e.msMatchesSelector||e.mozMatchesSelector||e.webkitMatchesSelector||function(e){for(var t=this,o=(t.document||t.ownerDocument).querySelectorAll(e),n=0;o[n]&&o[n]!==t;)++n;return Boolean(o[n])}),"function"!=typeof e.closest&&(e.closest=function(e){for(var t=this;t&&1===t.nodeType;){if(t.matches(e))return t;t=t.parentNode}return null})}(window.Element.prototype)

// скрипт для открытия/закрытия модалки
document.addEventListener('DOMContentLoaded', function () {

    var openModalLinks = document.querySelectorAll(".js-open-modal"),
    	closeModalLinks = document.querySelectorAll(".js-close-modal")

    // открытие модалки по клику на соответствующий элемент
	openModalLinks.forEach(function(item){
		item.addEventListener('click', function(event) {
			event.preventDefault()

			var modalTarget = this.getAttribute('data-modal'),
         		modalElem = document.querySelector('.modal[data-modal="' + modalTarget + '"]')
        	
			modalElem.classList.add('modal--active')
			document.body.classList.add('overflow-y-hidden')
			window.scrollTo(0,0)
		})
	})

    // закрытие модалки по клику на крестик в ней
	closeModalLinks.forEach(function(item){
		item.addEventListener('click', function(event) {
			var modalToClose = this.closest('.modal');
			modalToClose.classList.remove('modal--active')
			document.body.classList.remove('overflow-y-hidden')
		})
	})

    // закрытие модалки по нажатию на escape
	document.body.addEventListener('keyup', function (e) {
		var key = e.keyCode
		if (key == 27) {
			document.querySelector('.modal--active').classList.remove('modal--active')
			document.body.classList.remove('overflow-y-hidden')
		}
	}, false)

})