/**
 * VlinCode - Main JavaScript
 * Handles: mobile menu toggle, form submission with EmailJS, smooth scroll,
 *          animated counters (stats) and Swiper portfolio slider
 */

// ==========================================================================
// EmailJS Configuration
// ==========================================================================

const EMAILJS_PUBLIC_KEY = "LZNwN5BR1LuxyxsWF";
const EMAILJS_SERVICE_ID = "service_1p3cf9q";
const EMAILJS_TEMPLATE_ENTERPRISE = "template_3fl9vkl"; // Correo a tu empresa
const EMAILJS_TEMPLATE_CLIENT = "template_cet73uq"; // Confirmación al cliente

// ==========================================================================
// DOM Ready
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  emailjs.init(EMAILJS_PUBLIC_KEY);

  initMobileMenu();
  initContactForm();
  initSmoothScrollLinks();
  initCounters();
  initSwiperSlider();
  initAnimatedTitle();
});

// ==========================================================================
// Mobile Menu Toggle
// ==========================================================================

/**
 * Toggles the mobile navigation menu visibility
 * Uses the hamburger button in the header
 */
function initMobileMenu() {
  const menuBtn = document.querySelector(".mobile-menu-btn");
  const mobileNav = document.querySelector(".mobile-nav");

  if (!menuBtn || !mobileNav) return;

  menuBtn.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("open");
    menuBtn.classList.toggle("active", isOpen);

    // Update aria-expanded for accessibility
    menuBtn.setAttribute("aria-expanded", isOpen);

    // Toggle body scroll when menu is open
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  // Close menu when clicking a nav link
  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("open");
      menuBtn.classList.remove("active");
      menuBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });
}

// ==========================================================================
// Contact Form Handler (EmailJS)
// ==========================================================================

/**
 * Handles the CTA form submission using EmailJS
 * Sends two emails: one to enterprise, one confirmation to client
 */
function initContactForm() {
  const form = document.querySelector(".cta-form");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailInput = form.querySelector('input[type="email"]');
    const btn = form.querySelector("button");
    const email = emailInput?.value.trim();

    // Basic email validation
    if (!email || !isValidEmail(email)) {
      shakeElement(emailInput);
      return;
    }

    // Validate reCAPTCHA
    const recaptchaResponse = document.querySelector(".g-recaptcha textarea[name='g-recaptcha-response']");
    if (!recaptchaResponse || !recaptchaResponse.value) {
      shakeElement(form.querySelector(".g-recaptcha"));
      return;
    }

    // Disable button and show loading state
    const originalText = btn.textContent;
    btn.textContent = "Enviando...";
    btn.disabled = true;

    const templateParams = {
      email: email,
      reply_to: email,
      "g-recaptcha-response": recaptchaResponse.value,
    };

    let enterpriseOk = false;

    // Send email to enterprise
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ENTERPRISE,
        templateParams,
      );
      enterpriseOk = true;
    } catch (err) {
      // Enterprise email failed
    }

    // Send confirmation email to client
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_CLIENT,
        templateParams,
      );
    } catch (err) {
      // Client email failed
    }

    // Reset reCAPTCHA after submission
    if (typeof grecaptcha !== "undefined") {
      grecaptcha.reset();
    }

    // Feedback
    if (enterpriseOk) {
      btn.textContent = "¡Enviado!";
      emailInput.value = "";
    } else {
      btn.textContent = "Error. Revisa la consola (F12)";
    }

    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
    }, 3000);
  });
}

/**
 * Validates email format using regex
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Adds a shake animation to an element for validation feedback
 * @param {HTMLElement} element
 */
function shakeElement(element) {
  if (!element) return;
  element.style.animation = "shake 0.5s ease";
  element.addEventListener(
    "animationend",
    () => {
      element.style.animation = "";
    },
    { once: true },
  );
}

// ==========================================================================
// Smooth Scroll for Anchor Links
// ==========================================================================

/**
 * Adds smooth scroll behavior to all anchor links
 * Handles offset for the fixed header
 */
function initSmoothScrollLinks() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const headerHeight = document.querySelector("header")?.offsetHeight || 80;
      const targetPosition =
        target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    });
  });
}

// ==========================================================================
// Animated Counters (Stats Section)
// ==========================================================================

/**
 * Animates number counters in the stats section when they scroll into view.
 * Uses IntersectionObserver to trigger each counter only once.
 * Each counter reads its final value from a `data-target` attribute.
 */
function initCounters() {
  const counters = document.querySelectorAll(".counter");
  const speed = 80;

  if (!counters.length) return;

  const formats = {
    2: (v) => `+${v}`,
    100: (v) => `${v}%`,
    1: (v) => `${v}+`,
  };

  const startCounting = (counter) => {
    const target = +counter.getAttribute("data-target");
    const format = formats[target] || ((v) => `${v}`);

    const updateCount = () => {
      const currentText = counter.innerText.replace(/[^0-9]/g, "");
      const count = +currentText;
      const increment = Math.ceil(target / speed);

      if (count < target) {
        counter.innerText = format(Math.min(count + increment, target));
        setTimeout(updateCount, 25);
      } else {
        counter.innerText = format(target);
        counter.classList.add("bounce-effect", "flash-effect");
      }
    };

    updateCount();
  };

  // Observe counters and start counting when they enter the viewport (30% visible)
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startCounting(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 },
  );

  counters.forEach((counter) => observer.observe(counter));
}

// ==========================================================================
// Swiper Portfolio Slider
// ==========================================================================

/**
 * Initializes the Swiper carousel for the portfolio section.
 * Displays 1 slide on mobile, 2 on tablets, 3 on desktop.
 * Includes auto-play, looping, and clickable pagination.
 */
function initSwiperSlider() {
  new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: false,
    centerInsufficientSlides: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
    },
  });
}

// ==========================================================================
// ANIMATED TITLE TEXT
// ==========================================================================
function initAnimatedTitle() {
  const titulo = document.getElementById("titulo-animado");

  const texto = "Convertimos ideas en webs y tiendas online que ";
  const azul = "venden.";

  let i = 0;

  function escribirTexto() {
    if (i <= texto.length) {
      titulo.innerHTML = texto.substring(0, i);
      i++;
      setTimeout(escribirTexto, 45);
    } else {
      escribirAzul();
    }
  }

  let j = 0;

  function escribirAzul() {
    if (j <= azul.length) {
      titulo.innerHTML =
        texto +
        '<span class="texto-gradiente">' +
        azul.substring(0, j) +
        "</span>";

      j++;
      setTimeout(escribirAzul, 45);
    }
  }

  escribirTexto();
}
