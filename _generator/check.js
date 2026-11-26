// Prüft alle HTML-Dateien: interne Links/Anker, Grundstruktur, Tag-Verschachtelung, doppelte IDs.
const fs = require('fs');
const path = require('path');
const DIR = process.argv[2] || 'C:/Users/kunde/JustinZocktCommunity-Server/website';
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const BLOCK_IN_P = new Set(['div', 'p', 'ul', 'ol', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'table', 'section', 'article', 'nav', 'header', 'footer', 'details', 'main', 'form']);
const { BEDROCK_DNS } = require('./lib.js');
const DNS_OK = Object.entries(BEDROCK_DNS).filter(([k]) => k !== 'stand').map(([, v]) => v);
const files = fs.readdirSync(DIR).filter(f => fs.statSync(path.join(DIR, f)).isFile()).filter((f) => f.endsWith('.html'));
const ids = {}; const links = []; let errors = 0; let warns = 0;
const err = (f, m) => { errors++; console.log(`FEHLER ${f}: ${m}`); };
const warn = (f, m) => { warns++; console.log(`Hinweis ${f}: ${m}`); };

for (const f of files) {
  let src = fs.readFileSync(path.join(DIR, f), 'utf8');
  if (!/^<!DOCTYPE html>/i.test(src)) err(f, 'kein <!DOCTYPE html>');
  if (!/<html lang="de"/.test(src)) err(f, 'html ohne lang="de"');
  if (!/<meta charset="utf-8">/i.test(src)) err(f, 'kein meta charset');
  if (!/<meta name="viewport"/.test(src)) err(f, 'kein viewport');
  if ((src.match(/<title>[^<]+<\/title>/g) || []).length !== 1) err(f, 'genau ein <title> erwartet');
  if ((src.match(/<h1[\s>]/g) || []).length !== 1) err(f, 'genau ein <h1> erwartet');
  if ((src.match(/<main[\s>]/g) || []).length !== 1) err(f, 'genau ein <main> erwartet');
  if (/\uFFFD/.test(src)) err(f, 'kaputte Zeichen (Encoding)');
  if (f === 'admin.html' && !/<meta name="robots" content="noindex/.test(src)) err(f, 'noindex fehlt');
  // Kommentare, Script- und Style-Inhalte ausblenden
  src = src.replace(/<!--[\s\S]*?-->/g, '').replace(/(<script\b[^>]*>)[\s\S]*?(<\/script>)/gi, '$1$2').replace(/(<style\b[^>]*>)[\s\S]*?(<\/style>)/gi, '$1$2');
  const stack = []; ids[f] = new Set();
  const re = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:\s+[^\s=>\/]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>"']+))?)*)\s*(\/?)>|<(?!\/?[a-zA-Z!])/g;
  let m;
  while ((m = re.exec(src))) {
    if (!m[2]) { err(f, `rohes "<" bei Position ${m.index}: ${src.slice(m.index, m.index + 30)}`); continue; }
    const close = m[1] === '/'; const tag = m[2].toLowerCase(); const attrs = m[3] || '';
    if (tag === '!doctype') continue;
    if (close) {
      if (VOID.has(tag)) { err(f, `schließendes </${tag}> bei leerem Element`); continue; }
      const top = stack.pop();
      if (!top || top.tag !== tag) { err(f, `</${tag}> passt nicht zu <${top ? top.tag : '-'}> (Pos ${m.index})`); if (top) stack.push(top); }
      continue;
    }
    // Attribute
    const attrRe = /([^\s=>\/]+)(?:\s*=\s*("([^"]*)"|'([^']*)'|([^\s>"']+)))?/g; let a; const seen = new Set(); const at = {};
    while ((a = attrRe.exec(attrs))) {
      const name = a[1].toLowerCase();
      if (seen.has(name)) err(f, `Attribut doppelt: ${name} in <${tag}>`);
      seen.add(name);
      if (a[5] !== undefined) warn(f, `Attribut ohne Anführungszeichen: ${name}=${a[5]}`);
      at[name] = a[3] ?? a[4] ?? a[5] ?? '';
    }
    if (at.id !== undefined) { if (ids[f].has(at.id)) err(f, `doppelte id "${at.id}"`); ids[f].add(at.id); }
    if (tag === 'img' && at.alt === undefined) err(f, '<img> ohne alt');
    if (tag === 'a' && at.href !== undefined) links.push({ f, href: at.href, blank: at.target === '_blank', rel: at.rel || '' });
    if (tag === 'a' && stack.some((s) => s.tag === 'a')) err(f, 'Link in Link verschachtelt');
    if (BLOCK_IN_P.has(tag) && stack.length && stack[stack.length - 1].tag === 'p') err(f, `<${tag}> in <p> (Pos ${m.index})`);
    if (tag === 'li' && !['ul', 'ol'].includes((stack[stack.length - 1] || {}).tag)) err(f, '<li> nicht in ul/ol');
    if (tag === 'tr' && !['tbody', 'thead', 'tfoot', 'table'].includes((stack[stack.length - 1] || {}).tag)) err(f, '<tr> falsch verschachtelt');
    if ((tag === 'td' || tag === 'th') && (stack[stack.length - 1] || {}).tag !== 'tr') err(f, `<${tag}> nicht in <tr>`);
    if (tag === 'summary' && (stack[stack.length - 1] || {}).tag !== 'details') err(f, '<summary> nicht direkt in <details>');
    if (tag === 'button' && !at.type) warn(f, '<button> ohne type');
    if (!VOID.has(tag) && m[4] !== '/') stack.push({ tag, pos: m.index });
  }
  if (stack.length) err(f, 'nicht geschlossene Tags: ' + stack.map((s) => s.tag).join(', '));
}

let checked = 0; let external = 0;
for (const l of links) {
  if (/^(https?:|mailto:|tel:)/.test(l.href)) {
    external++;
    if (l.blank && !/noopener/.test(l.rel)) err(l.f, `target=_blank ohne rel=noopener: ${l.href}`);
    if (/^http:/.test(l.href)) err(l.f, `unverschlüsselter Link: ${l.href}`);
    continue;
  }
  checked++;
  const [file, anchor] = l.href.split('#');
  const target = file === '' ? l.f : file;
  if (!fs.existsSync(path.join(DIR, target))) { err(l.f, `Link auf fehlende Datei: ${l.href}`); continue; }
  if (anchor && target.endsWith('.html') && !ids[target].has(anchor)) err(l.f, `Anker fehlt: ${l.href}`);
}
// Verbotene Inhalte (Geheimnisse, Dashboard-Adresse)
for (const f of fs.readdirSync(DIR).filter(f => fs.statSync(path.join(DIR, f)).isFile())) {
  const t = fs.readFileSync(path.join(DIR, f), 'utf8');
  for (const bad of ['host-unlimited', 'minehost', ':15312', 'client-secret', 'token:', 'ftp://', 'proxycheck-key']) if (t.toLowerCase().includes(bad)) err(f, `enthält verbotenen Text "${bad}"`);
  // Erlaubt sind nur die oeffentlichen DNS-Server fuer Bedrock-Konsolen (lib.js, BEDROCK_DNS)
  const ipFree = DNS_OK.reduce((x, ip) => x.split(ip).join(''), t);
  if (/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/.test(ipFree)) err(f, 'enthält eine IP-Adresse');
}
console.log(`\n${files.length} HTML-Dateien, ${checked} interne Links/Anker geprüft, ${external} externe Links (nur Format geprüft).`);
console.log(`${errors} Fehler, ${warns} Hinweise.`);
process.exit(errors ? 1 : 0);
