/* JustinZocktCommunity – Navigation, Kopieren, Live-Status, Befehlssuche */
(function () {
  'use strict';
  document.documentElement.classList.remove('no-js');

  // ---------- Mobiles Menü ----------
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  // ---------- Kopieren ----------
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    var original = btn.textContent;
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var done = function (ok) {
        btn.textContent = ok ? '✓ Kopiert!' : 'Bitte von Hand kopieren';
        btn.classList.toggle('copied', ok);
        var live = document.getElementById('copy-status');
        if (live) live.textContent = ok ? 'Adresse ' + text + ' wurde kopiert.' : 'Kopieren nicht möglich.';
        setTimeout(function () { btn.textContent = original; btn.classList.remove('copied'); }, 2200);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(fallbackCopy(text)); });
      } else {
        done(fallbackCopy(text));
      }
    });
  });

  // ---------- Live-Status (api.mcsrvstat.us) ----------
  var statusBox = document.getElementById('server-status');
  if (statusBox) {
    var host = statusBox.getAttribute('data-host') || 'play.justinzockt.de';
    var dot = statusBox.querySelector('.dot');
    var line = statusBox.querySelector('.status-text');
    var meta = statusBox.querySelector('.status-meta');
    var list = statusBox.querySelector('.player-list');
    var setText = function (el, t) { if (el) el.textContent = t; };
    var fail = function () {
      dot.className = 'dot';
      setText(line, 'Status gerade nicht abrufbar');
      setText(meta, 'Die Status-Abfrage hat nicht geklappt. Schau im Discord vorbei oder versuche es später nochmal.');
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
          return;
        }
        dot.className = 'dot on';
        var p = d.players || {};
        var on = typeof p.online === 'number' ? p.online : 0;
        setText(line, 'Online – ' + on + (typeof p.max === 'number' ? ' / ' + p.max : '') + ' Spieler');
        setText(meta, d.version ? 'Version: ' + String(d.version).replace(/§./g, '') : 'Der Server ist erreichbar.');
        if (list) {
          list.innerHTML = '';
          var names = Array.isArray(p.list) ? p.list : [];
          names.slice(0, 60).forEach(function (pl) {
            var li = document.createElement('li');
            li.textContent = typeof pl === 'string' ? pl : (pl && pl.name) || '?';
            list.appendChild(li);
          });
          if (names.length === 0 && on > 0) {
            var li = document.createElement('li');
            li.textContent = 'Namen werden vom Server nicht angezeigt';
            list.appendChild(li);
          }
          list.hidden = list.children.length === 0;
        }
      })
      .catch(function () { clearTimeout(timer); fail(); });
  }

  // ---------- Befehlssuche ----------
  var search = document.getElementById('cmd-search');
  if (search) {
    var rows = Array.prototype.slice.call(document.querySelectorAll('.cmd'));
    var groups = Array.prototype.slice.call(document.querySelectorAll('.cmd-group'));
    var count = document.getElementById('cmd-count');
    var none = document.getElementById('no-results');
    var norm = function (s) { return s.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss'); };
    rows.forEach(function (r) { r.setAttribute('data-text', norm(r.textContent + ' ' + (r.getAttribute('data-keys') || ''))); });
    var run = function () {
      var words = norm(search.value.trim()).split(/\s+/).filter(Boolean);
      var shown = 0;
      rows.forEach(function (r) {
        var t = r.getAttribute('data-text');
        var hit = words.every(function (w) { return t.indexOf(w) !== -1; });
        r.hidden = !hit;
        if (hit) shown++;
      });
      groups.forEach(function (g) { g.hidden = !g.querySelector('.cmd:not([hidden])'); });
      if (count) count.textContent = shown + ' von ' + rows.length;
      if (none) none.style.display = shown ? 'none' : 'block';
    };
    search.addEventListener('input', run);
    var q = new URLSearchParams(location.search).get('q');
    if (q) search.value = q;
    run();
  }

  // ---------- Ranglisten ----------
  var rankOut = document.getElementById('rank-out');
  if (rankOut) {
    var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
    var num = function (n) { return Number(n).toLocaleString('de-DE'); };
    var hours = function (s) { var h = Math.floor(s / 3600); return num(h) + ' Std. ' + Math.floor((s % 3600) / 60) + ' Min.'; };
    var medal = function (i) { return i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i + 1) + '.'; };
    var table = function (rows, label, fmt) {
      if (!rows || !rows.length) return '<p class="muted">Noch keine Einträge.</p>';
      return '<div class="table-wrap"><table class="rank-table"><thead><tr><th scope="col">Platz</th><th scope="col">Spieler</th><th scope="col">' + esc(label) + '</th></tr></thead><tbody>' +
        rows.map(function (r, i) { return '<tr' + (i < 3 ? ' class="top' + (i + 1) + '"' : '') + '><td>' + medal(i) + '</td><td>' + esc(r[0]) + '</td><td>' + fmt(r[1]) + '</td></tr>'; }).join('') +
        '</tbody></table></div>';
    };
    fetch('daten/ranglisten.json', { cache: 'no-store' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(function (d) {
      var lists = [
        ['coins', '💰 Justin Coins', table(d.coins, 'Justin Coins', function (v) { return num(v) + ' JC'; })],
        ['spielzeit', '⏱ Spielzeit', table(d.spielzeit, 'Spielzeit', hours)],
        ['skills', '⭐ Skills gesamt', table(d.skills_gesamt, 'Gesamtlevel', num)]
      ];
      Object.keys(d.skills || {}).forEach(function (k, i) { lists.push(['skill' + i, k, table(d.skills[k], 'Level', num)]); });
      lists.push(['clans', '🛡 Clans', (d.clans && d.clans.length) ? '<div class="table-wrap"><table class="rank-table"><thead><tr><th scope="col">Platz</th><th scope="col">Clan</th><th scope="col">Mitglieder</th><th scope="col">Punkte</th><th scope="col">Gegründet</th></tr></thead><tbody>' +
        d.clans.map(function (c, i) { return '<tr' + (i < 3 ? ' class="top' + (i + 1) + '"' : '') + '><td>' + medal(i) + '</td><td><strong>[' + esc(c.tag) + ']</strong> ' + esc(c.name) + '</td><td>' + num(c.mitglieder) + '</td><td>' + num(c.punkte) + '</td><td>' + new Date(c.gegruendet).toLocaleDateString('de-DE') + '</td></tr>'; }).join('') +
        '</tbody></table></div>' : '<p class="muted">Noch keine Clans – gründe den ersten mit <code>/clan gruenden</code>!</p>']);
      lists.push(['minigames', '🎮 Minigames', table(d.minigames, 'Punkte', num)]);
      lists.push(['tode', '💀 Tode', table(d.tode, 'Tode', num)]);
      var tabs = document.getElementById('rank-tabs');
      tabs.innerHTML = lists.map(function (l, i) { return '<button type="button" role="tab" class="rank-tab" aria-selected="' + (i === 0) + '" data-i="' + i + '">' + esc(l[1]) + '</button>'; }).join('');
      var show = function (i) {
        rankOut.innerHTML = '<h2>' + esc(lists[i][1]) + '</h2>' + lists[i][2];
        Array.prototype.forEach.call(tabs.children, function (b) { b.setAttribute('aria-selected', String(b.getAttribute('data-i') === String(i))); });
      };
      tabs.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) show(Number(b.getAttribute('data-i'))); });
      show(0);
      document.getElementById('rank-stand').textContent = 'Stand: ' + new Date(d.stand).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' }) +
        ' · ' + num(d.spieler) + ' Spieler · zusammen ' + hours(d.spielzeit_gesamt) + ' gespielt';
    }).catch(function () {
      document.getElementById('rank-stand').textContent = 'Die Ranglisten sind gerade nicht verfügbar. Schau später nochmal vorbei.';
    });
  }

  // ---------- Jahr in der Fußzeile ----------
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
