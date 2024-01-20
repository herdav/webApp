// animations.js for davidherren.ch / 2024-01-20

{ // Animate Title Letters
  let isAnimating = false;
  function animateTitleLetters() {
    if (isAnimating) return;
    isAnimating = true;
    const title = document.getElementById('frame-title-center');
    const text = title.innerText;
    title.innerHTML = '';
    text.split('').forEach((letter, index) => {
      const span = document.createElement('span');
      span.innerText = letter;
      span.style.opacity = 0;
      title.appendChild(span);
      setTimeout(() => {
        span.style.opacity = 1;
      }, 100 * index);
    });
    setTimeout(() => {
      isAnimating = false;
    }, 100 * text.length);
  }
  /*document.getElementById('frame-title-center').addEventListener('mouseover', animateTitleLetters);*/
}

function imgOnMousePointer() {
  var div = document.createElement('div');

  div.style.width = '50px';
  div.style.height = '50px';
  div.style.backgroundColor = 'red';
  div.style.position = 'absolute';

  document.body.appendChild(div);
  document.addEventListener('mousemove', function(e) {
    div.style.left = e.clientX + 'px';
    div.style.top = e.clientY + 'px';
  });
}

function dropDown() {
  var mediaQueryMobile = window.matchMedia("(max-width: 1024px)");
  var mediaQueryDesktop = window.matchMedia("(min-width: 1025px)");
  var menuInner = document.getElementById('menu-inner');
  var menuTitle = document.getElementById('menu-title');
  var menu = document.getElementById('menu');
  var triangles = [];

  for (var i = 1; i <= 7; i++) {
    triangles.push(document.getElementById(`svg-triangle-${i}`));
  }

  var computedStyle = window.getComputedStyle(menuInner);
  var isExpanded = computedStyle.height !== '0px';

  function toggleTriangles(add) {
    triangles.forEach(function(triangle, index) {
      triangle.classList.toggle(`translateY-0${index + 1}`, add);
    });
  }

  if (mediaQueryMobile.matches) {
    menuInner.style.height = isExpanded ? '0px' : 'auto';
    toggleTriangles(!isExpanded);
  } else if (mediaQueryDesktop.matches) {
    if (isExpanded) {
      menu.style.width = 'calc(33% - 2rem)';
      menuInner.style.height = '0px';
      menuInner.style.margin = '0rem';
      menuTitle.style.height = 'calc(2rem - 2px)';
      toggleTriangles(true);
    } else {
      menu.style.width = '100%';
      menuInner.style.height = 'auto';
      menuInner.style.margin = '2rem';
      menuTitle.style.height = '2rem';
      toggleTriangles(false);
    }
  } else {
    menuInner.style.height = 'auto';
  }
  isExpanded = !isExpanded;
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

{ // MutationObserver to observe DOM changes and adjust the layout accordingly
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
