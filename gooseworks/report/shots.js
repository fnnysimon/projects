// /doc shot list for the GooseWorks recreation.
// Versions: v0 (baseline) … v5 (current), v6 = the reverted "ledger" art direction.
window.GLOBAL_CSS = '.reveal{opacity:1!important;transform:none!important;transition:none!important}*{transition:none!important}.step-panel{animation:none!important}';
window.SETTLE_MS = 2500;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const set = (d, sel, v) => { const e = d.querySelector(sel); e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); return e; };
// v4/v5 booking: fill step 1 and continue
async function step1(d, v5) {
  set(d, '#f-email', 'alex@example.com');
  set(d, '#f-site', 'example.com');
  if (v5) d.querySelector('#f-revenue input[value="$1–10M"]').click(); else set(d, '#f-revenue', d.querySelector('#f-revenue').options[2].value);
  d.querySelector('[data-action="continue"]').click();
  await sleep(1400);
}
const BOOK = '#book-form';

window.SHOTS = {
  // ---- 0. Start
  'v0-full':     { src: 'v0/index.html', full: true },

  // ---- 1. design-critique (v0 -> v1)
  'cr-hero-b':   { src: 'v0/index.html', boxes: [{ sel: '.hero .btn', n: 1 }, { sel: '.banner', n: 3, pad: 6, kids: true }] },
  'cr-hero-a':   { src: 'v1/index.html', boxes: [{ sel: '.hero .cta-row', n: 1, kids: true }, { sel: '.banner-close', n: 3, pad: 2 }] },
  'cr-price-b':  { src: 'v0/index.html', scroll: '#pricing', offset: 20, boxes: [{ sel: '.price-head', n: 2, all: true }] },
  'cr-price-a':  { src: 'v1/index.html', scroll: '#pricing', offset: 20, boxes: [{ sel: '.price:not(.price-featured) .price-head', n: 2, all: true }, { sel: '.price-featured', n: 2, pad: 14 }] },
  'cr-mob-b':    { mobile: true, src: 'v0/pages/book.html', boxes: [{ sel: '.form', n: 4, pad: 4 }] },
  'cr-mob-a':    { mobile: true, src: 'v1/pages/book.html', boxes: [{ sel: '.form', n: 4, pad: 4 }] },

  // ---- 2. design-elevation (v1 -> v2)
  'el-hero-b':   { w: 900, src: 'v1/index.html', run: (d) => d.querySelector('.hero .btn-dark').focus(), boxes: [{ sel: '.hero h1', n: 1, text: true }, { sel: '.dash h2', n: 1, text: true }, { sel: '.hero .btn-dark', n: 2, pad: 10 }] },
  'el-hero-a':   { w: 900, src: 'v2/index.html', run: (d) => d.querySelector('.hero .btn-dark').focus(), boxes: [{ sel: '.hero h1', n: 1, text: true }, { sel: '.dash h2', n: 1, text: true }, { sel: '.hero .btn-dark', n: 2, pad: 10 }] },
  'el-value-b':  { src: 'v1/index.html', scroll: '#value', offset: 160, boxes: [{ sel: '.value-item', n: 3, pad: 4 }, { sel: '.header-inner', n: 4, pad: 0 }] },
  'el-value-a':  { src: 'v2/index.html', scroll: '#value', offset: 160, boxes: [{ sel: '.value-item', n: 3, pad: 4 }, { sel: '.header-inner', n: 4, pad: 0 }] },

  // ---- 3. ux-superpowers + fixes (v2 -> v3)
  'ux-hero-b':   { src: 'v2/index.html', boxes: [{ sel: '.hero .lead', n: 1 }] },
  'ux-hero-a':   { src: 'v3/index.html', boxes: [{ sel: '.hero .lead', n: 1 }, { sel: '.stack-row', n: 2 }] },
  'ux-trust-b':  { src: 'v2/index.html', scroll: '#value', offset: 40 },
  'ux-trust-a':  { src: 'v3/index.html', scroll: '#trust', offset: 60, boxes: [{ sel: '#trust .container', n: 3, kids: true }] },

  // ---- 4. interaction-design + booking build (v3 -> v4)
  'bk-err-b':    { src: 'v3/pages/book.html', scroll: BOOK, offset: 100, run: (d) => d.querySelector('[data-step="1"] [type=submit]').click(), boxes: [{ sel: '#book-form label', n: 1, all: true, pad: 4 }] },
  'bk-err-a':    { src: 'v4/pages/book.html', scroll: BOOK, offset: 100, run: async (d) => { d.querySelector('[data-action="continue"]').click(); await sleep(400); }, boxes: [{ sel: '.field-error:not([hidden])', n: 1, all: true, pad: 4 }, { sel: '#step-indicator', n: 2, pad: 6 }] },
  'bk-slot-b':   { src: 'v3/pages/book.html', scroll: BOOK, offset: 100, run: (d) => { d.querySelector('[data-step="1"]').hidden = true; d.querySelector('[data-step="2"]').hidden = false; d.querySelectorAll('.slots button')[1].click(); }, boxes: [{ sel: '.slots', n: 3 }, { sel: '[data-step="2"] [type=submit]', n: 5, pad: 6 }] },
  'bk-slot-a':   { src: 'v4/pages/book.html', scroll: BOOK, offset: 100, run: async (d) => { await step1(d, false); d.querySelectorAll('#slots .slot:not([disabled])')[1].click(); await sleep(300); }, boxes: [{ sel: '#slots', n: 3, pad: 10 }, { sel: '#tz-line', n: 4, text: true, pad: 4 }, { sel: '.form-actions', n: 5, pad: 6 }] },
  'bk-ok-b':     { src: 'v3/pages/book.html', scroll: BOOK, offset: 100, run: (d) => { d.querySelector('[data-step="1"]').hidden = true; d.querySelector('[data-step="3"]').hidden = false; }, boxes: [{ sel: '[data-step="3"]', n: 6 }] },
  'bk-ok-a':     { src: 'v4/pages/book.html', scroll: BOOK, offset: 100, run: async (d) => { await step1(d, false); d.querySelectorAll('#slots .slot:not([disabled])')[1].click(); d.querySelector('[data-action="confirm"]').click(); await sleep(2200); }, boxes: [{ sel: '[data-step="3"]', n: 6, pad: 6 }] },

  // ---- 5. click reduction (v4 -> v5)
  'ck-form-b':   { src: 'v4/pages/book.html', scroll: BOOK, offset: 100, run: (d) => { set(d, '#f-email', 'marcus@brand.co').dispatchEvent(new Event('blur')); }, boxes: [{ sel: '.field:has(#f-site)', n: 1, pad: 4 }, { sel: '.field:has(#f-revenue)', n: 2, pad: 4 }] },
  'ck-form-a':   { src: 'v5/pages/book.html', scroll: BOOK, offset: 100, run: (d) => { set(d, '#f-email', 'marcus@brand.co').dispatchEvent(new Event('blur')); }, boxes: [{ sel: '.field:has(#f-site)', n: 1, pad: 4 }, { sel: '#f-revenue', n: 2, pad: 4 }] },
  'ck-plan-a':   { src: 'v5/pages/book.html?plan=growth', scroll: BOOK, offset: 100, boxes: [{ sel: '#f-revenue .chip:nth-child(2)', n: 3, pad: 6 }] },

  // ---- 6. frontend-design (v5 -> v6, reverted)
  'fd-hero-b':   { src: 'v5/index.html' },
  'fd-hero-a':   { src: 'v6/index.html', boxes: [{ sel: '.ledger', n: 1, pad: 10 }, { sel: '.hero h1 em', n: 2, text: true, pad: 4 }] },

  // ---- 7. shorter mobile page (v5b -> v7), all at 390 px
  'mb-full-b':   { mobile: true, full: true, src: 'v5b/index.html' },
  'mb-full-a':   { mobile: true, full: true, src: 'v7/index.html' },
  'mb-price-b':  { mobile: true, src: 'v5b/index.html', scroll: '#pricing .price-grid', offset: 70, boxes: [{ sel: '#pricing .price-grid', n: 1, pad: 4 }] },
  'mb-price-a':  { mobile: true, src: 'v7/index.html', scroll: '#pricing .swipe-hint', offset: 70, boxes: [{ sel: '#pricing .swipe-hint', n: 1, text: true, pad: 4 }, { sel: '#pricing .price-grid', n: 1, pad: 0 }] },
  'mb-sig-b':    { mobile: true, src: 'v5b/index.html', scroll: '#signals .levers', offset: 70, boxes: [{ sel: '#signals .lever-list', n: 2, pad: 4 }] },
  'mb-sig-a':    { mobile: true, src: 'v7/index.html', scroll: '#signals .levers', offset: 70, boxes: [{ sel: '#signals .lever-list', n: 2, pad: 4 }] },
  'mb-dup-b':    { mobile: true, src: 'v5b/index.html', scroll: '#reads .feature', offset: 70, boxes: [{ sel: '#reads .feature .panel-warm', n: 3, pad: 4 }] },
  'mb-dup-a':    { mobile: true, src: 'v7/index.html', scroll: '#reads .feature', offset: 70, boxes: [{ sel: '#reads .feature', n: 3, pad: 4 }] },
  'mb-story-b':  { mobile: true, src: 'v5b/index.html', scroll: '#customer .story-side', offset: 70, boxes: [{ sel: '#customer .story-side', n: 3, pad: 4 }] },
  'mb-story-a':  { mobile: true, src: 'v7/index.html', scroll: '#customer .story-side', offset: 70, boxes: [{ sel: '#customer .story-side', n: 3, pad: 4 }] },
  'mb-value-b':  { mobile: true, src: 'v5b/index.html', scroll: '#value', offset: 70, boxes: [{ sel: '#value .value-strip', n: 4, pad: 4 }] },
  'mb-value-a':  { mobile: true, src: 'v7/index.html', scroll: '#value', offset: 70, boxes: [{ sel: '#value .value-strip', n: 4, pad: 4 }] },
  'mb-hero-b':   { mobile: true, src: 'v5b/index.html', boxes: [{ sel: '.stack-row', n: 4, pad: 4 }] },
  'mb-hero-a':   { mobile: true, src: 'v7/index.html', boxes: [{ sel: '.stack-row', n: 4, pad: 4 }] },

  // ---- Final
  'v5-full':     { src: 'v5/index.html', full: true },
};
