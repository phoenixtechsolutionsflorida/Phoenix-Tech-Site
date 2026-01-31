// Active nav + basic demos
(function(){
  // Active nav
  const path = (location.pathname || "").split("/").pop() || "index.html";
  const current = path === "" ? "index.html" : path;

  document.querySelectorAll("[data-nav]").forEach(a => {
    const href = a.getAttribute("href");
    if (!href) return;
    const target = href.split("/").pop();
    if (target === current) a.classList.add("active");
  });

  // Contact form demo (static)
  const form = document.querySelector("[data-contact-form]");
  if (form){
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector("button[type='submit']");
      const note = form.querySelector("[data-form-note]");
      if (btn) btn.textContent = "Sent (demo)";
      if (note) note.textContent = "This is a static demo form. Hook it to email/API when ready.";
    });
  }

  // Shop buttons (placeholder)
  document.querySelectorAll("[data-buy]").forEach(btn => {
    btn.addEventListener("click", () => {
      alert("Shop is not configured yet. We'll connect payments later (Stripe/Square/PayPal).");
    });
  });
})();
