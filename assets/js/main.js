(function () {
  // Normalize a path or href to a comparable "route key"
  // Examples:
  // "/" -> ""
  // "/index.html" -> ""
  // "/about/" -> "about"
  // "/about/index.html" -> "about"
  // "/services.html" -> "services.html"
  function routeKey(input) {
    let p = (input || "").split("?")[0].split("#")[0];

    // If it's a full URL, extract pathname safely
    try {
      if (p.startsWith("http://") || p.startsWith("https://")) {
        p = new URL(p).pathname;
      }
    } catch (_) {}

    // Trim trailing slashes
    p = p.replace(/\/+$/, "");

    // Get last segment
    const parts = p.split("/").filter(Boolean);

    // Root or empty -> home
    if (parts.length === 0) return "";

    const last = parts[parts.length - 1];

    // Treat index.html as its folder (or home if at root)
    if (last.toLowerCase() === "index.html") {
      return parts.length === 1 ? "" : parts[parts.length - 2];
    }

    // If there is no extension, treat it as a folder route key
    // (e.g. "/about" or "/about/" -> "about")
    if (!last.includes(".")) return last;

    // Otherwise return the filename (services.html, shop.html, etc.)
    return last;
  }

  // Active nav
  const currentKey = routeKey(location.pathname);

  document.querySelectorAll("[data-nav]").forEach((a) => {
    const href = a.getAttribute("href");
    if (!href) return;

    const targetKey = routeKey(href);

    // Home should match "" key
    if (targetKey === currentKey) {
      a.classList.add("active");
    }
  });

  // Contact form demo (static)
  const form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector("button[type='submit']");
      const note = form.querySelector("[data-form-note]");
      if (btn) btn.textContent = "Sent (demo)";
      if (note) note.textContent = "This is a static demo form. Hook it to email/API when ready.";
    });
  }

  // Placeholder buy button
  document.querySelectorAll("[data-buy]").forEach((btn) => {
    btn.addEventListener("click", () => {
      alert("Checkout is not configured yet. We'll connect payments later (Stripe/Square/PayPal).");
    });
  });

  // Product modal data
  const PRODUCTS = {
    backup: {
      kicker: "Backup & restore",
      desc: "Phoenix Backup Utility is designed to make backups simple, clean, and dependable. Perfect for drive-to-drive backups and scheduled safety copies.",
      features: [
        "Simple backup workflow",
        "Fast restore process",
        "Clean, modern interface",
        "Designed for reliability",
        "Lifetime guarantee on Phoenix software"
      ]
    },
    antivirus: {
      kicker: "Security",
      desc: "Phoenix Antivirus focuses on a clean protection experience with modern UI. Built for scanning, quarantine, and future security tools as the platform grows.",
      features: [
        "Modern protection UI",
        "Scan modes planned (smart/custom)",
        "Quarantine workflow planned",
        "Built for future features",
        "Lifetime guarantee on Phoenix software"
      ]
    },
    cad: {
      kicker: "Computer-aided dispatch",
      desc: "Phoenix CAD is a computer-assisted dispatch program built for clarity and speed, designed to support dispatch workflows and real-time information display.",
      features: [
        "Dispatch-focused layout",
        "Fast, readable information panels",
        "Designed for scalability",
        "Modern UI foundation",
        "Lifetime guarantee on Phoenix software"
      ]
    }
  };

  // Modal wiring (only on shop page)
  const modal = document.getElementById("productModal");
  if (modal) {
    const titleEl = document.getElementById("pmTitle");
    const kickerEl = document.getElementById("pmKicker");
    const descEl = document.getElementById("pmDesc");
    const bannerEl = document.getElementById("pmBanner");
    const featuresEl = document.getElementById("pmFeatures");

    let lastFocus = null;

    function openModal(card) {
      const key = card.getAttribute("data-product");
      const title = card.getAttribute("data-title") || "Product";
      const banner = card.getAttribute("data-banner") || "";

      const info = PRODUCTS[key] || { kicker: "Product", desc: "", features: [] };

      kickerEl.textContent = info.kicker || "Product";
      titleEl.textContent = title;

      descEl.textContent = info.desc || "";
      bannerEl.src = banner;
      bannerEl.alt = `${title} banner`;

      featuresEl.innerHTML = "";
      (info.features || []).forEach((f) => {
        const li = document.createElement("li");
        li.textContent = f;
        featuresEl.appendChild(li);
      });

      lastFocus = document.activeElement;

      modal.classList.add("isOpen");
      modal.setAttribute("aria-hidden", "false");

      const closeBtn = modal.querySelector("[data-close-modal]");
      if (closeBtn) closeBtn.focus();
      document.body.style.overflow = "hidden";
    }

    function closeModal() {
      modal.classList.remove("isOpen");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    }

    document.querySelectorAll(".productCard").forEach((card) => {
      const openBtn = card.querySelector("[data-open-product]");
      const open = () => openModal(card);

      card.addEventListener("click", () => open());

      if (openBtn)
        openBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          open();
        });

      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      });
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    const closeBtn = modal.querySelector("[data-close-modal]");
    if (closeBtn) closeBtn.addEventListener("click", closeModal);

    document.addEventListener("keydown", (e) => {
      if (!modal.classList.contains("isOpen")) return;
      if (e.key === "Escape") closeModal();
    });
  }
})();
