// data.js for davidherren.ch / 2024-07-24

const config = {
  currentLanguage: '', // Sets the default language
  currentSlug: '', // Stores the current slug for content
  lastStateLeftExpanded: true, // Stores the expanded/collapsed state of the left content, also used in style.js
  titleElement: null, // Change menu H1 title on subpages to H2
  titleElementH1: true,
  indexIsLoaded: false
};

// Function to handle sending requests to the server using async/await
const sendRequest = async (url, successCallback, errorCallback) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    const data = await response.json();
    successCallback(data);
  } catch (error) {
    const errorMessage = error.response ? `Server returned status code ${error.response.status}` : 'Request failed due to network error';
    if (errorCallback) errorCallback(new Error(errorMessage));
    else console.error(errorMessage);
  }
};

// Function to switch the current language of the page
function switchLanguage(lang) {
  document.documentElement.lang = lang; // Sets the language of the document
  config.currentLanguage = lang; // Updates the config.currentLanguage variable
  highlightLanguageButton(lang); // Highlights the selected language button

  // Constructs a new path for the URL based on the selected language
  let newPath = '/' + config.currentLanguage + '/';
  if (config.currentSlug) {
    newPath += config.currentSlug;
  }
  history.pushState(null, null, newPath); // Updates the browser's history

  // Loads the appropriate content based on the config.currentSlug
  if (config.currentSlug === 'about') {
    loadAbout(false);
  } else if (config.currentSlug) {
    loadWorks(config.currentSlug, 0);
  } else {
    statement(config.currentLanguage);
  if (config.indexIsLoaded) {
    initializePage();
    }
  }
}

// Refactored to use a common function for loading content, with adjustments to not update meta description for index
const loadContent = (slug, popstate, contentType) => {
  window.scrollTo(0, 0); // Scrolls to the top of the page
  config.currentSlug = slug; // Updates the current slug in config

  let url = `/data.php?slug=${encodeURIComponent(slug)}&lang=${config.currentLanguage}`;
  if (contentType === 'index') {
    url += "&index=1";
    config.indexIsLoaded = true;
  } else if (contentType === 'about') {
    url += "&about=1";
  } else {
    url += "&works=1";
  }

  sendRequest(url, (response) => {
    const indexInnerElement = document.getElementById("index-inner");
    const contentElement = document.getElementById("content");
    if (contentType === 'index') {
      indexInnerElement.innerHTML = response.html;
      contentElement.innerHTML = '';
    } else {
      indexInnerElement.innerHTML = '';
      contentElement.innerHTML = response.html;
    }

    // Update meta description only if contentType is not 'index'
    if (contentType !== 'index') {
      const description = config.currentLanguage === 'de' ? response.descriptionDe : response.descriptionEn;
      updateMetaDescription(description);
      if (contentType !== 'about') {
        const pageTitle = response.title ? `${response.title} | David Herren` : 'David Herren';
        updateDocumentTitle(pageTitle);
      } else if (contentType === 'about') {
        updateDocumentTitle('About | David Herren');
      }
    }

    if (!popstate) { updateUrl(slug); }
    updateHrefLangTags();
    updateCanonicalTags();

    if (contentType === 'works') { 
      animateLetters('work-text-description');
    }
    
  }, (error) => {
    console.error(`Error with the request for ${contentType}:`, error);
  });

  highlightContentButton(`button-${slug}`, contentType);
  changeMenuTitle();
}

// Functions for loading specific types of content
function loadWorks(slug, popstate) {
  loadContent(slug, popstate, 'works');
}

function loadAbout(popstate) {
  loadContent('about', popstate, 'about');
}

function loadIndex(popstate) {
  loadContent('', popstate, 'index');
}

function changeMenuTitle() {
  if (config.titleElement && config.titleElement.tagName === 'H1' && config.titleElementH1) {
    let newTitleElement = document.createElement('h2');
    config.titleElementH1 = false;
    newTitleElement.id = config.titleElement.id;
    newTitleElement.innerHTML = config.titleElement.innerHTML;
    config.titleElement.parentNode.replaceChild(newTitleElement, config.titleElement);
  }
}

// Function to update the URL in the browser's history
function updateUrl(slug) {
  let newUrl = '/' + config.currentLanguage + '/' + slug; // Constructs the new URL
  window.history.pushState({path: newUrl}, '', newUrl); // Pushes the new URL to the browser's history
}

// Function to handle history popstate event
window.addEventListener('popstate', function(event) {
  const hostname = window.location.hostname;
  const isTargetDomain = hostname === 'localhost' || hostname === 'davidherren.ch';
  const hash = window.location.hash;
  const hasHash = hash.length > 0;
  if (isTargetDomain) {
    if (event.state && event.state.path) {
      const pathParts = event.state.path.split('/').filter(Boolean);
      if (pathParts.length >= 2) {
        const slug = pathParts[1];
        popstate = true;
        if (slug === 'about') {
          loadAbout(true);
        } else {
          loadWorks(slug, true);
        }
      }
    } else if (!hasHash) {
      loadIndex(true);
    }
  }
});

function initializePage() {
  let path = window.location.pathname.split('/').filter(Boolean);
  if (path.length <= 1) {
    loadIndex(true);
  }
}

// Event listener for the DOMContentLoaded event to ensure the page is fully loaded before executing any scripts
document.addEventListener("DOMContentLoaded", () => {
  // Extract parts of the URL path and filter out any empty elements
  let pathParts = window.location.pathname.split('/').filter(Boolean);
  
  initializePage();

  // Check the URL for a language code, using it if present, otherwise default to the browser's language preference
  if (pathParts.length > 0 && (pathParts[0] === 'de' || pathParts[0] === 'en')) {
    config.currentLanguage = pathParts[0]; // Set the page language based on the URL
  } else {
    // Default to the browser's language, or English if the browser's language is not explicitly supported
    let browserLanguage = navigator.language || navigator.userLanguage;
    config.currentLanguage = browserLanguage.startsWith('de') ? 'de' : 'en';
  }

  // Highlight the button for the current language and switch the page content to that language
  highlightLanguageButton(config.currentLanguage);
  switchLanguage(config.currentLanguage); // This function updates the page to reflect the chosen language
  
  // Load the index or specific content based on the URL, defaulting to the index if no specific path is provided
  if (pathParts.length > 1) {
    if (pathParts[1] === 'about') {
      loadAbout(false); // Load 'About' content if specified in the URL
    } else {
      attemptLoadWorks(pathParts[1], 0); // Try to load specific work details based on the slug in the URL
    }
  } /*else {
    // If no specific content is requested
  }*/

  // Update the page's hreflang tags based on the current language, for SEO purposes
  updateHrefLangTags(pathParts.length > 1 ? pathParts[1] : '');

  config.titleElement = document.getElementById('title-text'); // Get H1 title from menu
});

// Function to highlight the active language button
function highlightLanguageButton(lang) {
  document.querySelectorAll('#language-switch button').forEach(button => {
    button.classList.remove('button-highlighted'); // Removes highlight from all buttons
  });
  document.querySelector('#button-' + lang).classList.add('button-highlighted'); // Adds highlight to the selected button
}

// Function to highlight the active content button
function highlightContentButton(buttonId, contentType) {
  document.querySelectorAll('#menu-works button, #menu-about button').forEach(btn => {
    btn.classList.remove('button-highlighted');
  });
  if (contentType !== 'index') {
    const button = document.getElementById(buttonId);
    if (button) {
      button.classList.add('button-highlighted');
    }
  }
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

// Function to update canonical tags for SEO and accessibility
function updateCanonicalTags() {
  document.querySelectorAll('link[rel="canonical"]').forEach(function(tag) {tag.remove();});
  let canonicalTag = document.createElement('link');
  canonicalTag.rel = 'canonical';
  canonicalTag.href = 'https://davidherren.ch/' + config.currentLanguage + '/' + config.currentSlug;
  document.head.appendChild(canonicalTag);
}

// Function to update hreflang tags for SEO and accessibility
function updateHrefLangTags() {
  document.querySelectorAll('link[rel="alternate"]').forEach(tag => tag.remove()); // Removes existing hreflang tags
  const availableLanguages = ['de', 'en'];
  availableLanguages.forEach(lang => { // Iterate through available languages to create hreflang tags
    let linkTag = document.createElement('link');
    linkTag.rel = 'alternate';
    linkTag.hreflang = lang;
    linkTag.href = window.location.origin + '/' + lang + '/' + config.currentSlug;
    document.head.appendChild(linkTag);
  });
}

// Wrap loadWorks in a function that attempts to call it, and retries if it fails
function attemptLoadWorks(slug, popstate, attempt = 1) {
  if (typeof loadWorks === "function") {
    loadWorks(slug, popstate);
  } else if (attempt <= 3) { // Retry up to 3 times
    setTimeout(() => {
      attemptLoadWorks(slug, popstate, attempt + 1);
    }, 1000); // Wait 1 second before retrying
  } else {
    console.error("Failed to load work details after 3 attempts.");
  }
}
