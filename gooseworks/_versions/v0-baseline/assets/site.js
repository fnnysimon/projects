/* Shared behaviour: builds header/footer from site.config.js, resolves
   data-route links, orders landing sections, FAQ accordions, copy buttons.
   You normally don't need to edit this file — edit site.config.js. */
(function () {
  const S = window.SITE;
  const body = document.body;
  const ROOT = body.dataset.root || "";          // "" at site root, "../" in /pages
  const PAGE = body.dataset.page || "";          // current route id

  /* ---------- route resolution ---------- */
  function href(route) {
    if (!route) return "#";
    if (route === "cta") route = S.CTA.route;
    const [id, anchor] = route.split("#");
    const r = S.ROUTES[id];
    if (!r) { console.warn("[site] unknown route:", route); return "#"; }
    if (id === PAGE && anchor) return "#" + anchor;
    return ROOT + r.path + (anchor ? "#" + anchor : "");
  }
  window.SITE.href = href;

  function link(l, cls = "") {
    const a = document.createElement("a");
    a.textContent = l.label;
    a.href = l.href || href(l.route);
    if (l.route) a.dataset.routeId = l.route.split("#")[0];
    if (cls) a.className = cls;
    return a;
  }

  /* ---------- banner + header ---------- */
  const headerSlot = document.getElementById("site-header");
  if (headerSlot) {
    let html = "";
    if (S.BANNER) {
      html += `<div class="banner"><span class="banner-dots"><i></i><i></i><i></i></span>
        <span>${S.BANNER.text}</span>
        <a href="${href(S.BANNER.route)}">${S.BANNER.linkLabel} <span aria-hidden="true">→</span></a></div>`;
    }
    html += `<header class="header"><div class="header-inner">
      <a class="wordmark" href="${href("home")}" aria-label="${S.brand.first}${S.brand.second}">
        ${S.brand.first}<span>${S.brand.second}</span></a>
      <nav class="nav" aria-label="Main"></nav>
      <a class="btn btn-dark btn-sm header-cta" href="${href("cta")}">${S.CTA.label}</a>
      <button class="menu-toggle" aria-label="Open menu" aria-expanded="false"><span></span><span></span></button>
    </div></header>`;
    headerSlot.innerHTML = html;
    const nav = headerSlot.querySelector(".nav");
    S.NAV.forEach((l) => {
      const a = link(l);
      if (a.dataset.routeId === PAGE && !l.route.includes("#")) a.setAttribute("aria-current", "page");
      nav.appendChild(a);
    });
    const t = headerSlot.querySelector(".menu-toggle");
    t.addEventListener("click", () => {
      const open = headerSlot.classList.toggle("menu-open");
      t.setAttribute("aria-expanded", open);
    });
    nav.addEventListener("click", () => headerSlot.classList.remove("menu-open"));
  }

  /* ---------- footer ---------- */
  const footerSlot = document.getElementById("site-footer");
  if (footerSlot) {
    const cols = S.FOOTER.map((c) => `<div class="footer-col"><h4>${c.title}</h4><ul>${
      c.links.map((l) => `<li><a href="${l.href || href(l.route)}">${l.label}</a></li>`).join("")
    }</ul></div>`).join("");
    footerSlot.innerHTML = `<footer class="footer"><div class="container">
      <div class="footer-grid">${cols}</div>
      <div class="footer-bottom">
        <div class="yc"><span class="yc-badge">Y</span> Backed by Y Combinator</div>
        <p>${S.brand.tagline}</p>
        <p class="muted">© ${new Date().getFullYear()} ${S.brand.first}${S.brand.second} · educational recreation</p>
      </div></div></footer>`;
  }

  /* ---------- data-route links anywhere in the page ---------- */
  document.querySelectorAll("[data-route]").forEach((el) => {
    el.setAttribute("href", href(el.dataset.route));
  });

  /* ---------- landing section order ---------- */
  const main = document.querySelector("main[data-sections]");
  if (main && Array.isArray(S.LANDING_SECTIONS)) {
    const all = [...main.querySelectorAll(":scope > section[id]")];
    all.forEach((s) => { if (!S.LANDING_SECTIONS.includes(s.id)) s.remove(); });
    S.LANDING_SECTIONS.forEach((id) => {
      const s = document.getElementById(id);
      if (s && s.parentElement === main) main.appendChild(s);
    });
  }

  /* ---------- FAQ accordions ---------- */
  document.querySelectorAll(".faq-item > button").forEach((b) => {
    b.addEventListener("click", () => {
      const item = b.parentElement;
      const open = item.classList.toggle("open");
      b.setAttribute("aria-expanded", open);
    });
  });

  /* ---------- copy buttons ---------- */
  document.querySelectorAll("[data-copy]").forEach((b) => {
    b.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(b.dataset.copy); } catch (e) {}
      const old = b.textContent; b.textContent = "Copied"; setTimeout(() => (b.textContent = old), 1400);
    });
  });

  /* ---------- tabs (levers, skills filter) ---------- */
  document.querySelectorAll("[data-tabs]").forEach((group) => {
    const tabs = group.querySelectorAll("[data-tab]");
    const panels = group.querySelectorAll("[data-panel]");
    tabs.forEach((t) => t.addEventListener("click", () => {
      tabs.forEach((x) => x.classList.toggle("active", x === t));
      const k = t.dataset.tab;
      panels.forEach((p) => { p.hidden = !(k === "all" || p.dataset.panel === k); });
    }));
  });

  /* ---------- reveal on scroll ---------- */
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
  }
})();
