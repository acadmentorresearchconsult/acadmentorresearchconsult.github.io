// ====== QUICK SETTINGS ======
const SETTINGS = {
  whatsappNumberInternational: "233265355732", // e.g. "233501234567"
  email: "acadmentorresearchconsult@gmail.com",
  facebookUrl: "https://web.facebook.com/acadmentorresearchconsult",     // replace with your page
  instagramUrl: "https://www.instagram.com/acadmentorresearchconsult/",   // replace with your page
  peopleServed: 50
};
// ============================

// Mobile nav
const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("nav--open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      nav.classList.remove("nav--open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const href = a.getAttribute("href");
    if (!href || href === "#") return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// Floating socials + email
const whatsappBtn = document.getElementById("whatsappBtn");
const fbFloat = document.getElementById("fbFloat");
const igFloat = document.getElementById("igFloat");
const emailLink = document.getElementById("emailLink");

if (whatsappBtn) {
  const msg = "Hi AcadMentor! I need mentorship for my research/thesis. Please help.";
  whatsappBtn.href = `https://wa.me/${SETTINGS.whatsappNumberInternational}?text=${encodeURIComponent(msg)}`;
}
if (fbFloat) fbFloat.href = SETTINGS.facebookUrl;
if (igFloat) igFloat.href = SETTINGS.instagramUrl;
if (emailLink) {
  emailLink.href = `mailto:${SETTINGS.email}`;
  emailLink.textContent = SETTINGS.email;
}

// Counter
const servedEl = document.getElementById("servedCount");
function animateCount(el, target) {
  let current = 0;
  const steps = 80;
  const increment = Math.max(1, Math.floor(target / steps));
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = String(target);
      clearInterval(timer);
      return;
    }
    el.textContent = String(current);
  }, 18);
}

if (servedEl) {
  const target = Number(servedEl.dataset.target || SETTINGS.peopleServed || 50);
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(servedEl, target);
          obs.disconnect();
        }
      });
    },
    { threshold: 0.35 }
  );
  obs.observe(servedEl);
}

// Footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Toast popup
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("toast--show"));

  setTimeout(() => {
    toast.classList.remove("toast--show");
    setTimeout(() => toast.remove(), 260);
  }, 3000);
}

// Formspree submit (with popup + auto-clear)
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    if (formStatus) formStatus.textContent = "Sending message...";

    try {
      const formData = new FormData(contactForm);

      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" }
      });

      if (response.ok) {
        contactForm.reset(); // clears form
        if (formStatus) formStatus.textContent = "";
        showToast("Message sent successfully!", "success");
      } else {
        if (formStatus) formStatus.textContent = "Something went wrong. Please try again.";
        showToast("Failed to send. Please try again.", "error");
      }
    } catch (err) {
      if (formStatus) formStatus.textContent = "Network error. Please try again.";
      showToast("Network error. Please try again.", "error");
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

// Events & Offers nav notification
const eventsOffersLink = document.getElementById("eventsOffersLink");
const eventsOffersBadge = document.getElementById("eventsOffersBadge");

if (eventsOffersLink) {
  const version = eventsOffersLink.dataset.feedVersion || "1";
  const storageKey = "acadmentor-events-seen-version";
  const seenVersion = localStorage.getItem(storageKey);

  if (seenVersion !== version) {
    eventsOffersLink.classList.add("is-new");
    eventsOffersBadge.textContent = "New";
  } else {
    eventsOffersLink.classList.add("is-seen");
    eventsOffersBadge.textContent = "Seen";
  }

  eventsOffersLink.addEventListener("click", () => {
    localStorage.setItem(storageKey, version);
    eventsOffersLink.classList.remove("is-new");
    eventsOffersLink.classList.add("is-seen");
    if (eventsOffersBadge) eventsOffersBadge.textContent = "Seen";
  });
}

// Email subscription popup

document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("emailPopup");
  const closeBtn = document.getElementById("closePopup");

  if (!popup) return;

  // REMOVE THIS AFTER TESTING
  localStorage.removeItem("popupShown");

  if (!localStorage.getItem("popupShown")) {
    setTimeout(() => {
      popup.classList.remove("hidden");
      popup.setAttribute("aria-hidden", "false");
      localStorage.setItem("popupShown", "true");
    }, 5000); // 5 seconds
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      popup.classList.add("hidden");
    });
  }
});


// Close popup if subscription was successful
window.addEventListener("load", () => {
  const params = new URLSearchParams(window.location.search);

  if (params.get("subscribed") === "true") {
    const popup = document.getElementById("emailPopup");
    if (popup) {
      popup.classList.add("hidden");
    }

    // Optional: remove query from URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }
});
