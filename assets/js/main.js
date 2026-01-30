// Small helper: mark active nav link based on current page
(function(){
  const path = (location.pathname || "").split("/").pop() || "index.html";
  const current = path === "" ? "index.html" : path;

  document.querySelectorAll("[data-nav]").forEach(a => {
    const href = a.getAttribute("href");
    if (!href) return;

    const target = href.split("/").pop();
    if (target === current) a.classList.add("active");
  });

  // Contact form demo (static): prevent reload + show a lightweight message.
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
})();
