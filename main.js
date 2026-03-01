const PHONE_NUMBER = "5491131486380";

const menuToggle = document.getElementById("menuToggle");
const mainMenu = document.getElementById("mainMenu");
const quoteForm = document.getElementById("quoteForm");
const yearTarget = document.getElementById("year");

if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

if (menuToggle && mainMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainMenu.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainMenu.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (quoteForm) {
  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(quoteForm);
    const name = String(formData.get("name") || "").trim();
    const origin = String(formData.get("origin") || "").trim();
    const destination = String(formData.get("destination") || "").trim();

    if (!name || !origin || !destination) {
      alert("Por favor completa nombre, origen y destino.");
      return;
    }

    const message =
      `Hola, soy ${name}. Quiero pedir cotizacion para una mudanza/flete. ` +
      `Origen: ${origin}. Destino: ${destination}.`;

    const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener");
  });
}
