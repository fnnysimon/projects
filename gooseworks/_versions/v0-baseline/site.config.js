/* =====================================================================
   SITE CONFIG — the single place to edit routes and navigation.
   ---------------------------------------------------------------------
   • ROUTES: every page of the site, by id. Change a file path here and
     every link pointing to that id updates everywhere.
   • In HTML, link to a page with  data-route="book"  (or "home#pricing"
     for an anchor). Never hard-code page paths in the HTML.
   • NAV / FOOTER / BANNER / CTA: what appears in the header, footer and
     top banner, and where every "Book a call" button goes.
   • LANDING_SECTIONS: order of the landing page sections. Reorder, or
     remove an id to hide that section.
   ===================================================================== */

window.SITE = {
  brand: { first: "Goose", second: "works", tagline: "Your proactive growth agent." },

  ROUTES: {
    home:         { path: "index.html",                     title: "Home" },
    caseStudy:    { path: "pages/case-study-braxley.html",  title: "Customer story — Braxley Bands" },
    creative:     { path: "pages/creative-agent.html",      title: "Creative agent" },
    book:         { path: "pages/book.html",                title: "Book a call" },
    about:        { path: "pages/about.html",               title: "About" },
    skills:       { path: "pages/skills.html",              title: "Skills library" },
    privacy:      { path: "pages/privacy.html",             title: "Privacy" },
    terms:        { path: "pages/terms.html",               title: "Terms" },
    dataDeletion: { path: "pages/data-deletion.html",       title: "Data deletion" },
    sitemap:      { path: "sitemap.html",                   title: "Site map (dev)" },
  },

  /* Main CTA — every element with data-route="cta" goes here */
  CTA: { label: "Book a call", route: "book" },

  /* Thin announcement bar above the header. Set to null to hide it. */
  BANNER: { text: "Looking for our creative agent?", linkLabel: "See it", route: "creative" },

  /* Header navigation, left to right */
  NAV: [
    { label: "What Goose finds", route: "home#signals" },
    { label: "Customer story",   route: "caseStudy" },
    { label: "Pricing",          route: "home#pricing" },
    { label: "Creative agent",   route: "creative" },
  ],

  /* Footer columns */
  FOOTER: [
    { title: "Start",   links: [{ label: "Book a call", route: "book" }] },
    { title: "Explore", links: [{ label: "Creative agent", route: "creative" }, { label: "Skills", route: "skills" }] },
    { title: "Company", links: [{ label: "About", route: "about" }, { label: "Contact us", href: "mailto:hello@example.com" }] },
    { title: "Legal",   links: [{ label: "Privacy", route: "privacy" }, { label: "Terms", route: "terms" }, { label: "Data deletion", route: "dataDeletion" }] },
  ],

  /* Landing page: section ids in display order (see index.html) */
  LANDING_SECTIONS: [
    "hero",
    "dashboard",
    "reads",
    "signals",
    "levers",
    "value",
    "customer",
    "pricing",
    "faq",
    "final-cta",
  ],
};
