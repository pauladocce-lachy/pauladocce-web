document.addEventListener("DOMContentLoaded", async () => {

    const { data } = await db.auth.getSession();

    if (!data.session) {

        window.location.href = "index.html";
        return;

    }

    const logout = document.getElementById("logoutBtn");

    if (logout) {

        logout.addEventListener("click", async (e) => {

            e.preventDefault();

            const { error } = await db.auth.signOut();

            if (!error) {

                window.location.href = "index.html";

            } else {

                console.error(error);

            }

        });

    }

});
