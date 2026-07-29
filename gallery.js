// Renders the portfolio grid from data/portfolio.json and powers a
// simple lightbox. Each entry points at an image file under
// images/portfolio/ — drop your own photos there and list them in
// data/portfolio.json (see README for details).
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxClose = document.getElementById("lightbox-close");

  fetch("data/portfolio.json", { cache: "no-store" })
    .then((res) => res.json())
    .then((items) => {
      grid.innerHTML = "";
      items.forEach((item) => grid.appendChild(card(item)));
    })
    .catch(() => {
      grid.innerHTML = '<p class="ledger-error">Fotky se nepodařilo načíst.</p>';
    });

  function card(item) {
    const btn = document.createElement("button");
    btn.className = "gallery-item";
    btn.type = "button";
    btn.setAttribute("aria-label", `Zobrazit fotografii: ${item.caption}`);

    const photo = document.createElement("div");
    photo.className = "placeholder-photo";
    photo.setAttribute("data-label", "nahraďte vlastní fotkou");
    // Once real files exist under images/portfolio/, this background
    // takes over automatically — the dashed placeholder frame stays as
    // a fallback if the file is missing.
    photo.style.backgroundImage = `url(${item.file})`;
    photo.style.backgroundSize = "cover";
    photo.style.backgroundPosition = "center";

    const caption = document.createElement("figcaption");
    caption.textContent = item.caption;

    btn.appendChild(photo);
    btn.appendChild(caption);
    btn.addEventListener("click", () => openLightbox(item));
    return btn;
  }

  function openLightbox(item) {
    if (!lightbox) return;
    lightboxImg.style.backgroundImage = `url(${item.file})`;
    lightboxCaption.textContent = item.caption;
    lightbox.classList.add("open");
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
  }

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
});
