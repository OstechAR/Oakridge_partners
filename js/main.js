/* Runs on every page. */

document.addEventListener("DOMContentLoaded", () => {
  // Mobile nav toggle
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // Mark the current page's nav link
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === path) a.setAttribute("aria-current", "page");
  });

  // Footer year
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
});
/* ===========================================================
   Cookie consent banner. Shows once, remembers the choice in
   localStorage, and updates Google's Consent Mode accordingly
   so analytics_storage only turns on after explicit accept.
   =========================================================== */

(function () {
  const STORAGE_KEY = "oakridge_cookie_consent";

  document.addEventListener("DOMContentLoaded", () => {
    injectBanner();
    const saved = getSavedConsent();
    if (!saved) showBanner();

    // Exposed globally so a "Cookie preferences" link anywhere on
    // the site (e.g. footer, privacy.html) can reopen the banner.
    window.OakridgeConsent = {
      open: showBanner,
      current: getSavedConsent,
    };
  });

  function getSavedConsent() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function saveConsent(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {
      console.error("Oakridge: could not save cookie consent", e);
    }
  }

  function injectBanner() {
    if (document.getElementById("cookie-banner")) return;
    const el = document.createElement("div");
    el.id = "cookie-banner";
    el.className = "cookie-banner";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-label", "Cookie preferences");
    el.innerHTML = `
      <div class="cookie-banner-inner">
        <p class="cookie-banner-text">
          We use analytics cookies to understand how visitors use this site. No cookies are used to sell your data.
          See our <a href="privacy.html">privacy policy</a> for details.
        </p>
        <div class="cookie-banner-actions">
          <button type="button" class="btn btn-secondary" id="cookie-decline">Decline</button>
          <button type="button" class="btn btn-primary" id="cookie-accept">Accept</button>
        </div>
      </div>
    `;
    document.body.appendChild(el);

    document.getElementById("cookie-accept").addEventListener("click", () => {
      saveConsent("accepted");
      if (typeof gtag === "function") {
        gtag("consent", "update", { analytics_storage: "granted" });
      }
      hideBanner();
    });

    document.getElementById("cookie-decline").addEventListener("click", () => {
      saveConsent("declined");
      if (typeof gtag === "function") {
        gtag("consent", "update", { analytics_storage: "denied" });
      }
      hideBanner();
    });
  }

  function showBanner() {
    const el = document.getElementById("cookie-banner");
    if (el) el.classList.add("visible");
  }

  function hideBanner() {
    const el = document.getElementById("cookie-banner");
    if (el) el.classList.remove("visible");
  }
})();
