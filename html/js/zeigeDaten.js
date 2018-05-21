function zeigeDaten(selcet, input) {
	var i = 0;
	var count = 0;
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
		count++;
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
		while (i <= museen.length - 1) {
			listenAusgabe();
			i++;
		}
		ueberschriftPos.innerHTML = count + ' Museen insgesamt.';
	}
	if (selcet == 'frei') {
		while (i <= museen.length - 1) {
			if (museen[i].eintritt == 'frei') {
				listenAusgabe();
			}
			i++
		}
		ueberschriftPos.innerHTML += count + ' Museen mit freiem Eintritt.';
	}
	if (selcet == 'zeitg') {
		while (i <= museen.length - 1) {
			if (museen[i].typ.includes('zeitgenössisch') == true) {
				listenAusgabe();		
			}
			i++
		}
		ueberschriftPos.innerHTML += count + ' Museen mit zeitgenössischen Ausstellungen.';
	}
	if (selcet == 'historisch') {
		while (i <= museen.length - 1) {
			if (museen[i].typ.includes('historisch') == true) {
				listenAusgabe();		
			}
			i++
		}
		ueberschriftPos.innerHTML += count + ' Museen mit historischen Ausstellungen.';
	}
	if (input != '') {
		while (i <= museen.length - 1) {
			if (museen[i].bezeichnung.includes(input) == true || museen[i].beschreibung.includes(input) == true) {
				listenAusgabe();		
			}
			i++
		}
		if (count == 0) {
			ueberschriftPos.innerHTML += '<em>' + input + '</em> wurde in keinem Beitrag gefunden.';
		}
		if (count == 1) {
			ueberschriftPos.innerHTML += '<em>' + input + '</em> wurde in einem Beitrag gefunden.';
		} 
		if (count > 1) {
			ueberschriftPos.innerHTML += '<em>' + input + '</em> wurde in ' + count + ' Beiträgen gefunden.';
		}
	}		
}
