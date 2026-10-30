/* AL MACTOUM — moteur d'animations au défilement. Aucune dépendance.
   1) data-am="..."      : animation qui se joue une fois quand le bloc entre à l'écran
   2) data-scroll="..."  : animation pilotée par le défilement (va et vient avec la molette)
   Compatible React / Next.js : les blocs ajoutés plus tard sont détectés tout seuls. */
(function () {
  'use strict';
  if (window.AMMotion) return;
  var root = document.documentElement;
  root.classList.add('am-ready');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) root.classList.add('am-reduce');

  var clamp = function (v, a, b) { return Math.min(b === undefined ? 1 : b, Math.max(a || 0, v)); };
  var seg = function (p, a, b) { return clamp((p - a) / (b - a)); };
  var eOut = function (u) { return 1 - Math.pow(1 - u, 3); };
  var eInOut = function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
  var vh = function () { return window.innerHeight || 800; };
  var setVar = function (el, k, v) { el.style.setProperty(k, (+v).toFixed(4)); };

  /* ---------------- 1. animations à l'entrée (une fois) ---------------- */
  var timers = new Map();
  function clearTimers(el) { (timers.get(el) || []).forEach(function (id) { clearTimeout(id); cancelAnimationFrame(id); }); timers.set(el, []); }
  function later(el, fn, ms) { var id = setTimeout(fn, ms); (timers.get(el) || timers.set(el, []).get(el)).push(id); }
  function setIndex(el, sel) { el.querySelectorAll(sel).forEach(function (n, i) { n.style.setProperty('--i', i); }); }

  function splitTitle(el) {
    if (el.getAttribute('data-am-split') === '1') return;
    var parts = el.innerHTML.split(/<br\s*\/?>/i), k = 0, out = [];
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    parts.forEach(function (part) {
      var tmp = document.createElement('div'); tmp.innerHTML = part;
      var words = [];
      tmp.childNodes.forEach(function (n) {
        var cls = n.nodeType === 1 ? n.className : '';
        (n.textContent || '').split(/\s+/).filter(Boolean).forEach(function (w) {
          words.push('<span class="am-w" aria-hidden="true" style="--i:' + (k++) + '"><span' + (cls ? ' class="' + cls + '"' : '') + '>' + w.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</span></span>');
        });
      });
      out.push(words.join(' '));
    });
    el.innerHTML = out.join('<br>'); el.setAttribute('data-am-split', '1');
  }

  function prepare(el) {
    var kind = el.getAttribute('data-am');
    if (kind === 'title') splitTitle(el);
    if (kind === 'bento') setIndex(el, '.am-card');
    if (kind === 'agency') setIndex(el, '.am-contacts li');
    if (kind === 'stats') setIndex(el, '.am-stat');
    if (kind === 'checks') setIndex(el, '.am-check li');
    if (kind === 'agency' && !reduce) el.querySelectorAll('[data-type]').forEach(function (t) { t.textContent = ' '; });
    if (kind === 'stats' && !reduce) el.querySelectorAll('[data-count]').forEach(function (n) { n.textContent = '0'; });
  }

  function typeLines(el) {
    var t = 650;
    el.querySelectorAll('[data-type]').forEach(function (line, k, all) {
      var txt = line.getAttribute('data-type'), speed = k === 0 ? 55 : 28;
      later(el, function () {
        var n = 0; line.classList.add('is-typing');
        (function step() { n++; line.textContent = txt.slice(0, n); if (n < txt.length) later(el, step, speed); else if (k < all.length - 1) later(el, function () { line.classList.remove('is-typing'); }, 120); })();
      }, t);
      t += txt.length * speed + 160;
    });
  }
  function countUp(el) {
    el.querySelectorAll('[data-count]').forEach(function (n, i) {
      var to = +n.getAttribute('data-count'), dur = 1400, t0 = null;
      later(el, function () {
        function f(ts) { if (t0 === null) t0 = ts; var u = clamp((ts - t0) / dur); n.textContent = Math.round(eOut(u) * to); if (u < 1) timers.get(el).push(requestAnimationFrame(f)); }
        timers.get(el).push(requestAnimationFrame(f));
      }, 200 + i * 120);
    });
  }
  function runShip(el) {
    var path = el.querySelector('.am-route__line'), ship = el.querySelector('.am-route__ship');
    if (!path || !ship || !path.getTotalLength) return;
    var L = path.getTotalLength(), dur = 2300, t0 = null;
    later(el, function () {
      ship.style.opacity = 1;
      function frame(ts) {
        if (t0 === null) t0 = ts;
        var u = clamp((ts - t0) / dur), p = path.getPointAtLength(eInOut(u) * L);
        ship.setAttribute('transform', 'translate(' + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + ')');
        if (u < 1) timers.get(el).push(requestAnimationFrame(frame)); else { ship.style.transition = 'opacity .4s'; ship.style.opacity = 0; }
      }
      timers.get(el).push(requestAnimationFrame(frame));
    }, 550);
  }
  // jauge 60/40 de la carte « bento » : 0 → 60 puis → 100
  function runGauge(el) {
    var num = el.querySelector('.am-gauge__num'), cap = el.querySelector('.am-gauge__cap'), arcA = el.querySelector('.am-gauge__a'), arcB = el.querySelector('.am-gauge__b');
    if (arcA) arcA.setAttribute('stroke-dashoffset', '60'); if (arcB) arcB.setAttribute('stroke-dashoffset', '40');
    if (!num) return;
    // légendes traduites : data-caps="À la commande|À l’arrivée|Paiement en 2 fois"
    var caps = (el.getAttribute('data-caps') || 'À la commande|À l’arrivée de la voiture|Paiement en 2 fois').split('|');
    var steps = [[0, 60, 1100, caps[0]], [60, 100, 900, caps[1]]], k = 0;
    function run() {
      var s = steps[k], t0 = null; if (cap) cap.textContent = s[3];
      el.setAttribute('data-phase', k + 1);
      function f(ts) {
        if (t0 === null) t0 = ts;
        var u = eInOut(clamp((ts - t0) / s[2])), v = s[0] + (s[1] - s[0]) * u;
        num.textContent = Math.round(k === 0 ? v : v - 60);
        setVar(el, '--g', v / 100);
        if (arcA) arcA.setAttribute('stroke-dashoffset', (60 - Math.min(v, 60)).toFixed(2));
        if (arcB) arcB.setAttribute('stroke-dashoffset', (40 - Math.max(0, v - 60)).toFixed(2));
        if (u < 1) timers.get(el).push(requestAnimationFrame(f));
        else if (++k < steps.length) later(el, run, 700);
        else later(el, function () { num.textContent = '60/40'; el.setAttribute('data-phase', 3); if (cap) cap.textContent = caps[2]; }, 900);
      }
      timers.get(el).push(requestAnimationFrame(f));
    }
    later(el, run, 400);
  }
  function chat(el) {
    el.querySelectorAll('.am-chat__msg').forEach(function (m, i) { later(el, function () { m.classList.add('is-on'); }, 500 + i * 1300); });
  }

  function play(el) {
    clearTimers(el);
    el.classList.add('is-in');
    if (reduce) return;
    var kind = el.getAttribute('data-am');
    if (kind === 'route') runShip(el);
    if (kind === 'agency') typeLines(el);
    if (kind === 'stats') countUp(el);
    if (kind === 'gauge') runGauge(el);
    if (kind === 'chat') chat(el);
  }
  function replay(el) {
    clearTimers(el); el.classList.remove('is-in'); el.removeAttribute('data-phase');
    var ship = el.querySelector('.am-route__ship'); if (ship) { ship.style.transition = ''; ship.style.opacity = ''; }
    el.querySelectorAll('.is-on').forEach(function (n) { n.classList.remove('is-on'); });
    void el.offsetWidth; prepare(el); requestAnimationFrame(function () { play(el); });
  }
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); play(e.target); } });
  }, { threshold: 0.22, rootMargin: '0px 0px -6% 0px' }) : null;

  /* ---------------- 2. animations pilotées par le défilement ---------------- */
  var scrollers = [];
  var lastY = window.scrollY, vel = 0, drift = 0, lastT = performance.now();

  // progression d'une section épinglée (hauteur > écran, contenu en position: sticky)
  function pinP(el) { var r = el.getBoundingClientRect(); return clamp(-r.top / Math.max(1, r.height - vh())); }
  // progression d'un bloc qui traverse l'écran : 0 quand il apparaît en bas, 1 quand il sort en haut
  function viewP(el) { var r = el.getBoundingClientRect(); return clamp((vh() - r.top) / (vh() + r.height)); }
  function onScreen(el) { var r = el.getBoundingClientRect(); return r.bottom > -200 && r.top < vh() + 200; }

  var H = {
    hero: function (el) { var p = clamp(-el.getBoundingClientRect().top / vh()); setVar(el, '--p', p); },
    bands: function (el) {
      el.querySelectorAll('.am-band__track').forEach(function (t, i) {
        var w = t.scrollWidth / 2 || 1, dir = i % 2 ? 1 : -1;
        var x = ((window.scrollY * .55 + drift) % w + w) % w;
        t.style.transform = 'translate3d(' + (dir < 0 ? -x : x - w).toFixed(1) + 'px,0,0)';
      });
    },
    drive: function (el) {
      var p = pinP(el);
      setVar(el, '--p', p);
      setVar(el, '--car', eOut(seg(p, 0, .42)));
      setVar(el, '--txt', seg(p, .1, .45));
      setVar(el, '--sweep', eInOut(seg(p, .48, .72)));
      setVar(el, '--chips', seg(p, .55, .8));
      setVar(el, '--speed', clamp(Math.abs(vel) / 40));
    },
    pay: function (el) {
      var p = pinP(el);
      var a = eInOut(seg(p, .06, .26)), t = eInOut(seg(p, .3, .74)), b = eInOut(seg(p, .78, .93));
      setVar(el, '--a', a); setVar(el, '--t', t); setVar(el, '--b', b);
      var paid = Math.round(60 * a + 40 * b);
      var num = el.querySelector('[data-paid]'); if (num && num.textContent !== String(paid)) num.textContent = paid;
      var phase = p < .06 ? 0 : p < .28 ? 1 : p < .5 ? 2 : p < .76 ? 3 : p < .95 ? 4 : 5;
      if (el.getAttribute('data-phase') !== String(phase)) {
        el.setAttribute('data-phase', phase);
        el.querySelectorAll('[data-s]').forEach(function (n) { n.hidden = +n.getAttribute('data-s') !== phase; });
      }
    },
    story: function (el) {
      var p = pinP(el), n = el.querySelectorAll('.am-story__step').length || 1;
      var idx = Math.min(n - 1, Math.floor(p * n * .999)), local = p * n - idx;
      setVar(el, '--p', p); setVar(el, '--local', local);
      if (el.getAttribute('data-step') !== String(idx + 1)) {
        el.setAttribute('data-step', idx + 1);
        el.querySelectorAll('.am-story__step').forEach(function (s, i) { s.classList.toggle('is-active', i === idx); s.classList.toggle('is-prev', i < idx); s.classList.toggle('is-next', i > idx); });
        var big = el.querySelector('.am-story__big'); if (big) big.textContent = '0' + (idx + 1);
        var st = idx + 1;
        el.querySelectorAll('[data-k]').forEach(function (n) { var k = +n.getAttribute('data-k'); n.classList.toggle('is-done', k < st || (k === st && k === n.parentNode.children.length && local > .5)); n.classList.toggle('is-active', k === st); });
        el.querySelectorAll('.am-story__dots i').forEach(function (d, i) { d.classList.toggle('is-done', i <= idx); });
        el.querySelectorAll('[data-on]').forEach(function (n) { n.classList.toggle('is-on', st >= +n.getAttribute('data-on')); });
        el.querySelectorAll('[data-s]').forEach(function (n) { n.hidden = +n.getAttribute('data-s') !== st; });
      }
    },
    panels: function (el) {
      if (el.__manual) return;
      var p = viewP(el), n = el.querySelectorAll('.am-panel').length;
      var idx = Math.min(n - 1, Math.max(0, Math.floor(seg(p, .22, .62) * n * .999)));
      setActivePanel(el, idx);
    },
    parallax: function (el) { var s = parseFloat(el.getAttribute('data-speed') || '.15'); el.style.transform = 'translate3d(0,' + ((viewP(el) - .5) * s * -400).toFixed(1) + 'px,0)'; },
    cta: function (el) { setVar(el, '--p', viewP(el)); },
    footer: function (el) {
      var r = el.getBoundingClientRect(), p = clamp((vh() - r.top) / Math.min(r.height, vh()));
      setVar(el, '--p', p); setVar(el, '--draw', eInOut(seg(p, .05, .95)));
    },
    progress: function (el) { var h = document.documentElement.scrollHeight - vh(); setVar(el, '--p', h > 0 ? window.scrollY / h : 0); },
  };
  function setActivePanel(el, idx) {
    el.querySelectorAll('.am-panel').forEach(function (pn, i) { pn.classList.toggle('is-open', i === idx); pn.setAttribute('aria-expanded', i === idx ? 'true' : 'false'); });
  }

  // en-tête : se compacte au défilement, se cache en descendant, revient en remontant
  function header() {
    var hd = document.querySelector('.am-header'); if (!hd) return;
    var y = window.scrollY;
    hd.classList.toggle('is-scrolled', y > 40);
    if (!reduce) hd.classList.toggle('is-hidden', y > 400 && vel > 2 && !hd.contains(document.activeElement));
  }

  var ticking = false;
  function frame() {
    ticking = false;
    var now = performance.now(), y = window.scrollY, dt = Math.max(1, now - lastT);
    vel = vel * .8 + ((y - lastY) / dt * 16) * .2; lastY = y; lastT = now;
    header();
    if (reduce) return;
    scrollers.forEach(function (s) { if (s.kind === 'progress' || s.kind === 'bands' || onScreen(s.el)) { try { H[s.kind] && H[s.kind](s.el); } catch (e) {} } });
  }
  function request() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  // dérive lente des bandes même sans défilement
  function idle() { drift += .45 + Math.abs(vel) * .6; vel *= .95; scrollers.forEach(function (s) { if (s.kind === 'bands' && onScreen(s.el)) H.bands(s.el); }); requestAnimationFrame(idle); }

  /* ---------------- enregistrement ---------------- */
  var seen = new WeakSet();
  function register(el) {
    if (seen.has(el)) return; seen.add(el);
    if (el.hasAttribute('data-am')) {
      timers.set(el, []); prepare(el);
      if (!el.closest('.am-loader')) { if (io) io.observe(el); else play(el); }
    }
    if (el.hasAttribute('data-scroll')) {
      el.getAttribute('data-scroll').split(/\s+/).forEach(function (kind) { scrollers.push({ el: el, kind: kind }); });
      if (el.getAttribute('data-scroll') === 'panels') {
        el.querySelectorAll('.am-panel').forEach(function (pn, i) {
          var go = function () { el.__manual = true; setActivePanel(el, i); };
          pn.addEventListener('mouseenter', go); pn.addEventListener('click', go); pn.addEventListener('focusin', go);
        });
        setActivePanel(el, 0);
      }
      if (el.getAttribute('data-scroll') === 'story') H.story(el);
    }
  }
  function scan(scope) { (scope || document).querySelectorAll('[data-am],[data-scroll]').forEach(register); request(); }

  function loader() {
    var ld = document.querySelector('.am-loader'); if (!ld) return;
    var once = ld.getAttribute('data-am-once') !== 'false', key = 'am-loader-seen';
    try { if (once && sessionStorage.getItem(key)) { ld.remove(); return; } } catch (e) {}
    var logo = ld.querySelector('[data-am]'); if (logo) { register(logo); play(logo); }
    var min = parseInt(ld.getAttribute('data-am-min') || '2300', 10), start = Date.now();
    function done() {
      setTimeout(function () { ld.classList.add('is-done'); try { sessionStorage.setItem(key, '1'); } catch (e) {} setTimeout(function () { ld.remove(); }, 700); }, reduce ? 0 : Math.max(0, min - (Date.now() - start)));
    }
    if (document.readyState === 'complete') done(); else window.addEventListener('load', done);
  }

  function boot() {
    loader(); scan();
    if (reduce) {
      document.querySelectorAll('[data-paid]').forEach(function (n) { n.textContent = '100'; });
      document.querySelectorAll('.am-pay [data-s]').forEach(function (n) { n.hidden = n.getAttribute('data-s') !== '5'; });
      document.querySelectorAll('.am-story [data-k]').forEach(function (n) { n.classList.add('is-done'); });
      document.querySelectorAll('.am-story [data-on]').forEach(function (n) { n.classList.add('is-on'); });
    }
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    if (!reduce) requestAnimationFrame(idle);
    if ('MutationObserver' in window) new MutationObserver(function (ms) {
      ms.forEach(function (m) { m.addedNodes.forEach(function (n) { if (n.nodeType === 1) { if (n.matches('[data-am],[data-scroll]')) register(n); scan(n); } }); });
    }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();

  window.AMMotion = { scan: scan, play: play, replay: replay, refresh: request };
})();
