// data.js

// Initialization of global variables
let currentLanguage = 'de'; // Sets the default language to German
let currentSlug = ''; // Stores the current slug for content
let isLoadingWork = false; // Flag to indicate if work is currently being loaded
let currentMinWidth = '65%'; // Default minimum width for a section of the content

// Function to handle sending requests to a server
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
  }
}

// Function to highlight the active language button
function highlightLanguageButton(lang) {
  document.querySelectorAll('#language-switch button').forEach(button => {
    button.classList.remove('highlighted'); // Removes highlight from all buttons
  });
  document.querySelector('#button-' + lang).classList.add('highlighted'); // Adds highlight to the selected button
}

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
    let contentLeft = document.getElementById('content-inner-left');
    if (contentLeft) {
      contentLeft.style.transition = 'none';
      contentLeft.style.minWidth = currentMinWidth;
      setTimeout(() => {
        isLoadingWork = false; // Resets the loading flag
        contentLeft.style.transition = 'min-width 1.5s ease-in-out';
      }, 50);
      updateTriangleDirection(); // Updates the direction of the triangle indicator
    }
  }, (error) => {
    console.error('Error with the request:', error); // Logs any errors
  });
  highlightContentButton('button-' + slug); // Highlights the active content button
}

// Function to adjust the width of a content section
function adjustWidth() {
  let contentLeft = document.getElementById('content-inner-left');
  if (contentLeft) {
    // Toggles the width between two values
    currentMinWidth = currentMinWidth === '35%' ? '65%' : '35%';
    contentLeft.style.minWidth = currentMinWidth;
    contentLeft.addEventListener('transitionend', () => {
      let separatorLink = document.getElementById('seperator-link');
      if (separatorLink) {
        updateTriangleDirection(); // Updates the direction of the triangle indicator
        separatorLink.style.transition = "transform 0.5s ease";
      }
    }, { once: true });
  }
}

// Function to update the direction of the triangle used as a separator
function updateTriangleDirection() {
  let separatorLink = document.getElementById('seperator-link');
  let contentLeft = document.getElementById('content-inner-left');
  if (separatorLink && contentLeft) {
    // Calculates the width ratio to determine the triangle's direction
    let contentLeftWidth = contentLeft.offsetWidth;
    let parentWidth = contentLeft.parentNode.offsetWidth;
    if (contentLeftWidth / parentWidth < 0.5) {
      separatorLink.className = 'triangle rotated'; // Rotates the triangle
    } else {
      separatorLink.className = 'triangle'; // Sets the triangle to default position
    }
  }
}

function loadExhibitions() {
  currentSlug = 'exhibitions';
  let url = "/data.php?lang=" + encodeURIComponent(currentLanguage) + "&exhibitions=1";
  sendRequest(url, (response) => {
    document.getElementById("index").innerHTML = '';
    document.getElementById("content").innerHTML = response.html;
    updateDocumentTitle('Exhibitions');
    updateUrl('exhibitions');
  }, (error) => {
    console.error('Error with the request:', error);
  });
  highlightContentButton('button-exhibitions');
}

function loadAbout() {
  currentSlug = 'about';
  let url = "/data.php?lang=" + encodeURIComponent(currentLanguage) + "&about=1";
  sendRequest(url, (response) => {
    document.getElementById("index").innerHTML = '';
    document.getElementById("content").innerHTML = response.html;
    updateDocumentTitle('About');
    updateUrl('about');
  }, (error) => {
    console.error('Error with the request:', error);
  });
  highlightContentButton('button-about');
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
  ['de', 'en'].forEach(lang => {
    let linkTag = document.createElement('link'); // Creates a new link tag
    linkTag.rel = 'alternate';
    linkTag.hreflang = lang; // Sets the hreflang attribute
    linkTag.href = window.location.origin + '/' + lang + '/' + slug; // Sets the href attribute
    document.head.appendChild(linkTag); // Appends the link tag to the document head
  });
}

// Function to highlight the active content button
function highlightContentButton(buttonId) {
  document.querySelectorAll('#menu-works button, #menu-about button').forEach(btn => {
    btn.classList.remove('highlighted'); // Removes highlight from all buttons
  });
  const button = document.getElementById(buttonId);
  if (button) {
    button.classList.add('highlighted'); // Adds highlight to the selected button
  }
}

// Event listener for the DOMContentLoaded event to initialize the page based on URL
document.addEventListener("DOMContentLoaded", () => {
  // Highlight the current language button
  highlightLanguageButton(currentLanguage);

  // Reads the path part from the URL to determine the initial state of the page
  let pathParts = window.location.pathname.split('/').filter(Boolean);
  if (pathParts.length > 1) {
    // Set the language based on the URL path and load the corresponding content
    switchLanguage(pathParts[0]);
    if (pathParts[1] === 'about') {
      loadAbout();
    } else if (pathParts[1] === 'exhibitions') {
      loadExhibitions();
    } else {
      loadWorks(pathParts[1]);
    }
  }

  // Event listeners for additional functionalities can be added here
  window.addEventListener('scroll', () => {
    // Logic for behavior on scrolling
    let images = document.querySelectorAll('#content-inner-right img');
    let allTitleDivs = document.querySelectorAll('#content-inner-right .work-image-title');
    allTitleDivs.forEach(div => div.style.display = 'none');
    let currentVisibleImageIndex = -1;
    images.forEach((img, index) => {
      let rect = img.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        currentVisibleImageIndex = index;
      }
    });
    if (currentVisibleImageIndex !== -1) {
      allTitleDivs[currentVisibleImageIndex].style.display = 'block';
    }
  });
});
