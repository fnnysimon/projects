/* Shared behaviour: builds header/footer from site.config.js, resolves
   data-route links, orders landing sections, FAQ accordions, tabs, copy buttons.
   You normally don't need to edit this file — edit site.config.js. */
(function () {
  const S = window.SITE;
  const body = document.body;
  const ROOT = body.dataset.root || "";          // "" at site root, "../" in /pages
  const PAGE = body.dataset.page || "";          // current route id
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
  };

  /* ---------- route resolution ---------- */
  function href(route) {
    if (!route) return "#";
    if (route === "cta") route = S.CTA.route;
    if (route === "cta2") route = S.CTA2.route;
    const [id, anchor] = route.split("#");
    const r = S.ROUTES[id];
    if (!r) { console.warn("[site] unknown route:", route); return "#"; }
    if (r.url) return r.url;
    if (id === PAGE && anchor) return "#" + anchor;
    return ROOT + r.path + (anchor ? "#" + anchor : "");
  }
  window.SITE.href = href;
  const linkHref = (l) => l.contact ? "mailto:" + S.CONTACT.email : (l.href || href(l.route));

  /* ---------- banner (outside the sticky header, dismissible) ---------- */
  const headerSlot = document.getElementById("site-header");
  if (headerSlot && S.BANNER && PAGE !== S.BANNER.route && store.get("banner-dismissed") !== "1") {
    const b = document.createElement("div");
    b.className = "banner";
    b.innerHTML = `<span class="banner-dots" aria-hidden="true"><i></i><i></i><i></i></span>
      <span>${S.BANNER.text}</span>
      <a href="${href(S.BANNER.route)}">${S.BANNER.linkLabel} <span aria-hidden="true">→</span></a>
      <button class="banner-close" aria-label="Dismiss announcement">×</button>`;
    headerSlot.before(b);
    b.querySelector(".banner-close").addEventListener("click", () => { b.remove(); store.set("banner-dismissed", "1"); });
  }

  /* ---------- header ---------- */
  if (headerSlot) {
    const onCtaPage = PAGE === S.CTA.route;
    headerSlot.innerHTML = `<header class="header"><div class="header-inner">
      <a class="wordmark" href="${href("home")}" aria-label="${S.brand.first}${S.brand.second} home">
        ${S.brand.first}<span>${S.brand.second}</span></a>
      <nav class="nav" aria-label="Main"></nav>
      ${onCtaPage ? "" : `<a class="btn btn-dark btn-sm header-cta" href="${href("cta")}">${S.CTA.label}</a>`}
      <button class="menu-toggle" aria-label="Open menu" aria-expanded="false"><span></span><span></span></button>
    </div></header>`;
    const nav = headerSlot.querySelector(".nav");
    S.NAV.forEach((l) => {
      const a = document.createElement("a");
      a.textContent = l.label;
      a.href = linkHref(l);
      if (l.route && l.route.split("#")[0] === PAGE && !l.route.includes("#")) a.setAttribute("aria-current", "page");
      nav.appendChild(a);
    });
    const t = headerSlot.querySelector(".menu-toggle");
    t.addEventListener("click", () => {
      const open = headerSlot.classList.toggle("menu-open");
      t.setAttribute("aria-expanded", open);
      t.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    nav.addEventListener("click", () => headerSlot.classList.remove("menu-open"));
    // hairline under the header once the page has scrolled
    const onScroll = () => headerSlot.classList.toggle("is-scrolled", window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- footer ---------- */
  const footerSlot = document.getElementById("site-footer");
  if (footerSlot) {
    const cols = S.FOOTER.map((c) => `<div class="footer-col"><h2>${c.title}</h2><ul>${
      c.links.map((l) => `<li><a href="${linkHref(l)}">${l.label}</a></li>`).join("")
    }</ul></div>`).join("");
    footerSlot.innerHTML = `<footer class="footer"><div class="container">
      <div class="footer-grid">${cols}</div>
      <div class="footer-bottom">
        <div class="yc"><span class="yc-badge" aria-hidden="true">Y</span> Backed by Y Combinator</div>
        <p>${S.brand.tagline}</p>
        <p>© ${new Date().getFullYear()} ${S.brand.first}${S.brand.second} · educational recreation of <a href="https://gooseworks.ai/" target="_blank" rel="noopener">gooseworks.ai</a></p>
      </div></div></footer>`;
  }

  /* ---------- data-route links + CTA labels anywhere in the page ---------- */
  document.querySelectorAll("[data-route]").forEach((el) => {
    let h = href(el.dataset.route);
    if (el.dataset.query) { const [p, hash] = h.split("#"); h = p + (p.includes("?") ? "&" : "?") + el.dataset.query + (hash ? "#" + hash : ""); }
    el.setAttribute("href", h);
    const r = S.ROUTES[(el.dataset.route || "").split("#")[0]];
    if (r && r.url) { el.target = "_blank"; el.rel = "noopener"; }
  });
  document.querySelectorAll("[data-cta-label]").forEach((el) => {
    const c = el.dataset.ctaLabel === "2" ? S.CTA2 : S.CTA;
    const slot = el.querySelector(".label") || el;
    slot.textContent = c.label;
  });
  document.querySelectorAll("[data-cta-sub]").forEach((el) => { el.textContent = S.CTA.sub; });

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
  document.querySelectorAll(".faq-item > button").forEach((b, i) => {
    const ans = b.nextElementSibling;
    if (ans) { ans.id = ans.id || "faq-a-" + i; b.setAttribute("aria-controls", ans.id); }
    b.addEventListener("click", () => {
      const open = b.parentElement.classList.toggle("open");
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

  /* ---------- tabs (levers, skills filter) with ARIA ---------- */
  const mobile = window.matchMedia("(max-width: 860px)");
  document.querySelectorAll("[data-tabs]").forEach((group, g) => {
    const tabs = [...group.querySelectorAll("[data-tab]")];
    const panels = [...group.querySelectorAll("[data-panel]")];
    if (tabs[0]) tabs[0].parentElement.setAttribute("role", "tablist");
    panels.forEach((p, i) => { p.id = p.id || `tabs${g}-panel${i}`; p.setAttribute("role", "tabpanel"); });
    tabs.forEach((t) => {
      t.setAttribute("role", "tab");
      t.setAttribute("aria-selected", t.classList.contains("active"));
      const p = panels.find((x) => x.dataset.panel === t.dataset.tab);
      if (p) t.setAttribute("aria-controls", p.id);
    });

    // Levers: on mobile the panel opens right under the tapped lever (accordion);
    // on desktop it lives in its own column.
    const inline = group.hasAttribute("data-tabs-inline");
    const home = inline && panels[0] ? panels[0].parentElement : null;
    function place() {
      if (!inline) return;
      const active = tabs.find((t) => t.classList.contains("active"));
      panels.forEach((p) => {
        if (mobile.matches && active && p.dataset.panel === active.dataset.tab) active.after(p);
        else if (p.parentElement !== home) home.appendChild(p);
      });
    }

    function select(t) {
      tabs.forEach((x) => { x.classList.toggle("active", x === t); x.setAttribute("aria-selected", x === t); });
      const k = t.dataset.tab;
      panels.forEach((p) => { p.hidden = !(k === "all" || p.dataset.panel === k); });
      place();
    }
    tabs.forEach((t) => t.addEventListener("click", () => select(t)));
    mobile.addEventListener("change", place);
    place();
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
