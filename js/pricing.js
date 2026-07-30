// =========================================
// Paula Doccev 
// pricing.js 
// =========================================

async function loadPricing() {

    const { data, error } = await db
        .from("pricing")
        .select("*")
        .order("category")
        .order("sort_order");

    console.log("DATA:", data);
console.log("ERROR:", error);

    if (error) {

        console.error(error);
        return;

    }

    const categories = {

        damske: "Dámské",
        panske: "Pánské",
        detske: "Dětské"

    };

    Object.keys(categories).forEach(category => {

        const container = document.querySelector(
            `#pricing-${category} .pricing-table-container`
        );

        if (!container) return;

        const services = data.filter(item => item.category === category);

        let table = `
            <table class="pricing-table">

                <thead>

                    <tr>

                        <th>Služba</th>
                        <th>Krátké</th>
                        <th>Střední</th>
                        <th>Dlouhé</th>

                    </tr>

                </thead>

                <tbody>
        `;

        services.forEach(service => {

            table += `
                <tr>

                    <td>${service.service}</td>

                    <td>${service.short_price || "-"}</td>

                    <td>${service.medium_price || "-"}</td>

                    <td>${service.long_price || "-"}</td>

                </tr>
            `;

        });

        table += `
                </tbody>

            </table>
        `;

        container.innerHTML = table;

    });

}

document.addEventListener("DOMContentLoaded", loadPricing);

