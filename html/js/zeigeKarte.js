function zeigeKarte() {
	var map;
	var i;
	var options;
	var pos;
	var mapPos;
	var markerDaten;
	var ueberschriftPos;
	
	ueberschriftPos = document.getElementById('ueberschrift');
	ueberschriftPos.innerHTML = 'Karte';

	listenAusgabePos = document.getElementById('listenAusgabe');
	listenAusgabePos.innerHTML = '';

	pos = {
		lat: 47.0617343,
		lng: 8.2864024
	};

	options = {
		center: pos,
		zoom: 13
	};

	mapPos = document.getElementById('kartenAusgabe');
	map = new google.maps.Map(mapPos, options);

	i = 0;
	while (i <= museen.length - 1) {
		pos = {
			lat: museen[i].latitude,
			lng: museen[i].longitude
		};
		markerDaten = {
			position: pos,
			map: map,
			title: museen[i].bezeichnung,
			animation: google.maps.Animation.DROP
		};
		markerCurrent = new google.maps.Marker(markerDaten);
		i++;
	}

}
