// skills.html – alles aus skills.yml berechnet
const fs = require('fs');
const { parse } = require('./yaml-mini.js');
const { esc, c, de, head, table } = require('./lib.js');

const Y = parse(fs.readFileSync('C:/Users/kunde/JustinZocktCommunity-Server/justincore/src/main/resources/skills.yml', 'utf8'));

const ITEM = {
  IRON_PICKAXE: ['Eisenspitzhacke', 'Eisenspitzhacken'], TORCH: ['Fackel', 'Fackeln'], COOKED_BEEF: ['Steak', 'Steaks'],
  IRON_INGOT: ['Eisenbarren', 'Eisenbarren'], DIAMOND: ['Diamant', 'Diamanten'], GOLDEN_APPLE: ['Goldener Apfel', 'Goldene Äpfel'],
  EXPERIENCE_BOTTLE: ['Erfahrungsfläschchen', 'Erfahrungsfläschchen'], NETHERITE_SCRAP: ['Netheritplatte', 'Netheritplatten'],
  IRON_AXE: ['Eisenaxt', 'Eisenäxte'], OAK_SAPLING: ['Eichensetzling', 'Eichensetzlinge'], APPLE: ['Apfel', 'Äpfel'],
  BONE_MEAL: ['Knochenmehl', 'Knochenmehl'], IRON_SHOVEL: ['Eisenschaufel', 'Eisenschaufeln'], BREAD: ['Brot', 'Brote'],
  BRUSH: ['Pinsel', 'Pinsel'], IRON_HOE: ['Eisenhacke', 'Eisenhacken'], WHEAT_SEEDS: ['Weizenkörner', 'Weizenkörner'],
  GOLDEN_CARROT: ['Goldene Karotte', 'Goldene Karotten'], FISHING_ROD: ['Angel', 'Angeln'], COOKED_COD: ['Gebratener Kabeljau', 'Gebratene Kabeljaue'],
  BUCKET: ['Eimer', 'Eimer'], COOKED_SALMON: ['Gebratener Lachs', 'Gebratene Lachse'], NAME_TAG: ['Namensschild', 'Namensschilder'],
  IRON_SWORD: ['Eisenschwert', 'Eisenschwerter'], SHIELD: ['Schild', 'Schilde'], ARROW: ['Pfeil', 'Pfeile'],
  COAL: ['Kohle', 'Kohle'], IRON_NUGGET: ['Eisenklumpen', 'Eisenklumpen'], GOLD_NUGGET: ['Goldklumpen', 'Goldklumpen'],
  LAPIS_LAZULI: ['Lapislazuli', 'Lapislazuli'], EMERALD: ['Smaragd', 'Smaragde'], STICK: ['Stock', 'Stöcke'],
  ENCHANTED_GOLDEN_APPLE: ['Verzauberter Goldener Apfel', 'Verzauberte Goldene Äpfel'], FLINT: ['Feuerstein', 'Feuersteine'],
  CLAY_BALL: ['Tonklumpen', 'Tonklumpen'], BONE: ['Knochen', 'Knochen'], HEART_OF_THE_SEA: ['Herz des Meeres', 'Herzen des Meeres'],
  GLISTERING_MELON_SLICE: ['Glitzernde Melonenscheibe', 'Glitzernde Melonenscheiben'], SADDLE: ['Sattel', 'Sättel'],
  NAUTILUS_SHELL: ['Nautilusschale', 'Nautilusschalen'], GOLD_INGOT: ['Goldbarren', 'Goldbarren'],
  TOTEM_OF_UNDYING: ['Totem der Unsterblichkeit', 'Totems der Unsterblichkeit'],
};
const BLOCK = {
  STONE: 'Stein', DEEPSLATE: 'Tiefenschiefer', TUFF: 'Tuffstein', GRANITE: 'Granit', DIORITE: 'Diorit', ANDESITE: 'Andesit',
  CALCITE: 'Calcit', DRIPSTONE_BLOCK: 'Tropfsteinblock', SANDSTONE: 'Sandstein', RED_SANDSTONE: 'Roter Sandstein', TERRACOTTA: 'Keramik',
  NETHERRACK: 'Netherrack', BASALT: 'Basalt', SMOOTH_BASALT: 'Glatter Basalt', BLACKSTONE: 'Schwarzstein', END_STONE: 'Endstein',
  MAGMA_BLOCK: 'Magmablock', GLOWSTONE: 'Leuchtstein', OBSIDIAN: 'Obsidian', CRYING_OBSIDIAN: 'Weinender Obsidian',
  AMETHYST_CLUSTER: 'Amethysthaufen', COAL_ORE: 'Steinkohle', DEEPSLATE_COAL_ORE: 'Tiefenschiefer-Steinkohle', COPPER_ORE: 'Kupfererz',
  DEEPSLATE_COPPER_ORE: 'Tiefenschiefer-Kupfererz', IRON_ORE: 'Eisenerz', DEEPSLATE_IRON_ORE: 'Tiefenschiefer-Eisenerz',
  RAW_IRON_BLOCK: 'Roheisenblock', RAW_COPPER_BLOCK: 'Rohkupferblock', NETHER_QUARTZ_ORE: 'Netherquarzerz', NETHER_GOLD_ORE: 'Nethergolderz',
  GILDED_BLACKSTONE: 'Golddurchzogener Schwarzstein', REDSTONE_ORE: 'Redstone-Erz', DEEPSLATE_REDSTONE_ORE: 'Tiefenschiefer-Redstone-Erz',
  GOLD_ORE: 'Golderz', DEEPSLATE_GOLD_ORE: 'Tiefenschiefer-Golderz', LAPIS_ORE: 'Lapislazulierz', DEEPSLATE_LAPIS_ORE: 'Tiefenschiefer-Lapislazulierz',
  DIAMOND_ORE: 'Diamanterz', DEEPSLATE_DIAMOND_ORE: 'Tiefenschiefer-Diamanterz', EMERALD_ORE: 'Smaragderz',
  DEEPSLATE_EMERALD_ORE: 'Tiefenschiefer-Smaragderz', ANCIENT_DEBRIS: 'Antiker Schrott',
  OAK_LOG: 'Eichenstamm', SPRUCE_LOG: 'Fichtenstamm', BIRCH_LOG: 'Birkenstamm', JUNGLE_LOG: 'Tropenbaumstamm', ACACIA_LOG: 'Akazienstamm',
  DARK_OAK_LOG: 'Schwarzeichenstamm', MANGROVE_LOG: 'Mangrovenstamm', CHERRY_LOG: 'Kirschstamm', PALE_OAK_LOG: 'Blasseichenstamm',
  CRIMSON_STEM: 'Karmesinstiel', WARPED_STEM: 'Wirrstiel', MANGROVE_ROOTS: 'Mangrovenwurzeln', MUSHROOM_STEM: 'Pilzstiel',
  RED_MUSHROOM_BLOCK: 'Roter Pilzblock', BROWN_MUSHROOM_BLOCK: 'Brauner Pilzblock',
  DIRT: 'Erde', GRASS_BLOCK: 'Grasblock', COARSE_DIRT: 'Grobe Erde', ROOTED_DIRT: 'Wurzelerde', PODZOL: 'Podsol', MYCELIUM: 'Myzel',
  MUD: 'Schlamm', MUDDY_MANGROVE_ROOTS: 'Schlammige Mangrovenwurzeln', SAND: 'Sand', RED_SAND: 'Roter Sand', GRAVEL: 'Kies', CLAY: 'Ton',
  SOUL_SAND: 'Seelensand', SOUL_SOIL: 'Seelenerde', SNOW_BLOCK: 'Schneeblock', SNOW: 'Schneeschicht',
  WHEAT: 'Weizen', CARROTS: 'Karotten', POTATOES: 'Kartoffeln', BEETROOTS: 'Rote Bete', NETHER_WART: 'Netherwarze', COCOA: 'Kakaobohnen',
  TORCHFLOWER_CROP: 'Fackellilie', PITCHER_CROP: 'Kannenpflanze', MELON: 'Melone', PUMPKIN: 'Kürbis', SUGAR_CANE: 'Zuckerrohr',
  CACTUS: 'Kaktus', BAMBOO: 'Bambus', SWEET_BERRY_BUSH: 'Süßbeerenstrauch (Rechtsklick)', CAVE_VINES: 'Höhlenranken mit Leuchtbeeren (Rechtsklick)',
  CAVE_VINES_PLANT: 'Höhlenranken-Pflanze mit Leuchtbeeren (Rechtsklick)',
  fisch: 'Fisch gefangen', schatz: 'Schatz geangelt', muell: 'Müll geangelt',
  standard: 'Alle anderen feindlichen Mobs', ZOMBIE: 'Zombie', ZOMBIE_VILLAGER: 'Zombie-Dorfbewohner', HUSK: 'Wüstenzombie', DROWNED: 'Ertrunkener',
  SKELETON: 'Skelett', STRAY: 'Eiswanderer', BOGGED: 'Sumpfskelett', SPIDER: 'Spinne', CAVE_SPIDER: 'Höhlenspinne', CREEPER: 'Creeper',
  ENDERMAN: 'Enderman', WITCH: 'Hexe', SLIME: 'Schleim', MAGMA_CUBE: 'Magmawürfel', SILVERFISH: 'Silberfischchen', ENDERMITE: 'Endermite',
  PHANTOM: 'Phantom', BLAZE: 'Lohe', GHAST: 'Ghast', HOGLIN: 'Hoglin', ZOGLIN: 'Zoglin', ZOMBIFIED_PIGLIN: 'Zombifizierter Piglin',
  PIGLIN_BRUTE: 'Piglin-Barbar', WITHER_SKELETON: 'Witherskelett', GUARDIAN: 'Wächter', ELDER_GUARDIAN: 'Großer Wächter', SHULKER: 'Shulker',
  PILLAGER: 'Plünderer', VINDICATOR: 'Diener', VEX: 'Plagegeist', EVOKER: 'Magier', RAVAGER: 'Verwüster', BREEZE: 'Breeze',
  WARDEN: 'Wärter', WITHER: 'Wither', ENDER_DRAGON: 'Enderdrache',
  // neu (A3–A8)
  COBBLESTONE: 'Bruchstein (natürlich entstanden)', MOSSY_COBBLESTONE: 'Bemooster Bruchstein', REINFORCED_DEEPSLATE: 'Verstärkter Tiefenschiefer',
  INFESTED_STONE: 'Befallener Stein', INFESTED_COBBLESTONE: 'Befallener Bruchstein', INFESTED_DEEPSLATE: 'Befallener Tiefenschiefer',
  AMETHYST_BLOCK: 'Amethystblock', BUDDING_AMETHYST: 'Knospender Amethyst', SMALL_AMETHYST_BUD: 'Kleine Amethystknospe',
  MEDIUM_AMETHYST_BUD: 'Mittlere Amethystknospe', LARGE_AMETHYST_BUD: 'Große Amethystknospe',
  SULFUR: 'Schwefel', POTENT_SULFUR: 'Starker Schwefel', SULFUR_SPIKE: 'Schwefelspitze', CINNABAR: 'Zinnober',
  POPLAR_LOG: 'Pappelstamm', CREAKING_HEART: 'Knarzherz', TORCHFLOWER: 'Fackellilie', DIRT_PATH: 'Trampelpfad', FARMLAND: 'Ackerboden',
  COD: 'Kabeljau', SALMON: 'Lachs', PUFFERFISH: 'Kugelfisch', TROPICAL_FISH: 'Tropenfisch', ENCHANTED_BOOK: 'Verzaubertes Buch',
  CUSTOM_BOOK: 'Eigenes Verzauberungsbuch (Telekinesis, Timber, Soulbound, Mending)', NAME_TAG: 'Namensschild', SADDLE: 'Sattel',
  NAUTILUS_SHELL: 'Nautilusschale', LEATHER: 'Leder', LEATHER_BOOTS: 'Lederstiefel', BOWL: 'Schüssel',
  LILY_PAD: 'Seerosenblatt', POTION: 'Wasserflasche', ROTTEN_FLESH: 'Verrottetes Fleisch', STICK: 'Stock', STRING: 'Faden',
  TRIPWIRE_HOOK: 'Haken', BONE: 'Knochen', INK_SAC: 'Tintenbeutel',
};
// Gleiche Bloecke zusammenfassen, damit die Tabellen auch auf dem Handy kurz bleiben
const GROUP = (k) => {
  if (/TERRACOTTA$/.test(k)) return 'Keramik (alle Farben)';
  if (/NETHER_BRICKS$/.test(k)) return 'Netherziegel (auch rissig und gemeißelt)';
  if (/(STONE_BRICKS|DEEPSLATE_BRICKS|DEEPSLATE_TILES|^CHISELED_DEEPSLATE|BLACKSTONE_BRICKS|END_STONE_BRICKS|TUFF_BRICKS|MUD_BRICKS)$/.test(k)) return 'Natürlich generierte Ziegel (Stein-, Tiefenschiefer-, Schwarzstein-, Endstein-, Tuffstein- und Schlammziegel)';
  if (/PRISMARINE/.test(k)) return 'Prismarin (alle Arten)';
  if (/_NYLIUM$/.test(k)) return 'Karmesin- und Wirr-Nezel';
  if (/^CAVE_VINES/.test(k)) return 'Höhlenranken mit Leuchtbeeren (Rechtsklick)';
  if (k === 'ENCHANTED_FISHING_ROD' || k === 'ENCHANTED_BOW') return 'Verzauberte Angel oder verzauberter Bogen';
  if (k === 'FISHING_ROD' || k === 'BOW') return 'Beschädigte Angel oder beschädigter Bogen';
  return null;
};
const ICON = { bergbau: '⛏️', holz: '🪓', graben: '🏜️', landwirt: '🌾', angeln: '🎣', kampf: '⚔️' };
// Deutsche Erklaerung zu den englischen Skill-Namen (fuer Spieler, die kein Englisch koennen)
const DE_NAME = { bergbau: 'Bergbau', holz: 'Holzfällen', graben: 'Graben', landwirt: 'Landwirtschaft', angeln: 'Angeln', kampf: 'Kampf' };
const XPHEAD = { bergbau: 'Block', holz: 'Block', graben: 'Block', landwirt: 'Pflanze', angeln: 'Fang', kampf: 'Mob' };
const BOOK = { telekinese: 'Telekinesis', holzfaeller: 'Timber', seelenbindung: 'Soulbound', reparatur: 'Mending' };
const ROMAN = ['', 'I', 'II', 'III'];

function itemText(spec) {
  const [mat, n] = spec.split(':');
  const names = ITEM[mat];
  if (!names) throw new Error('Unbekanntes Item ' + mat);
  const amount = Number(n);
  return amount === 1 ? `1 ${names[0]}` : `${amount} ${names[1]}`;
}
const fmt = (v) => (Math.round(v * 100) / 100).toLocaleString('de-DE');
// XP-Wert: Zahl oder Bereich als Text ('9-12' = zufaellig 9 bis 12)
const fmtXp = (v) => (typeof v === 'string' && /^\d+(\.\d+)?-\d+(\.\d+)?$/.test(v) ? v.split('-').map(Number).map(fmt).join('–') : fmt(v));

function effect(pk, r, skillId) {
  const v = fmt(pk.start != null ? pk.start + pk.wert * (r - 1) : pk.wert * r);
  switch (pk.typ) {
    case 'haltbarkeit': return `+${v} % weniger Abnutzung`;
    case 'skill-xp': return `+${v} % Skill-XP`;
    case 'orb-bonus': return `+${v} % Erfahrungskugeln`;
    case 'doppelt': return `+${v} % Doppel-Drop`;
    case 'fund': return `+${v} % Zufallsfund-Bonus`;
    case 'edelstein': return `+${v} % Doppel-Drop bei Diamanten/Smaragden`;
    case 'schnellbiss': return `−${v} % Wartezeit beim Angeln`;
    case 'zwillinge': return `+${v} % Zwillings-Bonus beim Züchten`;
    case 'lebensraub': return `${v} % des Schadens an Monstern heilt dich`;
    case 'schmelze': return `+${v} % Schmelz-Bonus (Erze direkt als Barren)`;
    case 'nachpflanzen': return skillId === 'holz' ? 'Setzling wird automatisch nachgepflanzt' : 'Pflanzen werden automatisch nachgepflanzt';
    default: return v;
  }
}

// Titel (MiniMessage) -> HTML mit CSS
function titleHtml(mm) {
  const bold = /<bold>/.test(mm);
  const text = mm.replace(/<[^>]+>/g, '');
  const g = mm.match(/<gradient:([^>]+)>/);
  const col = mm.match(/<color:(#[0-9a-fA-F]{6})>/);
  if (g) {
    const cols = g[1].split(':');
    return { text, html: `<span class="mc-title grad${bold ? ' bold' : ''}" style="background-image:linear-gradient(90deg,${cols.join(',')})">${esc(text)}</span>`, colors: cols, bold };
  }
  return { text, html: `<span class="mc-title${bold ? ' bold' : ''}" style="color:${col[1]}">${esc(text)}</span>`, colors: [col[1]], bold };
}

const L = Y.level;
const needed = (lv) => Math.max(1, Math.round(L.basis * Math.pow(lv, L.exponent)));
const total = (lv) => { let t = 0; for (let i = 1; i < lv; i++) t += needed(i); return t; };
const hrs = (lv) => { const h = total(lv) / Y.level['xp-pro-stunde']; return h < 1 ? `${Math.round(h * 60 / 5) * 5} Minuten` : `${Math.round(h)} Stunden`; };
const coinsPer = Y.belohnungen['coins-pro-level'];
const coinsTotal = (() => { let t = 0; for (let i = 2; i <= L['max-level']; i++) t += coinsPer * i; return t; })();
const ansage = Y.belohnungen['ansage-level'];

function skillSection(id) {
  const s = Y.skills[id];
  const perks = Object.values(s.verbesserungen);
  const items = s.gegenstaende;
  const book = s.buch;
  const out = [];
  out.push(`<section id="${id}" aria-labelledby="h-${id}">
  <div class="skill-head"><span class="big" aria-hidden="true">${ICON[id]}</span><div><h2 id="h-${id}">${esc(s.name)} <small class="muted">(${DE_NAME[id]})</small></h2><p>${esc(s.beschreibung)}</p></div></div>`);

  // Kennzahlen
  out.push(`<div class="kv">
    <div><b>${BOOK[book.art]}${book.art === 'holzfaeller' ? ' ' + ROMAN[book.stufe] : ''}</b><span>Seltenes Buch bei Level ${book.level}</span></div>
    <div><b>${perks.length}</b><span>passive Verbesserungen</span></div>
    <div><b>${Object.keys(items).length}×</b><span>Gegenstände (Level ${Object.keys(items).join(', ')})</span></div>
    <div><b>${de(coinsTotal)} JC</b><span>Coins bis Level 100</span></div>
  </div>`);

  // Verbesserungen
  out.push(`<h3>Verbesserungen</h3><p class="muted small">Wirken automatisch und dauerhaft. „Stufen bei Level“ sagt dir, ab welchem Level die nächste Stufe dazukommt.</p>`);
  out.push(table(['Verbesserung', 'Pro Stufe', 'Stufen bei Level', 'Maximal'], perks.map((pk) => {
    const n = pk.stufen.length;
    const fixed = ['nachpflanzen'].includes(pk.typ);
    return [`<strong>${esc(pk.name)}</strong>`, fixed ? effect(pk, 1, id) : effect(pk, 1, id), pk.stufen.join(', '), fixed ? '–' : effect(pk, n, id)];
  }), { label: `Verbesserungen ${s.name}` }));

  // Meilensteine
  const ms = [];
  const levels = new Set([...Object.keys(items).map(Number), book.level, ...Object.keys(s.titel).map(Number)]);
  [...levels].sort((a, b) => a - b).forEach((lv) => {
    const parts = [];
    if (items[lv]) parts.push(items[lv].map(itemText).join(', '));
    if (book.level === lv) parts.push(`<span class="badge">📕 Buch: ${BOOK[book.art]}${book.art === 'holzfaeller' ? ' ' + ROMAN[book.stufe] : ''}</span>`);
    if (s.titel[lv]) parts.push(`Titel ${titleHtml(s.titel[lv]).html}`);
    if (lv === L['max-level']) parts.push('<span class="badge">🏆 Meister-Trophäe</span>');
    if (ansage.includes(lv)) parts.push('<span class="badge gray">📣 Ansage an alle</span>');
    ms.push({ cells: [`<strong>${lv}</strong>`, `${de(coinsPer * lv)} JC`, parts.join('<br>')] });
  });
  out.push(`<h3>Meilensteine</h3>`);
  out.push(table(['Level', 'Coins', 'Belohnung'], ms, { num: [], label: `Meilensteine ${s.name}` }));

  // Alle Level
  const rows = [];
  for (let lv = 2; lv <= L['max-level']; lv++) {
    const parts = [];
    perks.forEach((pk) => {
      const r = pk.stufen.indexOf(lv);
      if (r >= 0) {
        const fixed = ['nachpflanzen'].includes(pk.typ);
        parts.push(`${esc(pk.name)}${fixed ? '' : ' ' + (r + 1)}: ${effect(pk, r + 1, id)}`);
      }
    });
    if (items[lv]) parts.push('🎁 ' + items[lv].map(itemText).join(', '));
    if (book.level === lv) parts.push(`📕 Buch: ${BOOK[book.art]}${book.art === 'holzfaeller' ? ' ' + ROMAN[book.stufe] : ''}`);
    if (s.titel[lv]) parts.push(`🏷️ Titel ${titleHtml(s.titel[lv]).html}`);
    if (lv === L['max-level']) parts.push('🏆 Meister-Trophäe');
    const special = items[lv] || book.level === lv || s.titel[lv];
    rows.push({ cls: special ? 'hl' : '', cells: [String(lv), `${de(coinsPer * lv)} JC`, parts.length ? parts.join('<br>') : '<span class="muted">nur Coins</span>'] });
  }
  out.push(`<details><summary>Alle 99 Level-Aufstiege von ${esc(s.name)} anzeigen</summary><div class="details-body">${table(['Level', 'Coins', 'Was du zusätzlich bekommst'], rows, { num: [1], label: `Alle Level ${s.name}` })}</div></details>`);

  // XP-Tabelle
  // gleiche Bloecke zusammengefasst; unreife Pflanzen (nur natuerlich entstanden) als eigene Spalte
  const unreif = s['xp-ungewachsen'] || null;
  const seen = new Map();
  for (const [k, v] of Object.entries(s.xp)) {
    const name = k === 'standard' && id !== 'kampf' ? 'Alles andere' : (GROUP(k) || BLOCK[k] || k);
    if (!seen.has(name)) seen.set(name, { v, u: unreif && unreif[k] != null ? unreif[k] : null });
  }
  const xp = [...seen].map(([n, o]) => (unreif ? [esc(n), fmtXp(o.v), o.u != null ? fmtXp(o.u) : '–'] : [esc(n), fmtXp(o.v)]));
  const extra = (n, v) => xp.push(unreif ? [n, v, '–'] : [n, v]);
  if (s.tiere) {
    extra('Tiere züchten', fmtXp(s.tiere.zuechten));
    extra('Tiere scheren (z. B. Schafe)', fmtXp(s.tiere.scheren));
  }
  if (s['muenzen-faktor'] != null) extra('Seltene Münze geangelt', s['muenzen-faktor'] === 1 ? 'so viel wie der Coin-Wert' : `${fmt(s['muenzen-faktor'])} × Coin-Wert`);
  if (s['erster-drache']) extra(`<strong>Erster Enderdrache des Servers</strong> (einmalig – für den Killer und alle mit mindestens ${fmt(s['erster-drache-anteil'])} % des Schadens)`, de(s['erster-drache']));
  const xpHead = unreif ? [XPHEAD[id], 'Skill-XP (reif)', 'Unreif (nur natürlich entstanden)'] : [XPHEAD[id], 'Skill-XP'];
  out.push(`<details><summary>XP-Werte: ${esc(s.name)} (${xp.length} Einträge)</summary><div class="details-body"><p class="muted small">Steht dort ein Bereich wie „9–12“, bekommst du zufällig einen Wert dazwischen.${unreif ? ' Unreife Pflanzen geben nur etwas, wenn sie von selbst in der Welt entstanden sind (z. B. Dorf-Felder, Netherwarzen in Festungen). Selbst oder von anderen gepflanzte unreife Pflanzen geben nichts.' : ''}</p>${table(xpHead, xp, { num: unreif ? [1, 2] : [1], label: `XP-Werte ${s.name}` })}</div></details>`);

  // Zufallsfund – bewusst OHNE Anteile oder Wahrscheinlichkeiten
  const fund = s.fund.map((f) => { const [mat, range] = f.split(':'); return { mat, range }; });
  const fundName = esc(perks.find((p) => p.typ === 'fund').name);
  out.push(`<details><summary>Zufallsfund-Liste (${fundName})</summary><div class="details-body"><p class="muted small">Wenn die Verbesserung „${fundName}“ auslöst, bekommst du einen dieser Gegenstände.</p>${table(['Gegenstand', 'Menge'], fund.map((f) => [esc(ITEM[f.mat][1]), f.range.split('-')[0] === f.range.split('-')[1] ? f.range.split('-')[0] : f.range.replace('-', '–')]), { num: [1], label: `Zufallsfund ${s.name}` })}</div></details>`);
  out.push('</section>');
  return out.join('\n');
}

function body() {
  const ids = Object.keys(Y.skills);
  const nav = ids.map((id) => `<a href="#${id}">${ICON[id]} ${esc(Y.skills[id].name)}</a>`).join('');
  const gallery = ids.map((id) => {
    const s = Y.skills[id];
    const li = Object.keys(s.titel).map((lv) => `<li>${titleHtml(s.titel[lv]).html}<span class="lvl">Level ${lv}</span></li>`).join('');
    return `<div class="title-card"><h3>${ICON[id]} ${esc(s.name)}</h3><ul>${li}</ul></div>`;
  }).join('\n');

  const lvRows = [];
  for (let lv = 1; lv <= L['max-level']; lv++) {
    lvRows.push({ cls: [10, 25, 50, 75, 100].includes(lv) ? 'hl' : '', cells: [String(lv), lv < L['max-level'] ? de(needed(lv)) : '–', de(total(lv)), `${lv === 1 ? '–' : de(coinsPer * lv) + ' JC'}`] });
  }

  const books = ids.map((id) => {
    const s = Y.skills[id];
    return [`${ICON[id]} ${esc(s.name)}`, String(s.buch.level), `${BOOK[s.buch.art]}${s.buch.art === 'holzfaeller' ? ' ' + ROMAN[s.buch.stufe] : ''}`];
  });

  return `${head('Fortschritt', 'Skills', `Sechs Skills, Level 1 bis 100. Du spielst ganz normal – und bekommst bei <strong>jedem</strong> Level automatisch etwas. Nichts kaufen, keine Punkte verteilen, keine Abklingzeiten.`)}
    <div class="wrap">
      <div class="callout"><p><span aria-hidden="true">⌨️ </span>Im Spiel öffnest du alles mit ${c('/skill')} (oder ${c('/justin skill')}). Einen Skill direkt: z. B. ${c('/skill mining')}. Rangliste: ${c('/skill top')} oder z. B. ${c('/skill top mining')}. Die Skills heißen ${ids.map((id) => esc(Y.skills[id].name)).join(', ')}.</p></div>
      <nav class="skill-nav" aria-label="Skills">${nav}<a href="#titel">🏷️ Titel</a><a href="#level-xp">📈 Level-XP</a><a href="#farmen">🚫 Anti-Farm</a></nav>

      <h2 id="so-gehts">So funktioniert es</h2>
      <div class="grid">
        <div class="card"><span class="icon" aria-hidden="true">🛠️</span><h3>Einfach spielen</h3><p>Abbauen, Bäume fällen, graben, ernten, angeln und Monster besiegen gibt Skill-XP für den passenden Skill.</p></div>
        <div class="card"><span class="icon" aria-hidden="true">🪙</span><h3>Coins bei jedem Level</h3><p>Jeder Aufstieg gibt <strong>${coinsPer} × neues Level</strong> Justin Coins. Level 20 bringt also 200 JC, Level 100 bringt 1.000 JC. Bis Level 100 sind das ${de(coinsTotal)} JC pro Skill.</p></div>
        <div class="card"><span class="icon" aria-hidden="true">✨</span><h3>Jedes Level ein Upgrade</h3><p><strong>Jedes</strong> Level bringt mindestens eine neue Verbesserungs-Stufe – z. B. weniger Abnutzung, doppelte Drops oder mehr Erfahrung. Sie wirken sofort und immer.</p></div>
        <div class="card"><span class="icon" aria-hidden="true">📊</span><h3>Anzeige über der Hotbar</h3><p>Beim Arbeiten siehst du über der Hotbar, wie viel Skill-XP du gerade sammelst – pro Skill zusammengezählt. Machst du ${Y.anzeige ? Y.anzeige['pause-sekunden'] : 5} Sekunden Pause, verschwindet die Anzeige und beginnt danach wieder bei 0.</p></div>
        <div class="card"><span class="icon" aria-hidden="true">🎁</span><h3>Gegenstände</h3><p>Bei Level 5, 15, 30, 45, 65 und 85 bekommst du Gegenstände – von Werkzeug über Diamanten bis zu Netheritplatten.</p></div>
        <div class="card"><span class="icon" aria-hidden="true">📕</span><h3>Ein seltenes Buch</h3><p>Jeder Skill schenkt dir <strong>genau ein</strong> seltenes Verzauberungsbuch – mehr dazu unten und auf der Seite <a href="verzauberungen.html">Verzauberungen</a>.</p></div>
        <div class="card"><span class="icon" aria-hidden="true">🏷️</span><h3>Titel &amp; Trophäe</h3><p>Bei Level 25, 50, 75 und 100 gibt es einen Titel für den Chat, bei Level 100 zusätzlich die <strong>Meister-Trophäe</strong>. Bei diesen Leveln wird es allen Spielern mit Sound angesagt.</p></div>
      </div>
      <div class="callout info"><p><strong>Wichtig:</strong> Es gibt <strong>keine Punkte</strong>, nichts zu kaufen und <strong>keine aktiven Fähigkeiten</strong> oder Abklingzeiten. Alles kommt automatisch, sobald du das Level erreichst. Deinen Titel wählst du im Skill-Menü unter „Titel wählen“ – er erscheint dann in eckigen Klammern vor deinem Namen im Chat. Das Menü funktioniert auch auf Bedrock (Handy, Konsole) mit einfachem Antippen.</p></div>

      <h3>Die seltenen Bücher aus den Skills</h3>
      ${table(['Skill', 'Level', 'Buch'], books, { label: 'Bücher aus Skills' })}

${ids.map(skillSection).join('\n')}

      <h2 id="titel">Titel-Galerie</h2>
      <p>Jeder Titel sieht anders aus. So erscheinen sie im Spiel (nachgebaut mit den echten Farben):</p>
      <div class="titles">
${gallery}
      </div>

      <h2 id="level-xp">Wie viel XP brauche ich?</h2>
      <p>XP für den Schritt von Level L auf L+1 = ${L.basis} × L<sup>${String(L.exponent).replace('.', ',')}</sup> (gerundet). Das ist viermal so lang wie früher. Grobe Richtwerte bei etwa ${de(Y.level['xp-pro-stunde'])} Skill-XP pro Stunde: Level 10 nach etwa ${hrs(10)}, Level 25 nach etwa ${hrs(25)}, Level 50 nach etwa ${hrs(50)}, Level 100 nach etwa ${hrs(100)} aktivem Arbeiten im jeweiligen Skill.</p>
      <details><summary>XP-Tabelle für alle 100 Level anzeigen</summary><div class="details-body">${table(['Level', 'XP bis zum nächsten Level', 'XP gesamt, um dieses Level zu erreichen', 'Coins beim Erreichen'], lvRows, { num: [0, 1, 2, 3], label: 'XP pro Level' })}</div></details>

      <h2 id="farmen">Regeln gegen Farmen</h2>
      <p>Skill-XP gibt es für echtes Spielen in der Welt. Damit niemand mit Tricks schneller levelt, gelten diese Regeln für alle:</p>
      <ul>
        <li><strong>Wer AFK ist, bekommt keine Skill-XP.</strong></li>
        <li><strong>Gesetzte Blöcke geben keine XP</strong> – egal wer sie gesetzt hat. Das gilt auch, wenn ein gesetzter Block (z. B. Sand oder Kies) herunterfällt oder mit einem Kolben verschoben wird. Verschobene Blöcke gelten immer als gesetzt, auch natürliche Erze.</li>
        <li><strong>Generator-Blöcke:</strong> Stein, Bruchstein, Obsidian und Basalt, die durch Wasser und Lava entstehen, geben nie XP. Auch Schnee von Schneefall oder Schneegolems gibt keine XP.</li>
        <li><strong>Woodcutting:</strong> Bäume, die von Anfang an in der Welt standen, geben XP. Auch Bäume aus <strong>Setzlingen</strong> geben XP – egal ob sie von selbst oder mit <strong>Knochenmehl</strong> gewachsen sind. Nur selbst gesetztes Holz zählt nicht. Fällst du einen natürlichen Baum mit <a href="verzauberungen.html">Timber</a>, zählt jeder gefällte Stamm.</li>
        <li><strong>Farming:</strong> Reife Pflanzen geben den vollen Wert, egal wer sie gepflanzt hat. Mit Knochenmehl gewachsene Pflanzen zählen ganz normal. Bei Zuckerrohr, Kaktus und Bambus zählt jede Schicht – auch die darüber, die mit abbrechen –, außer Schichten, die selbst gesetzt wurden. Kürbis, Melone und Fackellilie nur, wenn sie gewachsen und nicht gesetzt sind. Unreife Pflanzen geben nur dann etwas, wenn sie von selbst in der Welt entstanden sind.</li>
        <li><strong>Züchten:</strong> In jedem Chunk gibt es eine Zuchtgrenze. Ist sie erreicht, gibt es dort keine Zucht mehr – und damit auch keine XP.</li>
        <li><strong>Combat:</strong> ${Number(Y.regeln['spawner-mobs']) >= 0.999 ? 'Auch Mobs aus Spawnern und Spawn-Eiern geben die vollen Kampf-XP.' : `Mobs aus Spawnern oder Spawn-Eiern geben nur ${fmt(Y.regeln['spawner-mobs'] * 100)} % der Kampf-XP.`}</li>
        <li>Im Kreativ- oder Zuschauermodus gibt es keine Skill-XP.</li>
        <li>Automatische Farmen (AFK-Maschinen, Bots, Makros) sind verboten, Fehler im Skill-System dürfen nicht ausgenutzt werden – siehe <a href="regeln.html#r10">Regeln, Abschnitt 10</a>.</li>
      </ul>
    </div>`;
}

module.exports = { body, Y, titleHtml, ITEM };
