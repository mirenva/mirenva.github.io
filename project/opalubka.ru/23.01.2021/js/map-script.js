(function ($) {
	'use strict';

	const mapElem = $('#contactMap');

	if (mapElem) {
		ymaps.ready(function () {
			const opalubkaMap = new ymaps.Map('contactMap', {
				center: [55.86800741247049,37.45588450000001],
				zoom: 10,
				controls: []
			});

			const placemarkOffice = window.placemark = new ymaps.Placemark([55.814689568919476,37.45588450000001], {
				iconContent: 'Офис компании «Опалубка»',
				balloonContent: 'Офис компании «Опалубка»<br>Москва, ул. Габричевского, д. 5, корп. 1.<br>Отдел аренды — офис 104<br>Отдел продаж — офис 102'
			},{
				preset: 'islands#darkBlueStretchyIcon'
			});

			const placemarkStorage = new ymaps.Placemark([55.96011949677388,37.54906249999998], {
				iconContent: 'Склад компании «Опалубка»',
				balloonContent: 'Склад компании «Опалубка»<br>МО, Мытищинский район, д. Грибки<br>(5 км. от МКАД по Дмитровскому шоссе)'
			},{
				preset: 'islands#darkBlueStretchyIcon'
			});

			const zoomControl = new ymaps.control.ZoomControl;
			opalubkaMap.controls.add(zoomControl);
			opalubkaMap.behaviors.disable('scrollZoom');

			opalubkaMap.geoObjects.add(placemarkOffice);
			opalubkaMap.geoObjects.add(placemarkStorage);
		});
	}
}(window.$))