document.addEventListener("DOMContentLoaded", async () => {

    // Kontrola přihlášení (hlavní projekt)
    const { data } = await db.auth.getSession();

    if (!data.session) {

        window.location.href = "index.html";
        return;

    }

    const sendBtn = document.getElementById("sendFeedbackBtn");

    sendBtn.addEventListener("click", sendFeedback);

    loadFeedback();

});

async function sendFeedback() {

    const textarea = document.getElementById("feedbackMessage");

    const message = textarea.value.trim();

    if (!message) {

        alert("Napište připomínku.");
        return;

    }

    const { error } = await feedbackDb
        .from("feedback")
        .insert({

            message: message

        });

    if (error) {

        console.error(error);

        alert("❌ Připomínku se nepodařilo odeslat.");

        return;

    }

    textarea.value = "";

    await loadFeedback();

    alert("✅ Připomínka byla úspěšně odeslána.");

}

async function loadFeedback() {

    const { data, error } = await feedbackDb
        .from("feedback")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {

        console.error(error);
        return;

    }

    const list = document.getElementById("feedbackList");

    list.innerHTML = "";

    data.forEach(item => {

        const date = new Date(item.created_at).toLocaleString("cs-CZ");

        list.innerHTML += `

            <div class="feedback-item">

                <div class="feedback-top">

                    <strong>${item.status}</strong>

                    <span>${date}</span>

                </div>

                <p>${item.message}</p>

            </div>

        `;

    });

}
