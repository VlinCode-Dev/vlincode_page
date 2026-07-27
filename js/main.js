/**
 * VlinCode - Main JavaScript
 * Handles: mobile menu toggle, form submission via serverless API,
 *          smooth scroll, animated counters and Swiper portfolio slider
 */

// ==========================================================================
// DOM Ready
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
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

function initMobileMenu() {
  const menuBtn = document.querySelector(".mobile-menu-btn");
  const mobileNav = document.querySelector(".mobile-nav");

  if (!menuBtn || !mobileNav) return;

  menuBtn.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("open");
    menuBtn.classList.toggle("active", isOpen);
    menuBtn.setAttribute("aria-expanded", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

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
// Contact Form Handler (Serverless API)
// ==========================================================================

function initContactForm() {
  const form = document.querySelector(".cta-form");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailInput = form.querySelector('input[type="email"]');
    const btn = form.querySelector("button");
    const email = emailInput?.value.trim();

    if (!email || !isValidEmail(email)) {
      shakeElement(emailInput);
      return;
    }

    const recaptchaResponse = document.querySelector(
      ".g-recaptcha textarea[name='g-recaptcha-response']",
    );
    if (!recaptchaResponse || !recaptchaResponse.value) {
      shakeElement(form.querySelector(".g-recaptcha"));
      return;
    }

    const originalText = btn.textContent;
    btn.textContent = "Enviando...";
    btn.disabled = true;

    let success = false;
    let errorMsg = "";

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          recaptchaToken: recaptchaResponse.value,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        success = true;
      } else {
        errorMsg = data.error || "Server error";
      }
    } catch (err) {
      errorMsg = err.message;
    }

    if (typeof grecaptcha !== "undefined") {
      grecaptcha.reset();
    }

    if (success) {
      btn.textContent = "¡Enviado!";
      emailInput.value = "";
    } else {
      btn.textContent = errorMsg || "Error, intenta de nuevo";
    }

    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
    }, 3000);
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

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
// ANIMATED TITLE TEXT (safe DOM manipulation)
// ==========================================================================

function initAnimatedTitle() {
  const titulo = document.getElementById("titulo-animado");
  if (!titulo) return;

  const texto = "Convertimos ideas en webs y tiendas online que ";
  const azul = "venden.";

  const span = document.createElement("span");
  span.className = "texto-gradiente";

  let i = 0;

  function escribirTexto() {
    if (i <= texto.length) {
      titulo.textContent = texto.substring(0, i);
      i++;
      setTimeout(escribirTexto, 45);
    } else {
      titulo.textContent = texto;
      titulo.appendChild(span);
      escribirAzul();
    }
  }

  let j = 0;

  function escribirAzul() {
    if (j <= azul.length) {
      span.textContent = azul.substring(0, j);
      j++;
      setTimeout(escribirAzul, 45);
    }
  }

  escribirTexto();
}
