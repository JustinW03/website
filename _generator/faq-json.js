// Erzeugt daten/faq.json aus der FAQ (fuer die Discord-Autoantwort im Plugin) und kopiert sie ins Plugin.
const fs = require('fs');
const path = require('path');

const SITE = 'https://justinzockt.de';

// Handgepflegte Zusatz-Stichwoerter/Synonyme (Spieler-Sprache, Tippfehler, Englisch)
const EXTRA = {
  start: ['whitelist', 'gewhitelistet', 'whitelisted', 'freischalten', 'freigeschaltet', 'joinen', 'join', 'beitreten', 'ip', 'adresse', 'serveradresse', 'drauf', 'reinkommen', 'connecten', 'verbinden', 'code', 'mitspielen'],
  version: ['version', 'versionen', 'java', 'update', 'snapshot', '1.21', 'veraltet', 'outdated'],
  bedrock: ['bedrock', 'handy', 'smartphone', 'iphone', 'android', 'tablet', 'ipad', 'konsole', 'ps', 'ps4', 'ps5', 'playstation', 'xbox', 'switch', 'nintendo', 'pocket', 'pe', 'mobile', 'crossplay', 'port', 'bedrockconnect'],
  coins: ['coins', 'coin', 'jc', 'geld', 'waehrung', 'guthaben', 'balance', 'verdienen', 'bezahlen', 'ueberweisen', 'money'],
  claims: ['claim', 'claimen', 'grundstueck', 'gebiet', 'chunk', 'chunks', 'schuetzen', 'schutz', 'griefen', 'griefing', 'grief', 'trust', 'base'],
  truhen: ['truhe', 'truhen', 'kiste', 'kisten', 'lock', 'abschliessen', 'sperren', 'shulker', 'fass', 'ofen', 'trichter', 'klauen', 'geklaut', 'dieb', 'diebe', 'sicher', 'gesichert', 'schliessen', 'abschliessen', 'aufbrechen'],
  spawn: ['spawn', 'npc', 'npcs', 'shop', 'speed', 'spawneffekte', 'bossbar'],
  schlafen: ['schlafen', 'bett', 'nacht', 'skippen'],
  home: ['home', 'homes', 'sethome', 'zuhause', 'heim'],
  respawn: ['respawn', 'respawnen', 'tod', 'sterben', 'gestorben', 'tot'],
  pvp: ['pvp', 'kaempfen', 'kampf', 'toeten', 'angreifen'],
  skills: ['skill', 'skills', 'level', 'leveln', 'xp'],
  mending: ['mending', 'reparatur', 'reparieren', 'villager', 'dorfbewohner'],
  elytra: ['elytra', 'elytren', 'fliegen', 'fluegel', 'flugel'],
  welt: ['welt', 'weltgrenze', 'border', 'worldborder', 'nether', 'end', 'groesse', 'gross', 'offen', 'oeffnen', 'drache', 'termin'],
  drachenei: ['drachenei', 'drache', 'enderdrache', 'ei', 'dragon'],
  gateways: ['gateway', 'gateways', 'endcity', 'end-stadt', 'endstadt', 'aeussere inseln'],
  vote: ['vote', 'voten', 'abstimmen', 'serverliste'],
  wartung: ['wartung', 'joinen', 'join', 'rein', 'reinkommen', 'nicht drauf', 'wartungsmodus', 'maintenance', 'offline', 'down', 'erreichbar'],
  amboss: ['amboss', 'teuer', 'anvil'],
  mods: ['mod', 'mods', 'erlaubt', 'verboten', 'shader', 'optifine', 'sodium', 'iris', 'minimap', 'texturepack', 'resourcepack', 'fabric', 'forge', 'xray', 'client', 'clients', 'litematica'],
  anticheat: ['anticheat', 'cheat', 'cheats', 'hack', 'hacks', 'gekickt', 'kick'],
  voice: ['voice', 'vc', 'voicechat', 'sprachchat', 'sprechen', 'reden', 'mikro'],
  report: ['melden', 'report', 'reporten', 'regelbruch', 'cheater', 'hacker', 'beleidigt', 'ignore'],
  bann: ['bann', 'gebannt', 'ban', 'banned', 'entbannen', 'entbannung', 'gesperrt'],
  bewerben: ['bewerben', 'bewerbung', 'team', 'supporter', 'moderator', 'builder'],
  chat: ['chat', 'schreiben', 'cooldown', 'spam', 'nachricht'],
  erfolge: ['erfolge', 'erfolg', 'achievement', 'achievements', 'fortschritte', 'advancements'],
  sub: ['sub', 'subs', 'subscriber', 'abonnieren', 'twitch', 'vorteile', 'rang', 'raenge'],
  premium: ['premium', 'kaufen', 'preis', 'kosten', 'kostet'],
  daten: ['daten', 'datenschutz', 'gespeichert', 'dsgvo', 'privatsphaere'],
  serverstart: ['serverstart', 'start', 'startet', 'eroeffnung', 'release', 'wann', 'tag'],
  rewards: ['rewards', 'reward', 'belohnung', 'belohnungen', 'gluecksrad', 'rad', 'daily', 'taeglich', 'drehen', 'spin', 'gewinn'],
  freunde: ['freunde', 'freund', 'friend', 'friends', 'anfrage', 'freundschaft', 'rechte', 'teilen'],
  spawner: ['spawner', 'trialspawner', 'tresor', 'vault', 'loottruhe', 'loot', 'abbauen', 'zerstoeren', 'kaputt'],
  zucht: ['zucht', 'zuechten', 'tiere', 'villager', 'dorfbewohner', 'farm', 'limit', 'grenze'],
  minigametitel: ['titel', 'minigame', 'siege', 'gewinnen', 'title'],
  clanraenge: ['clan', 'aeltester', 'leiter', 'gruender', 'befoerdern', 'degradieren', 'rang'],
};

const STOP = new Set(('wie was wo wann wer warum wieso weshalb welche welcher welches welchen kann koennen konnte darf duerfen muss '
  + 'muessen ich du er sie es wir ihr man mein meine meinen meiner dein deine der die das den dem des ein eine einen einem einer '
  + 'und oder aber auch noch nur schon mal ist sind bin bist war hat habe haben hast wird werden gibt geht gehen mit auf in im an am '
  + 'zu zum zur von vom fuer bei aus nach ueber unter um so wenn dann damit da dort hier nicht kein keine mich dich mir dir sich viele '
  + 'viel bekomme bekommen finde finden mache machen tun').split(' '));

const norm = (s) => s.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');

// HTML -> reiner Text: Code als `...`, Tags weg, Entities aufgeloest
function toText(html) {
  return html
    .replace(/<span class="sr-only">[\s\S]*?<\/span>/g, '')
    .replace(/<code>([\s\S]*?)<\/code>/g, '`$1`')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ').trim();
}

function keywords(id, frage, antwortText) {
  const set = new Set();
  for (const w of norm(frage).split(/[^a-z0-9.]+/)) {
    const t = w.replace(/^\.+|\.+$/g, '');
    if (t.length >= 2 && !STOP.has(t)) set.add(t);
  }
  // Befehle aus der Antwort (`/claim chunk` -> claim)
  for (const m of antwortText.matchAll(/`\/([a-z]+)/gi)) set.add(norm(m[1]));
  for (const w of EXTRA[id] || []) set.add(norm(w));
  return [...set];
}

function writeFaqJson(FAQ, outDir, pluginRes) {
  const list = FAQ.map(([id, frage, html]) => {
    const antwort = toText(html);
    return { id, frage, antwort, url: `${SITE}/faq.html#${id}`, keywords: keywords(id, frage, antwort) };
  });
  const json = JSON.stringify(list, null, 1) + '\n';
  fs.mkdirSync(path.join(outDir, 'daten'), { recursive: true });
  fs.writeFileSync(path.join(outDir, 'daten', 'faq.json'), json, 'utf8');
  fs.writeFileSync(pluginRes, json, 'utf8');
  console.log('geschrieben daten/faq.json (' + list.length + ' Fragen) + Plugin-Ressource');
}

module.exports = { writeFaqJson };
