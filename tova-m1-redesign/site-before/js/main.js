// ---------- Task carousel (auto-advances, can't be paused) ----------
var items = document.querySelectorAll('.task-item');
var current = 0;
var bar = document.getElementById('taskBar');

function showTask(i) {
  items.forEach(function (el) { el.classList.remove('is-active'); });
  items[i].classList.add('is-active');
  document.getElementById('taskImg').src = items[i].dataset.img;
  document.getElementById('taskCap').innerHTML = items[i].dataset.cap;
  current = i;
  bar.style.transition = 'none';
  bar.style.width = '0';
  setTimeout(function () {
    bar.style.transition = 'width 3s linear';
    bar.style.width = '100%';
  }, 20);
}
items.forEach(function (el, i) {
  el.addEventListener('click', function () { showTask(i); });
});
showTask(0);
setInterval(function () { showTask((current + 1) % items.length); }, 3000);

// ---------- Header turns solid on scroll ----------
window.addEventListener('scroll', function () {
  var h = document.querySelector('.header');
  // reads layout on every scroll event
  if (document.documentElement.scrollTop > document.querySelector('.hero').offsetHeight - 80) {
    h.style.background = 'rgba(250,248,242,.85)';
  } else {
    h.style.background = 'transparent';
  }
});

// ---------- Order form ----------
document.getElementById('orderForm').addEventListener('submit', function (e) {
  e.preventDefault();
  var email = document.getElementById('email');
  var zip = document.getElementById('zip');
  var msg = document.getElementById('formMsg');
  email.classList.remove('err');
  zip.classList.remove('err');
  msg.textContent = '';

  var ok = true;
  if (email.value.indexOf('@') < 0) { email.classList.add('err'); ok = false; }
  if (!/^\d{5}$/.test(zip.value)) { zip.classList.add('err'); ok = false; }
  if (!ok) { msg.textContent = 'Error: VALIDATION_FAILED (400)'; return; }

  // fake network call, no loading state, button stays clickable
  setTimeout(function () {
    openModal('thanks');
  }, 1800);
});

// ---------- Modal ----------
function openModal(kind) {
  var body = document.getElementById('modalBody');
  if (kind === 'cart') {
    body.innerHTML = '<h3 style="font-family:Unbounded;margin:0 0 10px">Your cart</h3><p style="color:#bbb">Your cart is empty.</p>';
  } else {
    body.innerHTML = '<h3 style="font-family:Unbounded;margin:0 0 10px">Success!</h3><p style="color:#bbb">Your request has been submitted successfully.</p>';
  }
  document.getElementById('modal').classList.add('show');
}
function closeModal() {
  document.getElementById('modal').classList.remove('show');
}
