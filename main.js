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
