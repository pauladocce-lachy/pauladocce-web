// =========================================
// Paula Docce
// pricing.js
// =========================================

async function loadPricing() {

    try {

        const response = await fetch("data/pricing.json");

        if (!response.ok) {
            throw new Error("Nepodařilo se načíst pricing.json");
        }

        const data = await response.json();

        data.categories.forEach(category => {

            const container = document.querySelector(
    `#pricing-${category.id} .pricing-table-container`
);

            if (!container) return;

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

            category.services.forEach(service => {

                table += `
                    <tr>

                        <td>${service.name}</td>

                        <td>${service.shortHair || "-"}</td>

                        <td>${service.mediumHair || "-"}</td>

                        <td>${service.longHair || "-"}</td>

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

    catch (error) {

        console.error(error);

    }

}

document.addEventListener("DOMContentLoaded", loadPricing);
