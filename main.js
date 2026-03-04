const PHONE_NUMBER = "5491128233925";

const menuToggle = document.getElementById("menuToggle");
const mainMenu = document.getElementById("mainMenu");
const quoteForm = document.getElementById("quoteForm");
const yearTarget = document.getElementById("year");

// Carousel functionality
const carousel = document.querySelector(".fleet-carousel");
const carouselTrack = document.querySelector(".carousel-track");
const carouselSlides = document.querySelectorAll(".carousel-slide");
const prevBtn = document.querySelector(".carousel-btn-prev");
const nextBtn = document.querySelector(".carousel-btn-next");
const dots = document.querySelectorAll(".carousel-dot");

let currentSlide = 0;
const totalSlides = carouselSlides.length;

if (carousel && carouselTrack && prevBtn && nextBtn && dots.length > 0) {
  const updateCarousel = () => {
    carouselTrack.style.transform = `translate3d(-${currentSlide * 100}%, 0, 0)`;
    carouselSlides.forEach((slide, index) => {
      slide.classList.toggle("active", index === currentSlide);
      slide.setAttribute("aria-hidden", String(index !== currentSlide));
    });
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentSlide);
      dot.setAttribute("aria-current", String(index === currentSlide));
    });
  };

  const nextSlide = () => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
  };

  const prevSlide = () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
  };

  const goToSlide = (index) => {
    currentSlide = index;
    updateCarousel();
  };

  if (nextBtn) {
    nextBtn.addEventListener("click", nextSlide);
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", prevSlide);
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => goToSlide(index));
  });

  // Auto-play carousel
  let autoPlayInterval = null;
  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayInterval = setInterval(() => {
      nextSlide();
    }, 5000);
  };

  const stopAutoPlay = () => {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
  };

  if (carousel) {
    carousel.addEventListener("mouseenter", stopAutoPlay);
    carousel.addEventListener("mouseleave", startAutoPlay);
    carousel.addEventListener("focusin", stopAutoPlay);
    carousel.addEventListener("focusout", startAutoPlay);
  }

  // Initialize carousel
  updateCarousel();
  startAutoPlay();
}

if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

if (menuToggle && mainMenu) {
  const closeMenu = () => {
    mainMenu.classList.remove("is-open");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = mainMenu.classList.toggle("is-open");
    menuToggle.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  document.addEventListener("click", (event) => {
    if (!mainMenu.classList.contains("is-open")) {
      return;
    }

    const target = event.target;
    if (target instanceof Node && !mainMenu.contains(target) && !menuToggle.contains(target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

if (quoteForm) {
  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(quoteForm);
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const origin = String(formData.get("origin") || "").trim();
    const destination = String(formData.get("destination") || "").trim();
    const details = String(formData.get("details") || "").trim();

    if (!name || !origin || !destination) {
      alert("Por favor completa tu nombre, origen y destino.");
      return;
    }

    let message = `Hola, soy ${name}. Quiero pedir cotización para una mudanza/flete. `;
    message += `Origen: ${origin}. Destino: ${destination}.`;

    if (phone) {
      message += ` Teléfono: ${phone}.`;
    }

    if (details) {
      message += ` Detalles: ${details}.`;
    }

    const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener");
  });
}
