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
    /* External destinations use "url" instead of "path" */
    creativeApp:  { url: "https://make.gooseworks.ai",      title: "Creative agent app (external)" },
  },

  /* Main CTA — every element with data-route="cta" goes here.
     data-cta-label on an element fills in the label automatically. */
  CTA: { label: "Book a call", sub: "15 minutes, free. Then you pick a time.", route: "book" },

  /* Lower-commitment CTA — data-route="cta2" */
  CTA2: { label: "See a real report", route: "caseStudy" },

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
    "customer",   // proof moved up, right after the product preview
    "reads",
    "signals",    // signals + levers merged into one section
    "value",      // now a compact 3-stat strip
    "trust",      // "Your data" reassurance, right before the price
    "pricing",
    "faq",
    "final-cta",
  ],
};
