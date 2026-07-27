// ============================================
// RESEÑAS - Agrega aquí las reseñas de tus clientes
// rating: 1 a 5
// ============================================
const resenas = [
  {
    nombre: "Equipo de desarrollo",
    empresa: "vlincode",
    rating: 5,
    mensaje:
      "Muy pronto podrás leer aquí la experiencia de nuestros primeros clientes impulsando su transformación digital.",
  },
  {
    nombre: "Equipo de desarrollo",
    empresa: "vlincode",
    rating: 5,
    mensaje:
      "¡Estamos listos para impulsar tu negocio! Como agencia de software nueva, nuestro objetivo es construir relaciones de confianza.",
  },
  {
    nombre: "Duvan Rico",
    empresa: "Independiente.",
    rating: 5,
    mensaje:
      "Destaco principalmente su responsabilidad y transparencia. Los tiempos de entrega se realizan a tiempo y con la calidad esperada.",
  },
];

// Renderizar carrusel (sin innerHTML — usa createElement + textContent)
const wrapper = document.getElementById("reviews-swiper-wrapper");

resenas.forEach((r) => {
  const slide = document.createElement("div");
  slide.className = "swiper-slide";

  const card = document.createElement("div");
  card.className =
    "review-card p-8 rounded-xl bg-surface-container-high border border-outline-variant/20 hover:border-primary/50 transition-colors duration-300 flex flex-col gap-4";

  const header = document.createElement("div");
  header.className = "flex flex-col";

  const nombre = document.createElement("p");
  nombre.className = "font-bold text-on-surface";
  nombre.textContent = r.nombre;
  header.appendChild(nombre);

  if (r.empresa) {
    const empresa = document.createElement("span");
    empresa.className = "text-on-surface-variant text-sm";
    empresa.textContent = r.empresa;
    header.appendChild(empresa);
  }

  const stars = document.createElement("div");
  stars.className = "text-sm";
  stars.textContent = "\u2B50".repeat(r.rating);

  const mensaje = document.createElement("p");
  mensaje.className =
    "text-on-surface-variant text-sm leading-relaxed line-clamp-4";
  mensaje.textContent = r.mensaje;

  card.appendChild(header);
  card.appendChild(stars);
  card.appendChild(mensaje);
  slide.appendChild(card);
  wrapper.appendChild(slide);
});

const reviewsSwiper = new Swiper(".reviewsSwiper", {
  slidesPerView: 1,
  spaceBetween: 20,
  loop: true,
  autoplay: { delay: 4000, disableOnInteraction: false },
  pagination: { el: ".reviews-pagination", clickable: true },
  navigation: {
    nextEl: ".reviews-nav-next",
    prevEl: ".reviews-nav-prev",
  },
  breakpoints: {
    640: { slidesPerView: 2, spaceBetween: 20 },
    1024: { slidesPerView: 3, spaceBetween: 20 },
  },
});

// Pausar autoplay al pasar el ratón sobre una reseña
document.querySelectorAll(".review-card").forEach((card) => {
  card.addEventListener("mouseenter", () => reviewsSwiper.autoplay.stop());
  card.addEventListener("mouseleave", () => reviewsSwiper.autoplay.start());
});
