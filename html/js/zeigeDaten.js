function zeigeDaten(selcet) {
	var i = 0;
	var ueberschriftPos;
	var listenAusgabePos;
	var kartenAusgabePos;

	ueberschriftPos = document.getElementById('ueberschrift');
	ueberschriftPos.innerHTML = '';
	
	listenAusgabePos = document.getElementById('listenAusgabe');	
	listenAusgabePos.innerHTML = '';
	
	kartenAusgabePos = document.getElementById('kartenAusgabe');
	kartenAusgabePos.innerHTML = '';
	
	imageMuseumPos = document.getElementById('imageMuseum');
	
	function listenAusgabe() {		
		listenAusgabePos.innerHTML += '<h2>' + 
		museen[i].bezeichnung + '</h2>' +
		'<table><tr style="vertical-align:top"><td style="width:50%">' +
		museen[i].beschreibung + '<br><br>' +
		museen[i].bezeichnung + '<br>' + 
		museen[i].adresse + ", " +
		museen[i].ort + '<br>' +
		museen[i].telefon + '</br><a target= "_blank" href="' +
		museen[i].url + '">' + museen[i].url + '</a></br><a href="mailto:' +
		museen[i].email + '">' + museen[i].email + '</a><br>' + 
		'<h3>Öffnungszeiten:</h3>' +
		museen[i].oeffnungszeiten + '<br>' + 
		'<h3>Eintritt:</h3>' + 
		museen[i].eintritt + '<br></td><td><img src="./img/' +
		museen[i].image + '" width="100%"></br></td></tr>' + 		
		'<tr style="vertical-align:top"><td style="width:50%">' +
		'<h3>Aktuelle Ausstellung:</h3>' +
		museen[i].ausstellungDatum + '<br>' + 
		museen[i].ausstellungTitel + '<br>' + 	
		'</td><td><a target= "_blank" href="' +
		museen[i].urlAusstellung + '"><img src="./img/' +
		museen[i].imageAktuell + '" width="100%"></a></table>';			
	}
	
	if (selcet == 'alle') {
		ueberschriftPos.innerHTML = 'Alle Muessen';
		while (i <= museen.length - 1) {
			listenAusgabe();
			i++;
		}
	}
	if (selcet == 'frei') {
		ueberschriftPos.innerHTML = 'Freier Eintritt';
		while (i <= museen.length - 1) {
			if (museen[i].eintritt == 'frei') {
				listenAusgabe();		
			}
			i++
		}
	}
	if (selcet == 'zeitgenössisch') {
		ueberschriftPos.innerHTML = 'Zeitgenössisch';
		while (i <= museen.length - 1) {
			if (museen[i].typ.includes('zeitgenössisch') == true) {
				listenAusgabe();		
			}
			i++
		}
	}
	if (selcet == 'historisch') {
		ueberschriftPos.innerHTML = 'Historisch';
		while (i <= museen.length - 1) {
			if (museen[i].typ.includes('historisch') == true) {
				listenAusgabe();		
			}
			i++
		}
	}
}