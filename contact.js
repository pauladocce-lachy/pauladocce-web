// GitHub Pages has no server, so this form can't send email on its own.
// The simplest zero-backend option is opening the visitor's own mail
// client with the message pre-filled (works everywhere, no account
// needed). If you'd rather the message send silently in the background,
// swap this for a service like Formspree or Getform — see README.md.
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.querySelector("#name").value.trim();
    const email = form.querySelector("#email").value.trim();
    const message = form.querySelector("#message").value.trim();

    const subject = encodeURIComponent(`Poptávka z webu — ${name}`);
    const body = encodeURIComponent(`${message}\n\nOd: ${name}\nE-mail: ${email}`);
    const targetEmail = form.dataset.email || "mail@pauladocce.cz";

    window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
  });
});
