const { data } = await db.auth.getSession();

if (!data.session) {

    window.location.href = "index.html";

}

const logout = document.getElementById("logoutBtn");

if (logout) {

    logout.addEventListener("click", async (e) => {

        e.preventDefault();

        await db.auth.signOut();

        window.location.href = "index.html";

    });

}
