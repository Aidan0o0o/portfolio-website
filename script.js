const header = document.querySelector("[data-header]");

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const cvLink = document.querySelector("[data-cv-link]");

cvLink?.addEventListener("click", () => {
  cvLink.classList.add("is-pressed");

  window.setTimeout(() => {
    cvLink.classList.remove("is-pressed");
  }, 650);
});

const copyEmailButton = document.querySelector("[data-copy-email]");

const copyText = async (text) => {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  textArea.remove();
};

copyEmailButton?.addEventListener("click", async () => {
  const email = copyEmailButton.dataset.copyEmail;
  const originalText = copyEmailButton.textContent;

  try {
    await copyText(email);
    copyEmailButton.textContent = "Copied";
    copyEmailButton.classList.add("is-copied");
  } catch {
    copyEmailButton.textContent = email;
  }

  window.setTimeout(() => {
    copyEmailButton.textContent = originalText;
    copyEmailButton.classList.remove("is-copied");
  }, 1800);
});

const revealItems = document.querySelectorAll(".reveal-on-scroll");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (prefersReducedMotion) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -80px",
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const galleryProjects = {
  "fresh-track": {
    title: "FreshTrack",
    images: [
      {
        src: "assets/projects/images/fresh-track/add-items-unfilled.PNG",
        alt: "FreshTrack empty add items screen",
        position: "center top",
      },
      {
        src: "assets/projects/images/fresh-track/add-items.png",
        alt: "FreshTrack add items screen with food entries",
        position: "center top",
      },
      {
        src: "assets/projects/images/fresh-track/barcode-scanning.png",
        alt: "FreshTrack barcode scanning screen",
        position: "center center",
      },
      {
        src: "assets/projects/images/fresh-track/edit-expiry.png",
        alt: "FreshTrack edit expiry screen",
        position: "center top",
      },
      {
        src: "assets/projects/images/fresh-track/receipt-scanner-2.png",
        alt: "FreshTrack receipt scanner result screen",
        position: "center top",
      },
      {
        src: "assets/projects/images/fresh-track/receipt-scanner.png",
        alt: "FreshTrack receipt camera scanner",
        position: "center center",
      },
      {
        src: "assets/projects/images/fresh-track/recipe.png",
        alt: "FreshTrack generated recipe screen",
        position: "center top",
      },
      {
        src: "assets/projects/images/fresh-track/recipes-2.PNG",
        alt: "FreshTrack recipes list screen",
        position: "center top",
      },
    ],
  },
  "pill-pall": {
    title: "PillPall",
    images: [
      {
        src: "assets/projects/images/pill-pall/home.JPG",
        alt: "PillPall home screen",
        position: "center center",
      },
      {
        src: "assets/projects/images/pill-pall/add-script-form.JPG",
        alt: "PillPall add prescription form",
        position: "center top",
      },
      {
        src: "assets/projects/images/pill-pall/scan-script.JPG",
        alt: "PillPall prescription scanning options",
        position: "center center",
      },
    ],
  },
  "ruh-portal": {
    title: "RUH Goal Portal",
    images: [
      {
        src: "assets/projects/images/RUH-portal/login-page.png",
        alt: "RUH Goal Portal login page",
        position: "center center",
      },
      {
        src: "assets/projects/images/RUH-portal/add-page.png",
        alt: "RUH Goal Portal add goal page",
        position: "center center",
      },
      {
        src: "assets/projects/images/RUH-portal/edit-page.png",
        alt: "RUH Goal Portal edit goal page",
        position: "center center",
      },
      {
        src: "assets/projects/images/RUH-portal/filter-page.png",
        alt: "RUH Goal Portal filter page",
        position: "center center",
      },
      {
        src: "assets/projects/images/RUH-portal/manage-edit.png",
        alt: "RUH Goal Portal manage edit screen",
        position: "center center",
      },
      {
        src: "assets/projects/images/RUH-portal/manage-page.png",
        alt: "RUH Goal Portal manage goals page",
        position: "center center",
      },
      {
        src: "assets/projects/images/RUH-portal/view-all-page.png",
        alt: "RUH Goal Portal view all goals page",
        position: "center center",
      },
      {
        src: "assets/projects/images/RUH-portal/view-indi-page.png",
        alt: "RUH Goal Portal individual goal page",
        position: "center center",
      },
    ],
  },
};

const galleryOverlay = document.querySelector("[data-gallery-overlay]");
const galleryTitle = document.querySelector("[data-gallery-title]");
const galleryTrack = document.querySelector("[data-gallery-track]");
const galleryCounter = document.querySelector("[data-gallery-counter]");
const galleryClose = document.querySelector("[data-gallery-close]");
const galleryPrev = document.querySelector("[data-gallery-prev]");
const galleryNext = document.querySelector("[data-gallery-next]");
const galleryOpeners = document.querySelectorAll("[data-gallery-id]");

let activeGalleryImages = [];
let activeGalleryIndex = 0;
let galleryOpener = null;

const updateGalleryCounter = () => {
  galleryCounter.textContent = activeGalleryImages.length
    ? `${activeGalleryIndex + 1} of ${activeGalleryImages.length}`
    : "";
};

const scrollGalleryTo = (index) => {
  const slides = galleryTrack.querySelectorAll(".gallery-slide");
  const slide = slides[index];

  if (!slide) {
    return;
  }

  activeGalleryIndex = index;
  galleryTrack.scrollTo({
    left:
      slide.offsetLeft -
      (galleryTrack.clientWidth - slide.clientWidth) / 2,
    behavior: prefersReducedMotion ? "auto" : "smooth",
  });
  updateGalleryCounter();
};

const setGalleryFromScroll = () => {
  const slides = [...galleryTrack.querySelectorAll(".gallery-slide")];

  if (!slides.length) {
    return;
  }

  const trackCenter = galleryTrack.scrollLeft + galleryTrack.clientWidth / 2;
  const closestIndex = slides.reduce((closest, slide, index) => {
    const slideCenter = slide.offsetLeft + slide.clientWidth / 2;
    const distance = Math.abs(trackCenter - slideCenter);

    return distance < closest.distance ? { distance, index } : closest;
  }, { distance: Infinity, index: 0 }).index;

  if (closestIndex !== activeGalleryIndex) {
    activeGalleryIndex = closestIndex;
    updateGalleryCounter();
  }
};

const openGallery = (projectId, opener) => {
  const project = galleryProjects[projectId];

  if (!project || !project.images.length) {
    return;
  }

  galleryOpener = opener;
  activeGalleryImages = project.images;
  activeGalleryIndex = 0;
  galleryTitle.textContent = project.title;
  galleryTrack.replaceChildren();

  activeGalleryImages.forEach((image) => {
    const slide = document.createElement("figure");
    const img = document.createElement("img");

    slide.className = "gallery-slide";
    img.src = image.src;
    img.alt = image.alt;
    img.style.objectPosition = image.position;
    slide.append(img);
    galleryTrack.append(slide);
  });

  galleryOverlay.classList.add("is-open");
  galleryOverlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("gallery-open");
  updateGalleryCounter();

  window.requestAnimationFrame(() => {
    scrollGalleryTo(0);
    galleryClose.focus();
  });
};

const closeGallery = () => {
  galleryOverlay.classList.remove("is-open");
  galleryOverlay.setAttribute("aria-hidden", "true");
  document.body.classList.remove("gallery-open");
  activeGalleryImages = [];
  galleryOpener?.focus();
};

galleryOpeners.forEach((opener) => {
  opener.addEventListener("click", () => {
    openGallery(opener.dataset.galleryId, opener);
  });
});

galleryClose?.addEventListener("click", closeGallery);

galleryPrev?.addEventListener("click", () => {
  const nextIndex =
    activeGalleryIndex === 0
      ? activeGalleryImages.length - 1
      : activeGalleryIndex - 1;

  scrollGalleryTo(nextIndex);
});

galleryNext?.addEventListener("click", () => {
  const nextIndex =
    activeGalleryIndex === activeGalleryImages.length - 1
      ? 0
      : activeGalleryIndex + 1;

  scrollGalleryTo(nextIndex);
});

galleryTrack?.addEventListener("scroll", () => {
  window.requestAnimationFrame(setGalleryFromScroll);
});

galleryOverlay?.addEventListener("click", (event) => {
  if (event.target === galleryOverlay) {
    closeGallery();
  }
});

const accessibilityToggle = document.querySelector("[data-accessibility-toggle]");
const accessibilityPanel = document.querySelector("[data-accessibility-panel]");
const accessibilityClose = document.querySelector("[data-accessibility-close]");
const accessibilityReset = document.querySelector("[data-accessibility-reset]");
const fontSizeInputs = document.querySelectorAll("input[name='font-size']");
const colourModeInputs = document.querySelectorAll("input[name='colour-mode']");

const accessibilityClasses = [
  "font-large",
  "font-larger",
  "colour-deuteranopia",
  "colour-protanopia",
  "colour-tritanopia",
  "colour-high-contrast",
  "colour-dark",
];

const settingsKey = "portfolioAccessibilitySettings";

const applyAccessibilitySettings = ({ fontSize = "default", colourMode = "default" }) => {
  document.documentElement.classList.remove(...accessibilityClasses);

  if (fontSize !== "default") {
    document.documentElement.classList.add(`font-${fontSize}`);
  }

  if (colourMode !== "default") {
    document.documentElement.classList.add(`colour-${colourMode}`);
  }

  fontSizeInputs.forEach((input) => {
    input.checked = input.value === fontSize;
  });

  colourModeInputs.forEach((input) => {
    input.checked = input.value === colourMode;
  });
};

const getAccessibilitySettings = () => ({
  fontSize:
    document.querySelector("input[name='font-size']:checked")?.value || "default",
  colourMode:
    document.querySelector("input[name='colour-mode']:checked")?.value ||
    "default",
});

const saveAccessibilitySettings = () => {
  localStorage.setItem(settingsKey, JSON.stringify(getAccessibilitySettings()));
};

const setAccessibilityPanelOpen = (isOpen) => {
  accessibilityPanel.hidden = !isOpen;
  accessibilityToggle.setAttribute("aria-expanded", String(isOpen));

  if (isOpen) {
    accessibilityPanel.querySelector("input, button")?.focus();
  }
};

let savedAccessibilitySettings = {};

try {
  savedAccessibilitySettings = JSON.parse(
    localStorage.getItem(settingsKey) || "{}"
  );
} catch {
  savedAccessibilitySettings = {};
}

applyAccessibilitySettings(savedAccessibilitySettings);

accessibilityToggle?.addEventListener("click", () => {
  setAccessibilityPanelOpen(accessibilityPanel.hidden);
});

accessibilityClose?.addEventListener("click", () => {
  setAccessibilityPanelOpen(false);
  accessibilityToggle.focus();
});

[...fontSizeInputs, ...colourModeInputs].forEach((input) => {
  input.addEventListener("change", () => {
    applyAccessibilitySettings(getAccessibilitySettings());
    saveAccessibilitySettings();
  });
});

accessibilityReset?.addEventListener("click", () => {
  const defaultSettings = { fontSize: "default", colourMode: "default" };
  applyAccessibilitySettings(defaultSettings);
  localStorage.setItem(settingsKey, JSON.stringify(defaultSettings));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && galleryOverlay?.classList.contains("is-open")) {
    closeGallery();
    return;
  }

  if (event.key === "Escape" && accessibilityPanel && !accessibilityPanel.hidden) {
    setAccessibilityPanelOpen(false);
    accessibilityToggle.focus();   
  }
});

document.addEventListener("click", (event) => {
  if (
    accessibilityPanel?.hidden ||
    event.target.closest(".accessibility-widget")
  ) {
    return;
  }

  setAccessibilityPanelOpen(false);
});
