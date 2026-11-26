const fs = require('fs');
const path = require('path');
const { page, PREMIUM_PREISE } = require('./lib.js');
const skills = require('./skills.js');
const p1 = require('./pages1.js');
const p2 = require('./pages2.js');
const p3 = require('./pages3.js');
const p4 = require('./pages4.js');
const OUT = 'C:/Users/kunde/JustinZocktCommunity-Server/website';
const PAGES = [
  ['index.html', 'Start', 'Minecraft-Community-Server von JustinZockt03 für Java und Bedrock: Adresse play.justinzockt.de, Live-Status, Skills, Clans, Shop, Events, Voten und Regeln.', p1.index],
  ['beitreten.html', 'Beitreten', 'Schritt für Schritt auf die Whitelist der JustinZocktCommunity: Discord, Twitch-Follow, Code eingeben – für Java und Bedrock (Handy, Windows, Xbox, PlayStation, Switch).', p1.beitreten],
  ['regeln.html', 'Regeln', 'Die vollständigen Serverregeln der JustinZocktCommunity mit Inhaltsverzeichnis.', p1.regeln],
  ['skills.html', 'Skills', 'Alle 6 Skills (Mining, Woodcutting, Excavation, Farming, Fishing, Combat) von Level 1 bis 100: Belohnungen, ein Upgrade pro Level, XP-Werte und Titel.', skills.body],
  ['erfolge.html', 'Erfolge', 'Alle Erfolge der JustinZocktCommunity: Minigame-Siege, Skill-Level, Spielzeit, Coins, Clans, Advent, Votes, Angeln, Loot-Truhen und seltene Funde.', p3.erfolgePage],
  ['verzauberungen.html', 'Verzauberungen', 'Eigene Verzauberungen: Soulbound, Telekinesis, Timber I–III und seltenes Mending.', p1.verzauberungen],
  ['clans.html', 'Clans', 'Clans gründen, Ränge (Gründer, Leiter, Ältester, Mitglied), Clan-Chat, Clan-Rangliste und private Nachrichten.', p1.clans],
  ['shop.html', 'Shop', 'Der Spieler-Shop am Spawn: kaufen, verkaufen und Angebote verwalten mit Justin Coins.', p1.shop],
  ['mods.html', 'Mods', 'Erlaubte und verbotene Mods und Clients auf der JustinZocktCommunity: Sodium, Iris, Minimaps ohne Radar – und was zum Bann führt.', p3.mods],
  ['raenge.html', 'Ränge', 'Ränge und Vorteile: Spieler, Twitch-Sub und Premium – das volle Spielerlebnis für alle, dazu Homes, Glücksräder, Claims mit Rabatt, Clan-Farbe, Coins pro Stunde, /ec, /craft, mobile Arbeitsblöcke und /tpa.', p3.raenge],
  ['premium.html', 'Premium kaufen', `Premium für die JustinZocktCommunity kaufen: ${PREMIUM_PREISE.map((p) => p.dauer + ' ' + p.preis).join(', ')} – 1 Home ohne Wartezeit, /tpa, /ec, /craft, /signieren, /invsort, mobile Arbeitsblöcke, Premium-Glücksrad, mehr Claims und mehr Coins.`, p3.premium],
  ['events.html', 'Events', 'Events der JustinZocktCommunity: Event-NPC am Spawn, Saison-Events, tägliche Glücksräder und Votes, Event-Regeln und Minigames.', p2.events],
  ['advent.html', 'Adventskalender', 'Der Adventskalender der JustinZocktCommunity: 24 versteckte Geschenke am Weihnachts-Spawn vom 1. bis 24. Dezember – mit Ort und Koordinaten zum Aufdecken.', p2.advent],
  ['belohnungen.html', 'Glücksräder & Votes', 'Tägliche Glücksräder mit /rewards – Glücksrad für alle, dazu Sub- und Premium-Rad – und Voten mit Tagesbonus und Vote-Erfolgen. Alles auch auf Bedrock.', p4.belohnungen],
  ['claims.html', 'Claims', 'Claims, Kistenschutz und Freunde: Chunks kaufen mit /claim chunk, Preise, Limits, Rollen, alle Flags, Claim-Anzeige, /lock und /freunde.', p4.claims],
  ['befehle.html', 'Befehle', 'Alle Spieler-Befehle der JustinZocktCommunity – durchsuchbar.', p2.befehle],
  ['faq.html', 'FAQ', 'Häufige Fragen zur JustinZocktCommunity: Version, Coins, Glücksräder, Claims, Kisten, Freunde, PvP, Mods, Anticheat und mehr.', p2.faq],
  ['team.html', 'Team', 'Ränge und Team-Rechte der JustinZocktCommunity.', p2.team],
  ['minigames.html', 'Minigames', `Die Minigame-Welt: ${p3.GAMES.length} Spiele von 4 Gewinnt bis OneBlock-Fight, Räume mit Passwort, automatische Statistiken und Ranglisten.`, p3.minigames],
  ['ranglisten.html', 'Ranglisten', 'Ranglisten der Community: Coins, Spielzeit, Skills, Erfolge, Clans, Clan-Spielzeit, Minecraft-Statistiken, Tode und jedes Minigame – automatisch aktualisiert.', p3.ranglisten],
  ['datenschutz.html', 'Datenschutz', 'Datenschutzhinweise für Minecraft-Server, Discord-Bot und Website.', p2.datenschutz],
  ['impressum.html', 'Impressum', 'Impressum der JustinZocktCommunity-Website.', p2.impressum],
  ['admin.html', 'Admin-Bereich', 'Admin-Bereich: Server-Dashboard und Befehlsreferenz für das Team.', p2.admin, true],
];
for (const [file, title, desc, fn, noindex] of PAGES) {
  fs.writeFileSync(path.join(OUT, file), page({ file, title, desc, body: fn(), noindex: !!noindex }), 'utf8');
  console.log('geschrieben', file);
}

// FAQ als JSON fuer die Discord-Autoantwort (Website + Plugin-Fallback)
require('./faq-json.js').writeFaqJson(p2.FAQ, OUT, 'C:/Users/kunde/JustinZocktCommunity-Server/justincore/src/main/resources/faq.json');

// Befehlsliste als Markdown fuer Justin (hochladen/BEFEHLE.md)
const md = [];
md.push('# Alle Befehle – JustinZocktCommunity (JustinCore 1.9.0)', '');
md.push('`<...>` = musst du ausfüllen, `[...]` = optional. Diese Datei wird zusammen mit der Website erzeugt (`website/_generator/build.js`).', '');
md.push('## Spieler-Befehle (für alle)', '');
for (const [, title, list] of p2.CMDS) {
  md.push('### ' + title, '', '| Befehl | Was es macht | Auch |', '|---|---|---|');
  for (const [cmd, desc, alias, , rank] of list) md.push('| `' + cmd.replace(/\|/g, '\\|') + '` | ' + (rank ? `**(${rank})** ` : '') + desc.replace(/\|/g, '\\|') + ' | ' + (alias || '') + ' |');
  md.push('');
}
md.push('## Team-, Admin- und Owner-Befehle', '');
for (const [title, list] of p2.ADMIN) {
  md.push('### ' + title, '', '| Befehl | Was es macht |', '|---|---|');
  for (const [cmd, desc] of list) md.push('| `' + cmd.replace(/\|/g, '\\|') + '` | ' + desc.replace(/\|/g, '\\|') + ' |');
  md.push('');
}
fs.writeFileSync('C:/Users/kunde/JustinZocktCommunity-Server/hochladen/BEFEHLE.md', md.join('\n'), 'utf8');
console.log('geschrieben hochladen/BEFEHLE.md');
