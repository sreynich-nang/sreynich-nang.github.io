/**
 * Achievement Stories Scrollytelling Engine
 * Handles split-column scroll synchronization, IntersectionObserver, and interactive stage controls.
 */

document.addEventListener("DOMContentLoaded", () => {
  initNavbarAndFooter();
  initScrollytelling();
  initNestedSliders();
  initStoryCopyButtons();
});

/**
 * Dynamically loads the shared navigation and footer components.
 */
function initNavbarAndFooter() {
  const isTwoLevelsDeep = window.location.pathname.includes("/pages/");
  const componentPrefix = isTwoLevelsDeep ? "../components/" : "pages/components/";

  // Load Nav
  fetch(componentPrefix + "nav.html?t=" + Date.now())
    .then((res) => (res.ok ? res.text() : Promise.reject("Nav not found")))
    .then((html) => {
      const el = document.getElementById("navbar-placeholder");
      if (el) {
        el.innerHTML = html;
        // Run embedded scripts
        el.querySelectorAll("script").forEach((oldScript) => {
          const newScript = document.createElement("script");
          newScript.textContent = oldScript.textContent;
          document.body.appendChild(newScript).parentNode.removeChild(newScript);
        });
      }
    })
    .catch((err) => console.warn("Failed to load nav component:", err));

  // Load Footer
  fetch(componentPrefix + "footer.html?t=" + Date.now())
    .then((res) => (res.ok ? res.text() : Promise.reject("Footer not found")))
    .then((html) => {
      const el = document.getElementById("footer-placeholder");
      if (el) el.innerHTML = html;
    })
    .catch((err) => console.warn("Failed to load footer component:", err));
}

/**
 * Helper to locate an achievement story element by hash string (ID, slug, or story-index).
 */
function findStoryItemByHash(hash) {
  if (!hash) return null;
  const clean = hash.replace("#", "").trim().toLowerCase();
  if (!clean) return null;

  // 1. Direct ID match (e.g. #bamnang or #story-1)
  const byId = document.getElementById(clean);
  if (byId) {
    return byId.classList.contains("achievement-story-item")
      ? byId
      : byId.closest(".achievement-story-item");
  }

  // 2. data-slug match (e.g. data-slug="mef")
  const bySlug = document.querySelector(`.achievement-story-item[data-slug="${clean}"]`);
  if (bySlug) return bySlug;

  // 3. Story index or story-N match
  const num = clean.replace("story-", "").replace("story", "");
  if (num && !isNaN(num)) {
    const byNum = document.querySelector(`.achievement-story-item[data-index="${num}"]`);
    if (byNum) return byNum;
  }

  return null;
}

/**
 * Initializes IntersectionObserver to track which story is in focus,
 * updating the active story item and the sticky right stage panel.
 * Also handles direct URL hash navigation and scroll sync.
 */
function initScrollytelling() {
  const storyItems = document.querySelectorAll(".achievement-story-item");
  const stagePanels = document.querySelectorAll(".stage-preview-panel");
  const stageDots = document.querySelectorAll(".stage-dot-btn");
  const navPills = document.querySelectorAll(".achievement-pill-btn");
  const trackerText = document.getElementById("stage-tracker-num");
  const trackerTitle = document.getElementById("stage-tracker-title");

  if (!storyItems.length) return;

  let currentActiveIndex = 1;
  let isProgrammaticScrolling = false;
  let programmaticScrollTimer = null;

  // Function to switch active story across all UI components
  function setActiveStory(index, updateUrlHash = false) {
    if (index === currentActiveIndex) return;
    currentActiveIndex = index;

    // 1. Update left story items
    storyItems.forEach((item) => {
      const itemIndex = parseInt(item.getAttribute("data-index"), 10);
      if (itemIndex === index) {
        item.classList.add("is-active");
      } else {
        item.classList.remove("is-active");
      }
    });

    // 2. Update right sticky preview panels
    stagePanels.forEach((panel) => {
      const panelIndex = parseInt(panel.getAttribute("data-index"), 10);
      if (panelIndex === index) {
        panel.classList.add("active");
      } else {
        panel.classList.remove("active");
      }
    });

    // 3. Update stage dot indicator buttons
    stageDots.forEach((dot) => {
      const dotIndex = parseInt(dot.getAttribute("data-index"), 10);
      if (dotIndex === index) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });

    // 4. Update horizontal hero pills
    navPills.forEach((pill) => {
      const pillIndex = parseInt(pill.getAttribute("data-index"), 10);
      if (pillIndex === index) {
        pill.classList.add("active");
      } else {
        pill.classList.remove("active");
      }
    });

    // 5. Update stage header numbers & title
    if (trackerText) {
      trackerText.textContent = String(index).padStart(2, "0");
    }

    const activeItem = document.querySelector(`.achievement-story-item[data-index="${index}"]`);
    if (activeItem && trackerTitle) {
      const titleElem = activeItem.querySelector(".story-title");
      if (titleElem) {
        trackerTitle.textContent = titleElem.textContent.trim();
      }

      // Sync browser address bar with current story slug
      if (updateUrlHash && window.history && window.history.replaceState) {
        const slug = activeItem.getAttribute("data-slug");
        if (slug && window.scrollY > 200) {
          window.history.replaceState(null, null, `#${slug}`);
        }
      }
    }
  }

  // Smoothly navigates to a specific story item with navbar offset and focus pulse
  function navigateToStory(targetItem, updateHash = true, pulse = true) {
    if (!targetItem) return;
    const index = parseInt(targetItem.getAttribute("data-index"), 10);
    const slug = targetItem.getAttribute("data-slug");

    isProgrammaticScrolling = true;
    clearTimeout(programmaticScrollTimer);
    programmaticScrollTimer = setTimeout(() => {
      isProgrammaticScrolling = false;
    }, 850);

    setActiveStory(index, false);

    // Smooth scroll taking fixed navbar (height ~76px + buffer) into account
    const headerOffset = 88;
    const elementPosition = targetItem.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: Math.max(0, offsetPosition),
      behavior: "smooth"
    });

    if (pulse) {
      targetItem.classList.add("story-target-pulse");
      setTimeout(() => targetItem.classList.remove("story-target-pulse"), 2200);
    }

    if (updateHash && slug && window.history && window.history.pushState) {
      window.history.pushState(null, null, `#${slug}`);
    }
  }

  // Setup IntersectionObserver for smooth scroll detection
  const observerOptions = {
    root: null,
    rootMargin: "-25% 0px -40% 0px",
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    if (isProgrammaticScrolling) return;
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const index = parseInt(entry.target.getAttribute("data-index"), 10);
        if (index) {
          setActiveStory(index, true);
        }
      }
    });
  }, observerOptions);

  storyItems.forEach((item) => observer.observe(item));

  // Fallback scroll listener for edge cases (e.g. fast scrolling)
  let scrollTimeout;
  window.addEventListener("scroll", () => {
    if (isProgrammaticScrolling) return;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const targetY = window.innerHeight * 0.35;
      let closestItem = null;
      let minDistance = Infinity;

      storyItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.top + rect.height * 0.3;
        const distance = Math.abs(itemCenter - targetY);
        if (distance < minDistance) {
          minDistance = distance;
          closestItem = item;
        }
      });

      if (closestItem) {
        const index = parseInt(closestItem.getAttribute("data-index"), 10);
        if (index && index !== currentActiveIndex) {
          setActiveStory(index, true);
        }
      }
    }, 60);
  }, { passive: true });

  // Handle Initial Landing via URL Hash (e.g., #mef, #story-2, #python-trainer)
  const initialHash = window.location.hash;
  const initialTarget = findStoryItemByHash(initialHash);

  if (initialTarget) {
    const initIndex = parseInt(initialTarget.getAttribute("data-index"), 10);
    setActiveStory(initIndex, false);
    // Delay scroll slightly to allow layout and images to position accurately
    setTimeout(() => {
      navigateToStory(initialTarget, false, true);
    }, 200);
  } else {
    // Default to Story 1
    setActiveStory(1, false);
  }

  // Listen for browser Back/Forward or manual hash modifications
  window.addEventListener("hashchange", () => {
    const target = findStoryItemByHash(window.location.hash);
    if (target) {
      navigateToStory(target, false, true);
    }
  });

  // Click listeners on hero quick jump pills
  navPills.forEach((pill) => {
    pill.addEventListener("click", (e) => {
      e.preventDefault();
      const slug = pill.getAttribute("data-slug");
      const index = parseInt(pill.getAttribute("data-index"), 10);
      const target = findStoryItemByHash(slug) || document.querySelector(`.achievement-story-item[data-index="${index}"]`);
      if (target) {
        navigateToStory(target, true, true);
      }
    });
  });

  // Click listeners on story title buttons
  document.querySelectorAll(".story-title-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const item = btn.closest(".achievement-story-item");
      if (item) {
        navigateToStory(item, true, true);
      }
    });
  });

  // Click listeners on stage dots (desktop top bar)
  stageDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const index = parseInt(dot.getAttribute("data-index"), 10);
      const target = document.querySelector(`.achievement-story-item[data-index="${index}"]`);
      if (target) {
        navigateToStory(target, true, true);
      }
    });
  });

  // Keyboard navigation when page or list is focused
  window.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (e.key === "ArrowDown" || e.key === "PageDown") {
      if (currentActiveIndex < storyItems.length) {
        const nextItem = document.querySelector(`.achievement-story-item[data-index="${currentActiveIndex + 1}"]`);
        if (nextItem) navigateToStory(nextItem, true, true);
      }
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      if (currentActiveIndex > 1) {
        const prevItem = document.querySelector(`.achievement-story-item[data-index="${currentActiveIndex - 1}"]`);
        if (prevItem) navigateToStory(prevItem, true, true);
      }
    }
  });
}

/**
 * Initializes direct section copy link buttons and toast notifications.
 */
function initStoryCopyButtons() {
  const toast = document.getElementById("achievement-copy-toast");
  const toastMsg = document.getElementById("achievement-toast-msg");
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    if (toastMsg) toastMsg.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2800);
  }

  function fallbackCopyText(text) {
    return new Promise((resolve, reject) => {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.top = "-9999px";
        textarea.style.left = "-9999px";
        textarea.setAttribute("readonly", "");
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const successful = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (successful) resolve();
        else reject(new Error("execCommand copy failed"));
      } catch (err) {
        reject(err);
      }
    });
  }

  document.querySelectorAll(".story-copy-link-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const slug = btn.getAttribute("data-slug");
      const item = btn.closest(".achievement-story-item");
      const titleElem = item ? item.querySelector(".story-title") : null;
      const titleText = titleElem ? titleElem.textContent.trim() : "Story";

      // Build canonical direct link to this spot
      const url = `${window.location.origin}${window.location.pathname}#${slug}`;

      const copyPromise = navigator.clipboard && navigator.clipboard.writeText
        ? navigator.clipboard.writeText(url)
        : fallbackCopyText(url);

      Promise.resolve(copyPromise)
        .then(() => {
          // Button state
          btn.classList.add("copied");
          const icon = btn.querySelector("i");
          const tooltip = btn.querySelector(".copy-tooltip");
          if (icon) icon.className = "bi bi-check2";
          if (tooltip) tooltip.textContent = "Copied!";

          // Show Toast notification
          showToast(`Direct link copied: #${slug}`);

          // Update URL in address bar without reloading
          if (window.history && window.history.pushState) {
            window.history.pushState(null, null, `#${slug}`);
          }

          // Reset button state after 2.2s
          setTimeout(() => {
            btn.classList.remove("copied");
            if (icon) icon.className = "bi bi-link-45deg";
            if (tooltip) tooltip.textContent = "Copy link";
          }, 2200);
        })
        .catch((err) => {
          console.warn("Clipboard write failed:", err);
          showToast(`Direct link: #${slug}`);
        });
    });
  });
}

/**
 * Initializes nested image sliders within each story panel and mobile card,
 * driven by sec-testimonials-nav-btn buttons and indicator dots.
 */
function initNestedSliders() {
  document.querySelectorAll(".panel-slider").forEach((slider) => {
    const slides = slider.querySelectorAll(".slider-slide");
    const dots = slider.querySelectorAll(".slider-dot");
    const prevBtn = slider.querySelector(".sec-testimonials-prev");
    const nextBtn = slider.querySelector(".sec-testimonials-next");

    if (slides.length <= 1) {
      if (prevBtn) prevBtn.style.display = "none";
      if (nextBtn) nextBtn.style.display = "none";
      const ind = slider.querySelector(".slider-indicators");
      if (ind) ind.style.display = "none";
      return;
    }

    let currentIndex = 0;

    function goToSlide(idx) {
      if (idx < 0) idx = slides.length - 1;
      if (idx >= slides.length) idx = 0;
      currentIndex = idx;

      slides.forEach((s, i) => {
        if (i === currentIndex) {
          s.classList.add("active");
        } else {
          s.classList.remove("active");
        }
      });

      dots.forEach((d, i) => {
        if (i === currentIndex) {
          d.classList.add("active");
        } else {
          d.classList.remove("active");
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        goToSlide(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        goToSlide(currentIndex + 1);
      });
    }

    dots.forEach((dot, dotIdx) => {
      dot.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        goToSlide(dotIdx);
      });
    });
  });
}
