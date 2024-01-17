// data.js for davidherren.ch / 2024-01-17

// Initialization of global variables
let currentLanguage = ''; // Sets the default language to German
let currentSlug = ''; // Stores the current slug for content
let lastStateLeftExpanded = true; // Stores the expanded/collapsed state of the left content

// Function to handle sending requests to the server
const sendRequest = (url, successCallback, errorCallback) => {
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      return response.json();
    })
    .then(data => successCallback(data))
    .catch(error => errorCallback(error));
};

// Function to switch the current language of the page
function switchLanguage(lang) {
  document.documentElement.lang = lang; // Sets the language of the document
  currentLanguage = lang; // Updates the currentLanguage variable
  highlightLanguageButton(lang); // Highlights the selected language button

  // Constructs a new path for the URL based on the selected language
  let newPath = '/' + currentLanguage + '/';
  if (currentSlug) {
    newPath += currentSlug;
  }
  history.pushState(null, null, newPath); // Updates the browser's history

  // Loads the appropriate content based on the currentSlug
  if (currentSlug === 'exhibitions') {
    loadExhibitions();
  } else if (currentSlug === 'about') {
    loadAbout();
  } else if (currentSlug) {
    loadWorks(currentSlug);
  } else {
    statement(currentLanguage);
  }
}

// Function to highlight the active language button
function highlightLanguageButton(lang) {
  document.querySelectorAll('#language-switch button').forEach(button => {
    button.classList.remove('button-highlighted'); // Removes highlight from all buttons
  });
  document.querySelector('#button-' + lang).classList.add('button-highlighted'); // Adds highlight to the selected button
}

// Function to highlight the active content button
function highlightContentButton(buttonId) {
  document.querySelectorAll('#menu-works button, #menu-about button').forEach(btn => {
    btn.classList.remove('button-highlighted'); // Removes highlight from all buttons
  });
  const button = document.getElementById(buttonId);
  if (button) {
    button.classList.add('button-highlighted'); // Adds highlight to the selected button
  }
}

function dropDown() {
  var mediaQuery = window.matchMedia("(max-width: 1024px)");
  var menuInner = document.getElementById('menu-inner');
  var dropdownSVG = document.getElementById('dropdown-svg');

  if (mediaQuery.matches) {
    if (menuInner.style.height === 'auto') {
      menuInner.style.height = '0px';
      dropdownSVG.classList.remove('rotated');
    } else {
      menuInner.style.height = 'auto';
      dropdownSVG.classList.add('rotated');
    }
  } else {
    menuInner.style.height = 'auto';
  }
}

document.addEventListener("DOMContentLoaded", function() {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio === 1) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }, { threshold: [0, 1.0] });

  var buttons = document.querySelectorAll('.button-navigation');
  buttons.forEach(button => observer.observe(button));
});

// Function to load content for a specific work
function loadWorks(slug) {
  isLoadingWork = true; // Sets the loading flag
  currentSlug = slug; // Updates the currentSlug
  // Constructs the URL for the request
  let url = "/data.php?slug=" + encodeURIComponent(slug) + "&lang=" + currentLanguage + "&works=1";
  sendRequest(url, (response) => {
    document.getElementById("index").innerHTML = ''; // Clears existing content
    document.getElementById("content").innerHTML = response.html; // Inserts new content
    updateDocumentTitle(response.title); // Updates the document title
    // Selects the appropriate description based on the current language
    let description = currentLanguage === 'de' ? response.descriptionDe : response.descriptionEn;
    updateMetaDescription(description); // Updates the meta description
    updateUrl(slug); // Updates the URL
    updateHrefLangTags(slug); // Updates hreflang tags for SEO
  });
  highlightContentButton('button-' + slug); // Highlights the active content button
}

// Function to load content for exhibitions
function loadExhibitions() {
  currentSlug = 'exhibitions';
  let url = "/data.php?lang=" + encodeURIComponent(currentLanguage) + "&exhibitions=1";
  sendRequest(url, (response) => {
    document.getElementById("index").innerHTML = '';
    document.getElementById("content").innerHTML = response.html;
    updateDocumentTitle('Exhibitions');
    updateUrl('exhibitions');
    updateHrefLangTags(slug); // Updates hreflang tags for SEO
  }, (error) => {
    console.error('Error with the request:', error);
  });
  highlightContentButton('button-exhibitions');
}

// Function to load content about
function loadAbout() {
  currentSlug = 'about';
  let url = "/data.php?lang=" + encodeURIComponent(currentLanguage) + "&about=1";
  sendRequest(url, (response) => {
    document.getElementById("index").innerHTML = '';
    document.getElementById("content").innerHTML = response.html;
    updateDocumentTitle('About');
    // Selects the appropriate description based on the current language
    let description = currentLanguage === 'de' ? response.descriptionDe : response.descriptionEn;
    updateMetaDescription(description); // Updates the meta description
    updateUrl('about');
    updateHrefLangTags('about'); // Updates hreflang tags for SEO
  }, (error) => {
    console.error('Error with the request:', error);
  });
  highlightContentButton('button-about');
  /*imgOnMousePointer();*/
}

// Function to update the meta description tag of the document
function updateMetaDescription(description) {
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta'); // Creates a new meta tag if it doesn't exist
    metaDescription.name = 'description';
    document.head.appendChild(metaDescription); // Appends the meta tag to the document head
  }
  metaDescription.content = description; // Updates the content of the meta tag
}

// Function to update the document title
function updateDocumentTitle(title) {
  document.title = title; // Sets the document's title
}

// Function to update the URL in the browser's history
function updateUrl(slug) {
  let newUrl = '/' + currentLanguage + '/' + slug; // Constructs the new URL
  window.history.pushState({path: newUrl}, '', newUrl); // Pushes the new URL to the browser's history
}

// Function to update hreflang tags for SEO and accessibility
function updateHrefLangTags(slug) {
  document.querySelectorAll('link[rel="alternate"]').forEach(tag => tag.remove()); // Removes existing hreflang tags

  // Define available languages
  const availableLanguages = ['de', 'en'];

  // Iterate through available languages to create hreflang tags
  availableLanguages.forEach(lang => {
    let linkTag = document.createElement('link');
    linkTag.rel = 'alternate';
    linkTag.hreflang = lang;
    linkTag.href = window.location.origin + '/' + lang + '/' + slug;
    document.head.appendChild(linkTag);
  });
}

// Event listener for the DOMContentLoaded event to initialize the page based on URL and browser language
document.addEventListener("DOMContentLoaded", () => {
  let pathParts = window.location.pathname.split('/').filter(Boolean);

  // Check the URL for a language code, use it if present, otherwise use the browser's language
  if (pathParts.length > 0 && (pathParts[0] === 'de' || pathParts[0] === 'en')) {
    currentLanguage = pathParts[0];
  } else {
    // Check the browser language and set the default language
    let browserLanguage = navigator.language || navigator.userLanguage;
    currentLanguage = browserLanguage.startsWith('de') ? 'de' : 'en';
  }

  // Highlight the current language button an switch to current language
  highlightLanguageButton(currentLanguage);
  switchLanguage(currentLanguage);
  statement(currentLanguage);

  // Load the appropriate content based on the URL
  if (pathParts.length > 1) {
    if (pathParts[1] === 'about') {
      loadAbout();
    } else if (pathParts[1] === 'exhibitions') {
      loadExhibitions();
    } else {
      loadWorks(pathParts[1]);
    }
  }

  // Update hreflang tags based on the current language and slug
  updateHrefLangTags(pathParts.length > 1 ? pathParts[1] : '');

  // Event listener for scroll events to handle image visibility and blur effects
  let blurApplied = false;
  window.addEventListener('scroll', () => {
    let images = document.querySelectorAll('#content-inner-right img');
    let allTitleDivs = document.querySelectorAll('#content-inner-left .work-image-title');
    let contentInnerLeft = document.querySelector('#content-inner-left');
    
    // Initially hide all title divs
    allTitleDivs.forEach(div => div.style.display = 'none');
    let currentVisibleImageIndex = -1;
    
    // Determine the visible image index based on the viewport position
    images.forEach((img, index) => {
      let rect = img.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight / 2) {
        currentVisibleImageIndex = index;
      }
    });

    // Handle the visibility of titles and blur effect based on scroll position
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      allTitleDivs.forEach(div => div.style.display = 'none');
    } else if (currentVisibleImageIndex !== -1) {
      allTitleDivs[currentVisibleImageIndex].style.display = 'flex';
      /*if (!blurApplied) {
       applyBlurAndGray(contentInnerLeft, 0, 0, 0, 100, 500);
        blurApplied = true;
      }
    } else {
        if (blurApplied) {
          applyBlurAndGray(contentInnerLeft, 0, 0, 100, 0, 500);
          blurApplied = false;
        }*/
      }
  });
});

// MutationObserver to observe DOM changes and adjust the layout accordingly
{
  const observer = new MutationObserver((mutations, obs) => {
    const pointerButton = document.getElementById('pointer');
    const contentLeft = document.getElementById('content-inner-left');
    const contentRight = document.getElementById('content-inner-right');
    const svgArrow = document.querySelector('.svg-arrow');

    let isLeftExpanded = lastStateLeftExpanded;

    // Set the initial state based on the last known state
    if (contentLeft) {
      if (isLeftExpanded) {
        contentLeft.classList.add('width-expanded');
        contentRight.classList.add('width-collapsed');
        applySvgTransformations(true);
      } else {
        contentLeft.classList.add('width-collapsed');
        contentRight.classList.add('width-expanded');
        applySvgTransformations(false);
      }
    }

    // Event listener for click events on the pointer button
    if (pointerButton) {
      pointerButton.addEventListener('click', function(event) {
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        const scrolledToBottom = window.scrollY + clientHeight >= scrollHeight;

        // Check if scrolled to the bottom of the page
        if (scrolledToBottom) {
          // Already at the bottom, so let the default anchor behavior take over
          return;  // Exit the function without preventing the default behavior
        }

        // Toggle collapse/expand based on current state
        isLeftExpanded = !isLeftExpanded;
        lastStateLeftExpanded = isLeftExpanded;  // Update the global state

        if (isLeftExpanded) {
          // Logic for expanding
          contentLeft.classList.remove('width-collapsed');
          contentRight.classList.remove('width-expanded');
          contentLeft.classList.add('width-expanded');
          contentRight.classList.add('width-collapsed');
          applySvgTransformations(true);
        } else {
          // Logic for collapsing
          contentLeft.classList.remove('width-expanded');
          contentRight.classList.remove('width-collapsed');
          contentLeft.classList.add('width-collapsed');
          contentRight.classList.add('width-expanded');
          applySvgTransformations(false);
        }

        event.preventDefault();  // Prevent default only when not at the bottom
      });

      // Scroll event listener to adjust the pointer button position and behavior
      window.addEventListener('scroll', function() {
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        const scrolledToBottom = window.scrollY + clientHeight >= scrollHeight;
      
        // Adjust the vertical position of the pointer
        if (window.scrollY > 500) {
          pointerButton.style.top = '50vh';
        } else {
          pointerButton.style.top = '4rem';
        }
        // Check if scrolled to the bottom of the page
        if (scrolledToBottom) {
          // Rotate arrow upwards to indicate scroll to top (-90deg)
          if (isLeftExpanded) {
            svgArrow.style.transform = 'rotate(90deg)';
          } else {
            svgArrow.style.transform = 'rotate(-90deg)';
          }
          pointerButton.href = '#top'; // Set href to '#top' to enable scrolling to the top
        } else {
          // Reset arrow rotation based on the collapse state
          svgArrow.style.transform = '';
          pointerButton.href = ''; // Remove link to #top when not at bottom
        }
      });

      // obs.disconnect(); // Uncomment to stop the observer once the element is found
    }
  });
  observer.observe(document, { childList: true, subtree: true });
}

// Function to apply blur and/or gray to an element
function applyBlurAndGray(element, startBlur, endBlur, startGray, endGray, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const blurValue = progress * (endBlur - startBlur) + startBlur;
    const grayValue = progress * (endGray - startGray) + startGray;
    element.style.filter = `blur(${blurValue}px) grayscale(${grayValue}%)`;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

function statement(lang) {
  let url = "/data.php?statement=" + encodeURIComponent(lang);
  sendRequest(url, 
    response => {
      updateMetaDescription(response.description); 
    },
    error => {
      console.error('Error fetching statement:', error);
    }
  );
}

function applySvgTransformations(expand) {
  var translationValues = [62, 54, 46, 38, 30, 22];
  function manageClass(element, className, add) {
      if (element) {
          if (add) {
              element.classList.add(className);
          } else {
              element.classList.remove(className);
          }
      }
  }
  for (var i = 1; i <= 12; i++) {
      var element = document.getElementById('svg-arrow-' + i);
  }
  translationValues.forEach(function(value, index) {
      var element1 = document.getElementById('svg-arrow-' + (index + 1));
      var element2 = document.getElementById('svg-arrow-' + (index + 7));
      var className = 'translate-' + value;

      if (expand) {
          manageClass(element1, className, true);
          manageClass(element2, className, true);
          manageClass(element1, 'translate-00', false);
          manageClass(element2, 'translate-00', false);
      } else {
          manageClass(element1, className, false);
          manageClass(element2, className, false);
          manageClass(element1, 'translate-00', true);
          manageClass(element2, 'translate-00', true);
      }
  });
}

function imgOnMousePointer() {
  var div = document.createElement('div');

  // Setze Stil für das div (Größe, Farbe etc.)
  div.style.width = '50px';
  div.style.height = '50px';
  div.style.backgroundColor = 'red';
  div.style.position = 'absolute';

  // Füge das div zum body hinzu
  document.body.appendChild(div);

  // Event-Listener für Mausbewegung
  document.addEventListener('mousemove', function(e) {
    // Aktualisiere die Position des divs entsprechend der Mausposition
    div.style.left = e.clientX + 'px';
    div.style.top = e.clientY + 'px';
  });
}
