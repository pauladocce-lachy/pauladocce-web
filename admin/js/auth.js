const form = document.getElementById("loginForm");

if (form) {

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const { error } = await db.auth.signInWithPassword({
            email,
            password
        });

        if (error) {

            alert("Neplatný e-mail nebo heslo.");
            return;

        }

        window.location.href = "dashboard.html";

    });

}
 
