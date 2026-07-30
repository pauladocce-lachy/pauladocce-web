document.addEventListener("DOMContentLoaded", async () => {

    // Kontrola přihlášení
    const { data } = await db.auth.getSession();

    if (!data.session) {

        window.location.href = "index.html";
        return;

    }

    const sendBtn = document.getElementById("sendFeedbackBtn");

    sendBtn.addEventListener("click", sendFeedback);

});

async function sendFeedback() {

    const textarea = document.getElementById("feedbackMessage");

    const message = textarea.value.trim();

    if (!message) {

        alert("Napište připomínku.");

        return;

    }

    const { error } = await db
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

    alert("✅ Připomínka byla úspěšně odeslána.");

}
