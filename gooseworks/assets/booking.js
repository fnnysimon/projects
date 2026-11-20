/* Booking flow — v8 "2 clicks": pick a time (click 1) → type your email → Confirm (click 2).
   Brand details (website, revenue, ad spend) moved AFTER the booking, as optional questions.
   Used on the landing hero (6 slots) and on pages/book.html (9 slots): any <form data-booking>.
   Behaviour kept from docs/06-interaction-spec-booking.md: errors, skeleton, slow/timeout, taken slot, draft, .ics.
   Demo only: the "API" is simulated. Add ?demo=slow|error|taken|empty|offline to the URL to see each state. */
(function () {
  const form = document.querySelector("form[data-booking]");
  if (!form) return;

  /* ---------- config (numbers from the spec's Timing table) ---------- */
  const T = { skeletonDelay: 300, slow: 4000, timeout: 15000 };
  const DEMO = new URLSearchParams(location.search).get("demo") || "";
  const FAKE = { slots: 650, submit: DEMO === "slow" ? 6000 : 1200 };
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const TZ = Intl.DateTimeFormat().resolvedOptions().timeZone || "your time zone";
  const DRAFT_KEY = "book-draft";
  const COUNT = +form.dataset.slots || 9;
  const CONTACT = (window.SITE && window.SITE.CONTACT) || { email: "hello@example.com" };

  const $ = (sel) => form.querySelector(sel);
  const live = $("[data-live]");
  const panels = [...form.querySelectorAll(".step-panel")];
  const email = $("#f-email"), emailErr = $("#f-email-err");
  const slotsEl = $("[data-slot-list]"), slotStatus = $("[data-slot-status]"), submitErr = $("[data-submit-err]");
  const confirmArea = $("[data-confirm-area]");
  const confirmBtn = $(".confirm-btn"), confirmLabel = $(".confirm-label"), slowNote = $("[data-slow]");

  const state = { step: 1, slot: null, slots: [], busy: false, takenOnce: false };
  const announce = (msg) => { live.textContent = ""; setTimeout(() => (live.textContent = msg), 30); };

  /* ---------- draft (sessionStorage, never required to work) ---------- */
  const draft = {
    load() { try { return JSON.parse(sessionStorage.getItem(DRAFT_KEY) || "{}"); } catch (e) { return {}; } },
    save() { try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ email: email.value, slot: state.slot ? state.slot.iso : null })); } catch (e) {} },
    clear() { try { sessionStorage.removeItem(DRAFT_KEY); } catch (e) {} },
  };

  /* ---------- email validation: first check on blur or Confirm, then live ---------- */
  const emailRule = (v) => {
    v = v.trim();
    if (!v) return "Enter your work email so we can send the invite.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "This doesn't look like an email. Check for a missing @ or dot.";
    return "";
  };
  function checkEmail() {
    const msg = emailRule(email.value);
    email.setAttribute("aria-invalid", msg ? "true" : "false");
    emailErr.hidden = !msg;
    if (msg) { emailErr.textContent = msg; emailErr.classList.remove("in"); void emailErr.offsetWidth; emailErr.classList.add("in"); }
    return !msg;
  }
  email.addEventListener("blur", () => { if (email.value) checkEmail(); });
  email.addEventListener("input", () => { draft.save(); if (email.getAttribute("aria-invalid") === "true") checkEmail(); });

  /* ---------- slots ---------- */
  function makeSlots() {
    // next working days, 3 times each, in the visitor's time zone (demo data)
    const out = [], d = new Date(); d.setHours(0, 0, 0, 0);
    while (out.length < COUNT) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() === 0 || d.getDay() === 6) continue;
      for (const [h, m] of [[10, 0], [14, 30], [16, 0]]) {
        if (out.length >= COUNT) break;
        const t = new Date(d); t.setHours(h, m);
        out.push({ iso: t.toISOString(), date: t,
          day: t.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }),
          time: t.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }), taken: false });
      }
    }
    return out;
  }
  const slotText = (s) => `${s.day}, ${s.time}`;

  function renderSlots() {
    slotsEl.innerHTML = "";
    state.slots.forEach((s) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "slot"; b.dataset.iso = s.iso;
      b.innerHTML = `<span class="slot-day">${s.day}</span><span class="slot-time">${s.time}</span>${s.taken ? '<span class="slot-tag">Just taken</span>' : ""}`;
      b.setAttribute("aria-pressed", state.slot && state.slot.iso === s.iso ? "true" : "false");
      if (s.taken) { b.disabled = true; b.classList.add("taken"); b.setAttribute("aria-label", `${slotText(s)}, taken`); }
      b.addEventListener("click", () => selectSlot(s));
      slotsEl.appendChild(b);
    });
    updateConfirm();
  }

  function selectSlot(s, quiet) {
    if (state.busy || s.taken) return;
    state.slot = s;
    slotsEl.querySelectorAll(".slot").forEach((b) => b.setAttribute("aria-pressed", b.dataset.iso === s.iso ? "true" : "false"));
    submitErr.hidden = true;
    const wasHidden = confirmArea.hidden;
    confirmArea.hidden = false;
    if (wasHidden && !reduced.matches) { confirmArea.classList.remove("in"); void confirmArea.offsetWidth; confirmArea.classList.add("in"); }
    updateConfirm(); draft.save();
    if (quiet) return;
    // the next action is the email: take the visitor there (or straight to Confirm if it's already filled)
    (emailRule(email.value) ? email : confirmBtn).focus({ preventScroll: true });
    const r = confirmArea.getBoundingClientRect();
    if (r.bottom > innerHeight) confirmArea.scrollIntoView({ block: "nearest", behavior: reduced.matches ? "auto" : "smooth" });
    announce(`${slotText(s)} selected. Enter your email, then confirm.`);
  }

  function updateConfirm() { confirmLabel.textContent = state.slot ? `Confirm ${slotText(state.slot)}` : "Confirm"; }

  function showSlotStatus(kind) {
    slotStatus.hidden = !kind || kind === "loading";
    slotsEl.hidden = !!kind && kind !== "loading";
    if (kind === "loading") {
      slotsEl.innerHTML = Array.from({ length: Math.min(COUNT, 6) }, () => '<span class="slot skeleton" aria-hidden="true"></span>').join("");
      slotsEl.setAttribute("aria-busy", "true");
    } else slotsEl.removeAttribute("aria-busy");
    if (kind === "error") {
      slotStatus.innerHTML = `<p>We couldn't load times. Check your connection.</p><button type="button" class="btn btn-ghost btn-sm">Retry</button>`;
      slotStatus.querySelector("button").addEventListener("click", loadSlots);
      announce("We couldn't load times.");
    }
    if (kind === "empty") {
      slotStatus.innerHTML = `<p>No times left this week.</p><a class="text-link" href="mailto:${CONTACT.email}">Email the founders instead <span aria-hidden="true">→</span></a>`;
      announce("No times left this week.");
    }
  }

  let slotsLoadedOnce = false;
  function loadSlots() {
    const skeletonTimer = setTimeout(() => showSlotStatus("loading"), T.skeletonDelay);
    setTimeout(() => {
      clearTimeout(skeletonTimer);
      if (DEMO === "offline" && !slotsLoadedOnce) { slotsLoadedOnce = true; showSlotStatus("error"); return; }
      if (DEMO === "empty") { showSlotStatus("empty"); return; }
      slotsLoadedOnce = true;
      state.slots = makeSlots();
      showSlotStatus(null);
      renderSlots();
      const saved = state.slots.find((s) => s.iso === draft.load().slot);
      if (saved) selectSlot(saved, true);
    }, FAKE.slots);
  }

  /* ---------- submit (simulated API) ---------- */
  function setBusy(on) {
    state.busy = on;
    confirmBtn.setAttribute("aria-busy", on ? "true" : "false");
    confirmBtn.classList.toggle("is-busy", on);
    email.readOnly = on;
    slotsEl.querySelectorAll(".slot").forEach((b) => { b.disabled = on || b.classList.contains("taken"); });
    if (on) { confirmLabel.textContent = "Booking…"; announce("Booking your call…"); }
    else { updateConfirm(); slowNote.hidden = true; }
  }

  function showSubmitError(msg) {
    submitErr.textContent = msg; submitErr.hidden = false;
    confirmLabel.textContent = state.slot ? `Try again: ${slotText(state.slot)}` : "Try again";
    announce(msg);
  }

  const fakeBook = () => new Promise((resolve, reject) => setTimeout(() => {
    if (DEMO === "error") return reject("network");
    if (DEMO === "taken" && !state.takenOnce) { state.takenOnce = true; return reject("taken"); }
    resolve();
  }, FAKE.submit));

  function confirm() {
    if (state.busy || !state.slot) return;
    if (!checkEmail()) { email.focus(); return; }
    submitErr.hidden = true;
    setBusy(true);
    const slowTimer = setTimeout(() => { slowNote.hidden = false; announce("Still working."); }, T.slow);
    let timedOut = false;
    const timeout = setTimeout(() => {
      timedOut = true; clearTimeout(slowTimer); setBusy(false);
      showSubmitError(`This is taking too long. Your details are saved. Try again, or email ${CONTACT.email}.`);
    }, T.timeout);

    fakeBook().then(() => {
      if (timedOut) return;
      clearTimeout(slowTimer); clearTimeout(timeout); setBusy(false);
      showSuccess();
    }).catch((why) => {
      if (timedOut) return;
      clearTimeout(slowTimer); clearTimeout(timeout); setBusy(false);
      if (why === "taken") {
        const lost = state.slot; lost.taken = true; state.slot = null;
        renderSlots();
        showSubmitError(`Someone just took ${slotText(lost)}. Pick another time, your email is kept.`);
        confirmLabel.textContent = "Confirm";
        const first = slotsEl.querySelector(".slot:not(:disabled)");
        if (first) first.focus();
      } else showSubmitError("We couldn't book the call. Nothing was lost. Try again.");
    });
  }

  /* ---------- success + calendar file ---------- */
  function ics(s) {
    const fmt = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const end = new Date(s.date.getTime() + 15 * 60000);
    return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//GooseWorks demo//EN", "BEGIN:VEVENT",
      "UID:" + Date.now() + "@gooseworks-demo", "DTSTAMP:" + fmt(new Date()), "DTSTART:" + fmt(s.date), "DTEND:" + fmt(end),
      "SUMMARY:GooseWorks call: see your funnel leaks", "DESCRIPTION:15-minute call. Have your Shopify and ad accounts at hand.",
      "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  }

  function showSuccess() {
    const s = state.slot;
    $("[data-when]").innerHTML = `For <b>${slotText(s)}</b> <span class="muted">(${TZ.replace(/_/g, " ")})</span>`;
    $("[data-mail]").textContent = `A calendar invite is on its way to ${email.value.trim()}.`;
    try { $("[data-ics]").href = URL.createObjectURL(new Blob([ics(s)], { type: "text/calendar" })); } catch (e) {}
    draft.clear();
    prefillDetails();
    state.step = 2;   // Enter in the optional details must never re-book
    const from = panels[0], to = panels[1];
    from.hidden = true; to.hidden = false;
    if (!reduced.matches) to.classList.add("enter-forward");
    const title = to.querySelector(".step-title");
    title.focus({ preventScroll: true });
    const top = form.getBoundingClientRect().top;
    if (top < 70) form.scrollIntoView({ block: "start", behavior: reduced.matches ? "auto" : "smooth" });
    announce(`You're booked for ${slotText(s)}.`);
  }

  /* ---------- optional details, asked after the booking ---------- */
  const FREE_MAIL = /^(gmail|googlemail|yahoo|ymail|hotmail|outlook|live|msn|icloud|me|mac|aol|proton|protonmail|pm|gmx|mail|yandex|zoho|free|orange|laposte|sfr|wanadoo|hey)\./i;
  const PLAN_BAND = { starter: "Under $1M", growth: "$1–10M", business: "$10M+" };
  function prefillDetails() {
    const site = $("#f-site");
    const domain = (email.value.trim().split("@")[1] || "").toLowerCase();
    if (site && domain && !FREE_MAIL.test(domain) && !site.value) { site.value = domain; site.dataset.autofilled = "1"; }
    const plan = (new URLSearchParams(location.search).get("plan") || "").toLowerCase();
    if (PLAN_BAND[plan]) form.querySelectorAll('input[name="revenue"]').forEach((r) => { r.checked = r.value === PLAN_BAND[plan]; });
  }
  const detailsBtn = $("[data-action='details']");
  if (detailsBtn) detailsBtn.addEventListener("click", () => {
    const box = $("[data-details]");
    box.innerHTML = `<p class="details-done">✓ Thanks. We'll look at your store before the call.</p>`;
    announce("Thanks. Details saved.");
  });

  /* ---------- wiring ---------- */
  const tz = $("[data-tz]");
  if (tz) tz.textContent = `Free, 15 minutes on video. Times in ${TZ.replace(/_/g, " ")}.`;
  form.querySelectorAll("[data-contact]").forEach((a) => { a.href = "mailto:" + CONTACT.email; });

  form.addEventListener("submit", (e) => { e.preventDefault(); if (state.step === 1) confirm(); });

  const d = draft.load();
  if (d.email) email.value = d.email;
  loadSlots();
})();
