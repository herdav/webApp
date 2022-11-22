// --------------------------------------- //
// -- Created 2016-2022 by David Herren -- //
// ------- https://davidherren.ch -------- //
// --------------------------------------- //

var id, workSelected, savedSelector;
var langCurrent;
var langChanged = false;
var urlIndex = window.location.protocol + "//" + window.location.host + window.location.pathname;

function menu() {
	var menuPos = document.getElementById("works");
	menuPos.innerHTML = "";
	for (var i = 0; i < works.length; i++) {
		if (works[i].menu) {
			menuPos.innerHTML += `<a class="link" href="javascript:content('` + works[i].name + `')">` + works[i].menu + `</a>`;
		} else {
			menuPos.innerHTML += `<a class="link" href="javascript:content('` + works[i].name + `')">` + works[i].title + `</a>`;
		}
	}
}

function content(selector) {
	savedSelector = selector;

	function contentSelect() {
		if (selector === "") {
			selector = "index";
		}
		if (selector !== "index" && selector !== "about" && selector !== "exhibitions") {
			workSelected = true;
		} else {
			workSelected = false;
			id = selector;
		}
		if (workSelected === true) {
			for (var i = 0; i < works.length; i++) {
				if (works[i].name === selector) {
					id = i;
				}
			}
		}
	}
	function docTitle() {
		if (workSelected === true) {
			document.title = works[id].title + " | David Herren";
		}
		if (selector === "index") {
			document.title = "David Herren";
		}
		if (selector === "about") {
			document.title = "About | David Herren";
		}
		if (selector === "exhibitions") {
			document.title = "Exhibitions | David Herren";
		}
	}
	function dynamic() {
		{
			window.scrollTo(0, 0);
			var workPos = document.getElementById("work");
			var flexPos = document.getElementById("flex");
			var listPos = document.getElementById("list");
			var exhiPos = document.getElementById("exhi");
			workPos.innerHTML = "";
			flexPos.innerHTML = "";
			listPos.innerHTML = "";
			exhiPos.innerHTML = "";
			document.getElementById("load").style.visibility = "hidden";
		}
		{ // work project pages
			function work_de() {
				document.getElementsByTagName("META")[0].content = works[id].description_de;
				if (works[id].text_copy) { // copy description from another project
					for (var i = 0; i < works.length; i++) {
						if (works[i].name === works[id].text_copy) {
							workPos.innerHTML = '<img alt="' +
								works[id].image_meta + '" src="./img/' +
								works[id].image + '" width="100%"><div class="text"><h1>' +
								works[id].title + '</h1>' + '<p>' +
								works[id].year + ', ' +
								works[id].data_de + ', ' +
								works[id].size_de +
								works[id].edition + '<br><p class="column">' +
								works[i].text_de + '</p>' +
								works[id].links + '</p></div>';
						}
					}
				} else if (works[id].vimeo_id) { // show video instead of image
					workPos.innerHTML = '<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/' + works[id].vimeo_id + '?h=543f1f4ab7&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>' + '<div class="text"><h1>' +
						works[id].title + '</h1>' + '<p>' +
						works[id].year + ', ' +
						works[id].data_de + ', ' +
						works[id].size_de +
						works[id].edition + '<br><p class="column">' +
						works[id].text_de + '</p>' +
						works[id].links + '</p></div>';
				} else if (works[id].image_highres && window.innerWidth >= 1200) { // show high resolution image with zoom function
					document.getElementById("load").style.visibility = "visible";
					let outerHeigh = 500;
					let initialScale = 0.1;
					let newHeigh = initialScale * works[id].image_highres_heigh;
					let deltaTopA = (works[id].image_highres_heigh - newHeigh) / 2;
					let deltaTopB = (works[id].image_highres_heigh + newHeigh - outerHeigh) / 2 - outerHeigh / 2;
					let deltaTop = -1 * (deltaTopA + deltaTopB) / 2;
					let newWidth = initialScale * works[id].image_highres_width;
					let deltaLeftA = (works[id].image_highres_width - newWidth) / 2;
					let deltaLeftB = (works[id].image_highres_width + newWidth - outerHeigh) / 2 - outerHeigh / 2;
					let deltaLeft = -1 * (deltaLeftA + deltaLeftB) / 2;
					workPos.innerHTML = '<div id="zoom_outer" style="height:'+ outerHeigh + 'px"><img ' + 
						'style="transform: matrix('+ initialScale + ', 0, 0,' + initialScale + ', 0, 0);' + // set initial scale
						'left:' + deltaLeft +'px; top:' + deltaTop + 'px"' + // set inital position
						'id="zoom_element" alt="' + 
						works[id].image_meta + '" src="./img/' +
						works[id].image_highres + '"></div><div class="text"><h1>' +
						works[id].title + '</h1>' + '<p>' +
						works[id].year + ', ' +
						works[id].data_de + ', ' +
						works[id].size_de +
						works[id].edition + '<br><p class="column">' +
						works[id].text_de + '</p>' +
						works[id].links + '</p></div>';
					panzoom('#zoom_element', {
						bound:'outer',
						scale_min: 0.01, // 0.01 to 20
						scale_max: 0.8 // 0.01 to 20
					});
				} else if (works[id].essay) {
					workPos.innerHTML = '<img alt="' +
						works[id].image_meta + '" src="./img/' +
						works[id].image + '" width="100%"><div class="text"><h1>' +
						works[id].title + '</h1>' + '<p>' +
						works[id].year + ', ' +
						works[id].data_de + ', ' +
						works[id].size_de +
						works[id].edition + '<br><div id="essay">' +
						works[id].essay + 
						works[id].links + '</p></div>';
				}
				else { // show image
					workPos.innerHTML = '<img alt="' +
						works[id].image_meta + '" src="./img/' +
						works[id].image + '" width="100%"><div class="text"><h1>' +
						works[id].title + '</h1>' + '<p>' +
						works[id].year + ', ' +
						works[id].data_de + ', ' +
						works[id].size_de +
						works[id].edition + '<br><p class="column">' +
						works[id].text_de + '</p>' +
						works[id].links + '</p></div>';
				}
			}
			function work_en() {
				document.getElementsByTagName("META")[0].content = works[id].description_en;
				if (works[id].text_copy) { // copy description from another project
					for (var i = 0; i < works.length; i++) {
						if (works[i].name === works[id].text_copy) {
							workPos.innerHTML = '<img alt="' +
								works[id].image_meta + '" src="./img/' +
								works[id].image + '" width="100%"><div class="text"><h1>' +
								works[id].title + '</h1>' + '<p>' +
								works[id].year + ', ' +
								works[id].data_en + ', ' +
								works[id].size_en +
								works[id].edition + '<br><p class="column">' +
								works[i].text_en + '</p>' +
								works[id].links + '</p></div>';
						}
					}
				} else if (works[id].vimeo_id) { // show video instead of image
					workPos.innerHTML = '<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/' + works[id].vimeo_id + '?h=543f1f4ab7&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>' + '<div class="text"><h1>' +
						works[id].title + '</h1>' + '<p>' +
						works[id].year + ', ' +
						works[id].data_en + ', ' +
						works[id].size_en +
						works[id].edition + '<br><p class="column">' +
						works[id].text_en + '</p>' +
						works[id].links + '</p></div>';
				} else if (works[id].image_highres && window.innerWidth >= 1200) { // show high resolution image with zoom function
					document.getElementById("load").style.visibility = "visible";
					let outerHeigh = 500;
					let initialScale = 0.1;
					let newHeigh = initialScale * works[id].image_highres_heigh;
					let deltaTopA = (works[id].image_highres_heigh - newHeigh) / 2;
					let deltaTopB = (works[id].image_highres_heigh + newHeigh - outerHeigh) / 2 - outerHeigh / 2;
					let deltaTop = -1 * (deltaTopA + deltaTopB) / 2;
					let newWidth = initialScale * works[id].image_highres_width;
					let deltaLeftA = (works[id].image_highres_width - newWidth) / 2;
					let deltaLeftB = (works[id].image_highres_width + newWidth - outerHeigh) / 2 - outerHeigh / 2;
					let deltaLeft = -1 * (deltaLeftA + deltaLeftB) / 2;
					workPos.innerHTML = '<div id="zoom_outer" style="height:'+ outerHeigh + 'px"><img ' + 
						'style="transform: matrix('+ initialScale + ', 0, 0,' + initialScale + ', 0, 0);' + // set initial scale
						'left:' + deltaLeft +'px; top:' + deltaTop + 'px"' + // set inital position
						'id="zoom_element" alt="' + 
						works[id].image_meta + '" src="./img/' +
						works[id].image_highres + '"></div><div class="text"><h1>' +
						works[id].title + '</h1>' + '<p>' +
						works[id].year + ', ' +
						works[id].data_en + ', ' +
						works[id].size_en +
						works[id].edition + '<br><p class="column">' +
						works[id].text_en + '</p>' +
						works[id].links + '</p></div>'
					panzoom('#zoom_element', {
						bound:'outer',
						scale_min: 0.01, // 0.01 to 20
						scale_max: 0.8 // 0.01 to 20
					});
				} else if (works[id].essay) {
						workPos.innerHTML = '<img alt="' +
							works[id].image_meta + '" src="./img/' +
							works[id].image + '" width="100%"><div class="text"><h1>' +
							works[id].title + '</h1>' + '<p>' +
							works[id].year + ', ' +
							works[id].data_en + ', ' +
							works[id].size_en +
							works[id].edition + '<br><div id="essay">' +
							works[id].essay + 
							works[id].links + '</p></div>';
				} else { // show image
					workPos.innerHTML = '<img alt="' +
						works[id].image_meta + '" src="./img/' +
						works[id].image + '" width="100%"><div class="text"><h1>' +
						works[id].title + '</h1>' + '<p>' +
						works[id].year + ', ' +
						works[id].data_en + ', ' +
						works[id].size_en +
						works[id].edition + '<br><p class="column">' +
						works[id].text_en + '</p>' +
						works[id].links + '</p></div>';
				}
			}
		}
		function workDetail() {
			if (workSelected === true && (id >= 0 || langChanged === true)) {
				if (window.innerWidth >= 600) {
					document.body.style.backgroundImage = "url('./img/" +
						works[id].image_back + "')";
				} else {
					document.body.style.backgroundImage = null;
				}
				if (langCurrent === "de") {
					work_de();
				}
				if (langCurrent === "en") {
					work_en();
				}
			}
		}
		function pages() {
			if (id === "index") {
				currentLang();
				if (window.innerWidth >= 600) {
					document.body.style.backgroundImage = "url('./img/back/davidherren-atlas-back.jpg')";
				} else {
					document.body.style.backgroundImage = null;
				}

				if (langCurrent === "de") {
					document.getElementsByTagName("META")[0].content = about[0].text_de;
					for (var i = 0; i < works.length; i++) {
						flexPos.innerHTML += '<div class="flxSub"><div class="flxSubImg"><a class="imgLink" href="javascript:content(' + "'" +
							works[i].name + "'" + ')"><img alt="' +
							works[i].image_prev_meta + '" src="./img/' +
							works[i].image_prev + '" width="100%"></a></div><div class="text"><h2>' +
							works[i].title + '</h2><p>' +
							works[i].year + ', ' +
							works[i].data_de + ', ' +
							works[i].size_de +
							works[i].edition + '<br><br>' +
							works[i].links + '</p></div></div>';
					}
				}
				if (langCurrent === "en") {
					document.getElementsByTagName("META")[0].content = about[0].text_en;
					for (var j = 0; j < works.length; j++) {
						flexPos.innerHTML += '<div class="flxSub"><div class="flxSubImg"><a class="imgLink" href="javascript:content(' + "'" +
							works[j].name + "'" + ')"><img alt="' +
							works[j].image_prev_meta + '" src="./img/' +
							works[j].image_prev + '" width="100%"></a></div><div class="text"><h2>' +
							works[j].title + '</h2><p>' +
							works[j].year + ', ' +
							works[j].data_en + ', ' +
							works[j].size_en +
							works[j].edition + '<br><br>' +
							works[j].links + '</p></div></div>';
					}
				}
			}

			if (id === "about") {
				currentLang();
				document.body.style.backgroundImage = "none";

				if (langCurrent === "de") {
					document.getElementsByTagName("META")[0].content = about[0].text_de;
					for (var k = 0; k < about.length; k++) {
						listPos.innerHTML += '<div class="about"><h2>' +
							about[k].title_de + '</h2><p>' +
							about[k].text_de + '</p></div>';
					}
				}
				if (langCurrent === "en") {
					document.getElementsByTagName("META")[0].content = about[0].text_en;
					for (var l = 0; l < about.length; l++) {
						listPos.innerHTML += '<div class="about"><h2>' +
							about[l].title_en + '</h2><p>' +
							about[l].text_en + '</p></div>';
					}
				}
			}

			if (id === "exhibitions") {
				currentLang();
				document.body.style.backgroundImage = "none";
				document.getElementsByTagName("META")[0].content = about[0].text_de;

				if (langCurrent === 'de') {
					for (var m = 0; m < exhibitions.length; m++) {
						exhiPos.innerHTML += '<div class="exhi">' + '<div class="exhi-txt"><h2>' +
							exhibitions[m].title + '</h2><p>' +
							exhibitions[m].text_de + '<br><br>' +
							exhibitions[m].links + '</p></div>' + '<div class="exhi-img">' + '<img alt="' +
							exhibitions[m].img_meta + '" src="./img/' +
							exhibitions[m].image + '" width="100%">' + '</div>';
					}
				}
				if (langCurrent === "en") {
					document.getElementsByTagName("META")[0].content = about[0].text_en;
					for (var n = 0; n < exhibitions.length; n++) {
						exhiPos.innerHTML += '<div class="exhi">' + '<div class="exhi-txt"><h2>' +
							exhibitions[n].title + '</h2><p>' +
							exhibitions[n].text_en + '<br><br>' +
							exhibitions[n].links + '</p></div>' + '<div class="exhi-img">' + '<img alt="' +
							exhibitions[n].img_meta + '" src="./img/' +
							exhibitions[n].image + '" width="100%">' + '</div>';
					}
				}
			}
		}
		pages();
		workDetail();
	}
	function currentLink() {
		var links = document.getElementsByClassName("link");
		for (var i = 0; i < links.length; i++) {
			if (i === id) {
				links[i].classList.add("current");
			} else {
				links[i].classList.remove("current");
			}
		}
		if (id === "about") {
			links[works.length + 1].classList.add("current");
		}
		if (id === "exhibitions") {
			links[works.length].classList.add("current");
		}
	}
	function currentLang() {
		var langPos = document.getElementsByClassName("lang");

		if (langCurrent === "de") {
			langPos[0].classList.add("current");
			langPos[1].classList.remove("current");
		}
		if (langCurrent === "en") {
			langPos[0].classList.remove("current");
			langPos[1].classList.add("current");
		}

		var langDE = document.getElementById("langDE");
		var langEN = document.getElementById("langEN");

		langDE.href = urlIndex + "?" + selector + "=de";
		langDE.hreflang = "de";

		langEN.href = urlIndex + "?" + selector + "=en";
		langEN.hreflang = "en";
	}
	function urlUpdate() {
		var urlNew = "?" + selector + "=" + langCurrent;

		if (history.pushState && selector !== "index") {
			window.history.pushState({
				path: urlNew
			}, "", urlNew);
		} else {
			window.history.pushState({
				path: urlIndex
			}, "", urlIndex);
		}
	}
	contentSelect();
	docTitle();
	dynamic();
	currentLink();
	currentLang();
	logos();
	urlUpdate();
}

function language(langSelector) {
	if (langSelector !== langCurrent) {
		langChanged = true;
		langCurrent = langSelector;
		content(savedSelector);
		langChanged = false;
	}
}

function navLang() {
	if (navigator.language.includes("de") === true) {
		langCurrent = "de";
	} else {
		langCurrent = "en";
	}
}

function along() {
	var alongPolyline = '<polyline class="along" points="20,2 35,20 20,38" />';

	function navTop() {
		var btnSVG = '<svg width="40" height="40"><a ' + 'href="javascript:scrollTo(0, 500)"' + ' style="cursor:pointer" target="_self">' + alongPolyline + '</a></svg>';

		var topPos = document.getElementById("along-top");
		topPos.innerHTML = btnSVG;

		var d = document.documentElement;
		var offset = d.scrollTop + window.innerHeight;
		var height = d.offsetHeight;

		if (height - offset < 80) {
			document.getElementById("along-top").className = "top-visible";
		} else {
			document.getElementById("along-top").className = "top-hidden";
		}
	}

	function navAlong() {
		var leftPos = document.getElementById("along-left");
		var rightPos = document.getElementById("along-right");

		leftPos.innerHTML = "";
		rightPos.innerHTML = "";

		var btnSVGstart = '<svg width="40" height="40"><a href="javascript:content(';
		var btnSVGend = ')" style="cursor:pointer" target="_self">' + alongPolyline + '</a></svg>';

		if (workSelected === true) {
			if (id === 0) {
				leftPos.innerHTML = btnSVGstart + "'" + works[works.length - 1].name + "'" + btnSVGend;
				rightPos.innerHTML = btnSVGstart + "'" + works[id + 1].name + "'" + btnSVGend;
			}

			if (id === works.length - 1) {
				leftPos.innerHTML = btnSVGstart + "'" + works[id - 1].name + "'" + btnSVGend;
				rightPos.innerHTML = btnSVGstart + "'" + works[0].name + "'" + btnSVGend;
			}

			if (id > 0 && id < works.length - 1) {
				leftPos.innerHTML = btnSVGstart + "'" + works[id - 1].name + "'" + btnSVGend;
				rightPos.innerHTML = btnSVGstart + "'" + works[id + 1].name + "'" + btnSVGend;
			}

			if ((document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) && window.innerWidth > 1200) {
				document.getElementById("along-left").className = "along-visible";
				document.getElementById("along-right").className = "along-visible";
			} else {
				document.getElementById("along-left").className = "along-hidden";
				document.getElementById("along-right").className = "along-hidden";
			}
		}
	}

	navTop();
	navAlong();
}

function urlPara() {
	var urlPar = location.search;
	var langTag;
	var firstLoad = false;

	if (!firstLoad) {
		content("index");
		firstLoad = true;
	}

	if (urlPar.includes("=") === true) {
		langTag = urlPar.indexOf("=");
		parContent = urlPar.substring(1, langTag);
		parLang = urlPar.substring(langTag + 1, langTag + 3);
		content(parContent);
		language(parLang);
	}

	if (window.location.hash) {
		console.log("HASH");
		window.alert("HASH");
	}
}

function logos() {
	var logosPos = document.getElementById("logos");
	logosPos.innerHTML = "";

	for (var i = 0; i < links.length; i++) {
		logosPos.innerHTML += '<div class="logo">' + '<a href="' +
			links[i].url + '"target="_blank">' + '<img alt="' +
			links[i].title + '" src="./img/logos/' +
			links[i].img + '" >' + '</a>' + '</div>';
	}
}

function scrollTo(to, duration) { // copied from https://gist.github.com/andjosh/6764939
	const
		element = document.scrollingElement || document.documentElement,
		start = element.scrollTop,
		change = to - start,
		startDate = +new Date(),

		easeInOutQuad = function (t, b, c, d) {
			t /= d / 2;
			if (t < 1) {
				return c / 2 * t * t + b;
			}
			t--;
			return -c / 2 * (t * (t - 2) - 1) + b;
		},

		animateScroll = function () {
			const currentDate = +new Date();
			const currentTime = currentDate - startDate;
			element.scrollTop = parseInt(easeInOutQuad(currentTime, start, change, duration));
			if (currentTime < duration) {
				requestAnimationFrame(animateScroll);
			} else {
				element.scrollTop = to;
			}
		};

	animateScroll();
}

function popstate() {
	jQuery(document).ready(function($) {
		if (window.history && window.history.pushState) {
			$(window).on('popstate', function() {
				if ($(location).prop('hash') === "") {
					location.reload();
				}
			});
		}
	});
}
