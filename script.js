const header = document.querySelector("[data-header]");

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

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
