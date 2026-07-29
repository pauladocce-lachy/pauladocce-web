// Loads data/cenik.json and renders it either as the full ceník page
// (grouped by category) or as a short teaser (flat list of a few items,
// used on the homepage). The admin page edits the very same JSON file.
document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("cenik-list");
  if (!el) return;

  const mode = el.dataset.mode || "full";
  const limit = parseInt(el.dataset.limit || "0", 10);

  fetch("data/cenik.json", { cache: "no-store" })
    .then((res) => {
      if (!res.ok) throw new Error("Ceník se nepodařilo načíst.");
      return res.json();
    })
    .then((data) => render(data))
    .catch((err) => {
      el.innerHTML = `<p class="ledger-error">Ceník se právě nepodařilo načíst. Zkuste prosím obnovit stránku. (${err.message})</p>`;
    });

  function render(data) {
    if (mode === "teaser") {
      renderTeaser(data);
    } else {
      renderFull(data);
    }
  }

  function renderFull(data) {
    el.innerHTML = "";
    data.categories.forEach((cat) => {
      const section = document.createElement("div");
      section.className = "ledger-category";
      section.innerHTML = `<h3>${escapeHtml(cat.name)}</h3>`;
      cat.items.forEach((item) => {
        section.appendChild(itemRow(item));
      });
      el.appendChild(section);
    });
    if (data.note) {
      const note = document.createElement("p");
      note.className = "ledger-note";
      note.textContent = data.note;
      el.appendChild(note);
    }
  }

  function renderTeaser(data) {
    el.innerHTML = "";
    const flat = data.categories.flatMap((c) => c.items);
    const items = limit > 0 ? flat.slice(0, limit) : flat;
    items.forEach((item) => el.appendChild(itemRow(item)));
  }

  function itemRow(item) {
    const row = document.createElement("div");
    row.className = "ledger-item";
    row.innerHTML = `
      <span class="name">${escapeHtml(item.name)}${item.note ? `<span class="note">${escapeHtml(item.note)}</span>` : ""}</span>
      <span class="fill"></span>
      <span class="price">${escapeHtml(item.price)}</span>
    `;
    return row;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str ?? "";
    return div.innerHTML;
  }
});
