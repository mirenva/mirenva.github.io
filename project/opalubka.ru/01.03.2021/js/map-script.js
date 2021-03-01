(function ($) {
	'use strict';

	const mapElem = $('#contactMap');

	if (mapElem) {
		ymaps.ready(function () {
			const opalubkaMap = new ymaps.Map('contactMap', {
				center: [55.86921799173241,37.61797312695314],
				zoom: 10,
				controls: []
			});

			const zoomControl = new ymaps.control.ZoomControl;
			opalubkaMap.controls.add(zoomControl);
			opalubkaMap.behaviors.disable('scrollZoom');

			const layoutOffice = getContentLayoutOffice();
			const layoutStorage = getContentLayoutStorage();

			const placemarkOffice = new ymaps.Placemark([55.814689568919476,37.45588450000001], {
				title: 'ОФИС',
				address: 'Москва, ул. Габричевского, д. 5, корп. 1',
				worktime: 'ПН—ПТ с 9:00 до 17:00 часов. СБ—ВС выходной',
			}, {iconLayout: layoutOffice, iconOffset: [0, -100]});

			const placemarkStorage = new ymaps.Placemark([55.96011949677388,37.54906249999998], {
				title: 'СКЛАД',
				address: 'МО, Мытищинский район, д. Грибки<br>(5 км. от МКАД по Дмитровскому шоссе)',
			}, {iconLayout: layoutStorage, iconOffset: [0, -100]});

			opalubkaMap.geoObjects.add(placemarkOffice);
			opalubkaMap.geoObjects.add(placemarkStorage);
		});
	}
}(window.$));

function getContentLayoutOffice() {
	return ymaps.templateLayoutFactory.createClass(
		'<div class="map-mark">' +
			'<div class="map-mark__left">' +
				'<img src="https://api-maps.yandex.ru/2.0.48/images/2c3d90d4e522c1f62b6cf3e59f7a877d.png"/>' +
			'</div>' +
			'<div class="map-mark__right">' +
				'<div class="map-mark__text map-mark__text--title">' +
					'<b>{{ properties.title | raw }}</b>' +
				'</div>' +
				'<div class="map-mark__text map-mark__text--address">' +
					'{{ properties.address | raw }}' +
				'</div>' +
				'<div class="map-mark__text map-mark__text--worktime">' +
					'{{ properties.worktime | raw }}' +
				'</div>' +
			'</div>' +
		'</div>'
	);
}

function getContentLayoutStorage() {
	return ymaps.templateLayoutFactory.createClass(
		'<div class="map-mark">' +
			'<div class="map-mark__left">' +
				'<img src="https://api-maps.yandex.ru/2.0.48/images/2c3d90d4e522c1f62b6cf3e59f7a877d.png"/>' +
			'</div>' +
			'<div class="map-mark__right">' +
				'<div class="map-mark__text map-mark__text--title">' +
					'<b>{{ properties.title | raw }}</b>' +
				'</div>' +
				'<div class="map-mark__text map-mark__text--address">' +
					'{{ properties.address | raw }}' +
				'</div>' +
			'</div>' +
		'</div>'
	);
}