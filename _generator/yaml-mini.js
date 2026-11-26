// Minimaler YAML-Leser fuer skills.yml (Maps per Einrueckung, Flow-Listen/-Maps, Skalare).
function stripComment(line) {
  let q = null;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (q) { if (ch === q) q = null; continue; }
    if (ch === "'" || ch === '"') { q = ch; continue; }
    if (ch === '#' && (i === 0 || /\s/.test(line[i - 1]))) return line.slice(0, i);
  }
  return line;
}
function scalar(s) {
  s = s.trim();
  if (s === '') return null;
  if (s[0] === "'") return s.slice(1, -1).replace(/''/g, "'");
  if (s[0] === '"') return JSON.parse(s);
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
  return s;
}
function flow(src) {
  let i = 0;
  const ws = () => { while (i < src.length && /\s/.test(src[i])) i++; };
  function val() {
    ws();
    if (src[i] === '[') {
      i++; const a = []; ws();
      if (src[i] === ']') { i++; return a; }
      for (;;) { a.push(val()); ws(); if (src[i] === ',') { i++; continue; } if (src[i] === ']') { i++; return a; } throw new Error('flow list: ' + src); }
    }
    if (src[i] === '{') {
      i++; const o = {}; ws();
      if (src[i] === '}') { i++; return o; }
      for (;;) {
        ws(); let k = ''; while (!(src[i] === ':' && /\s/.test(src[i + 1] || ' '))) k += src[i++];
        i++; o[k.trim()] = val(); ws();
        if (src[i] === ',') { i++; continue; } if (src[i] === '}') { i++; return o; } throw new Error('flow map: ' + src);
      }
    }
    if (src[i] === "'") { let j = i + 1; let s = ''; for (;;) { if (src[j] === "'" && src[j + 1] === "'") { s += "'"; j += 2; continue; } if (src[j] === "'") break; s += src[j++]; } i = j + 1; return s; }
    let s = '';
    while (i < src.length && !',]}'.includes(src[i]) && !(src[i] === ':' && /\s/.test(src[i + 1] || ' '))) s += src[i++];
    return scalar(s);
  }
  return val();
}
function parse(text) {
  const root = {}; const stack = [{ ind: -1, obj: root }];
  for (const raw of text.split(/\r?\n/)) {
    const line = stripComment(raw).replace(/\s+$/, '');
    if (!line.trim()) continue;
    const ind = line.match(/^ */)[0].length;
    while (stack.length > 1 && stack[stack.length - 1].ind >= ind) stack.pop();
    const parent = stack[stack.length - 1].obj;
    const m = line.trim().match(/^([^:]+?):(\s+(.*))?$/);
    if (!m) throw new Error('Zeile nicht lesbar: ' + raw);
    const key = scalar(m[1]); const rest = (m[3] || '').trim();
    if (rest === '') { const o = {}; parent[key] = o; stack.push({ ind, obj: o }); }
    else if (rest[0] === '[' || rest[0] === '{') parent[key] = flow(rest);
    else parent[key] = scalar(rest);
  }
  return root;
}
module.exports = { parse };
