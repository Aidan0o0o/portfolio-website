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
