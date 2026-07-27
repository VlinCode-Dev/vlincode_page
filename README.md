# VlinCode - Landing Page

Página web institucional de **VlinCode**, agencia de desarrollo digital especializada en desarrollo web, tiendas eCommerce y diseño UX/UI. Este documento describe cómo fue construido el proyecto, su arquitectura técnica y las decisiones de diseño tomadas.

---

## Sobre VlinCode

VlinCode es una agencia de desarrollo digital que ofrece servicios de creación de páginas web, tiendas en línea, diseño de interfaces (UX/UI) y mantenimiento continuo. La landing page funciona como punto de contacto principal: captura leads a través de un formulario de cotización y proyecta la identidad visual de la marca.

---

## Finalidad

Este proyecto **no es una aplicación para usar**, sino la representación digital de VlinCode como empresa. Su propósito es:

- Presentar los servicios que ofrece la agencia.
- Mostrar trabajos destacados y reseñas de clientes reales.
- Capturar correos electrónicos de potenciales clientes interesados en cotizaciones.
- Establecer la identidad visual de la marca con un diseño oscuro, moderno y profesional.

---

## Estructura del Proyecto

```
vlincode_page/
├── index.html              # Página principal (Tailwind config + HTML semántico)
├── README.md               # Este archivo
├── reseñas.md              # Reseñas en formato Markdown (fuente de datos original)
├── css/
│   └── styles.css          # Estilos custom: glass-panel, text-gradient, animaciones
├── js/
│   ├── main.js             # Lógica principal: menú, formulario, contadores, Swiper
│   └── reseñas.js          # Renderizado dinámico de reseñas en carrusel
└── assets/
    └── images/
        ├── VlinCode_logo.png        # Logo principal de la empresa
        ├── logo_vc_transparent.png  # Logo transparente (favicon)
        ├── favicon.png              # Favicon alternativo
        └── imgimg.avif              # Imagen hero del carrusel
```

---

## Paleta de Colores (Material Design 3)

El sistema de colores sigue la especificación **Material Design 3** en modo oscuro. Todos los tokens están definidos en el objeto `tailwind.config` dentro de `index.html`.

### Colores principales

| Token | HEX | Uso |
|---|---|---|
| `background` / `surface` | <span style="background:#051424;border:1px solid #434656;padding:2px 6px;border-radius:4px;color:#fff">`#051424`</span> | Fondo principal de la página |
| `primary` | <span style="background:#b7c4ff;padding:2px 6px;border-radius:4px;color:#000">`#b7c4ff`</span> | Acentos, texto destacado, borde hover |
| `primary-container` | <span style="background:#0052ff;padding:2px 6px;border-radius:4px;color:#fff">`#0052ff`</span> | Botones CTA, degradados, brillo accent |
| `on-surface` | <span style="background:#d4e4fa;padding:2px 6px;border-radius:4px;color:#000">`#d4e4fa`</span> | Texto principal sobre fondo oscuro |
| `on-surface-variant` | <span style="background:#c3c5d9;padding:2px 6px;border-radius:4px;color:#000">`#c3c5d9`</span> | Texto secundario, descripciones |
| `surface-container` | <span style="background:#122131;padding:2px 6px;border-radius:4px;color:#fff">`#122131`</span> | Fondo de tarjetas de servicios |
| `surface-container-high` | <span style="background:#1c2b3c;padding:2px 6px;border-radius:4px;color:#fff">`#1c2b3c`</span> | Fondo de tarjetas de reseñas |
| `surface-container-lowest` | <span style="background:#010f1f;padding:2px 6px;border-radius:4px;color:#fff">`#010f1f`</span> | Fondo de secciones alternas (portfolio, footer) |
| `outline-variant` | <span style="background:#434656;padding:2px 6px;border-radius:4px;color:#fff">`#434656`</span> | Bordes sutiles y separadores |
| `secondary` | <span style="background:#bec6e0;padding:2px 6px;border-radius:4px;color:#000">`#bec6e0`</span> | Texto de soporte, labels |
| `error` | <span style="background:#ffb4ab;padding:2px 6px;border-radius:4px;color:#000">`#ffb4ab`</span> | Estados de error |

### Gradientes

- **`text-gradient`**: de `#b7c4ff` a `#0052ff` (primary → primary-container)
- **`texto-gradiente`**: de `#ffffff` a `#0055ff` (blanco → azul eléctrico) para la palabra animada "venden"

### Efectos visuales

- **`glass-panel`**: efecto frosted glass con `backdrop-filter: blur(24px)` y fondo `rgba(5, 20, 36, 0.5)`. Usado en el carrusel de portfolio y elementos flotantes del hero.
- **`flash-effect`**: destello blanco que recorre el texto de los contadores al completarse.
- **`bounce-effect`**: animación de rebote al finalizar un contador.

---

## Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|---|---|---|
| **HTML5** | - | Estructura semántica de la página |
| **Tailwind CSS** | CDN (última) | Framework CSS utility-first, configurado vía script inline |
| **JavaScript** | Vanilla (ES6+) | Interactividad sin dependencias de framework |
| **Google Fonts** | - | Fuentes: Geist (headlines), Inter (body), JetBrains Mono (labels) |
| **Material Symbols** | - | Iconografía del sistema Material Design |
| **Swiper.js** | v11 | Carruseles de portfolio y reseñas |
| **EmailJS** | v4 | Envío de correos desde el formulario de contacto sin backend |
| **Tidio Chat** | - | Widget de chat en vivo para soporte al cliente |
| **Vercel Speed Insights** | v2 | Monitoreo de rendimiento de la página |
| **Vercel Web Analytics** | - | Analítica de tráfico |

### Dependencias externas (CDN)

Todas las dependencias se cargan por CDN. No hay sistema de build, no hay `package.json`, no hay bundler. El proyecto se ejecuta directamente abriendo `index.html` o sirviéndolo con cualquier servidor estático.

---

## Secciones de la Página

| Sección | ID | Descripción |
|---|---|---|
| **Header** | - | TopAppBar fija con navegación desktop/mobile y CTA |
| **Hero** | - | Título animado con efecto typewriter, imagen principal y elementos flotantes |
| **Estadísticas** | - | Contadores animados: proyectos entregados, clientes satisfechos, años de experiencia |
| **Servicios** | `#servicios` | 4 tarjetas: Desarrollo web, eCommerce, UX/UI, Mantenimiento |
| **Portafolio** | `#portafolio` | Carrusel Swiper con trabajos destacados |
| **Clientes** | `#clientes` | Logo marquee infinito con pausa en hover |
| **Reseñas** | `#seccion-resenas` | Carrusel dinámico generado desde `reseñas.js` |
| **Precios** | `#precios` | Sección de cotización (proyectos desde $100 USD) |
| **FAQ** | - | Acordeón nativo con `<details>` |
| **CTA / Contacto** | `#contacto` | Formulario de captura de leads vía EmailJS |
| **Footer** | - | Navegación secundaria y copyright |

---

## Funcionalidades JavaScript

Las funcionalidades están documentadas en `js/main.js`:

- **Menú móvil**: toggle con animación de rotación del icono hamburger, bloqueo de scroll del body, cierre automático al hacer click en un enlace.
- **Formulario de contacto**: validación de email con regex, envío dual vía EmailJS (correo a la empresa + confirmación al cliente), estados de carga y error.
- **Contadores animados**: se activan con `IntersectionObserver` al entrar en el viewport (30% visible), cada contador tiene formato personalizado (`+3`, `100%`, `1+`).
- **Título animado**: efecto typewriter que escribe "Convertimos ideas en webs y tiendas online que " y luego "venden." con gradiente azul.
- **Swiper**: dos carruseles independientes — portfolio (autoplay 3s, 1/2/3 slides) y reseñas (autoplay 4s, 1/2/3 slides con navegación).

---

## Personalización

### Fuentes

Las fuentes se cargan desde Google Fonts y se mapean en `tailwind.config.fontFamily`:

- **Geist**: headlines y display text (`font-headline-md`, `font-display-lg`)
- **Inter**: body text (`font-body-md`, `font-body-lg`)
- **JetBrains Mono**: labels y código (`font-label-sm`, `font-code-block`)

### Reseñas

Las reseñas se editan directamente en `js/reseñas.js` en el array `resenas`. Cada objeto tiene: `nombre`, `empresa`, `rating` (1-5) y `mensaje`. El carrusel se renderiza automáticamente.

### Contenido

Todo el contenido está en `index.html`. Las secciones están delimitadas con comentarios HTML (`<!-- ===== SECTION NAME ===== -->`).

---

## Cómo Ejecutar

### Opción 1: Servidor local (recomendado)

```bash
python3 -m http.server 8000
# Abrir http://localhost:8000
```

### Opción 2: Node.js

```bash
npx http-server -p 8000
```

### Opción 3: Directo en el navegador

Abrir `index.html`. Algunas funciones (EmailJS, fetch) pueden no funcionar por restricciones de `file://`.

---

## Notas Técnicas

- El formulario envía correos reales a través de EmailJS (sin backend). Las credenciales están en `js/main.js`.
- El chat de Tidio está integrado vía script externo.
- Las imágenes están optimizadas en formato `.avif` para mejor rendimiento.
- El proyecto **no usa bundler ni sistema de build**. Es HTML + CSS + JS puro servido estáticamente.
- El deploy está orientado a Vercel (Speed Insights y Web Analytics integrados).
