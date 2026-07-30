async function loadHomePricing() {

    const { data, error } = await db
        .from("pricing")
        .select("*")
        .order("sort_order");

    if (error) {

        console.error(error);
        return;

    }

    const preview = document.querySelector(".pricing-preview");

    if (!preview) return;

    preview.innerHTML = "";

    data.slice(0, 4).forEach(service => {

        preview.innerHTML += `

            <div class="price-row">

                <span>${service.service}</span>

                <span>${service.short_price}</span>

            </div>

        `;

    });

}

document.addEventListener("DOMContentLoaded", loadHomePricing);
