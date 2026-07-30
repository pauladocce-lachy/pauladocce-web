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
                <div class="service-row">

                    <input type="text" value="${service.service}">

                    <input type="text" value="${service.short_price}">

                    <input type="text" value="${service.medium_price}">

                    <input type="text" value="${service.long_price}">

                    <button>🗑️</button>

                </div>
            `;

        });

        html += `
                <div class="add-service">

                    <button>+ Přidat službu</button>

                </div>

            </div>
        `;

        container.innerHTML += html;

    });

}
