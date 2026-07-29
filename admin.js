// ---------------------------------------------------------------------
// KADEŘNICTVÍ PAULA DOCCE — admin ceníku
//
// Jak to funguje: na GitHub Pages není žádný server ani databáze, takže
// "uložení" znamená přímý zápis do souboru data/cenik.json v tomto
// repozitáři přes GitHub API. Přihlášení = zadání GitHub uživatelského
// jména, názvu repozitáře a osobního přístupového tokenu (hesla) s
// právem zapisovat do TOHOTO repozitáře. Nic z toho se nikam neposílá
// kromě GitHubu — vše zůstává jen v tomto prohlížeči (localStorage).
// Podrobný návod je v README.md.
// ---------------------------------------------------------------------

const BRANCH = "main";
const FILE_PATH = "data/cenik.json";

const STORAGE_KEY = "pauladocce-admin-config"; // { owner, repo, token }

const el = {
  gate: document.getElementById("admin-gate"),
  editor: document.getElementById("admin-editor"),
  ownerInput: document.getElementById("owner-input"),
  repoInput: document.getElementById("repo-input"),
  tokenInput: document.getElementById("token-input"),
  loginForm: document.getElementById("login-form"),
  gateStatus: document.getElementById("gate-status"),
  logoutBtn: document.getElementById("logout-btn"),
  saveBtn: document.getElementById("save-btn"),
  addCategoryBtn: document.getElementById("add-category-btn"),
  categories: document.getElementById("admin-categories"),
  noteInput: document.getElementById("admin-note"),
  status: document.getElementById("admin-status"),
};

let config = null; // { owner, repo, token }
let state = null;  // parsed cenik.json
let sha = null;    // current blob sha, required by GitHub to update the file

document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    config = JSON.parse(saved);
    loadData();
  }

  el.loginForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const owner = el.ownerInput.value.trim();
    const repo = el.repoInput.value.trim();
    const token = el.tokenInput.value.trim();
    if (!owner || !repo || !token) return;
    config = { owner, repo, token };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    loadData();
  });

  el.logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    config = null;
    state = null;
    sha = null;
    el.editor.hidden = true;
    el.gate.hidden = false;
    setGateStatus("", "");
  });

  el.addCategoryBtn?.addEventListener("click", () => {
    state.categories.push({ name: "Nová kategorie", items: [] });
    renderCategories();
  });

  el.saveBtn?.addEventListener("click", saveData);
});

function apiHeaders() {
  return {
    Authorization: `Bearer ${config.token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

function apiUrl() {
  return `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${FILE_PATH}?ref=${BRANCH}`;
}

async function loadData() {
  setGateStatus("Načítám ceník…", "");
  try {
    const res = await fetch(apiUrl(), { headers: apiHeaders() });
    if (res.status === 401 || res.status === 403) {
      throw new Error("Token nemá přístup k tomuto repozitáři (zkontroluj oprávnění tokenu).");
    }
    if (res.status === 404) {
      throw new Error("Repozitář nebo soubor nenalezen — zkontroluj uživatelské jméno a název repozitáře.");
    }
    if (!res.ok) throw new Error(`GitHub API vrátilo chybu ${res.status}.`);

    const json = await res.json();
    sha = json.sha;
    const decoded = decodeURIComponent(escape(atob(json.content.replace(/\n/g, ""))));
    state = JSON.parse(decoded);

    el.gate.hidden = true;
    el.editor.hidden = false;
    el.noteInput.value = state.note || "";
    renderCategories();
    setStatus("Ceník načten. Změny se uloží až po kliknutí na Uložit.", "ok");
  } catch (err) {
    setGateStatus(err.message, "err");
  }
}

function renderCategories() {
  el.categories.innerHTML = "";
  state.categories.forEach((cat, catIndex) => {
    el.categories.appendChild(categoryBlock(cat, catIndex));
  });
}

function categoryBlock(cat, catIndex) {
  const wrap = document.createElement("div");
  wrap.className = "admin-category";

  const head = document.createElement("div");
  head.className = "admin-category-head";

  const nameInput = document.createElement("input");
  nameInput.value = cat.name;
  nameInput.setAttribute("aria-label", "Název kategorie");
  nameInput.addEventListener("input", () => (cat.name = nameInput.value));

  const removeCatBtn = document.createElement("button");
  removeCatBtn.className = "icon-btn";
  removeCatBtn.type = "button";
  removeCatBtn.textContent = "Smazat kategorii";
  removeCatBtn.addEventListener("click", () => {
    if (confirm(`Opravdu smazat kategorii "${cat.name}" a všechny její položky?`)) {
      state.categories.splice(catIndex, 1);
      renderCategories();
    }
  });

  head.appendChild(nameInput);
  head.appendChild(removeCatBtn);
  wrap.appendChild(head);

  const itemsWrap = document.createElement("div");
  cat.items.forEach((item, itemIndex) => {
    itemsWrap.appendChild(itemRow(cat, item, itemIndex));
  });
  wrap.appendChild(itemsWrap);

  const addItemBtn = document.createElement("button");
  addItemBtn.className = "admin-add-item";
  addItemBtn.type = "button";
  addItemBtn.textContent = "+ přidat položku";
  addItemBtn.addEventListener("click", () => {
    cat.items.push({ name: "Nová položka", note: "", price: "0 Kč" });
    renderCategories();
  });
  wrap.appendChild(addItemBtn);

  return wrap;
}

function itemRow(cat, item, itemIndex) {
  const row = document.createElement("div");
  row.className = "admin-item-row";

  const nameInput = fieldInput(item.name, "Název služby", (v) => (item.name = v));
  const noteInput = fieldInput(item.note || "", "Poznámka (nepovinné)", (v) => (item.note = v));
  const priceInput = fieldInput(item.price, "Cena, např. od 490 Kč", (v) => (item.price = v));

  const removeBtn = document.createElement("button");
  removeBtn.className = "icon-btn";
  removeBtn.type = "button";
  removeBtn.textContent = "✕";
  removeBtn.setAttribute("aria-label", `Smazat položku ${item.name}`);
  removeBtn.addEventListener("click", () => {
    cat.items.splice(itemIndex, 1);
    renderCategories();
  });

  row.appendChild(nameInput);
  row.appendChild(noteInput);
  row.appendChild(priceInput);
  row.appendChild(removeBtn);
  return row;
}

function fieldInput(value, placeholder, onInput) {
  const input = document.createElement("input");
  input.value = value;
  input.placeholder = placeholder;
  input.setAttribute("aria-label", placeholder);
  input.addEventListener("input", () => onInput(input.value));
  return input;
}

async function saveData() {
  state.note = el.noteInput.value;
  state.updated = new Date().toISOString().slice(0, 10);

  const json = JSON.stringify(state, null, 2) + "\n";
  const base64 = btoa(unescape(encodeURIComponent(json)));

  setStatus("Ukládám…", "");
  el.saveBtn.disabled = true;
  try {
    const res = await fetch(
      `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${FILE_PATH}`,
      {
        method: "PUT",
        headers: { ...apiHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Aktualizace ceníku přes admin stránku",
          content: base64,
          sha,
          branch: BRANCH,
        }),
      }
    );
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || `GitHub API vrátilo chybu ${res.status}.`);
    }
    const body = await res.json();
    sha = body.content.sha; // keep sha fresh so a second save in a row still works
    setStatus("Uloženo. Na webu se změna projeví za pár desítek vteřin (GitHub Pages musí web znovu sestavit).", "ok");
  } catch (err) {
    setStatus(`Uložení selhalo: ${err.message}`, "err");
  } finally {
    el.saveBtn.disabled = false;
  }
}

function setStatus(msg, kind) {
  el.status.textContent = msg;
  el.status.className = "admin-status" + (kind ? ` ${kind}` : "");
}

function setGateStatus(msg, kind) {
  el.gateStatus.textContent = msg;
  el.gateStatus.className = "admin-status" + (kind ? ` ${kind}` : "");
}
