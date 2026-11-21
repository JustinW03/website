/* JustinZocktCommunity – Menü, Kopieren, Live-Status, Suche, Ranglisten (mit Unterkategorien), Server-Infos (daten/info.json),
   Adventskalender, Animationen. Keine Bibliotheken, keine Cookies, kein Speichern im Browser. */
(function () {
  'use strict';
  var doc = document;
  var root = doc.documentElement;
  root.classList.remove('no-js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
  var $ = function (s, el) { return (el || doc).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || doc).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var num = function (n) { return Number(n).toLocaleString('de-DE'); };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var afk = function (sec) { sec = Math.max(0, Math.round(Number(sec) || 0)); var m = Math.floor(sec / 60), s = sec % 60; return s ? m + ':' + pad(s) + ' Min.' : m + ' Min.'; };
  var get = function (obj, path) { return String(path).split('.').reduce(function (o, k) { return o == null ? undefined : o[k]; }, obj); };
  // JSON von der eigenen Website laden: erst frisch (?t= gegen alte Zwischenspeicher), bei Fehler normal noch einmal.
  var fetchJson = function (url, opts) {
    var ctrl = ('AbortController' in window) ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 10000);
    if (ctrl) opts.signal = ctrl.signal;
    return fetch(url, opts).then(function (r) { clearTimeout(timer); if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (d) { if (!d || typeof d !== 'object') throw new Error('kein JSON'); return d; }, function (e) { clearTimeout(timer); throw e; });
  };
  var loadJson = function (url) {
    if (!window.fetch) return Promise.reject(new Error('kein fetch'));
    return fetchJson(url + '?t=' + Date.now(), { cache: 'no-store' }).catch(function () { return fetchJson(url, {}); });
  };
  // "vor 3 Minuten", "vor 2 Stunden", "gerade eben"
  var ago = function (ms) {
    var m = Math.round((Date.now() - Number(ms)) / 60000);
    if (m < 1) return 'gerade eben';
    if (m < 60) return 'vor ' + m + (m === 1 ? ' Minute' : ' Minuten');
    var h = Math.round(m / 60);
    if (h < 48) return 'vor ' + h + (h === 1 ? ' Stunde' : ' Stunden');
    var t = Math.round(h / 24);
    return 'vor ' + t + ' Tagen';
  };

  // Sekunden-Takt für alle Countdowns
  var tickers = [];
  setInterval(function () { tickers.forEach(function (f) { try { f(); } catch (e) { /* egal */ } }); }, 1000);

  // ---------- Mobiles Menü + "Mehr" ----------
  var toggle = $('.nav-toggle');
  var nav = doc.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  // Untermenüs ("Spielen", "Hilfe"): immer nur eins offen; Klick daneben oder Escape schließt.
  var subs = $$('.has-sub').map(function (li) { return { li: li, btn: $('.sub-toggle', li) }; }).filter(function (s) { return s.btn; });
  var setSub = function (s, open) { s.li.classList.toggle('open', open); s.btn.setAttribute('aria-expanded', open ? 'true' : 'false'); };
  subs.forEach(function (s) {
    if ($('a[aria-current="page"]', s.li)) s.btn.setAttribute('aria-current', 'page');
    s.btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !s.li.classList.contains('open');
      subs.forEach(function (o) { if (o !== s) setSub(o, false); });
      setSub(s, open);
    });
    // Tastatur: Pfeil runter öffnet und springt zum ersten Eintrag
    s.btn.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowDown') return;
      e.preventDefault();
      subs.forEach(function (o) { if (o !== s) setSub(o, false); });
      setSub(s, true);
      var first = $('.sub a', s.li); if (first) first.focus();
    });
    // Mit Tab aus dem Untermenü heraus -> schließen
    s.li.addEventListener('focusout', function (e) { if (e.relatedTarget && !s.li.contains(e.relatedTarget)) setSub(s, false); });
  });
  if (subs.length) doc.addEventListener('click', function (e) { subs.forEach(function (s) { if (!s.li.contains(e.target)) setSub(s, false); }); });
  doc.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var openSub = subs.filter(function (s) { return s.li.classList.contains('open') || s.li.contains(doc.activeElement); })[0];
    if (openSub) { setSub(openSub, false); openSub.btn.focus(); return; }
    if (nav && nav.classList.contains('open')) { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.focus(); }
  });
  // Maus über ein anderes Untermenü -> das offene schließen (sonst wären zwei gleichzeitig sichtbar)
  subs.forEach(function (s) { s.li.addEventListener('mouseenter', function () { subs.forEach(function (o) { if (o !== s) setSub(o, false); }); }); });

  // ---------- Kopfzeile beim Scrollen + Fortschrittsbalken ----------
  var headerEl = $('.site-header');
  var bar = $('.progress');
  var scene = $('.scene');
  var ticking = false;
  var pointer = { x: 0, y: 0 };
  function onFrame() {
    ticking = false;
    var y = window.scrollY || window.pageYOffset;
    if (headerEl) headerEl.classList.toggle('scrolled', y > 8);
    if (bar) {
      var h = doc.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, y / h) : 0) + ')';
    }
    if (scene && !reduce) {
      scene.style.transform = 'translate3d(' + (pointer.x * 18) + 'px,' + (pointer.y * 14 + y * 0.12) + 'px,0) rotateY(' + (pointer.x * 10) + 'deg) rotateX(' + (-pointer.y * 8) + 'deg)';
    }
  }
  var requestFrame = function () { if (!ticking) { ticking = true; window.requestAnimationFrame(onFrame); } };
  window.addEventListener('scroll', requestFrame, { passive: true });
  window.addEventListener('resize', requestFrame);
  onFrame();

  // ---------- Spotlight auf Karten + Parallax ----------
  if (finePointer && !reduce) {
    doc.addEventListener('pointermove', function (e) {
      var card = e.target.closest && e.target.closest('.card, .tier, .game');
      if (card) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      }
      if (scene) {
        pointer.x = e.clientX / window.innerWidth - 0.5;
        pointer.y = e.clientY / window.innerHeight - 0.5;
        requestFrame();
      }
    }, { passive: true });
  }

  // ---------- Animierte Zahlen ----------
  function animateTo(el, to) {
    var from = Number(el.getAttribute('data-shown')) || 0;
    el.setAttribute('data-shown', String(to));
    if (reduce || from === to) { el.textContent = num(to); return; }
    var t0 = null, dur = 1300;
    var step = function (t) {
      if (t0 === null) t0 = t;
      var p = Math.min(1, (t - t0) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = num(Math.round(from + (to - from) * e));
      if (p < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }
  function setCount(el, value) {
    el.setAttribute('data-count', String(value));
    if (el.getAttribute('data-counted') === '1') animateTo(el, Number(value));
    else el.textContent = num(value);
  }

  // ---------- Scroll-Reveal ----------
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      el.classList.add('in');
      if (el.hasAttribute('data-count')) { el.setAttribute('data-counted', '1'); el.setAttribute('data-shown', '0'); animateTo(el, Number(el.getAttribute('data-count'))); }
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }) : null;
  function revealAll(scope) {
    if (!io || reduce) return;
    var sel = '.card, .steps > li, .table-wrap, .callout, details, .rule-section, .game, .tier, .stat, .portal, .social, .kv > div, .toc, .cmd-group, .title-card';
    $$(sel, scope).forEach(function (el) {
      if (el.classList.contains('reveal') || el.closest('.reveal:not(.in)')) return;
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92) { if (el.classList.contains('stat')) el.classList.add('in'); return; }
      var parent = el.parentElement;
      var idx = parent ? Array.prototype.indexOf.call(parent.children, el) : 0;
      el.style.setProperty('--d', ((idx % 6) * 55) + 'ms');
      el.classList.add('reveal');
      io.observe(el);
    });
  }
  revealAll(doc);
  $$('[data-count]').forEach(function (el) {
    if (io && !reduce) io.observe(el); else el.setAttribute('data-counted', '1');
  });

  // ---------- Kopieren ----------
  function fallbackCopy(text) {
    var ta = doc.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', '');
    ta.style.position = 'fixed'; ta.style.opacity = '0';
    doc.body.appendChild(ta); ta.select();
    var ok = false;
    try { ok = doc.execCommand('copy'); } catch (e) { ok = false; }
    doc.body.removeChild(ta);
    return ok;
  }
  $$('[data-copy]').forEach(function (btn) {
    var original = btn.textContent;
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var done = function (ok) {
        btn.textContent = ok ? '✓ Kopiert!' : 'Bitte von Hand kopieren';
        btn.classList.toggle('copied', ok);
        var live = doc.getElementById('copy-status');
        if (live) live.textContent = ok ? 'Adresse ' + text + ' wurde kopiert.' : 'Kopieren nicht möglich.';
        if (ok) sparkle(btn, 14);
        setTimeout(function () { btn.textContent = original; btn.classList.remove('copied'); }, 2200);
      };
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(fallbackCopy(text)); });
      else done(fallbackCopy(text));
    });
  });

  // kleine Funken (z. B. beim Kopieren oder Türchen öffnen)
  function sparkle(el, n) {
    if (reduce || !el) return;
    var host = el.closest('.door-wrap') || el.parentElement;
    if (!host) return;
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    var colors = ['#ffd76a', '#ffffff', getComputedStyle(root).getPropertyValue('--red').trim() || '#ff1f3d', '#3ddc84'];
    var hr = host.getBoundingClientRect(), er = el.getBoundingClientRect();
    for (var i = 0; i < n; i++) {
      var s = doc.createElement('span');
      s.className = 'sparkle';
      s.setAttribute('aria-hidden', 'true');
      s.style.left = (er.left - hr.left + er.width / 2) + 'px';
      s.style.top = (er.top - hr.top + er.height / 2) + 'px';
      s.style.background = colors[i % colors.length];
      var a = Math.random() * Math.PI * 2, d = 40 + Math.random() * 70;
      s.style.setProperty('--x', Math.cos(a) * d + 'px');
      s.style.setProperty('--y', Math.sin(a) * d + 'px');
      host.appendChild(s);
      setTimeout(function (x) { return function () { if (x.parentNode) x.parentNode.removeChild(x); }; }(s), 1000);
    }
  }

  // ---------- Live-Status (api.mcsrvstat.us) ----------
  var statusBox = doc.getElementById('server-status');
  if (statusBox) {
    var host = statusBox.getAttribute('data-host') || 'play.justinzockt.de';
    var dot = $('.dot', statusBox), line = $('.status-text', statusBox), meta = $('.status-meta', statusBox), list = $('.player-list', statusBox);
    var setText = function (el, t) { if (el) el.textContent = t; };
    var setOnline = function (v) { $$('[data-online]').forEach(function (el) { if (typeof v === 'number') { el.setAttribute('data-count', String(v)); el.setAttribute('data-counted', '1'); animateTo(el, v); } else el.textContent = v; }); };
    var fail = function () {
      dot.className = 'dot';
      setText(line, 'Status gerade nicht abrufbar');
      setText(meta, 'Die Status-Abfrage hat nicht geklappt. Schau im Discord vorbei oder versuche es später nochmal.');
      setOnline('?');
    };
    var controller = ('AbortController' in window) ? new AbortController() : null;
    var timer = setTimeout(function () { if (controller) controller.abort(); }, 8000);
    fetch('https://api.mcsrvstat.us/3/' + encodeURIComponent(host), controller ? { signal: controller.signal } : {})
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (d) {
        clearTimeout(timer);
        if (!d || typeof d.online !== 'boolean') { fail(); return; }
        if (!d.online) {
          dot.className = 'dot off';
          setText(line, 'Server ist gerade offline');
          setText(meta, 'Vielleicht ein Neustart oder Wartung – Infos gibt es im Discord.');
          setOnline(0);
          return;
        }
        dot.className = 'dot on';
        var p = d.players || {};
        var on = typeof p.online === 'number' ? p.online : 0;
        setText(line, 'Online – ' + on + (typeof p.max === 'number' ? ' / ' + p.max : '') + ' Spieler');
        setText(meta, d.version ? 'Version: ' + String(d.version).replace(/§./g, '') : 'Der Server ist erreichbar.');
        setOnline(on);
        if (list) {
          list.innerHTML = '';
          var names = Array.isArray(p.list) ? p.list : [];
          names.slice(0, 60).forEach(function (pl, i) {
            var li = doc.createElement('li');
            li.textContent = typeof pl === 'string' ? pl : (pl && pl.name) || '?';
            li.style.animationDelay = (i * 40) + 'ms';
            list.appendChild(li);
          });
          if (names.length === 0 && on > 0) { var li = doc.createElement('li'); li.textContent = 'Namen werden vom Server nicht angezeigt'; list.appendChild(li); }
          list.hidden = list.children.length === 0;
        }
      })
      .catch(function () { clearTimeout(timer); fail(); });
  }

  // ---------- Suche (Befehle + Mods) ----------
  var norm = function (s) { return s.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/[’'`]/g, ''); };
  function setupSearch(inputId, rowSel, groupSel, countId, noneId) {
    var input = doc.getElementById(inputId);
    if (!input) return;
    var rows = $$(rowSel), groups = groupSel ? $$(groupSel) : [];
    var count = doc.getElementById(countId), none = doc.getElementById(noneId);
    rows.forEach(function (r) { r.setAttribute('data-text', norm(r.textContent + ' ' + (r.getAttribute('data-keys') || ''))); });
    var run = function () {
      var words = norm(input.value.trim()).split(/\s+/).filter(Boolean);
      var shown = 0;
      rows.forEach(function (r) {
        var t = r.getAttribute('data-text');
        var hit = words.every(function (w) { return t.indexOf(w) !== -1; });
        r.hidden = !hit;
        if (hit) shown++;
      });
      groups.forEach(function (g) { g.hidden = !g.querySelector(rowSel.split(' ').pop() + ':not([hidden])'); });
      if (count) count.textContent = shown + ' von ' + rows.length;
      if (none) none.style.display = shown ? 'none' : 'block';
    };
    input.addEventListener('input', run);
    var q = new URLSearchParams(location.search).get('q');
    if (q) input.value = q;
    run();
  }
  setupSearch('cmd-search', '.cmd', '.cmd-group', 'cmd-count', 'no-results');
  setupSearch('mod-search', '.mod-list li', '.mod-card', 'mod-count', 'mod-none');

  // ---------- Minigames: Liste + Filter ----------
  var ICONS = [['4 gewinnt', '🔴'], ['vier', '🔴'], ['tic', '❌'], ['schiffe', '🚢'], ['memory', '🧠'], ['mensch', '🎲'], ['dame', '⚪'], ['schach', '♟️'], ['barricade', '🧱'], ['kniffel', '🎲'], ['galgen', '🪢'], ['schere', '✂️'], ['blackjack', '🃏'], ['mines', '💣'], ['wordle', '🔤'], ['2048', '🔢'], ['koffer', '🧳'], ['spleef', '❄️'], ['tnt', '🧨'], ['parkour', '🏃'], ['knockback', '🥊'], ['schneeball', '☃️'], ['bogen', '🏹'], ['mlg', '💧'], ['crafting', '🛠️'], ['eisboot', '🛶']];
  var iconFor = function (name) { var n = String(name).toLowerCase(); for (var i = 0; i < ICONS.length; i++) if (n.indexOf(ICONS[i][0]) !== -1) return ICONS[i][1]; return '🎮'; };
  var mgList = doc.getElementById('mg-list');
  var mgFilter = 'alle';
  function applyMgFilter() {
    if (!mgList) return;
    $$('.game', mgList).forEach(function (g) { g.classList.toggle('gone', mgFilter !== 'alle' && g.getAttribute('data-kind') !== mgFilter); });
  }
  $$('.mg-filters .chip').forEach(function (b) {
    b.addEventListener('click', function () {
      mgFilter = b.getAttribute('data-f');
      $$('.mg-filters .chip').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      applyMgFilter();
    });
  });
  function renderGames(games) {
    if (!mgList) return;
    mgList.innerHTML = games.map(function (g) {
      var players = g.min === g.max ? String(g.min) : g.min + '–' + g.max;
      return '<li class="game" data-kind="' + (g.action ? 'action' : 'tisch') + '"><span class="g-ico" aria-hidden="true">' + iconFor(g.name + ' ' + g.id) + '</span><h3>' + esc(g.name) + '</h3><p>' + esc(g.info || '') + '</p><div class="g-meta"><span class="badge gray">👥 ' + esc(players) + '</span><span class="badge' + (g.action ? '' : ' green') + '">' + (g.action ? 'Arena' : 'Tisch') + '</span></div></li>';
    }).join('');
    applyMgFilter();
    revealAll(mgList);
  }

  // ---------- Welt-Status (Portale) ----------
  function renderPortal(el, d) {
    var state = $('.portal-state', el), text = $('.portal-text', el), cd = $('.countdown', el);
    var name = el.getAttribute('data-portal') === 'end' ? 'Das End' : 'Der Nether';
    var set = function (cls, label, t) { state.className = 'portal-state ' + cls; state.textContent = label; text.textContent = t; };
    if (!d) return;
    if (d.offen) { set('open', 'Offen', name + ' ist offen – viel Spaß und pass auf dich auf!'); cd.hidden = true; return; }
    var at = Number(d.oeffnet_ms) || 0;
    if (at > Date.now()) {
      var when = new Date(at).toLocaleString('de-DE', { timeZone: 'Europe/Berlin', weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
      set('soon', 'Bald', name + ' öffnet am ' + when + ' Uhr.');
      cd.hidden = false;
      var draw = function () {
        var s = Math.max(0, Math.floor((at - Date.now()) / 1000));
        if (s === 0) { set('open', 'Jetzt', name + ' öffnet genau jetzt!'); cd.hidden = true; return; }
        cd.innerHTML = '<span>' + Math.floor(s / 86400) + '<small>Tage</small></span><span>' + pad(Math.floor(s / 3600) % 24) + '<small>Std.</small></span><span>' + pad(Math.floor(s / 60) % 60) + '<small>Min.</small></span><span>' + pad(s % 60) + '<small>Sek.</small></span>';
        cd.setAttribute('aria-label', 'Noch ' + Math.floor(s / 86400) + ' Tage, ' + (Math.floor(s / 3600) % 24) + ' Stunden, ' + (Math.floor(s / 60) % 60) + ' Minuten');
      };
      draw(); tickers.push(draw);
    } else if (at) {
      set('soon', 'In Kürze', name + ' wird in Kürze geöffnet.'); cd.hidden = true;
    } else {
      set('closed', 'Gesperrt', name + ' ist noch gesperrt. Den Termin gibt es im Discord.'); cd.hidden = true;
    }
  }

  // ---------- Themafarbe ----------
  function hexRgb(h) { var n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  function setTheme(main, dark) {
    if (!/^#[0-9a-f]{6}$/i.test(main || '')) return;
    var m = hexRgb(main);
    var dk = /^#[0-9a-f]{6}$/i.test(dark || '') ? hexRgb(dark) : m.map(function (v) { return Math.round(v * 0.7); });
    var light = m.map(function (v) { return Math.round(v + (255 - v) * 0.4); });
    var s = root.style;
    s.setProperty('--red', main);
    s.setProperty('--red-rgb', m.join(' '));
    s.setProperty('--red-dark', 'rgb(' + dk.join(',') + ')');
    s.setProperty('--red-dark-rgb', dk.join(' '));
    s.setProperty('--red-text', 'rgb(' + light.join(',') + ')');
    emberColor = m;
  }

  // ---------- Server-Infos (daten/info.json) ----------
  var adventFromServer = null;
  var dauer = function (sec) { sec = Math.max(0, Math.round(Number(sec) || 0)); if (sec >= 60 && sec % 60 === 0) { var m = sec / 60; return m + (m === 1 ? ' Minute' : ' Minuten'); } return sec + (sec === 1 ? ' Sekunde' : ' Sekunden'); };
  var joinDe = function (a) { return a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' und ' + a[a.length - 1]; };
  function applyInfo(d) {
    if (!d || typeof d !== 'object') return;
    if (d.theme && d.theme.haupt) setTheme(d.theme.haupt, d.theme.dunkel);
    if (!d.stand) return; // Platzhalter-Datei: HTML-Fallbacks behalten
    if (d.advent && adventFromServer) adventFromServer(d.advent);
    $$('[data-info-list]').forEach(function (el) { var v = get(d, el.getAttribute('data-info-list')); if (Array.isArray(v) && v.length) el.textContent = joinDe(v.map(function (x) { return x && x.name ? x.name : String(x); })); });
    $$('[data-info]').forEach(function (el) {
      var v = get(d, el.getAttribute('data-info'));
      if (v === undefined || v === null || v === '') return;
      var f = el.getAttribute('data-fmt') || 'num';
      el.textContent = f === 'afk' ? afk(v) : f === 'dauer' ? dauer(v) : f === 'prozent' ? num(v) + ' %' : (f === 'num' && typeof v === 'number') ? num(v) : String(v);
    });
    $$('[data-info-count]').forEach(function (el) { var v = get(d, el.getAttribute('data-info-count')); if (typeof v === 'number') setCount(el, v); });
    if (Array.isArray(d.minigames) && d.minigames.length) {
      $$('[data-info-len="minigames"]').forEach(function (el) { if (el.hasAttribute('data-count')) setCount(el, d.minigames.length); else el.textContent = d.minigames.length; });
      renderGames(d.minigames);
    }
    if (d.dimensionen) $$('[data-portal]').forEach(function (el) { renderPortal(el, d.dimensionen[el.getAttribute('data-portal')]); });
    // Wartungsmodus und Vote-Link (Link nur, wenn der Server einen https-Link kennt)
    $$('[data-wartung]').forEach(function (el) { el.hidden = !(d.wartung && d.wartung.aktiv); });
    var vl = d.vote && Array.isArray(d.vote.links) && d.vote.links[0] && d.vote.links[0].url;
    if (vl && /^https:\/\//.test(vl)) $$('[data-vote-link]').forEach(function (a) { a.href = vl; });
  }
  if ($('[data-info], [data-info-count], [data-info-len], [data-info-list], [data-portal], [data-season], [data-wartung], [data-vote-link], #mg-list')) {
    loadJson('daten/info.json').then(applyInfo).catch(function () { /* Fallback im HTML bleibt */ });
  }

  // ---------- Ranglisten ----------
  var rankOut = doc.getElementById('rank-out');
  if (rankOut) {
    var hours = function (s) { var h = Math.floor(s / 3600); return num(h) + ' Std. ' + Math.floor((s % 3600) / 60) + ' Min.'; };
    var medal = function (i) { return i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i + 1) + '.'; };
    var rowCls = function (i) { return ' style="--i:' + Math.min(i, 30) + '"' + (i < 3 ? ' class="top' + (i + 1) + '"' : ''); };
    var podium = function (rows, fmt) {
      if (!rows || rows.length < 3) return '';
      return '<div class="podium" aria-hidden="true">' + [0, 1, 2].map(function (i) { return '<div class="p' + (i + 1) + '"><b>' + medal(i) + '</b>' + esc(rows[i][0]) + '<span>' + fmt(rows[i][1]) + '</span></div>'; }).join('') + '</div>';
    };
    var table = function (rows, label, fmt) {
      if (!rows || !rows.length) return '<p class="muted">Noch keine Einträge.</p>';
      return podium(rows, fmt) + '<div class="table-wrap"><table class="rank-table"><thead><tr><th scope="col">Platz</th><th scope="col">Spieler</th><th scope="col">' + esc(label) + '</th></tr></thead><tbody>' +
        rows.map(function (r, i) { return '<tr' + rowCls(i) + '><td>' + medal(i) + '</td><td>' + esc(r[0]) + '</td><td>' + fmt(r[1]) + '</td></tr>'; }).join('') + '</tbody></table></div>';
    };
    var TIME_GAMES = /parkour|mines|speed|craft|eisboot|mlg|rennen/i;
    var bestFmt = function (game, id, v) {
      if (v === null || v === undefined || v === '' || v === false) return '–';
      if (typeof v === 'string') return esc(v);
      if (TIME_GAMES.test(id + ' ' + (game.name || '')) && v > 0) return (v / 1000).toFixed(2).replace('.', ',') + ' s';
      return num(v);
    };
    var gameTable = function (id, g) {
      var e = (g && g.eintraege) || [];
      if (!e.length) return '<p class="muted">Für dieses Spiel gibt es noch keine Einträge.</p>';
      var best = !!g.best;
      return '<div class="table-wrap"><table class="rank-table"><thead><tr><th scope="col">Platz</th><th scope="col">Spieler</th><th scope="col" class="num">Siege</th><th scope="col" class="num">Spiele</th><th scope="col" class="num">Punkte</th>' + (best ? '<th scope="col" class="num">Bestwert</th>' : '') + '</tr></thead><tbody>' +
        e.map(function (r, i) {
          return '<tr' + rowCls(i) + '><td>' + medal(i) + '</td><td>' + esc(r.name) + '</td><td class="num">' + num(r.siege || 0) + '</td><td class="num">' + num(r.spiele || 0) + '</td><td class="num">' + num(r.punkte || 0) + '</td>' + (best ? '<td class="num">' + (r.best_text ? esc(r.best_text) : bestFmt(g, id, r.best)) + '</td>' : '') + '</tr>';
        }).join('') + '</tbody></table></div>';
    };
    var clanTable = function (rows, label, fmt) {
      if (!rows || !rows.length) return '<p class="muted">Noch keine Clans – gründe den ersten mit <code>/clan gruenden</code>!</p>';
      return '<div class="table-wrap"><table class="rank-table"><thead><tr><th scope="col">Platz</th><th scope="col">Clan</th><th scope="col">Mitglieder</th><th scope="col">' + esc(label) + '</th></tr></thead><tbody>' +
        rows.map(function (c, i) { return '<tr' + rowCls(i) + '><td>' + medal(i) + '</td><td><strong>[' + esc(c.tag) + ']</strong> ' + esc(c.name) + '</td><td>' + num(c.mitglieder) + '</td><td>' + fmt(c) + '</td></tr>'; }).join('') +
        '</tbody></table></div>';
    };
    var standEl = doc.getElementById('rank-stand');
    loadJson('daten/ranglisten.json').then(function (d) {
      var jc = function (v) { return num(v) + ' JC'; };
      // Jede Gruppe: [Name, Inhalt, danach, Unterkategorien]
      var skillSubs = [['Gesamt', function () { return table(d.skills_gesamt, 'Gesamtlevel', num); }]];
      Object.keys(d.skills || {}).forEach(function (k) { skillSubs.push([k, function () { return table(d.skills[k], 'Level', num); }]); });
      var lists = [
        ['💰 Justin Coins', function () { return table(d.coins, 'Justin Coins', jc); }],
        ['⏱ Spielzeit', function () { return table(d.spielzeit, 'Spielzeit', hours); }],
        ['⭐ Skills', null, null, skillSubs]
      ];
      if (Array.isArray(d.erfolge)) lists.push(['🏆 Erfolge', function () { return table(d.erfolge, 'Erfolge', num) + '<p class="muted small">Gezählt werden erledigte Minecraft-Fortschritte und <a href="erfolge.html">JZC-Erfolge</a> (ohne Rezepte), aktualisiert beim Join und bei jedem neuen Erfolg.</p>'; }]);
      var clanSubs = [['Punkte', function () { return clanTable(d.clans, 'Punkte', function (c) { return num(c.punkte); }) + (d.clans && d.clans.length ? '<p class="muted small">Gegründet: ' + d.clans.map(function (c) { return '[' + esc(c.tag) + '] ' + new Date(c.gegruendet).toLocaleDateString('de-DE'); }).join(' · ') + '</p>' : ''); }]];
      if (Array.isArray(d.clans_spielzeit)) clanSubs.push(['Spielzeit', function () { return clanTable(d.clans_spielzeit, 'Spielzeit', function (c) { return hours(c.spielzeit); }); }]);
      lists.push(['🛡 Clans', null, null, clanSubs]);
      var mgSubs = [['Punkte', function () { return table(d.minigames, 'Punkte', num); }]];
      if (Array.isArray(d.minigames_siege)) mgSubs.push(['Siege', function () { return table(d.minigames_siege, 'Siege', num); }]);
      var spiele = d.minigames_spiele && typeof d.minigames_spiele === 'object' ? d.minigames_spiele : null;
      var ids = spiele ? Object.keys(spiele) : [];
      if (ids.length) {
        ids.sort(function (a, b) { return String(spiele[a].name || a).localeCompare(String(spiele[b].name || b), 'de'); });
        var picked = ids[0];
        mgSubs.push(['Je Spiel', function () {
          return '<div class="select"><label for="mg-pick"><strong>Spiel wählen:</strong></label><select id="mg-pick">' +
            ids.map(function (id) { return '<option value="' + esc(id) + '"' + (id === picked ? ' selected' : '') + '>' + esc(spiele[id].name || id) + ' (' + ((spiele[id].eintraege || []).length) + ')</option>'; }).join('') +
            '</select></div><div id="mg-out" aria-live="polite">' + gameTable(picked, spiele[picked]) + '</div>';
        }, function () {
          var sel = doc.getElementById('mg-pick');
          if (sel) sel.addEventListener('change', function () { picked = sel.value; doc.getElementById('mg-out').innerHTML = gameTable(picked, spiele[picked]); });
        }]);
      }
      lists.push(['🎮 Minigames', null, null, mgSubs]);
      if (Array.isArray(d.votes)) {
        var voteHint = '<p class="muted small">Gezählt werden belohnte Votes. <a href="index.html#voten">So votest du</a> – kleine Belohnung alle 24 Stunden.</p>';
        var voteSubs = [['Gesamt', function () { return table(d.votes, 'Votes', num) + voteHint; }]];
        if (Array.isArray(d.votes_30_tage)) voteSubs.push(['Letzte 30 Tage', function () { return table(d.votes_30_tage, 'Votes', num); }]);
        lists.push(['🗳 Votes', null, null, voteSubs]);
      }
      // Minecraft-Statistiken (nur, wenn der Server sie schon liefert)
      if (d.java && typeof d.java === 'object') {
        var J = d.java;
        var herzen = function (v) { return num(v) + ' ❤'; };
        var strecke = function (m) { return m >= 1000 ? (m / 1000).toFixed(1).replace('.', ',') + ' km' : num(m) + ' m'; };
        var javaHint = '<p class="muted small">Minecraft-Statistiken der freigeschalteten Spieler (ohne Minigame-Welt bei eigenen Zählern), aktualisiert alle paar Minuten und beim Verlassen des Servers.</p>';
        var javaSubs = [
          ['XP gesammelt', 'xp', 'XP', num], ['Nächte', 'naechte', 'Nächte durchgeschlafen', num],
          ['Abgebaut', 'abgebaut', 'Blöcke abgebaut', num], ['Platziert', 'platziert', 'Blöcke platziert', num],
          ['Schaden ausgeteilt', 'schaden_ausgeteilt', 'Herzen', herzen], ['Schaden erhalten', 'schaden_erhalten', 'Herzen', herzen],
          ['Spieler-Kills', 'spieler_kills', 'Kills', num], ['Tode durch Spieler', 'spieler_tode', 'Tode', num],
          ['Mob-Kills', 'mob_kills', 'Kills', num], ['Sprünge', 'spruenge', 'Sprünge', num],
          ['Elytra-Flug', 'elytra', 'Strecke', strecke], ['Seltene Bücher', 'buecher', 'Bücher', num],
          ['Elytras gefunden', 'elytras', 'Elytras', num], ['Coins gefunden', 'coins', 'Justin Coins', jc]
        ].filter(function (x) { return Array.isArray(J[x[1]]); }).map(function (x) {
          return [x[0], function () { return table(J[x[1]], x[2], x[3]) + javaHint; }];
        });
        if (javaSubs.length) lists.push(['☕ Java', null, null, javaSubs]);
      }
      lists.push(['💀 Tode', function () { return table(d.tode, 'Tode', num); }]);

      var tabs = doc.getElementById('rank-tabs');
      var subTabs = doc.getElementById('rank-subtabs');
      var cur = 0, curSub = {};
      var tabBtn = function (label, i, on, cls) { return '<button type="button" role="tab" class="' + cls + '" id="' + (cls === 'rank-tab' ? 'rt-' : 'rs-') + i + '" aria-controls="rank-out" aria-selected="' + on + '" tabindex="' + (on ? 0 : -1) + '" data-i="' + i + '">' + esc(label) + '</button>'; };
      tabs.innerHTML = lists.map(function (l, i) { return tabBtn(l[0], i, i === 0, 'rank-tab'); }).join('');
      var mark = function (box, i, focus) { Array.prototype.forEach.call(box.children, function (b) { var on = b.getAttribute('data-i') === String(i); b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; if (on && focus) b.focus(); }); };
      var show = function (i, focus, sub, subFocus) {
        cur = i;
        var l = lists[i];
        var item = l, title = l[0];
        if (l[3]) {
          var s = typeof sub === 'number' ? sub : (curSub[i] || 0);
          if (s >= l[3].length) s = 0;
          curSub[i] = s;
          subTabs.innerHTML = l[3].map(function (x, k) { return tabBtn(x[0], k, k === s, 'rank-tab rank-subtab'); }).join('');
          subTabs.hidden = false;
          item = l[3][s];
          title = l[0] + ' – ' + item[0];
          rankOut.setAttribute('aria-labelledby', 'rs-' + s);
          if (subFocus) mark(subTabs, s, true);
        } else {
          subTabs.hidden = true;
          subTabs.innerHTML = '';
          rankOut.setAttribute('aria-labelledby', 'rt-' + i);
        }
        rankOut.innerHTML = '<h2>' + esc(title) + '</h2>' + item[1]();
        if (item[2]) item[2]();
        mark(tabs, i, focus);
      };
      var keys = function (box, count, go) {
        box.addEventListener('keydown', function (e) {
          var at = Number((doc.activeElement && doc.activeElement.getAttribute('data-i')) || 0);
          if (e.key === 'ArrowRight') { e.preventDefault(); go((at + 1) % count(), true); }
          if (e.key === 'ArrowLeft') { e.preventDefault(); go((at - 1 + count()) % count(), true); }
        });
      };
      tabs.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) show(Number(b.getAttribute('data-i'))); });
      subTabs.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) show(cur, false, Number(b.getAttribute('data-i'))); });
      keys(tabs, function () { return lists.length; }, function (i, f) { show(i, f); });
      keys(subTabs, function () { return (lists[cur][3] || [1]).length; }, function (k, f) { show(cur, false, k, f); });
      // Direktlinks: ranglisten.html#minigames, #skills, #clans, #erfolge
      var want = 0, h = location.hash.replace('#', '');
      lists.forEach(function (l, i) { if (h && l[0].toLowerCase().indexOf(h) !== -1) want = i; });
      show(want);

      // Stand: "vor X Minuten" (läuft live weiter)
      var renderStand = function () {
        if (!d.stand) { standEl.textContent = 'Die Ranglisten werden gerade zum ersten Mal vom Server geholt.'; return; }
        var t = new Date(d.stand);
        var txt = 'Stand: ' + ago(d.stand) + ' (' + t.toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' }) + ') · ' + num(d.spieler) + ' Spieler · zusammen ' + hours(d.spielzeit_gesamt) + ' gespielt';
        if (Date.now() - d.stand > 3 * 3600e3) txt += ' – der Server war länger nicht erreichbar, die Zahlen können veraltet sein.';
        standEl.textContent = txt;
      };
      renderStand();
      setInterval(renderStand, 30000);
    }).catch(function (e) {
      if (window.console && console.error) console.error('Ranglisten:', e);
      if (location.protocol === 'file:') {
        standEl.textContent = 'Diese Seite ist als Datei vom PC geöffnet – die Ranglisten laden nur online auf www.justinzockt.de/ranglisten.html.';
        return;
      }
      standEl.textContent = 'Die Ranglisten sind gerade nicht verfügbar. Schau später nochmal vorbei.';
    });
  }

  // ---------- Adventskalender (deutsche Zeit) ----------
  function berlin() {
    var o = {};
    try {
      new Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23' })
        .formatToParts(new Date()).forEach(function (p) { if (p.type !== 'literal') o[p.type] = Number(p.value); });
    } catch (e) {
      var n = new Date(); o = { year: n.getFullYear(), month: n.getMonth() + 1, day: n.getDate(), hour: n.getHours(), minute: n.getMinutes(), second: n.getSeconds() };
    }
    if (o.hour === 24) o.hour = 0;
    return o;
  }
  var B = berlin();
  var dayNum = function (y, m, d) { return Math.round(Date.UTC(y, m - 1, d) / 864e5); };
  // Phase: aus = kein Kalender, bald = Vorschau (ab anzeigen-ab bis 30.11.), aktiv = 1.–24. Dezember.
  // Quelle: daten/info.json (advent.sichtbar/aktiv/anzeigen_ab vom Server); ohne Datei eigene Datumslogik.
  function calcPhase(b, srv) {
    var inDec = b.month === 12 && b.day <= 24;
    var after24 = b.month === 12 && b.day > 24;
    if (srv) {
      if (!srv.sichtbar && !srv.aktiv) return 'aus';
      return inDec ? 'aktiv' : after24 ? 'aus' : 'bald';
    }
    if (inDec) return 'aktiv';
    if (after24) return 'aus';
    var ab = /^\d{2}-\d{2}$/.test(String(adventFrom)) ? adventFrom : '11-01';
    var fm = Number(ab.slice(0, 2)), fd = Number(ab.slice(3));
    return (b.month > fm || (b.month === fm && b.day >= fd)) ? 'bald' : 'aus';
  }
  var adventFrom = '11-01';
  var adventSrv = null;
  var phase = null;
  var today = 0;
  var grid = doc.getElementById('advent-grid');
  var raw = doc.getElementById('advent-daten');
  var status = doc.getElementById('advent-status');
  var msg = doc.getElementById('advent-msg');
  var byDay = {};
  if (raw) {
    try {
      var bin = atob(raw.textContent.trim().split('').reverse().join(''));
      var bytes = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      JSON.parse(new TextDecoder('utf-8').decode(bytes)).forEach(function (d) { byDay[d[0]] = d; });
    } catch (e) { byDay = {}; }
  }
  var secsToMidnight = function () { var b = berlin(); return 86400 - (b.hour * 3600 + b.minute * 60 + b.second); };
  var daysToDec1 = function (b) { return dayNum(b.year, 12, 1) - dayNum(b.year, b.month, b.day); };
  var fmtLeft = function (s) { var d = Math.floor(s / 86400); return (d ? d + (d === 1 ? ' Tag, ' : ' Tage, ') : '') + pad(Math.floor(s / 3600) % 24) + ':' + pad(Math.floor(s / 60) % 60) + ':' + pad(s % 60); };
  var drawStatus = function () {
    if (!status || phase === 'aus') return;
    var b = berlin();
    if (phase === 'bald') {
      if (b.month === 12) { location.reload(); return; }
      var s = (daysToDec1(b) - 1) * 86400 + secsToMidnight();
      status.innerHTML = '⏳ Bald geht\'s los! Das erste Türchen öffnet am <b>1. Dezember</b> – noch <b>' + fmtLeft(Math.max(0, s)) + '</b>.';
    } else if (b.day !== today || b.month !== 12) {
      location.reload();
    } else {
      status.innerHTML = today === 24 ? '🎁 Heiligabend! Heute ist das <b>letzte Türchen</b> offen – noch <b>' + fmtLeft(secsToMidnight()) + '</b>.' :
        '✨ Heute ist <b>Türchen ' + today + '</b> offen. Das nächste öffnet in <b>' + fmtLeft(secsToMidnight()) + '</b>.';
    }
  };
  tickers.push(drawStatus);
  var ORDER = [7, 15, 2, 20, 11, 4, 18, 9, 23, 1, 13, 6, 24, 21, 3, 16, 10, 5, 12, 19, 8, 14, 22, 17];
  var VAR = ['', 'v2', 'v3', 'v4'];
  var fill = function (wrap, d) {
    var back = $('.door-back', wrap);
    var data = byDay[d] || [d, 'Überraschung', [], ''];
    back.innerHTML = '<span class="day">' + d + '</span><h3>' + esc(data[1]) + '</h3><ul>' + data[2].map(function (x) { return '<li>' + esc(String(x).replace(/\{J\}/g, String(B.year))) + '</li>'; }).join('') + '</ul>';
  };
  function setPhase(p) {
    if (p === phase) return;
    phase = p;
    today = phase === 'aktiv' ? B.day : 0;
    $$('[data-season="advent"]').forEach(function (el) { el.hidden = phase === 'aus'; });
    $$('[data-season="advent-aus"]').forEach(function (el) { el.hidden = phase !== 'aus'; });
    $$('[data-advent-year]').forEach(function (el) { el.textContent = B.year; });
    if (!grid) return;
    if (phase === 'aus') { grid.innerHTML = ''; return; }
    grid.innerHTML = ORDER.map(function (d) {
      var data = byDay[d] || [];
      var cls = ['door-wrap', VAR[(d * 7) % 4], data[3] || '', d === 24 ? 'big' : (d === 6 || d === 20) ? 'wide' : '', d < today ? 'open' : d === today ? 'today' : 'locked'].filter(Boolean).join(' ');
      var label = d < today ? 'Türchen ' + d + ' (schon offen)' : d === today ? 'Türchen ' + d + ' – heute! Zum Öffnen klicken' : 'Türchen ' + d + ' – öffnet am ' + d + '. Dezember';
      return '<div class="' + cls + '" data-day="' + d + '"><div class="door-back" tabindex="-1"></div><button type="button" class="door" aria-label="' + label + '"><span class="door-num" aria-hidden="true">' + d + '</span><span class="door-knob" aria-hidden="true"></span><span class="door-lock" aria-hidden="true">🔒</span></button></div>';
    }).join('');
    $$('.door-wrap.open', grid).forEach(function (w) { fill(w, Number(w.getAttribute('data-day'))); $('.door', w).tabIndex = -1; });
    drawStatus();
    revealAll(grid);
  }
  if (grid) {
    grid.addEventListener('click', function (e) {
      var btn = e.target.closest('.door');
      if (!btn) return;
      var wrap = btn.parentElement, d = Number(wrap.getAttribute('data-day'));
      if (wrap.classList.contains('locked')) {
        wrap.classList.remove('shake'); void wrap.offsetWidth; wrap.classList.add('shake');
        var left = phase === 'bald' ? daysToDec1(B) + d - 1 : d - today;
        if (msg) msg.textContent = '🔒 Türchen ' + d + ' öffnet erst am ' + d + '. Dezember – noch ' + left + (left === 1 ? ' Tag' : ' Tage') + '. Nicht schummeln! 😉';
        return;
      }
      if (wrap.classList.contains('open')) return;
      fill(wrap, d);
      wrap.classList.remove('today');
      wrap.classList.add('open');
      btn.tabIndex = -1;
      btn.setAttribute('aria-label', 'Türchen ' + d + ' (geöffnet)');
      if (msg) msg.textContent = '🎉 Türchen ' + d + ' ist offen! Abholen kannst du es im Spiel mit /justin advent.';
      sparkle(btn, 26);
      setTimeout(function () { var b = $('.door-back', wrap); if (b) b.focus({ preventScroll: true }); }, reduce ? 0 : 600);
    });
    grid.addEventListener('animationend', function (e) { if (e.target.classList.contains('door-wrap')) e.target.classList.remove('shake'); });
  }
  setPhase(calcPhase(B, null));
  // vom Server (daten/info.json) – wird von applyInfo aufgerufen
  adventFromServer = function (a) {
    if (!a || typeof a !== 'object') return;
    if (a.anzeigen_ab) adventFrom = a.anzeigen_ab;
    adventSrv = a;
    setPhase(calcPhase(berlin(), adventSrv));
  };

  // ---------- Hero: Glut-Partikel (Canvas) ----------
  var emberColor = [255, 31, 61];
  var canvas = $('.hero-canvas');
  if (canvas && canvas.getContext && !reduce) {
    var ctx = canvas.getContext('2d');
    var hero = canvas.parentElement;
    var W = 0, H = 0, parts = [], running = false, visible = true, dpr = Math.min(2, window.devicePixelRatio || 1);
    var resize = function () {
      W = hero.clientWidth; H = hero.clientHeight;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var want = Math.round(Math.min(90, Math.max(24, W / 16)));
      while (parts.length < want) parts.push(spawn(true));
      parts.length = want;
    };
    var spawn = function (anywhere) {
      return { x: Math.random() * W, y: anywhere ? Math.random() * H : H + 10, s: 1.5 + Math.random() * 3.5, vy: 0.25 + Math.random() * 0.8, ph: Math.random() * 6.28, sw: 0.3 + Math.random() * 0.8, a: 0.25 + Math.random() * 0.6, w: Math.random() < 0.18 };
    };
    var t = 0;
    var draw = function () {
      if (!running) return;
      t += 0.016;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.y -= p.vy; p.x += Math.sin(t * p.sw + p.ph) * 0.35 + pointer.x * 0.25;
        if (p.y < -12 || p.x < -20 || p.x > W + 20) { parts[i] = spawn(false); continue; }
        var fade = Math.min(1, p.y / (H * 0.35));
        var al = p.a * fade * (0.75 + 0.25 * Math.sin(t * 3 + p.ph));
        var c = p.w ? [255, 215, 106] : emberColor;
        ctx.fillStyle = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (al * 0.18).toFixed(3) + ')';
        ctx.fillRect(p.x - p.s * 1.6, p.y - p.s * 1.6, p.s * 4.2, p.s * 4.2);
        ctx.fillStyle = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + al.toFixed(3) + ')';
        ctx.fillRect(p.x, p.y, p.s, p.s);
      }
      ctx.globalCompositeOperation = 'source-over';
      window.requestAnimationFrame(draw);
    };
    var setRun = function () {
      var should = visible && !doc.hidden;
      if (should && !running) { running = true; window.requestAnimationFrame(draw); } else if (!should) running = false;
    };
    resize();
    window.addEventListener('resize', function () { resize(); });
    doc.addEventListener('visibilitychange', setRun);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; setRun(); }).observe(hero);
    setRun();
  }

  // ---------- Jahr in der Fußzeile ----------
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
