document.addEventListener("DOMContentLoaded", async () => {

    // Kontrola přihlášení
    const { data } = await db.auth.getSession();

    if (!data.session) {

        window.location.href = "index.html";
        return;

    }

    // Odhlášení
    const logout = document.getElementById("logoutBtn");

    if (logout) {

        logout.addEventListener("click", async (e) => {

            e.preventDefault();

            await db.auth.signOut();

            window.location.href = "index.html";

        });

    }

    loadPricing();

    loadPricing();

const saveBtn = document.getElementById("saveAllBtn");

if (saveBtn) {

    saveBtn.addEventListener("click", savePricing);

}

});

async function loadPricing() {

    const { data, error } = await db
        .from("pricing")
        .select("*")
        .order("category")
        .order("sort_order");

    if (error) {

        console.error(error);
        return;

    }

    const container = document.getElementById("pricingContainer");

    container.innerHTML = "";

    const categories = {

        damske: "Dámské",
        panske: "Pánské",
        detske: "Dětské"

    };

    Object.keys(categories).forEach(category => {

        const services = data.filter(item => item.category === category);

        let html = `
            <div class="category-card">

                <h2>${categories[category]}</h2>
        `;

        html += `
    <div class="service-row service-header">

        <div>Služba</div>

        <div>Krátké</div>

        <div>Střední</div>

        <div>Dlouhé</div>

        <div></div>

    </div>
`;

        services.forEach(service => {

           html += `
    <div class="service-row"
     data-id="${service.id}"
     data-sort="${service.sort_order}"
     data-category="${service.category}">

        <input class="service-name" type="text" value="${service.service}">

        <input class="short-price" type="text" value="${service.short_price}">

        <input class="medium-price" type="text" value="${service.medium_price}">

        <input class="long-price" type="text" value="${service.long_price}">

        <div class="row-actions">

    <button class="move-up">⬆️</button>

    <button class="move-down">⬇️</button>

    <button class="delete-btn">🗑️</button>

</div>

    </div>
`;

        });

        html += `
                <div class="add-service">

    <button class="add-service-btn" data-category="${category}">
        + Přidat službu
    </button>

</div>

            </div>
        `;

        container.innerHTML += html;

    });

}

async function savePricing() {

    const rows = document.querySelectorAll(".service-row");

    for (const row of rows) {

        // Přeskočí hlavičku tabulky
        if (row.classList.contains("service-header")) continue;

        const id = row.dataset.id;

        const service = row.querySelector(".service-name").value;

        const short_price = row.querySelector(".short-price").value;

        const medium_price = row.querySelector(".medium-price").value;

        const long_price = row.querySelector(".long-price").value;

        const { error } = await db
            .from("pricing")
            .update({

                service,
                short_price,
                medium_price,
                long_price

            })
            .eq("id", id);

        if (error) {

            console.error(error);

        }

    }

    await loadPricing();

alert("✅ Ceník byl úspěšně uložen a synchronizován.");

}

document.addEventListener("click", async (e) => {

    if (!e.target.classList.contains("delete-btn")) return;

    const row = e.target.closest(".service-row");

    const id = row.dataset.id;

    if (!confirm("Opravdu chcete smazat tuto službu?")) return;

    const { error } = await db
        .from("pricing")
        .delete()
        .eq("id", id);

    if (error) {

        console.error(error);
        alert("❌ Nepodařilo se smazat službu.");
        return;

    }

    row.remove();

});

document.addEventListener("click", async (e) => {

    if (!e.target.classList.contains("add-service-btn")) return;

    const category = e.target.dataset.category;

    const { error } = await db
        .from("pricing")
        .insert({

            category: category,

            service: "Nová služba",

            short_price: "0 Kč",

            medium_price: "0 Kč",

            long_price: "0 Kč",

            sort_order: 999

        });

    if (error) {

        console.error(error);
        alert("Nepodařilo se přidat službu.");
        return;

    }

    loadPricing();

});

document.addEventListener("click", async (e) => {

    if (
        !e.target.classList.contains("move-up") &&
        !e.target.classList.contains("move-down")
    ) return;

    const row = e.target.closest(".service-row");

    const id = Number(row.dataset.id);
    const category = row.dataset.category;
    const sort = Number(row.dataset.sort);

    const direction = e.target.classList.contains("move-up") ? -1 : 1;

    const { data, error } = await db
        .from("pricing")
        .select("*")
        .eq("category", category)
        .order("sort_order");

    if (error) {
        console.error(error);
        return;
    }

    const index = data.findIndex(item => item.id === id);

    const swapIndex = index + direction;

    if (swapIndex < 0 || swapIndex >= data.length) return;

    const current = data[index];
    const target = data[swapIndex];

    await db
        .from("pricing")
        .update({ sort_order: target.sort_order })
        .eq("id", current.id);

    await db
        .from("pricing")
        .update({ sort_order: current.sort_order })
        .eq("id", target.id);

    loadPricing();

});
