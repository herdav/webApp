// data.js for davidherren.ch / 2025-03-12

const config = {
  currentLanguage: '', // Default language
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
    const errorMessage = error.response
      ? `Server returned status code ${error.response.status}`
      : 'Request failed due to network error';
    if (errorCallback) errorCallback(new Error(errorMessage));
    else console.error(errorMessage);
  }
};

// Function to switch the current language of the page
function switchLanguage(lang) {
  document.documentElement.lang = lang; // Set document language
  config.currentLanguage = lang; // Update config
  highlightLanguageButton(lang); // Highlight the selected language button

  // Construct new path based on selected language and current slug
  let newPath = `/${config.currentLanguage}/`;
  if (config.currentSlug) {
    newPath += config.currentSlug;
  }
  history.pushState(null, null, newPath); // Update browser history

  // Load appropriate content based on the current slug
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

// Refactored common function for loading content; does not update meta description for index
const loadContent = (slug, popstate, contentType) => {
  window.scrollTo(0, 0); // Scroll to top of page
  config.currentSlug = slug; // Update current slug

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

    // Update meta description only if not index
    if (contentType !== 'index') {
      const description = config.currentLanguage === 'de' ? response.descriptionDe : response.descriptionEn;
      updateMetaDescription(description);
      if (contentType !== 'about') {
        const pageTitle = response.title ? `${response.title} | David Herren` : 'David Herren';
        updateDocumentTitle(pageTitle);
      } else {
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
};

// Functions for loading specific types of content
const loadWorks = (slug, popstate) => loadContent(slug, popstate, 'works');
const loadAbout = (popstate) => loadContent('about', popstate, 'about');
const loadIndex = (popstate) => loadContent('', popstate, 'index');

function changeMenuTitle() {
  if (config.titleElement && config.titleElement.tagName === 'H1' && config.titleElementH1) {
    const newTitleElement = document.createElement('h2');
    config.titleElementH1 = false;
    newTitleElement.id = config.titleElement.id;
    newTitleElement.innerHTML = config.titleElement.innerHTML;
    config.titleElement.parentNode.replaceChild(newTitleElement, config.titleElement);
  }
}

// Function to update the URL in the browser's history
function updateUrl(slug) {
  const newUrl = `/${config.currentLanguage}/${slug}`; // Construct new URL
  window.history.pushState({ path: newUrl }, '', newUrl);
}

// Handle history popstate event
window.addEventListener('popstate', (event) => {
  const hostname = window.location.hostname;
  const isTargetDomain = hostname === 'localhost' || hostname === 'davidherren.ch';
  const hash = window.location.hash;
  const hasHash = hash.length > 0;
  if (isTargetDomain) {
    if (event.state && event.state.path) {
      const pathParts = event.state.path.split('/').filter(Boolean);
      if (pathParts.length >= 2) {
        const slug = pathParts[1];
        const popstate = true;
        if (slug === 'about') {
          loadAbout(popstate);
        } else {
          loadWorks(slug, popstate);
        }
      }
    } else if (!hasHash) {
      loadIndex(true);
    }
  }
});

function initializePage() {
  const path = window.location.pathname.split('/').filter(Boolean);
  if (path.length <= 1) {
    loadIndex(true);
  }
}

// DOMContentLoaded event to ensure scripts run after page is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  
  initializePage();

  // Check URL for language code; if not present, default to browser language (de or en)
  if (pathParts.length > 0 && (pathParts[0] === 'de' || pathParts[0] === 'en')) {
    config.currentLanguage = pathParts[0];
  } else {
    const browserLanguage = navigator.language || navigator.userLanguage;
    config.currentLanguage = browserLanguage.startsWith('de') ? 'de' : 'en';
  }

  highlightLanguageButton(config.currentLanguage);
  switchLanguage(config.currentLanguage); // Updates page to chosen language
  
  // Load specific content based on URL; default to index if no content requested
  if (pathParts.length > 1) {
    if (pathParts[1] === 'about') {
      loadAbout(false);
    } else {
      attemptLoadWorks(pathParts[1], 0);
    }
  }

  updateHrefLangTags();
  config.titleElement = document.getElementById('title-text'); // Get H1 title from menu
});

// Function to highlight the active language button
function highlightLanguageButton(lang) {
  document.querySelectorAll('#language-switch button').forEach(button => {
    button.classList.remove('button-highlighted');
  });
  document.querySelector(`#button-${lang}`).classList.add('button-highlighted');
}

// Function to highlight the active content button
function highlightContentButton(buttonId, contentType) {
  document.querySelectorAll('#menu-works button, #menu-about button').forEach(btn => {
    btn.classList.remove('button-highlighted');
  });
  if (contentType !== 'index') {
    const button = document.getElementById(buttonId);
    if (button) button.classList.add('button-highlighted');
  }
}

{ // Functions to update meta description and handle statement requests
  function updateMetaDescription(description) {
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = description;
  }

  function statement(lang) {
    const url = `/data.php?statement=${encodeURIComponent(lang)}`;
    sendRequest(url, (response) => {
      updateMetaDescription(response.description);
    }, (error) => {
      console.error('Error fetching statement:', error);
    });
  }
}

// Function to update the document title
function updateDocumentTitle(title) {
  document.title = title;
}

// Function to update canonical tags for SEO
function updateCanonicalTags() {
  document.querySelectorAll('link[rel="canonical"]').forEach(tag => tag.remove());
  const canonicalTag = document.createElement('link');
  canonicalTag.rel = 'canonical';
  canonicalTag.href = `https://davidherren.ch/${config.currentLanguage}/${config.currentSlug}`;
  document.head.appendChild(canonicalTag);
}

// Function to update hreflang tags for SEO
function updateHrefLangTags() {
  document.querySelectorAll('link[rel="alternate"]').forEach(tag => tag.remove());
  const availableLanguages = ['de', 'en'];
  availableLanguages.forEach(lang => {
    const linkTag = document.createElement('link');
    linkTag.rel = 'alternate';
    linkTag.hreflang = lang;
    linkTag.href = `${window.location.origin}/${lang}/${config.currentSlug}`;
    document.head.appendChild(linkTag);
  });
}

// Wrap loadWorks in a function that retries if it fails
function attemptLoadWorks(slug, popstate, attempt = 1) {
  if (typeof loadWorks === "function") {
    loadWorks(slug, popstate);
  } else if (attempt <= 3) {
    setTimeout(() => {
      attemptLoadWorks(slug, popstate, attempt + 1);
    }, 1000);
  } else {
    console.error("Failed to load work details after 3 attempts.");
  }
}
