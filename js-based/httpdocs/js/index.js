// --------------------------------------- //
// -- Created 2016-2023 by David Herren -- //
// ------- https://davidherren.ch -------- //
// --------------------------------------- //

var id, workSelected, savedSelector;
var langCurrent;
var langChanged = false;
var urlIndex = window.location.protocol + "//" + window.location.host + window.location.pathname;
var loadModell = false;

{ // Main content
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
			if (workSelected) {
				for (var i = 0; i < works.length; i++) {
					if (works[i].name === selector) {
						id = i;
					}
				}
			}
		}
		function docTitle() {
			if (workSelected) {
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
			{ // setup
				window.scrollTo(0, 0);
				var workPos = document.getElementById("work");
				var flexPos = document.getElementById("flex");
				var listPos = document.getElementById("list");
				var exhiPos = document.getElementById("exhi");
				document.getElementById("load").style.visibility = "hidden";
				workPos.innerHTML = "";
				flexPos.innerHTML = "";
				listPos.innerHTML = "";
				exhiPos.innerHTML = "";
			}
			{ // work project pages
				function work() {
					document.getElementsByTagName("META")[0].content = works[id][`description_${langCurrent}`];
					const imageHTML = () => `
					<div id="image"><div id="dots"></div><img id="workImg" onclick="changeImg()" alt="
					${works[id].image_meta}" src="./img/
					${works[id].image}" width="100%"><div class="text"><h1>
					`;
					const commonHTML = () => `
					<h1>${works[id].title}</h1>
					<p>${works[id].year}, ${works[id][`data_${langCurrent}`]}, ${works[id][`size_${langCurrent}`]}${works[id].edition}<br><p class="column">
					`;
					const textHTML = () => `
					${works[id][`text_${langCurrent}`]}</p>
					${works[id].links}</p></div>
					`;
					if (works[id].text_copy) { // copy description from another project
						for (var i = 0; i < works.length; i++) {
							if (works[i].name === works[id].text_copy) {
								workPos.innerHTML = imageHTML() + commonHTML() +
									works[i][`text_${langCurrent}`] + '</p>' +
									works[id].links + '</p></div>';
								if (works[id].image_set) {imageChange()}
							}
						}
					} else if (works[id].vimeo_id && !works[id].essay) { // show video
						workPos.innerHTML = '<div style="padding:'+ works[id].vimeo_padding + '% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/' + works[id].vimeo_id + '?h=543f1f4ab7&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>' + '<div class="text"><h1>' +
						commonHTML() + textHTML();
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
							commonHTML() + textHTML();
							panzoom('#zoom_element', {
							bound:'outer',
							scale_min: 0.01, // 0.01 to 20
							scale_max: 0.8 // 0.01 to 20
						});
					} else if (works[id].essay && !works[id].vimeo_id) { // show essay (long text)
						workPos.innerHTML = imageHTML() + commonHTML() +
							works[id].essay + works[id].links + '</p></div>';
					} else if (works[id].essay &&  works[id].vimeo_id) { // show essay (long text) with video
						workPos.innerHTML = '<div style="padding:'+ works[id].vimeo_padding + '% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/' + works[id].vimeo_id + '?h=543f1f4ab7&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>' + '<div class="text"><h1>' +
							commonHTML() + works[id].essay + works[id].links + '</p></div>';
					} else { // show image and (short) text
						workPos.innerHTML = imageHTML() + commonHTML() + textHTML();
						if (works[id].image_set) {imageChange()}
					}
				}
				function imageChange() {
					dots = [];
					imgIndex = 0;
					document.getElementById('workImg').style.cursor = "Pointer";
					document.getElementById('dots').style.cursor = "Pointer";
					var dotsContainer = document.getElementById('dots');
					for (var i = 0; i < works[id].image_set; i++) {
						var dot = document.createElement('span');
						dot.classList.add('dot');
						dot.addEventListener('click', (function(index) {
							return function() {
									imgIndex = index - 1;
									changeImg();
							}
					})(i));
					if (i == 0) {
							dot.classList.add('active');
					}
					dotsContainer.appendChild(dot);
					dots.push(dot);
					}
				}
			}
			function workDetail() { // load detail site
				if (workSelected && (id >= 0 || langChanged)) {
					work();
					if (window.innerWidth >= 600) { // hide background image
						document.body.style.backgroundImage = "url('./img/" +
							works[id].image_back + "')";
					} else {
						document.body.style.backgroundImage = null;
					}
				}
			}
			function pages() { // index site
				if (id === "index") {
					currentLang();
					if (window.innerWidth >= 600) {
						document.body.style.backgroundImage = "url('./img/back/davidherren-interference-back.jpg')";
					} else {
						document.body.style.backgroundImage = null;
					}
					document.getElementsByTagName("META")[0].content = about[0][`text_${langCurrent}`];
					for (var i = 0; i < works.length; i++) {
						flexPos.innerHTML += '<div class="flxSub"><div class="flxSubImg"><a class="imgLink" href="javascript:content(' + "'" +
								works[i].name + "'" + ')"><img alt="' +
							works[i].image_prev_meta + '" src="./img/' +
							works[i].image_prev + '" width="100%"></a></div><div class="text"><h2>' +
							works[i].title + '</h2><p>' +
							works[i].year + ', ' +
							works[i][`data_${langCurrent}`] + ', ' +
							works[i][`size_${langCurrent}`] +
							works[i].edition + '<br><br>' +
							works[i].links + '</p></div></div>';
						}
				}
				if (id === "about") {
					currentLang();
					document.body.style.backgroundImage = "none";
					document.getElementsByTagName("META")[0].content = about[0][`text_${langCurrent}`];
					for (var k = 0; k < about.length; k++) {
						listPos.innerHTML += '<div class="about"><h2>' +
							about[k][`title_${langCurrent}`] + '</h2><p>' +
							about[k][`text_${langCurrent}`] + '</p></div>';
					}
				}
				if (id === "exhibitions") {
					currentLang();
					document.body.style.backgroundImage = "none";
					document.getElementsByTagName("META")[0].content = about[0][`text_${langCurrent}`];
					for (var m = 0; m < exhibitions.length; m++) {
						exhiPos.innerHTML += '<div class="exhi">' + '<div class="exhi-txt"><h2>' +
							exhibitions[m].title + '</h2><p>' +
							exhibitions[m][`text_${langCurrent}`] + '<br><br>' +
							exhibitions[m].links + '</p></div>' + '<div class="exhi-img">' + '<img alt="' +
							exhibitions[m].img_meta + '" src="./img/' +
							exhibitions[m].image + '" width="100%">' + '</div>';
					}
				}
			}
			pages();
			workDetail();
		}
		function currentLink() {
			let links = Array.from(document.getElementsByClassName("link"));
			links.forEach((link, index) => {
				if (index === id || (id === "about" && index === works.length + 1) || (id === "exhibitions" && index === works.length)) {
					link.classList.add("current");
				} else {
					link.classList.remove("current");
				}
			});
		}
		function currentLang() {
			const langPos = Array.from(document.getElementsByClassName("lang"));
			const langDE = document.getElementById("langDE");
			const langEN = document.getElementById("langEN");
			const setLang = (lang, pos) => {
				langPos.forEach((el, index) => el.classList.toggle("current", index === pos));
				document.documentElement.setAttribute("lang", lang.toUpperCase());
				langDE.href = `${urlIndex}?${selector}=${lang}`;
				langDE.hreflang = lang;
			};
			if (langCurrent === "de") {
				setLang('de', 0);
			} else if (langCurrent === "en") {
				setLang('en', 1);
			}
		}
		function urlUpdate() {
			const urlNew = `?${selector}=${langCurrent}`;
			const newPath = (history.pushState && selector !== "index") ? urlNew : urlIndex;
			window.history.pushState({ path: newPath }, "", newPath);
		}
		contentSelect();
		docTitle();
		dynamic();
		currentLink();
		currentLang();
		logos();
		urlUpdate();
	}
	{ // If more than one img available, click through (required for work project pages)
		var imgIndex = 0;
		var dots = [];
		function changeImg() {
			if(works[id].image_set) {
				var img = document.getElementById('workImg');
				imgIndex++;
				if (imgIndex >= works[id].image_set) {imgIndex = 0;}
				img.src = "./img/" + works[id].image_name + imgIndex + ".jpg";
				if(works[id].image_meta_set) {img.alt = works[id].image_meta_set[imgIndex];}
				dots.forEach(function(dot, index) {
					if (index == imgIndex) {
							dot.classList.add('active');
					} else {
							dot.classList.remove('active');
					}
			});
			}
		}
	}
}
function language(langSelector) {
  if (langSelector === langCurrent) return;
  langChanged = true;
  langCurrent = langSelector;
  content(savedSelector);
  langChanged = false;
}
function navLang() {
  langCurrent = navigator.language.includes("de") ? "de" : "en";
}
function along() {
	var alongPolyline = '<polyline class="along" points="20,2 35,20 20,38" />';
	function navTop() {
		const topPos = document.getElementById("along-top");
		topPos.innerHTML = `<svg width="40" height="40"><a href="javascript:scrollTo(0, 500)" style="cursor:pointer" target="_self">${alongPolyline}</a></svg>`;
		const isVisible = document.documentElement.offsetHeight - (document.documentElement.scrollTop + window.innerHeight) < 80 && window.innerWidth >= 1200;
		topPos.className = isVisible ? "top-visible" : "top-hidden";
	}
	function navAlong() {
    const leftPos = document.getElementById("along-left");
    const rightPos = document.getElementById("along-right");
		leftPos.innerHTML = "";
    rightPos.innerHTML = "";
    const btnSVGstart = '<svg width="40" height="40"><a href="javascript:content(';
    const btnSVGend = ')" style="cursor:pointer" target="_self">' + alongPolyline + '</a></svg>';
    if (workSelected) {
        const prevWorkName = works[id === 0 ? works.length - 1 : id - 1].name;
        const nextWorkName = works[id === works.length - 1 ? 0 : id + 1].name;
        leftPos.innerHTML = btnSVGstart + "'" + prevWorkName + "'" + btnSVGend;
        rightPos.innerHTML = btnSVGstart + "'" + nextWorkName + "'" + btnSVGend;
        const isScrollDownAndWideScreen = (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) && window.innerWidth > 1200;
        const visibilityClassSuffix = isScrollDownAndWideScreen ? 'visible' : 'hidden';
        document.getElementById("along-left").className = "along-" + visibilityClassSuffix;
        document.getElementById("along-right").className = "along-" + visibilityClassSuffix;
        document.getElementById("along-top").className = "top-" + visibilityClassSuffix;
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
	if (urlPar.includes("=")) { // if language selected
		langTag = urlPar.indexOf("=");
		parContent = urlPar.substring(1, langTag);
		parLang = urlPar.substring(langTag + 1, langTag + 3);
		content(parContent);
		language(parLang);
	}
	if (urlPar.includes("?") && !urlPar.includes("=")) { // if no language selected
		parContent = urlPar.substring(1, urlPar.length);
		content(parContent);
		language(currentLang);
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
function scrollAnimation() {
	window.addEventListener('scroll', function() {
		if (window.pageYOffset > 80 && window.innerWidth > 1200) {  // 80
			document.getElementById("menu").style.position = "relative";
			document.getElementById("menu").style.marginTop = "80px";
			document.getElementById("menu").style.marginBottom = "0px";
			document.getElementById("content").style.marginTop = "0px";
			} else {
				document.getElementById("menu").style.position = "sticky";
				document.getElementById("menu").style.marginTop = "40px";
				document.getElementById("menu").style.marginBottom = "40px";
			}
	});
}
function loader() {
	document.getElementById("#loader").style.visibility = "visible";
}
