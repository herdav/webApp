// style.js for davidherren.ch / 2025-03-12

{
  // Animate Words with each word appearing with an initial delay
  let isAnimating = false;
  function animateLetters(id) {
    if (isAnimating) return;
    isAnimating = true;
    const title = document.getElementById(id);
    const text = title.innerText;
    title.innerHTML = "";
    const words = text.split(" ");
    words.forEach((word, index) => {
      const span = document.createElement("span");
      span.innerText = word;
      span.style.opacity = 0;
      title.appendChild(span);
      if (index < words.length - 1) {
        title.appendChild(document.createTextNode(" "));
      }
      setTimeout(() => {
        span.style.opacity = 1;
      }, 600 * index);
    });
    setTimeout(() => {
      isAnimating = false;
    }, 600 * words.length); // Reset the isAnimating flag after the last animation
  }
}

function applySvgTransformations(expand) {
  const manageClass = (element, className, add) => {
    if (element) {
      if (add) {
        element.classList.add(className);
      } else {
        element.classList.remove(className);
      }
    }
  };

  // Apply transformations to each element based on the calculated translation value
  for (let index = 0; index <= 12; index++) {
    const elementId = "svg-arrow-" + index;
    const element = document.getElementById(elementId);
    const randomDuration = (Math.random() * 1.5).toFixed(2) + "s";

    if (element) {
      element.style.transition = `transform ${randomDuration} ease-in-out`;

      // Calculate translation value based on the index
      let value;
      if (index === 0) {
        value = 68;
      } else {
        const adjustedIndex = ((index - 1) % 6) + 1;
        value = 68 - adjustedIndex * 8;
      }

      const className = "translate-" + value;

      if (expand) {
        manageClass(element, className, true);
        manageClass(element, "translate-00", false);
      } else {
        manageClass(element, className, false);
        manageClass(element, "translate-00", true);
      }
    }
  }
}

function workTextHeight() {
  const workText = document.getElementById("work-text");
  const menu = document.getElementById("menu");

  if (workText && menu) {
    // Get the viewport height in pixels
    const viewportHeight = window.innerHeight;
    // Calculate the new height, subtracting the menu's offsetHeight and an additional value
    const height = viewportHeight - menu.offsetHeight - 128 + "px";
    // Apply the obtained height as min-height and max-height for the element
    workText.style.maxHeight = height;
    workText.style.minHeight = height;
  }
}

function scrollTopEvent() {
  const workText = document.getElementById("work-text");
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (workText) {
    workText.scrollTop = 0;
  }
}

{
  // MutationObserver to observe DOM changes and adjust the layout accordingly
  const observer = new MutationObserver((mutations, obs) => {
    const pointerButton = document.getElementById("pointer");
    const contentLeft = document.getElementById("content-inner-left");
    const contentRight = document.getElementById("content-inner-right");
    const svgArrow = document.querySelector(".svg-arrow");

    let isLeftExpanded = config.lastStateLeftExpanded;

    // Toggle class helper function
    const toggleClasses = (expandLeft) => {
      const leftClassAction = expandLeft ? "add" : "remove";
      const rightClassAction = expandLeft ? "remove" : "add";
      contentLeft.classList[leftClassAction]("width-expanded");
      contentRight.classList[rightClassAction]("width-expanded");
      contentLeft.classList[rightClassAction]("width-collapsed");
      contentRight.classList[leftClassAction]("width-collapsed");
      applySvgTransformations(!expandLeft);
      workTextHeight(); // Ensure workTextHeight is called after layout adjustments
    };

    if (contentLeft) {
      toggleClasses(isLeftExpanded); // Apply initial state
    }

    if (pointerButton) {
      pointerButton.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent default behavior for all clicks
        if (pointerButton.getAttribute("href") === "#top") {
          scrollTopEvent(); // Smoothly scroll to the top
          return; // Exit early
        }

        // Handling for clicks not targeting '#top'
        isLeftExpanded = !isLeftExpanded;
        config.lastStateLeftExpanded = isLeftExpanded; // Update global state
        toggleClasses(isLeftExpanded);
      });

      window.addEventListener("scroll", () => {
        if (config.currentSlug !== "about") {
          handleScrollLogic(pointerButton, svgArrow, isLeftExpanded);
          handleScrollElementTitles();
        }
      });

      // Apply hover event listeners to all .frame-title-left elements
      document
        .querySelectorAll(".frame-title-left")
        .forEach((frameTitleLeft) => {
          frameTitleLeft.addEventListener("mouseenter", () =>
            svgArrowRotation(svgArrow, isLeftExpanded, true)
          );
          frameTitleLeft.addEventListener("mouseleave", () =>
            svgArrowRotation(svgArrow, isLeftExpanded, false)
          );
        });
    }
  });
  observer.observe(document, { childList: true, subtree: true });
}

function svgArrowRotation(svgArrow, isLeftExpanded, isEntering) {
  svgArrow.style.transition = "transform 0.5s ease-in-out";
  if (isEntering) {
    svgArrow.style.transform = isLeftExpanded
      ? "rotate(90deg)"
      : "rotate(-90deg)";
  } else {
    svgArrow.style.transform = "";
  }
}

function handleScrollLogic(pointerButton, svgArrow, isLeftExpanded) {
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = document.documentElement.clientHeight;
  const scrolledNearBottom =
    window.scrollY + clientHeight >= scrollHeight - clientHeight / 2;
  pointerButton.style.top = window.scrollY > 500 ? "50vh" : "4rem";

  if (scrolledNearBottom) {
    svgArrow.style.transition = "transform 0.5s ease-in-out";
    svgArrow.style.transform = isLeftExpanded
      ? "rotate(90deg)"
      : "rotate(-90deg)";
    pointerButton.href = "#top";
  } else {
    svgArrow.style.transform = "";
    pointerButton.href = "";
  }
  if (window.scrollY === 0) {
    scrollTopEvent();
  }
}

function handleScrollElementTitles() {
  // Dynamically show titles based on scroll position
  const contentRight = document.querySelector("#content-inner-right");
  // Select images, the embedded model, and the video by their specific selectors
  const images = contentRight.querySelectorAll("img");
  const video = contentRight.querySelector("#work-video");
  const model = contentRight.querySelector("#embedded-model");

  const allElements = [...images]; // Start with all images
  if (video) allElements.push(video); // Add the video if it exists
  if (model) allElements.push(model); // Add the 3D model if it exists

  const allTitleDivs = document.querySelectorAll(
    "#content-inner-left .work-image-title, #content-inner-left .work-video-title, #content-inner-left .work-model-title"
  );
  allTitleDivs.forEach((div) => (div.style.display = "none")); // Initially hide all title divs
  let lastVisibleElementIndex = -1;

  allElements.forEach((el, index) => {
    const rect = el.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < window.innerHeight / 2) {
      lastVisibleElementIndex = index;
    }
  });

  // Handle the special case for the last element
  if (lastVisibleElementIndex !== -1) {
    const lastElRect =
      allElements[allElements.length - 1].getBoundingClientRect();
    if (
      allElements.length - 1 === lastVisibleElementIndex &&
      lastElRect.bottom < window.innerHeight / 2
    ) {
      allTitleDivs[lastVisibleElementIndex].style.display = "none";
    } else {
      allTitleDivs[lastVisibleElementIndex].style.display = "flex";
    }
  }
}

{
  // Controls the dropdown menu
  let currentOpenDropdownId = null;
  let currentOpenImgDivId = null;
  function dropDownMenu() {
    const mediaQueryMobile = window.matchMedia("(max-width: 1024px)");
    const menuInner = document.getElementById("menu-inner");
    const menuTitle = document.getElementById("menu-title");
    const menu = document.getElementById("menu");
    const buttonId = "button-dropdown";
    const computedStyle = window.getComputedStyle(menuInner);
    const isExpanded = computedStyle.height !== "0px";

    menuInner.style.height = isExpanded ? "0px" : "auto";
    menuInner.style.visibility = isExpanded ? "collapse" : "visible";
    menuInner.style.margin = isExpanded ? "0rem" : "2rem";
    menuTitle.style.height = isExpanded ? "calc(2rem - 2px)" : "2rem";

    if (mediaQueryMobile.matches) {
      menu.style.width = "auto";
      menuInner.style.margin = isExpanded ? "0rem" : "1rem";
    } else {
      menu.style.width = isExpanded ? "calc((100% - 4rem) / 3)" : "auto";
    }

    toggleTriangles(buttonId, !isExpanded);
  }

  // Expose dropDownMenu to global scope if needed
  window.dropDownMenu = dropDownMenu;

  // Modified toggleTriangles now accepts an optional "force" parameter.
  function toggleTriangles(buttonId, force) {
    const dropdownSvg = document.querySelector(`#${buttonId} svg`);
    if (!dropdownSvg) return;
    const triangles = dropdownSvg.querySelectorAll("rect");
    if (typeof force === "boolean") {
      triangles.forEach((triangle, index) => {
        if (force) {
          triangle.classList.add(`translateY-0${index + 1}`);
        } else {
          triangle.classList.remove(`translateY-0${index + 1}`);
        }
      });
      currentOpenDropdownId = force ? buttonId : null;
    } else {
      const isButtonAlreadyOpen = currentOpenDropdownId === buttonId;
      if (isButtonAlreadyOpen) {
        triangles.forEach((triangle, index) => {
          triangle.classList.remove(`translateY-0${index + 1}`);
        });
        currentOpenDropdownId = null;
      } else {
        triangles.forEach((triangle, index) => {
          triangle.classList.add(`translateY-0${index + 1}`);
        });
        currentOpenDropdownId = buttonId;
      }
    }
  }

  function expandImage(imgDivId, dropdownButtonId) {
    const imgDiv = document.getElementById(imgDivId);
    if (!imgDiv) return;

    const isClosingDiv = currentOpenImgDivId === imgDivId;
    if (isClosingDiv) {
      // Close the currently open image div
      imgDiv.style.height = "0px";
      currentOpenImgDivId = null;

      // Remove the translateY classes from the associated dropdown button
      const dropdownSvg = document.querySelector(`#${dropdownButtonId} svg`);
      const triangles = dropdownSvg.querySelectorAll("rect");
      triangles.forEach((triangle, index) => {
        triangle.classList.remove(`translateY-0${index + 1}`);
      });
    } else {
      // Close previous image div if exists
      if (currentOpenImgDivId) {
        const currentOpenImgDiv = document.getElementById(currentOpenImgDivId);
        if (currentOpenImgDiv) {
          currentOpenImgDiv.style.height = "0px";
          const previousDropdownButtonId = currentOpenImgDiv.getAttribute(
            "data-dropdown-button-id"
          );
          if (previousDropdownButtonId) {
            toggleTriangles(previousDropdownButtonId, false);
          }
        }
      }
      // Open new image div
      imgDiv.style.height = "100%";
      currentOpenImgDivId = imgDivId;
      imgDiv.setAttribute("data-dropdown-button-id", dropdownButtonId);
    }
  }

  // Expose expandImage to global scope if needed
  window.expandImage = expandImage;

  function resetTriangles() {
    if (currentOpenDropdownId) {
      const dropdownSvg = document.querySelector(
        `#${currentOpenDropdownId} svg`
      );
      if (dropdownSvg) {
        const triangles = dropdownSvg.querySelectorAll("rect");
        triangles.forEach((triangle, index) => {
          triangle.classList.remove(`translateY-0${index + 1}`);
        });
      }
      currentOpenDropdownId = null;
    }
  }

  // Expose resetTriangles to global scope if needed
  window.resetTriangles = resetTriangles;
}

{
  // Adjust height of index items
  const adjustHeight = () => {
    document.querySelectorAll(".index-item").forEach((item) => {
      const width = item.offsetWidth;
      const height = width * 0.667;
      item.style.height = `${height}px`;
    });
  };
  window.addEventListener("resize", adjustHeight);
  // Optionally call adjustHeight on load
  adjustHeight();
}
