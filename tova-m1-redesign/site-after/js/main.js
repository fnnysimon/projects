var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Task tabs (auto-advance with pause; keyboard: arrows, Home, End) ----------
var tabs = Array.prototype.slice.call(document.querySelectorAll('.task-item'));
var panel = document.getElementById('taskPanel');
var bar = document.getElementById('taskBar');
var toggle = document.getElementById('taskToggle');
var current = 0;
var timer = null;
var userPaused = reduceMotion;   // no auto-advance for people who asked for less motion
var hoverPaused = false;
var INTERVAL = window.TovaScenes ? window.TovaScenes.duration : 5000;   // one full scene loop per task

function showTask(i, moveFocus) {
  tabs.forEach(function (t, n) {
    var on = n === i;
    t.classList.toggle('is-active', on);
    t.setAttribute('aria-selected', on ? 'true' : 'false');
    t.tabIndex = on ? 0 : -1;
  });
  var tab = tabs[i];
  var cap = tab.dataset.cap.replace(' · ', ', ');
  var label = 'Tova ' + tab.textContent.toLowerCase() + ': ' + cap.charAt(0).toLowerCase() + cap.slice(1);
  var stage = document.getElementById('taskScene');
  if (window.TovaScenes) stage.innerHTML = window.TovaScenes.render(i, label);   // re-render restarts the loop
  else { var img = stage.querySelector('img'); img.src = tab.dataset.img; img.alt = label; }
  document.getElementById('taskCap').textContent = tab.dataset.cap;
  panel.setAttribute('aria-labelledby', tab.id);
  if (moveFocus) tab.focus();
  current = i;
  restartBar();
}

function restartBar() {
  bar.style.transition = 'none';
  bar.style.width = '0';
  if (userPaused || hoverPaused) return;
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      bar.style.transition = 'width ' + INTERVAL + 'ms linear';
      bar.style.width = '100%';
    });
  });
}

function schedule() {
  clearInterval(timer);
  timer = null;
  if (userPaused || hoverPaused) { restartBar(); return; }
  restartBar();
  timer = setInterval(function () { showTask((current + 1) % tabs.length, false); }, INTERVAL);
}

tabs.forEach(function (t, i) {
  t.addEventListener('click', function () { showTask(i, false); schedule(); });
  t.addEventListener('keydown', function (e) {
    var next = null;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (i + 1) % tabs.length;
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = tabs.length - 1;
    if (next !== null) { e.preventDefault(); showTask(next, true); schedule(); }
  });
});

function setPaused(p) {
  userPaused = p;
  toggle.setAttribute('aria-pressed', p ? 'true' : 'false');
  toggle.querySelector('.task-toggle__label').textContent = p ? 'Resume' : 'Pause';
  toggle.querySelector('.task-toggle__icon use').setAttribute('href', p ? '#i-play' : '#i-pause');
  panel.classList.toggle('is-paused', p);              // Pause also freezes the animation (WCAG 2.2.2)
  if (!p) panel.classList.remove('is-still');
  schedule();
}
toggle.addEventListener('click', function () { setPaused(!userPaused); });

// Pause while the pointer or keyboard focus is inside the task area
var taskArea = document.querySelector('.tasks');
function hold(on) { hoverPaused = on; schedule(); }
taskArea.addEventListener('mouseenter', function () { hold(true); });
taskArea.addEventListener('mouseleave', function () { hold(false); });
taskArea.addEventListener('focusin', function () { hold(true); });
taskArea.addEventListener('focusout', function (e) { if (!taskArea.contains(e.relatedTarget)) hold(false); });

if (reduceMotion) panel.classList.add('is-still');
setPaused(userPaused);
showTask(0, false);

// ---------- Analytics stub: events go to a dataLayer for whatever tool is plugged in later ----------
// No personal data in events (see reports/04-ux-discovery.md, telemetry).
function track(name, props) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(Object.assign({ event: name }, props || {}));
}

// ---------- Hero robot V2: turns toward you, never stares; one interaction = privacy mode ----------
// Spec: reports/07-interaction-design.md, changes from reports/08-expert-panel.md
(function () {
  var robot = document.getElementById('robot');
  if (!robot) return;
  var svg = robot.querySelector('svg');
  var hero = document.querySelector('.hero');
  var chip = document.getElementById('robotChip');
  var status = document.getElementById('robotStatus');
  var link = document.getElementById('robotLink');
  var live = document.getElementById('robotLive');
  var coarse = window.matchMedia('(pointer: coarse)').matches;
  var hintText = (coarse ? 'Tap' : 'Click') + ' Tova to turn its camera off';
  var heroVisible = true;
  var wakeTimer = null, hintTimer = null, autoplayTimers = [];
  var tx = 0, ty = 0, gx = 0, gy = 0, raf = null;

  status.textContent = hintText;
  window.tovaRobotUsed = false;

  function showHint() { chip.classList.add('is-visible'); }

  // Visual state only; `announce` also updates aria-pressed, the hint and the live region
  function setPrivate(on, announce) {
    var was = svg.classList.contains('is-private');
    svg.classList.toggle('is-private', on);
    if (was && !on) wake();
    if (on) { gx = 0; gy = 0; kick(); }   // camera off: it stops looking at you
    if (!announce) return;
    robot.setAttribute('aria-pressed', on ? 'true' : 'false');
    status.textContent = on ? 'Camera off · Slide the shutter anytime' : hintText;
    link.hidden = !on;
    live.textContent = on ? 'Camera off.' : 'Camera on.';
    showHint();
  }

  // Camera back on: antenna ping and a wave (restartable)
  function wake() {
    if (reduceMotion) return;
    svg.classList.remove('is-waking');
    svg.getBoundingClientRect();   // restart the CSS animations
    svg.classList.add('is-waking');
    clearTimeout(wakeTimer);
    wakeTimer = setTimeout(function () { svg.classList.remove('is-waking'); }, 2000);
  }

  robot.addEventListener('click', function () {
    autoplayTimers.forEach(clearTimeout);
    autoplayTimers = [];
    var on = robot.getAttribute('aria-pressed') !== 'true';
    setPrivate(on, true);
    window.tovaRobotUsed = true;
    track('robot_privacy_toggle', { state: on ? 'camera_off' : 'camera_on' });
  });
  robot.addEventListener('focus', showHint);   // keyboard users get the hint at once
  link.addEventListener('click', function () { track('robot_chip_click'); });

  // Pause everything while the hero is off-screen
  new IntersectionObserver(function (entries) {
    heroVisible = entries[0].isIntersecting;
    if (!heroVisible) { gx = 0; gy = 0; kick(); }
  }).observe(hero);

  // Hint appears late: 3 s hovering the hero (pointer) or 1.5 s in view (touch)
  if (!coarse) {
    hero.addEventListener('pointerenter', function () { hintTimer = setTimeout(showHint, 3000); });
    hero.addEventListener('pointerleave', function () { clearTimeout(hintTimer); });
  }

  // Mobile A/B test: (A) privacy mode plays once, 2 s, on first view vs (B) control
  var variant = 'none';
  if (coarse && !reduceMotion) {
    try {
      variant = localStorage.getItem('tova_robot_ab');
      if (variant !== 'autoplay' && variant !== 'control') {
        variant = Math.random() < 0.5 ? 'autoplay' : 'control';
        localStorage.setItem('tova_robot_ab', variant);
      }
    } catch (e) { variant = 'control'; }
  }
  window.tovaRobotVariant = variant;

  if (coarse) {
    var seen = false;
    new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting || seen) return;
      seen = true;
      setTimeout(showHint, 1500);
      if (variant === 'autoplay') {
        track('robot_autoplay_shown');
        autoplayTimers.push(setTimeout(function () { setPrivate(true, false); }, 600));
        autoplayTimers.push(setTimeout(function () { setPrivate(false, false); }, 2600));
      }
    }, { threshold: 0.6 }).observe(robot);
  }

  if (reduceMotion) return;   // no blinking, no tracking

  // Blink at a random interval of 3.5–6.5 s (skipped when hidden or off-screen)
  (function blink() {
    setTimeout(function () {
      if (!document.hidden && heroVisible) {
        svg.classList.add('is-blinking');
        setTimeout(function () { svg.classList.remove('is-blinking'); }, 140);
      }
      blink();
    }, 3500 + Math.random() * 3000);
  })();

  // Head turns toward the pointer, smoothed (12% of the remaining distance per frame)
  function clamp(v) { return Math.max(-1, Math.min(1, v)); }
  function frame() {
    tx += (gx - tx) * 0.12;
    ty += (gy - ty) * 0.12;
    svg.style.setProperty('--tx', tx.toFixed(3));
    svg.style.setProperty('--ty', ty.toFixed(3));
    raf = (Math.abs(gx - tx) > 0.002 || Math.abs(gy - ty) > 0.002) ? requestAnimationFrame(frame) : null;
  }
  function kick() { if (!raf && !reduceMotion) raf = requestAnimationFrame(frame); }

  if (!coarse) {
    hero.addEventListener('pointermove', function (e) {
      if (!heroVisible || svg.classList.contains('is-private')) return;
      var r = svg.getBoundingClientRect();
      gx = clamp((e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2));
      gy = clamp((e.clientY - (r.top + r.height * 0.3)) / (window.innerHeight / 2));
      kick();
    });
    hero.addEventListener('pointerleave', function () { gx = 0; gy = 0; kick(); });
  }
})();

// ---------- Header turns solid on scroll ----------
function updateHeader() {
  var h = document.querySelector('.header');
  // reads layout on every scroll event
  h.classList.toggle('is-scrolled', document.documentElement.scrollTop > document.querySelector('.hero').offsetHeight - 80);
}
window.addEventListener('scroll', updateHeader);
updateHeader();

// ---------- Accordion (shadcn pattern; several items can be open; closed panels are inert) ----------
document.querySelectorAll('.accordion__trigger').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var open = btn.getAttribute('aria-expanded') === 'true';
    var content = document.getElementById(btn.getAttribute('aria-controls'));
    btn.setAttribute('aria-expanded', open ? 'false' : 'true');
    content.dataset.state = open ? 'closed' : 'open';
    content.inert = open;
  });
});

// ---------- Tooltip (opens on hover and focus, stays while hovered, Escape closes) ----------
document.querySelectorAll('.tooltip-wrap').forEach(function (wrap) {
  var tip = wrap.querySelector('.tooltip');
  var trigger = wrap.querySelector('button');
  function set(open) { tip.dataset.state = open ? 'open' : 'closed'; }
  wrap.addEventListener('pointerenter', function () { set(true); });
  wrap.addEventListener('pointerleave', function () { if (document.activeElement !== trigger) set(false); });
  trigger.addEventListener('focus', function () { set(true); });
  trigger.addEventListener('blur', function () { set(false); });
  trigger.addEventListener('click', function () { set(tip.dataset.state !== 'open'); });   // touch
  wrap.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
});

// ---------- Order form ----------
function setError(input, text) {
  var err = document.getElementById(input.id + '-error').querySelector('span');
  err.textContent = text;
  if (text) input.setAttribute('aria-invalid', 'true');
  else input.removeAttribute('aria-invalid');
}

document.getElementById('orderForm').addEventListener('submit', function (e) {
  e.preventDefault();
  var email = document.getElementById('email');
  var zip = document.getElementById('zip');
  var btn = document.getElementById('joinBtn');
  if (btn.disabled) return;

  setError(email, '');
  setError(zip, '');
  document.getElementById('formMsg').textContent = '';

  var firstInvalid = null;
  if (!/^\S+@\S+\.\S+$/.test(email.value)) {
    setError(email, 'Enter an email address, like name@example.com.');
    firstInvalid = email;
  }
  if (!/^\d{5}$/.test(zip.value)) {
    setError(zip, 'Enter a 5-digit US ZIP code.');
    firstInvalid = firstInvalid || zip;
  }
  if (firstInvalid) {
    var count = (email.hasAttribute('aria-invalid') ? 1 : 0) + (zip.hasAttribute('aria-invalid') ? 1 : 0);
    document.getElementById('formMsg').textContent = count === 2 ? 'Please fix the 2 fields above.' : 'Please fix the field above.';
    firstInvalid.focus();
    return;
  }

  // loading state: one request at a time
  var label = btn.innerHTML;
  btn.disabled = true;
  btn.classList.add('is-loading');
  btn.setAttribute('aria-busy', 'true');
  btn.innerHTML = '<svg class="icon icon--spin" aria-hidden="true"><use href="#i-loader-circle"/></svg> Joining…';

  // fake network call
  setTimeout(function () {
    btn.disabled = false;
    btn.classList.remove('is-loading');
    btn.removeAttribute('aria-busy');
    btn.innerHTML = label;
    openModal('thanks', email.value);
    track('waitlist_join', { robot_used: !!window.tovaRobotUsed, robot_variant: window.tovaRobotVariant || 'none' });
  }, 1800);
});

// Every "Join the waitlist" link scrolls to the form and puts the cursor in the email field
document.querySelectorAll('[data-join]').forEach(function (a) {
  a.addEventListener('click', function () {
    setTimeout(function () { document.getElementById('email').focus({ preventScroll: true }); }, reduceMotion ? 0 : 500);
  });
});

// ---------- Modal (native <dialog>: focus trap, Escape and focus return are built in) ----------
function openModal(kind, email) {
  var body = document.getElementById('modalBody');
  var arrow = ' <svg class="icon" aria-hidden="true"><use href="#i-arrow-right"/></svg>';
  if (kind === 'cart') {
    body.innerHTML = '<div class="dialog__header"><h2 class="dialog__title" id="modalTitle">Your cart</h2>' +
      '<p class="dialog__description">Nothing in your cart. Tova M1 is available to join the waitlist.</p></div>' +
      '<div class="dialog__footer"><a class="btn btn--default" href="#order" data-modal-join>Join the waitlist' + arrow + '</a></div>';
  } else {
    body.innerHTML = '<div class="dialog__header"><h2 class="dialog__title" id="modalTitle">You\'re on the list</h2>' +
      '<p class="dialog__description">We\'ve sent a confirmation to <strong></strong>.</p></div>' +
      '<ul class="dialog__list">' +
      '<li>You\'ll be among the first to order, at the launch price of $1,690.</li>' +
      '<li>We\'ll email you when it\'s your turn. Deliveries start in Q1 2027.</li>' +
      '<li>Nothing to pay now. You can leave the list anytime.</li></ul>' +
      '<div class="dialog__footer"><button class="btn btn--default" type="button" onclick="closeModal()">Done</button></div>';
    body.querySelector('strong').textContent = email;
  }
  var join = body.querySelector('[data-modal-join]');
  if (join) join.addEventListener('click', function () {
    closeModal();
    setTimeout(function () { document.getElementById('email').focus({ preventScroll: true }); }, reduceMotion ? 0 : 500);
  });
  var dlg = document.getElementById('modal');
  if (!dlg.open) dlg.showModal();
}
function closeModal() {
  document.getElementById('modal').close();
}
// Click on the backdrop closes it too
document.getElementById('modal').addEventListener('click', function (e) {
  var r = this.getBoundingClientRect();
  var outside = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
  if (e.target === this && outside) closeModal();
});

// ---------- Scroll reveal: section headings and their content rise in once ----------
(function () {
  if (reduceMotion || !('IntersectionObserver' in window)) return;
  var targets = document.querySelectorAll(
    'section:not(.hero) > .section-title, .tasks, .skills, .specs, .press__row, .table-wrap, .trust__grid, .accordion, .order > *'
  );
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -10% 0px' });
  targets.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  // Keyboard users who tab into content that has not been revealed yet still see it
  document.addEventListener('focusin', function (e) {
    var r = e.target.closest && e.target.closest('.reveal');
    if (r) r.classList.add('is-in');
  });
})();

// ---------- State preview panel: add ?states to the URL to show every state on demand ----------
(function () {
  if (!/[?&]states\b/.test(location.search)) return;
  var panel = document.createElement('aside');
  panel.className = 'card states-panel';
  panel.setAttribute('aria-label', 'State preview');
  panel.innerHTML = '<p class="section-label">State preview</p>';
  var form = document.getElementById('orderForm');
  var email = document.getElementById('email');
  var zip = document.getElementById('zip');
  var states = [
    ['Form: errors', function () { email.value = ''; zip.value = ''; form.requestSubmit(); }],
    ['Form: loading', function () { email.value = 'name@example.com'; zip.value = '94107'; form.requestSubmit(); }],
    ['Dialog: success', function () { openModal('thanks', 'name@example.com'); }],
    ['Dialog: empty cart', function () { openModal('cart'); }],
    ['Robot: privacy on/off', function () { document.getElementById('robot').click(); }]
  ];
  states.forEach(function (s) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn btn--outline btn--sm';
    b.textContent = s[0];
    b.addEventListener('click', s[1]);
    panel.appendChild(b);
  });
  document.body.appendChild(panel);
})();

// ---------- Skills search: filters the cards as you type ----------
(function () {
  var q = document.getElementById('skillsQuery');
  if (!q) return;
  var cards = Array.prototype.slice.call(document.querySelectorAll('#skillsList .skill'));
  var count = document.getElementById('skillsCount');
  var empty = document.getElementById('skillsEmpty');
  var debounce;
  function norm(t) { return t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  cards.forEach(function (c) { c.dataset.search = norm(c.textContent + ' ' + (c.dataset.tags || '')); });
  function filter() {
    var words = norm(q.value.trim()).split(/\s+/).filter(Boolean);
    var shown = 0;
    cards.forEach(function (c) {
      var hit = words.every(function (w) { return c.dataset.search.indexOf(w) !== -1; });
      c.hidden = !hit;
      if (hit) shown++;
    });
    empty.hidden = shown > 0;
    document.getElementById('skillsQueryEcho').textContent = q.value.trim();
    count.textContent = !words.length ? cards.length + ' skills'
      : shown === 0 ? 'No skills match'
      : shown + (shown === 1 ? ' skill matches' : ' skills match') + ' “' + q.value.trim() + '”';
  }
  q.addEventListener('input', function () {
    clearTimeout(debounce);
    debounce = setTimeout(function () {
      filter();
      if (q.value.trim()) track('skills_search', { results: cards.filter(function (c) { return !c.hidden; }).length });
    }, 150);
  });
  document.getElementById('skillsClear').addEventListener('click', function () { q.value = ''; filter(); q.focus(); });
  filter();
})();
