// Cache-Schutz: Versionsnummer = kurzer Hash von style.css / main.js (neue Datei = neue Adresse, alter Cache greift nicht)
const ASSET_V = (() => {
  const fs = require('fs'), path = require('path'), crypto = require('crypto');
  const h = (f) => { try { return crypto.createHash('sha1').update(fs.readFileSync(path.join(__dirname, '..', f))).digest('hex').slice(0, 8); } catch (e) { return '1'; } };
  return { css: h('style.css'), js: h('main.js') };
})();
// Gemeinsame Bausteine: Kopf, Fuß, Hilfsfunktionen
const IP = 'play.justinzockt.de';
// ---- Hier kann Justin die Bedrock-Adresse, den Port und den Vote-Link aendern (danach: node build.js) ----
const BEDROCK = { host: 'bedrock.justinzockt.de', port: '15314' };
// Serverlisten-Vote (Platzhalter: auf die eigene Server-Seite der Serverliste aendern)
const VOTE_URL = 'https://minecraft-serverlist.net/vote/61208';
// Premium-Shop (Tebex). Leer lassen, solange der Shop noch nicht eingerichtet ist (dann steht dort "bald verfügbar").
const SHOP_URL = 'https://justinzocktcommunity.tebex.store/';
// Premium-Preise (Einführungspreis, OHNE Streichpreis - siehe Hinweis in UPDATE-Anleitung). Ersparnis gegenüber 9,99 €/Monat.
const PREMIUM_PREISE = [
  { dauer: '1 Monat', preis: '9,99 €', proMonat: '9,99 €', spar: 0 },
  { dauer: '6 Monate', preis: '49,99 €', proMonat: '8,33 €', spar: 17 },
  { dauer: '12 Monate', preis: '79,99 €', proMonat: '6,67 €', spar: 33 }
];
// Oeffentliche BedrockConnect-DNS-Server (Quelle: github.com/Pugmatt/BedrockConnect, Stand November 2026)
const BEDROCK_DNS = { stand: 'November 2026', haupt: '104.238.130.180', playstation: '45.55.68.52', deutschland: '134.255.231.119', zweit: '8.8.8.8' };
const LINKS = {
  discord: 'https://discord.gg/uaaWsNEyZH',
  twitch: 'https://twitch.tv/JustinZockt03',
  tiktok: 'https://www.tiktok.com/@justinzockt03live',
  youtube: 'https://www.youtube.com/@JustinZockt03',
};
// Hauptmenue: einfache Punkte + Premium-Knopf + zwei Untermenues ("Spielen", "Hilfe").
// admin.html steht bewusst NICHT im Menue (nur im Fuss).
const NAV = [
  ['index.html', 'Start'],
  ['beitreten.html', 'Beitreten'],
  ['regeln.html', 'Regeln'],
  ['raenge.html', 'Ränge'],
];
const NAV_GROUPS = [
  { id: 'nav-spielen', label: 'Spielen', items: [
    ['skills.html', 'Skills'],
    ['erfolge.html', 'Erfolge'],
    ['minigames.html', 'Minigames'],
    ['events.html', 'Events'],
    ['belohnungen.html', 'Glücksräder &amp; Votes'],
    ['ranglisten.html', 'Ranglisten'],
    ['clans.html', 'Clans'],
    ['claims.html', 'Claims &amp; Kisten'],
    ['shop.html', 'Shop'],
  ] },
  { id: 'nav-hilfe', label: 'Hilfe', items: [
    ['befehle.html', 'Befehle'],
    ['faq.html', 'FAQ'],
    ['mods.html', 'Mods'],
    ['verzauberungen.html', 'Verzauberungen'],
    ['team.html', 'Team &amp; Bewerbung'],
  ] },
];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const c = (s) => `<code>${esc(s)}</code>`;
const de = (n) => Number(n).toLocaleString('de-DE');
const ext = (href, text, extra = '') => `<a href="${href}" target="_blank" rel="noopener noreferrer"${extra}>${text}<span class="sr-only"> (öffnet in neuem Tab)</span></a>`;

const LOGO = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="#fff" d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5z" opacity=".25"/><path fill="#fff" d="M12 3 4 7.5 12 12l8-4.5z"/><path fill="#fff" d="M12 12v9l-8-4.5v-9z" opacity=".7"/></svg>`;

function header(file) {
  const li = ([href, label]) => `<li><a href="${href}"${href === file ? ' aria-current="page"' : ''}>${label}</a></li>`;
  const cur = (href) => (href === file ? ' aria-current="page"' : '');
  const group = (g) => `<li class="has-sub${g.items.some(([h]) => h === file) ? ' is-current' : ''}"><button class="sub-toggle" type="button" aria-expanded="false" aria-controls="${g.id}">${g.label}</button><ul class="sub" id="${g.id}">${g.items.map(li).join('')}</ul></li>`;
  const items = NAV.map(li).join('\n          ')
    + `\n          <li class="nav-premium-li"><a class="nav-premium" href="premium.html"${cur('premium.html')}><span aria-hidden="true">👑</span> Premium</a></li>`
    + NAV_GROUPS.map((g) => `\n          ${group(g)}`).join('')
    + `\n          <li data-season="advent" hidden><a class="nav-advent" href="advent.html"${cur('advent.html')}>🎄 Advent</a></li>`;
  return `<a class="skip" href="#inhalt">Zum Inhalt springen</a>
  <header class="site-header">
    <div class="progress" aria-hidden="true"></div>
    <div class="wrap header-inner">
      <a class="brand" href="index.html" aria-label="JustinZocktCommunity – Startseite">
        <span class="brand-mark">${LOGO}</span>
        <span>JustinZocktCommunity<small>Minecraft-Server</small></span>
      </a>
      <a class="header-premium" href="premium.html"${cur('premium.html')}><span aria-hidden="true">👑</span> Premium</a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav"><span aria-hidden="true">☰</span> <span class="nav-toggle-text">Menü</span></button>
      <nav class="nav" id="site-nav" aria-label="Hauptnavigation">
        <ul>
          ${items}
        </ul>
      </nav>
    </div>
  </header>`;
}

function footer() {
  return `<footer class="site-footer">
    <div class="wrap">
      <div class="footer-grid">
        <div>
          <h2>Server</h2>
          <p>JustinZocktCommunity – der Minecraft-Community-Server von JustinZockt03.<br>Java: <code>${IP}</code><br>Bedrock: <code>${BEDROCK.host}</code> · Port <code>${BEDROCK.port}</code></p>
          <p class="small">Hilfe, Meldungen, Entbannung und Bewerbungen: Discord-Kanal <strong>#tickets</strong>.</p>
        </div>
        <div>
          <h2>Infos</h2>
          <ul>
            <li><a href="beitreten.html">So kommst du auf den Server</a></li>
            <li><a href="beitreten.html#bedrock">Bedrock (Handy, Konsole, Windows)</a></li>
            <li><a href="belohnungen.html">Glücksräder &amp; Votes</a></li>
            <li><a href="claims.html">Claims, Kisten &amp; Freunde</a></li>
            <li><a href="regeln.html">Serverregeln</a></li>
            <li><a href="mods.html">Erlaubte &amp; verbotene Mods</a></li>
            <li><a href="raenge.html">Ränge &amp; Vorteile</a></li>
            <li><a href="premium.html">👑 Premium kaufen</a></li>
            <li><a href="befehle.html">Alle Befehle</a></li>
            <li><a href="faq.html">Häufige Fragen</a></li>
            <li><a href="team.html#bewerben">Bewerben</a></li>
          </ul>
        </div>
        <div>
          <h2>Community</h2>
          <ul>
            <li>${ext(LINKS.discord, 'Discord')}</li>
            <li>${ext(LINKS.twitch, 'Twitch')}</li>
            <li>${ext(LINKS.tiktok, 'TikTok')}</li>
            <li>${ext(LINKS.youtube, 'YouTube')}</li>
          </ul>
        </div>
        <div>
          <h2>Rechtliches</h2>
          <ul>
            <li><a href="impressum.html">Impressum</a></li>
            <li><a href="datenschutz.html">Datenschutz</a></li>
            <li><a href="admin.html">Admin-Bereich</a></li>
          </ul>
        </div>
      </div>
      <nav class="footer-links" aria-label="Wichtige Links"><a class="fl-premium" href="premium.html"><span aria-hidden="true">👑</span> Premium</a><a href="regeln.html">Regeln</a><a href="impressum.html">Impressum</a><a href="datenschutz.html">Datenschutz</a></nav>
      <p class="footer-note">© <span data-year>2026</span> JustinZocktCommunity. Kein offizielles Minecraft-Produkt. Nicht von Mojang oder Microsoft genehmigt und nicht mit Mojang oder Microsoft verbunden.</p>
    </div>
  </footer>`;
}

function page({ file, title, desc, body, noindex = false }) {
  const full = file === 'index.html' ? 'JustinZocktCommunity – Minecraft-Server von JustinZockt03' : `${title} – JustinZocktCommunity`;
  return `<!DOCTYPE html>
<html lang="de" class="no-js">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(full)}</title>
  <meta name="description" content="${esc(desc)}">
  ${noindex ? '<meta name="robots" content="noindex, nofollow">' : '<meta name="robots" content="index, follow">'}
  <meta name="theme-color" content="#0f0b0c">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(full)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:locale" content="de_DE">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%23ff1f3d'/%3E%3Cpath d='M16 5 6 10.5 16 16l10-5.5z' fill='%23fff'/%3E%3Cpath d='M16 16v11L6 21.5v-11z' fill='%23fff' opacity='.7'/%3E%3C/svg%3E">
  <link rel="stylesheet" href="style.css?v=${ASSET_V.css}">
</head>
<body>
  ${header(file)}
  <main id="inhalt" tabindex="-1">
${body}
  </main>
  ${footer()}
  <script src="main.js?v=${ASSET_V.js}" defer></script>
</body>
</html>
`;
}

const head = (eyebrow, h1, lead) => `    <div class="page-hero">
      <div class="page-head wrap">
        <span class="eyebrow">${eyebrow}</span>
        <h1>${h1}</h1>
        ${lead ? `<p class="lead">${lead}</p>` : ''}
      </div>
    </div>`;

// Dynamischer Wert aus daten/info.json (main.js ersetzt den Fallback, sobald die Datei geladen ist)
// fmt: num (Standard), afk (Sekunden -> "5 Min."), text
const info = (path, fallback, fmt = 'num') => `<span data-info="${path}" data-fmt="${fmt}">${fallback}</span>`;
const DEF = { coins: { spieler: 500, sub: 600, premium: 750 }, afk: { spieler: 300, sub: 360, premium: 450 } };
const afkText = (s) => (s % 60 ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')} Min.` : `${s / 60} Min.`);
const coinsH = (rank) => info(`coins_pro_stunde.${rank}`, de(DEF.coins[rank]));
const afkH = (rank) => info(`afk_sekunden.${rank}`, afkText(DEF.afk[rank]), 'afk');

const table = (headers, rows, opts = {}) => {
  const th = headers.map((h, i) => `<th scope="col"${opts.num && opts.num.includes(i) ? ' class="num"' : ''}>${h}</th>`).join('');
  const tr = rows.map((r) => {
    const cls = r.cls ? ` class="${r.cls}"` : '';
    const cells = (r.cells || r).map((d, i) => (i === 0 && opts.rowHead ? `<th scope="row">${d}</th>` : `<td${opts.num && opts.num.includes(i) ? ' class="num"' : ''}>${d}</td>`)).join('');
    return `<tr${cls}>${cells}</tr>`;
  }).join('\n');
  return `<div class="table-wrap"${opts.label ? ` role="region" aria-label="${esc(opts.label)}" tabindex="0"` : ''}><table>${opts.caption ? `<caption>${opts.caption}</caption>` : ''}<thead><tr>${th}</tr></thead><tbody>
${tr}
</tbody></table></div>`;
};

// Sprungmarken oben auf langen Seiten: jump([['#id', 'Text'], ...])
const jump = (list, label = 'Auf dieser Seite') => `<nav class="skill-nav jump-nav" aria-label="${esc(label)}">${list.map(([href, t]) => `<a href="${href}">${t}</a>`).join('')}</nav>`;
// Link zum Premium-Shop (neuer Tab) oder Hinweis, solange kein Shop eingetragen ist
const shopBtn = (text = 'Zum Premium-Shop', cls = 'btn btn-gold') => (SHOP_URL ? ext(SHOP_URL, text, ` class="${cls}"`) : '<span class="badge gold">Der Shop ist bald verfügbar</span>');

module.exports = { IP, BEDROCK, VOTE_URL, SHOP_URL, PREMIUM_PREISE, BEDROCK_DNS, LINKS, NAV, NAV_GROUPS, jump, shopBtn, esc, c, de, ext, page, head, table, info, DEF, afkText, coinsH, afkH };
