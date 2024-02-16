// data.js for davidherren.ch / 2024-02-16

let currentLanguage = ''; // Sets the default language
let currentSlug = ''; // Stores the current slug for content
let lastStateLeftExpanded = true; // Stores the expanded/collapsed state of the left content
let titleElement; // Change menu H1 title on subpages to H2
let titleElementH1 = true;

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
    //.catch(error => errorCallback(error));
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
  if (currentSlug === 'about') {
    loadAbout(false);
  } else if (currentSlug) {
    loadWorks(currentSlug, 0);
  } else {
    statement(currentLanguage);
    loadIndex(false);
  }
}

// Function to load content for a specific work
function loadWorks(slug, popstate) {
  window.scrollTo(0, 0);
  currentSlug = slug; // Updates the currentSlug
  let url = "/data.php?slug=" + encodeURIComponent(slug) + "&lang=" + currentLanguage + "&works=1"; // Constructs the URL for the request
  sendRequest(url, (response) => {
    document.getElementById("index-inner").innerHTML = ''; // Clears existing content
    document.getElementById("content").innerHTML = response.html; // Inserts new content
    updateDocumentTitle(response.title + " | David Herren"); // Updates the document title
    let description = currentLanguage === 'de' ? response.descriptionDe : response.descriptionEn; // Selects the appropriate description based on the current language
    updateMetaDescription(description); // Updates the meta description
    if (!popstate) { updateUrl(slug); } // Updates the URL, except popstate event
    updateHrefLangTags(slug); // Updates hreflang tags for SEO
    animateLetters('work-text-description');
  });
  highlightContentButton('button-' + slug); // Highlights the active content button
  changeMenuTitle(); // Change menu H1 title on subpages to H2
}

function changeMenuTitle() {
  if (titleElement && titleElement.tagName === 'H1' && titleElementH1) {
    var newTitleElement = document.createElement('h2');
    titleElementH1 = false;
    newTitleElement.id = titleElement.id;
    newTitleElement.innerHTML = titleElement.innerHTML;
    titleElement.parentNode.replaceChild(newTitleElement, titleElement);
  }
}

// Function to load content about
function loadAbout(popstate) {
  currentSlug = 'about';
  let url = "/data.php?lang=" + encodeURIComponent(currentLanguage) + "&about=1";
  sendRequest(url, (response) => {
    document.getElementById("index-inner").innerHTML = '';
    document.getElementById("content").innerHTML = response.html;
    updateDocumentTitle('About | David Herren');
    let description = currentLanguage === 'de' ? response.descriptionDe : response.descriptionEn;
    updateMetaDescription(description);
    if (!popstate) { updateUrl('about'); }
    updateHrefLangTags('about');
  }, (error) => {
    console.error('Error with the request:', error);
  });
  highlightContentButton('button-about');
  changeMenuTitle();
}

// Function to load content index
function loadIndex(popstate) {
  currentSlug = '';
  let url = "/data.php?lang=" + encodeURIComponent(currentLanguage) + "&index=1";
  sendRequest(url, (response) => {
    document.getElementById("index-inner").innerHTML = response.html;
    document.getElementById("content").innerHTML = '';
    updateDocumentTitle('David Herren');
    if (!popstate) { updateUrl('') }; // Updates the URL, except popstate event
    adjustHeight();
  }, (error) => {
    console.error('Error with the request:', error);
  });
  highlightContentButton('');
}

// Function to update the URL in the browser's history
function updateUrl(slug) {
  let newUrl = '/' + currentLanguage + '/' + slug; // Constructs the new URL
  window.history.pushState({path: newUrl}, '', newUrl); // Pushes the new URL to the browser's history
}

window.addEventListener('popstate', function(event) {
  if (event.state && event.state.path) {
    const pathParts = event.state.path.split('/').filter(Boolean);
    const slug = pathParts[1];
    if (pathParts.length === 2 ) {
      popstate = true;
      if (slug === 'about') {
        loadAbout(true);
      } else {
        loadWorks(slug, true);
      }
    } else {
      loadIndex(true);
  }
}
});

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
    btn.classList.remove('button-highlighted');
  });
  const button = document.getElementById(buttonId);
  if (button) {
    button.classList.add('button-highlighted');
  }
}

{ // Adjust height of index items
  function adjustHeight() {
    var items = document.querySelectorAll('.index-item');
    items.forEach(function(item) {
      var width = item.offsetWidth;
      var height = width * 0.75;
      item.style.height = height + 'px';
    });
  }
  window.onresize = adjustHeight;
}

{ // Function to update the meta description tag of the document
  function updateMetaDescription(description) {
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta'); // Creates a new meta tag if it doesn't exist
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription); // Appends the meta tag to the document head
    }
    metaDescription.content = description; // Updates the content of the meta tag
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
}

// Function to update the document title
function updateDocumentTitle(title) {
  document.title = title; // Sets the document's title
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

// Event listener for the DOMContentLoaded event to ensure the page is fully loaded before executing any scripts
document.addEventListener("DOMContentLoaded", () => {
  // Extract parts of the URL path and filter out any empty elements
  let pathParts = window.location.pathname.split('/').filter(Boolean);

  // Check the URL for a language code, using it if present, otherwise default to the browser's language preference
  if (pathParts.length > 0 && (pathParts[0] === 'de' || pathParts[0] === 'en')) {
    currentLanguage = pathParts[0]; // Set the page language based on the URL
  } else {
    // Default to the browser's language, or English if the browser's language is not explicitly supported
    let browserLanguage = navigator.language || navigator.userLanguage;
    currentLanguage = browserLanguage.startsWith('de') ? 'de' : 'en';
  }

  // Highlight the button for the current language and switch the page content to that language
  highlightLanguageButton(currentLanguage);
  switchLanguage(currentLanguage); // This function updates the page to reflect the chosen language

  // Load the index or specific content based on the URL, defaulting to the index if no specific path is provided
  if (pathParts.length > 1) {
    if (pathParts[1] === 'about') {
      loadAbout(false); // Load 'About' content if specified in the URL
    } else {
      loadWorks(pathParts[1], 0); // Load specific work details based on the slug in the URL
    }
  } else {
    // If no specific content is requested, load the index content
    /*loadIndex("motionstudy"); // Adjust this call to pass the correct exclusion parameter if necessary*/
  }

  // Update the page's hreflang tags based on the current language, for SEO purposes
  updateHrefLangTags(pathParts.length > 1 ? pathParts[1] : '');

  // Additional event listener for handling scroll events, for dynamically showing image titles based on scroll position
  window.addEventListener('scroll', handleScrollEvent);


  titleElement = document.getElementById('title-text'); // Get H1 title from menu
});

// Function to handle scroll events, used for dynamically adjusting visibility of image titles based on viewport position
function handleScrollEvent() {
  let images = document.querySelectorAll('#content-inner-right img');
  let allTitleDivs = document.querySelectorAll('#content-inner-left .work-image-title');
  
  // Initially hide all title divs
  allTitleDivs.forEach(div => div.style.display = 'none');
  let currentVisibleImageIndex = -1;
  
  // Determine the currently visible image based on its viewport position
  images.forEach((img, index) => {
    let rect = img.getBoundingClientRect();
    // Special handling for the first image or subsequent images based on their position in the viewport
    if (rect.bottom > 0 && (index === 0 || rect.top < window.innerHeight / 2)) {
      currentVisibleImageIndex = index;
    }
  });

  // Display the title for the currently visible image, if any
  if (currentVisibleImageIndex !== -1) {
    allTitleDivs[currentVisibleImageIndex].style.display = 'flex';
  }
}
