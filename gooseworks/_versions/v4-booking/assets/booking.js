/* Booking flow — implements docs/06-interaction-spec-booking.md
   Demo only: the "API" is simulated. Add ?demo=slow|error|taken|empty|offline to the URL to see each state. */
(function () {
  const form = document.getElementById("book-form");
  if (!form) return;

  /* ---------- config (numbers from the spec's Timing table) ---------- */
  const T = {
    debounce: 300,      // URL check after typing stops (< ~400 ms Doherty threshold)
    skeletonDelay: 300, // show slot skeleton only if loading takes longer than this
    slow: 4000,         // switch to "Still working…"
    timeout: 15000,     // give up and show an error
  };
  const DEMO = new URLSearchParams(location.search).get("demo") || "";
  const FAKE = { slots: 650, submit: DEMO === "slow" ? 6000 : 1200 }; // simulated API latency
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const TZ = Intl.DateTimeFormat().resolvedOptions().timeZone || "your time zone";
  const DRAFT_KEY = "book-draft";

  const $ = (sel) => form.querySelector(sel);
  const live = $("#book-live");
  const indicator = $("#step-indicator");
  const panels = [...form.querySelectorAll(".step-panel")];
  const fields = { email: $("#f-email"), site: $("#f-site"), revenue: $("#f-revenue"), spend: $("#f-spend") };
  const slotsEl = $("#slots"), slotStatus = $("#slot-status"), slotErr = $("#slot-err"), submitErr = $("#submit-err");
  const confirmBtn = $(".confirm-btn"), confirmLabel = $(".confirm-label"), backBtn = $('[data-action="back"]'), slowNote = $("#slow-note");

  const state = { step: 1, slot: null, slots: [], busy: false, takenOnce: false };

  /* ---------- draft (sessionStorage, never required to work) ---------- */
  const draft = {
    load() { try { return JSON.parse(sessionStorage.getItem(DRAFT_KEY) || "{}"); } catch (e) { return {}; } },
    save() {
      try {
        sessionStorage.setItem(DRAFT_KEY, JSON.stringify({
          email: fields.email.value, site: fields.site.value, revenue: fields.revenue.value, spend: fields.spend.value,
          slot: state.slot ? state.slot.iso : null,
        }));
      } catch (e) {}
    },
    clear() { try { sessionStorage.removeItem(DRAFT_KEY); } catch (e) {} },
  };

  const announce = (msg) => { live.textContent = ""; setTimeout(() => (live.textContent = msg), 30); };

  /* ---------- validation ---------- */
  const normaliseSite = (v) => v.trim().replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/+$/, "");
  const rules = {
    email(v) {
      v = v.trim();
      if (!v) return "Enter your work email so we can send the invite.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "This doesn't look like an email. Check for a missing @ or dot.";
      return "";
    },
    site(v) {
      if (!v.trim()) return "Add your store's website. We look at it before the call.";
      if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+(\/\S*)?$/i.test(normaliseSite(v))) return "We couldn't read this address. Try the format yourbrand.com.";
      return "";
    },
    revenue(v) { return v ? "" : "Pick your revenue range so we come prepared."; },
  };

  function setError(name, msg) {
    const input = fields[name], err = $("#f-" + name + "-err");
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    err.hidden = !msg;
    if (msg) { err.textContent = msg; err.classList.remove("in"); void err.offsetWidth; err.classList.add("in"); }
  }
  const check = (name) => { const msg = rules[name](fields[name].value); setError(name, msg); return !msg; };

  Object.keys(rules).forEach((name) => {
    const input = fields[name];
    let timer;
    // first check on blur — never scold while typing
    input.addEventListener("blur", () => { if (input.value || input.dataset.touched) check(name); input.dataset.touched = "1"; });
    // once flagged, re-check live (site debounced) so the error clears the moment it's fixed
    input.addEventListener(input.tagName === "SELECT" ? "change" : "input", () => {
      draft.save();
      if (input.getAttribute("aria-invalid") !== "true") return;
      if (name === "site") { clearTimeout(timer); timer = setTimeout(() => check(name), T.debounce); }
      else check(name);
    });
  });
  fields.spend.addEventListener("change", draft.save);
  fields.site.addEventListener("blur", () => { // tolerant input: silently tidy the address
    if (!rules.site(fields.site.value)) fields.site.value = normaliseSite(fields.site.value);
  });

  /* ---------- step changes (focus + motion) ---------- */
  const LABELS = { 1: "Step 1 of 2 · Your brand", 2: "Step 2 of 2 · Pick a time", 3: "" };

  function goStep(n, dir = "forward") {
    const from = panels.find((p) => !p.hidden), to = panels.find((p) => +p.dataset.step === n);
    const h0 = form.offsetHeight;
    from.hidden = true; to.hidden = false;
    state.step = n;
    indicator.textContent = LABELS[n]; indicator.hidden = !LABELS[n];

    if (!reduced.matches) {
      // panel slides in the direction of travel; form height eases between steps
      to.classList.remove("enter-forward", "enter-back"); void to.offsetWidth;
      to.classList.add(dir === "back" ? "enter-back" : "enter-forward");
      const h1 = form.offsetHeight;
      form.style.height = h0 + "px"; void form.offsetHeight;
      form.classList.add("is-resizing"); form.style.height = h1 + "px";
      setTimeout(() => { form.classList.remove("is-resizing"); form.style.height = ""; }, 220);
    }
    // move focus to the step heading so screen readers read "Pick a time" etc.
    const title = to.querySelector(".step-title");
    title.focus({ preventScroll: true });
    const top = form.getBoundingClientRect().top;
    if (top < 70 || top > innerHeight * 0.6) form.scrollIntoView({ block: "start", behavior: reduced.matches ? "auto" : "smooth" });
  }

  /* ---------- slots ---------- */
  function makeSlots() {
    // next 3 working days, 3 times each, in the visitor's time zone (demo data)
    const out = [], d = new Date(); d.setHours(0, 0, 0, 0);
    while (out.length < 9) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() === 0 || d.getDay() === 6) continue;
      for (const [h, m] of [[10, 0], [14, 30], [16, 0]]) {
        const t = new Date(d); t.setHours(h, m);
        out.push({
          iso: t.toISOString(), date: t,
          day: t.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }),
          time: t.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
          taken: false,
        });
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

  function selectSlot(s) {
    if (state.busy || s.taken) return;
    state.slot = s;
    slotsEl.querySelectorAll(".slot").forEach((b) => b.setAttribute("aria-pressed", b.dataset.iso === s.iso ? "true" : "false"));
    slotErr.hidden = true; submitErr.hidden = true;
    updateConfirm(); draft.save();
  }

  function updateConfirm() {
    confirmLabel.textContent = state.slot ? `Confirm ${slotText(state.slot)}` : "Confirm";
  }

  function showSlotStatus(kind) {
    slotStatus.hidden = !kind;
    slotsEl.hidden = !!kind && kind !== "loading";
    if (kind === "loading") {
      slotStatus.hidden = true;
      slotsEl.innerHTML = Array.from({ length: 6 }, () => '<span class="slot skeleton" aria-hidden="true"></span>').join("");
      slotsEl.setAttribute("aria-busy", "true");
    } else slotsEl.removeAttribute("aria-busy");
    if (kind === "error") {
      slotStatus.innerHTML = `<p>We couldn't load times. Check your connection.</p><button type="button" class="btn btn-ghost btn-sm" data-action="retry-slots">Retry</button>`;
      slotStatus.querySelector("button").addEventListener("click", loadSlots);
      announce("We couldn't load times.");
    }
    if (kind === "empty") {
      slotStatus.innerHTML = `<p>No times left this week.</p><a class="text-link" href="mailto:hello@example.com">Email us instead <span aria-hidden="true">→</span></a>`;
      announce("No times left this week.");
    }
  }

  let slotsLoadedOnce = false;
  function loadSlots() {
    if (slotsLoadedOnce && state.slots.length) { renderSlots(); return; }
    const skeletonTimer = setTimeout(() => showSlotStatus("loading"), T.skeletonDelay);
    setTimeout(() => {
      clearTimeout(skeletonTimer);
      if (DEMO === "offline" && !slotsLoadedOnce) { slotsLoadedOnce = true; showSlotStatus("error"); return; }
      if (DEMO === "empty") { showSlotStatus("empty"); return; }
      slotsLoadedOnce = true;
      state.slots = makeSlots();
      const saved = draft.load().slot;
      state.slot = state.slots.find((s) => s.iso === saved) || null;
      showSlotStatus(null);
      renderSlots();
    }, FAKE.slots);
  }

  /* ---------- submit (simulated API) ---------- */
  function setBusy(on) {
    state.busy = on;
    confirmBtn.setAttribute("aria-busy", on ? "true" : "false");
    confirmBtn.classList.toggle("is-busy", on);
    backBtn.disabled = on;
    slotsEl.querySelectorAll(".slot").forEach((b) => { b.disabled = on || b.classList.contains("taken"); });
    if (on) { confirmLabel.textContent = "Booking…"; announce("Booking your call…"); }
    else { updateConfirm(); slowNote.hidden = true; }
  }

  function showSubmitError(msg) {
    submitErr.textContent = msg; submitErr.hidden = false;
    confirmLabel.textContent = state.slot ? `Try again: ${slotText(state.slot)}` : "Try again";
    announce(msg);
  }

  function fakeBook() {
    return new Promise((resolve, reject) => setTimeout(() => {
      if (DEMO === "error") return reject("network");
      if (DEMO === "taken" && !state.takenOnce) { state.takenOnce = true; return reject("taken"); }
      resolve();
    }, FAKE.submit));
  }

  function confirm() {
    if (state.busy) return;
    if (!state.slot) {
      slotErr.textContent = "Pick a time to continue."; slotErr.hidden = false;
      const first = slotsEl.querySelector(".slot:not(:disabled)");
      if (first) first.focus();
      return;
    }
    submitErr.hidden = true;
    setBusy(true);
    const slowTimer = setTimeout(() => { slowNote.hidden = false; announce("Still working."); }, T.slow);
    let timedOut = false;
    const timeout = setTimeout(() => {
      timedOut = true; clearTimeout(slowTimer); setBusy(false);
      showSubmitError("This is taking too long. Your details are saved. Try again, or email hello@example.com.");
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
        showSubmitError(`Someone just took ${slotText(lost)}. Here are the times still free.`);
        confirmLabel.textContent = "Confirm";
        const first = slotsEl.querySelector(".slot:not(:disabled)");
        if (first) first.focus();
      } else {
        showSubmitError("We couldn't book the call. Nothing was lost. Try again.");
      }
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
    $("#success-when").innerHTML = `For <b>${slotText(s)}</b> <span class="muted">(${TZ})</span>`;
    $("#success-mail").textContent = `A calendar invite is on its way to ${fields.email.value.trim()}.`;
    try { $("#add-cal").href = URL.createObjectURL(new Blob([ics(s)], { type: "text/calendar" })); } catch (e) {}
    draft.clear();
    goStep(3);
    announce(`You're booked for ${slotText(s)}.`);
  }

  /* ---------- wiring ---------- */
  $("#tz-line").textContent = `15 minutes, on video. Times in ${TZ.replace(/_/g, " ")}.`;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (state.step === 1) {
      const order = ["email", "site", "revenue"];
      const bad = order.filter((n) => !check(n));
      order.forEach((n) => (fields[n].dataset.touched = "1"));
      if (bad.length) { fields[bad[0]].focus(); return; }
      goStep(2); loadSlots();
    } else if (state.step === 2) confirm();
  });
  backBtn.addEventListener("click", () => { if (!state.busy) goStep(1, "back"); });

  // restore a draft after a refresh — nothing typed is ever lost
  const d = draft.load();
  ["email", "site", "revenue", "spend"].forEach((k) => { if (d[k]) fields[k].value = d[k]; });
})();
