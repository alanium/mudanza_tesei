const PHONE_NUMBER = "5491128233925";

/* --------------------------------------------------------------------------
   Navbar: transparente sobre el hero, solida al scrollear.
   Tambien maneja el menu desplegable en mobile.
   -------------------------------------------------------------------------- */
(function () {
  const bar = document.querySelector(".topbar");
  const hero = document.querySelector(".hero");
  const toggle = document.getElementById("menuToggle");
  const menu = document.getElementById("mainMenu");

  if (!bar) return;

  let overHero = Boolean(hero);
  let menuOpen = false;

  // Solida cuando ya no estamos sobre la foto, o cuando el menu esta abierto
  // (si no, el panel blanco quedaria con el logo y los links blancos encima).
  const sync = () => {
    bar.classList.toggle("solid", !overHero || menuOpen);
  };

  if (hero) {
    new IntersectionObserver(
      (entries) => {
        overHero = entries[0].isIntersecting;
        sync();
      },
      { rootMargin: "-78px 0px 0px 0px", threshold: 0 }
    ).observe(hero);
  }

  sync();

  if (toggle && menu) {
    const setMenu = (open) => {
      menuOpen = open;
      menu.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Cerrar menu" : "Abrir menu");
      sync();
    };

    toggle.addEventListener("click", () => setMenu(!menuOpen));

    menu.addEventListener("click", (event) => {
      if (event.target.tagName === "A") setMenu(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuOpen) setMenu(false);
    });

    document.addEventListener("click", (event) => {
      if (!menuOpen) return;
      if (!menu.contains(event.target) && !toggle.contains(event.target)) setMenu(false);
    });

    // al volver a desktop el panel no debe quedar colgado
    window.matchMedia("(min-width: 901px)").addEventListener("change", (event) => {
      if (event.matches && menuOpen) setMenu(false);
    });
  }
})();

/* --------------------------------------------------------------------------
   Año del footer
   -------------------------------------------------------------------------- */
const yearTarget = document.getElementById("year");
if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

/* --------------------------------------------------------------------------
   Formulario de cotizacion -> WhatsApp
   -------------------------------------------------------------------------- */
const quoteForm = document.getElementById("quoteForm");
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

    let message = `Hola, soy ${name}. Quiero pedir cotizacion para una mudanza/flete. `;
    message += `Origen: ${origin}. Destino: ${destination}.`;

    if (phone) message += ` Telefono: ${phone}.`;
    if (details) message += ` Detalles: ${details}.`;

    const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener");
  });
}

/* --------------------------------------------------------------------------
   Movimiento: titular del hero, aparicion al llegar a cada pagina, botones
   magneticos y parallax. Solo corre si <html class="motion"> (no hay
   "reducir movimiento"). El scroll clavado es CSS puro (scroll-snap).
   -------------------------------------------------------------------------- */
(function () {
  const root = document.documentElement;
  if (!root.classList.contains("motion")) return;

  /* 1. Titular del hero: una palabra por vez, con mascara */
  const h1 = document.querySelector(".hero h1");
  if (h1 && !h1.classList.contains("split")) {
    const text = h1.textContent.trim();
    h1.setAttribute("aria-label", text);
    h1.textContent = "";
    text.split(/\s+/).forEach((word, i, all) => {
      const mask = document.createElement("span");
      mask.className = "w";
      mask.setAttribute("aria-hidden", "true");
      const inner = document.createElement("span");
      inner.style.setProperty("--i", i);
      inner.textContent = word;
      mask.appendChild(inner);
      h1.appendChild(mask);
      if (i < all.length - 1) h1.appendChild(document.createTextNode(" "));
    });
    h1.classList.add("split");
  }

  /* 2. Aparicion al llegar a cada pagina */
  const reveal = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        reveal.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -5% 0px" }
  );
  document.querySelectorAll("[data-reveal]").forEach((el) => reveal.observe(el));

  /* 3. Botones magneticos (solo con mouse) */
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll(".btn-primary, .nav .cta").forEach((btn) => {
      btn.addEventListener("pointermove", (event) => {
        const r = btn.getBoundingClientRect();
        const x = (event.clientX - (r.left + r.width / 2)) * 0.22;
        const y = (event.clientY - (r.top + r.height / 2)) * 0.3;
        btn.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      });
      btn.addEventListener("pointerleave", () => {
        btn.style.transform = "";
      });
    });
  }

  /* 4. Parallax suave de la foto del hero */
  const heroBlock = document.querySelector(".hero-block");
  if (heroBlock) {
    let ticking = false;
    const update = () => {
      ticking = false;
      const p = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
      heroBlock.style.setProperty("--hero-p", p.toFixed(3));
    };
    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
      },
      { passive: true }
    );
  }
})();
