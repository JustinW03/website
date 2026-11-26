// Ranglisten, Minigames, Mods, Ränge
// Dynamische Werte kommen aus daten/info.json und daten/ranglisten.json (alle 30 Min. vom Server, siehe README).
const fs = require('fs');
const { esc, c, de, ext, head, table, info, coinsH, afkH, DEF, afkText, SHOP_URL, PREMIUM_PREISE, jump, shopBtn } = require('./lib.js');

// ------------------------------------------------------------------ ranglisten
const ranglisten = () => `${head('Community', 'Ranglisten', 'Wer hat die meisten Coins, die meiste Spielzeit, die höchsten Skills, die meisten Erfolge, den stärksten Clan – und wer gewinnt welches Minigame? Die Listen werden automatisch etwa alle 15 Minuten aktualisiert.')}
    <div class="wrap">
      <p class="muted" id="rank-stand" aria-live="polite">Lade Ranglisten …</p>
      <div class="rank-tabs" role="tablist" aria-label="Ranglisten" id="rank-tabs"></div>
      <div class="rank-tabs rank-subtabs" role="tablist" aria-label="Unterkategorien" id="rank-subtabs" hidden></div>
      <div id="rank-out" role="tabpanel"></div>
      <noscript><p class="callout">Für die Ranglisten wird JavaScript benötigt.</p></noscript>
      <p class="muted">Es erscheinen nur freigeschaltete Spieler. Oben stehen die besten 3 auf dem Podest, darunter die Plätze 4 bis 100 – mit Suche nach Namen. Clan-Punkte = Skill-Gesamtlevel aller Mitglieder + ihre Spielstunden; „Clan-Spielzeit“ zählt die Spielzeit aller Mitglieder zusammen. „Erfolge“ zählt erledigte Minecraft-Fortschritte und <a href="erfolge.html">JZC-Erfolge</a> (ohne Rezepte). Unter „⭐ Skills“ findest du Gesamt und jeden Skill einzeln. Minigame-Statistiken zählen <strong>automatisch</strong> für alle – unter „🎮 Minigames“ gibt es Punkte, Siege und für jedes Spiel eine eigene Rangliste („Je Spiel“). Unter „☕ Java“ stehen Minecraft-Statistiken: gesammelte XP, durchgeschlafene Nächte, abgebaute und platzierte Blöcke, ausgeteilter und erhaltener Schaden (in Herzen), Spieler-Kills, Tode durch Spieler, Mob-Kills, Sprünge, Elytra-Flugstrecke sowie gefundene seltene Bücher, Elytras und Justin Coins aus Truhen und vom Angeln. Die Minigame-Welt und der Kreativmodus zählen bei Blöcken, XP und Funden nicht mit; aktualisiert wird alle paar Minuten und beim Verlassen des Servers.</p>
    </div>`;

// ------------------------------------------------------------------ minigames
// Fallback-Liste, falls daten/info.json fehlt. [Name, Spieler, Kurzinfo, Arena?]
const GAMES = [
  ['4 Gewinnt', '2', 'Steine fallen in ein echtes Gestell – vier in eine Reihe gewinnt', false],
  ['Tic-Tac-Toe', '2', 'Großes Feld im Boden – Best of 3 bis 9, Unentschieden wird neu gespielt', false],
  ['Schiffe versenken', '2', 'Jeder in seiner geschlossenen Kabine – kein Spicken, auch nicht per Minimap', false],
  ['Memory', '2–4', '48 Karten auf dem Boden – finde die meisten Paare', false],
  ['Mensch ärgere Dich nicht', '2–4', 'Würfeln, rauswerfen, ärgern – alle 4 ins Ziel', false],
  ['Dame', '2', 'Der Brettklassiker – schlagen ist Pflicht', false],
  ['Schach', '2', 'Das Spiel der Könige auf einem echten Brett', false],
  ['Barricade', '2–4', 'Mit richtigen Spielfiguren: Barrikaden versetzen – Modus 1 Figur oder alle Figuren, mehr Barrikaden, großes Brett', false],
  ['Kniffel', '1–4', 'Würfeln, halten, eintragen – am echten Würfeltisch mit großer Wertungswand. Allein ist es ab 180 Punkten ein Sieg', false],
  ['Galgenmännchen', '2–6', 'Echter Galgen, der mit jedem Fehler wächst, Buchstaben-Tastatur zum Anklicken und über 2.600 Wörter in 4 Stufen (leicht bis extrem). Bei Punktgleichstand gewinnt, wer weniger Fehler hatte', false],
  ['Schere-Stein-Papier', '2', 'Verdeckt am Pult wählen, große Auflösung in der Mitte', false],
  ['Blackjack', '1–4', 'Am Casino-Tisch näher an 21 als der Geber – 1 bis 15 Runden, ohne Geld', false],
  ['Reducto', '2–6', '16 verdeckte Karten – Reihen bilden, Feld verkleinern, wenigste Punkte gewinnen', false],
  ['Minesweeper', '1', 'Großes Minenfeld in 3 Stufen (Leicht, Mittel, Schwer) mit Bestzeit je Stufe', false],
  ['Wordle', '1–4', 'Errate das Wort in sechs Versuchen – 4 bis 7 Buchstaben, über 1.600 Wörter, mit Tastatur auf dem Boden', false],
  ['2048', '1', 'Kachel-Wand mit Pfeil-Knöpfen am Tisch – endlos, Rangliste nach Punkten. Ein Sieg zählt erst mit der 2048-Kachel', false],
  ['Ich packe meinen Koffer', '2–6', 'Nur mit Minecraft-Items: alles in der richtigen Reihenfolge aus dem Regal wählen – ohne Hilfe im Chat. Gewinnen kann nur, wer mindestens 1 Item gepackt hat', false],
  ['Zockerstadt', '2–8', 'Neu! Das große Handels- und Grundstücksspiel in Justins Zocker-City: 40 Felder von der Noob-Gasse über Twitch- und Discord-Server bis zu Justins Zockerzimmer, mit Stream-Events, Community-Truhe und Timeout statt Gefängnis – kaufen, versteigern, Häuser und Hotels bauen, Hypotheken, Handeln, Gefängnis und Bankrott. Spielende wählbar: klassisch bis einer übrig ist oder „erster Bankrott verliert“', false],
  ['Kartenblitz', '2–10', 'Neu! Farbe oder Zahl ablegen, mit Aussetzen, Richtungswechsel, +2, Farbwahl und +4 – bei der vorletzten Karte „Blitz!“ rufen. Wer fertig ist, gewinnt; gespielt wird, bis nur noch einer Karten hat', false],
  ['Stapelmeister', '2–6', 'Neu! Gemeinsame Stapel von 1 bis 12 aufbauen, Joker passen überall – wer zuerst seinen Vorrat los ist, gewinnt. Die anderen spielen weiter um die Plätze', false],
  ['Werwolf', '5–30', 'Neu! Am Lagerfeuer mit Erzähler: nachts wachen nur die richtigen Rollen auf, tagsüber wird diskutiert und abgestimmt. Seherin, Hexe, Jäger, Amor, Beschützer und viele mehr – die Rollen-Verteilung wird nach Spielerzahl berechnet und ist anpassbar', false],
  ['Geheimwort', '4–16', 'Neu! Team Rot gegen Blau: Der Hinweisgeber gibt ein Wort und eine Zahl, das Team deckt die passenden Karten auf – aber Vorsicht vor dem Attentäter. Teams frei wählen oder zufällig verteilen', false],
  ['Spleef', '2–8', 'Grab den anderen den Schnee unter den Füßen weg', true],
  ['TNT-Run', '2–8', 'Lauf! Der Boden verschwindet unter deinen Füßen', true],
  ['Parkour', '1–8', 'Vier Strecken: Leicht, Mittel, Schwer, Extrem – Bestzeit je Stufe. Mit dem Auge (Slot 3) blendest du die anderen Spieler aus', true],
  ['Knockback-FFA', '2–8', 'Punkte für Runterschubsen und die Krone in der Mitte – 4 Maps zur Auswahl: Blumeninseln, Wolkentempel, Lavafestung, Pilzwald', true],
  ['Schneeballschlacht', '2–8', 'Punkte für jeden Treffer, Bonus fürs Ins-Wasser-Schubsen – 4 Maps: Eisschollen-See, Schneeburg, Gletscherspalten, Winterdorf', true],
  ['Bogen-Schießstand', '1–4', 'Triff die Ziele – je genauer, desto mehr Punkte. 4 Maps: Waldlichtung, Wüsten-Fort, Winterburg, Kirschgarten', true],
  ['MLG-Wasser', '1–8', 'Alle fallen gleichzeitig – rette dich mit dem Wassereimer. Jede Runde 4 Blöcke höher (bis 100) – ab 32 Blöcken gibt es eine kurze Pause: Alle schauen von oben zu, wie sich die Decke öffnet, der Leuchtturm fährt durch das Loch nach oben und wächst danach mit. Nach dem Spiel schließt sich alles wieder. Scheitern alle gleichzeitig, ist es unentschieden', true],
  ['Speed-Crafting', '1–8', 'Hunderte Werkbank-Rezepte, alle Zutaten liegen bereit – Rangliste je Item', true],
  ['Eisbootrennen', '1–16', 'Eigene 500×500-Arena mit rund 2.400 Blöcken Strecke für bis zu 16 Fahrer, 1 bis 10 Runden: Tannenwald, Slalom, Strohballen-Schikane, Weihnachtsdorf, See mit Eisinseln, Eisschlucht, Kristallfeld, Eistunnel, Gabelung und Blaueis-Geraden. Wer feststeckt, kommt automatisch zurück auf die Strecke', true],
  ['OneBlock-Fight', '2–8', 'Neu! Jeder auf seiner eigenen Insel über dem Nichts, in der Mitte ein Zufallsblock, der endlos zufällige Items gibt. Bauen, Brücken schlagen, kämpfen – wer fällt oder stirbt, ist raus. Der Letzte gewinnt', true],
];
const ICONS = [['4 gewinnt', '🔴'], ['tic', '❌'], ['schiffe', '🚢'], ['memory', '🧠'], ['mensch', '🎲'], ['dame', '⚪'], ['schach', '♟️'], ['barricade', '🧱'], ['kniffel', '🎲'], ['galgen', '🪢'], ['schere', '✂️'], ['blackjack', '🃏'], ['mines', '💣'], ['wordle', '🔤'], ['2048', '🔢'], ['koffer', '🧳'], ['spleef', '❄️'], ['tnt', '🧨'], ['parkour', '🏃'], ['knockback', '🥊'], ['schneeball', '☃️'], ['bogen', '🏹'], ['mlg', '💧'], ['crafting', '🛠️'], ['eisboot', '🛶'], ['reducto', '🂠'], ['zockerstadt', '🏙️'], ['kartenblitz', '⚡'], ['stapelmeister', '📚'], ['werwolf', '🐺'], ['geheimwort', '🕵️'], ['oneblock', '🟫']];
const iconFor = (name) => { const n = name.toLowerCase(); const hit = ICONS.find(([k]) => n.includes(k)); return hit ? hit[1] : '🎮'; };
const gameLi = ([n, p, d, action]) => `<li class="game" data-kind="${action ? 'action' : 'tisch'}"><span class="g-ico" aria-hidden="true">${iconFor(n)}</span><h3>${esc(n)}</h3><p>${esc(d)}</p><div class="g-meta"><span class="badge gray">👥 ${esc(p)}</span><span class="badge${action ? '' : ' green'}">${action ? 'Arena' : 'Tisch'}</span></div></li>`;

const minigames = () => `${head('Minigames', 'Minigame-Welt', `Eine eigene Welt nur zum Spielen: <span data-info-len="minigames">${GAMES.length}</span> Spiele, jedes mit eigenem Raum und 4 Spielfeldern, offene Räume oder Räume mit Passwort und eine Statistik, die automatisch mitzählt.`)}
    <div class="wrap">
      ${jump([['#mg-hin', 'So kommst du hin'], ['#spiele', 'Die Spiele'], ['#mg-raeume', 'Räume &amp; Passwort'], ['#mg-fair', 'Fair &amp; zufällig'], ['#mg-stats', 'Statistiken'], ['#mg-titel', 'Titel']])}
      <h2 id="mg-hin">So kommst du hin</h2>
      <ol class="steps">
        <li><h3>Rein in die Welt</h3><p>${c('/minigames join')} eingeben oder den <strong>Minigames-NPC</strong> am Spawn anklicken. Dein Survival-Inventar wird sicher gespeichert. Du bekommst nur einen <strong>Kompass</strong> (Spiele-Menü) und ein <strong>Bett</strong> (verlassen).</p></li>
        <li><h3>Durch eine Tür laufen</h3><p>Du landest in der geschlossenen <strong>Spawn-Halle</strong>. An den Wänden ist für jedes Spiel eine <strong>Tür</strong> mit dem Spielnamen darüber (nach Kategorie sortiert) – einfach durchlaufen und du bist im <strong>Spielraum</strong>. Alternativ: Kompass → Spiel anklicken.</p></li>
        <li><h3>Spielfeld aussuchen</h3><p>Jeder Raum ist gleich groß und hat <strong>4 Spielfelder</strong> (eins pro Ecke, durch Glaswände getrennt). In der Raummitte stehen die <strong>4 Tische</strong> – darüber steht, ob jemand drin ist und wer. Klick auf einen Tisch = Raum erstellen oder beitreten. Sobald der Raum erstellt ist, steht das Spielfeld schon fertig aufgebaut da (Figuren, Karten, Würfel), du siehst also vor dem Start, wie es aussieht – spielbar ist es erst nach dem Start. Daneben hängt die <strong>Top 10</strong> des Spiels – ein Klick schaltet um zwischen z. B. Siegen, Punkten, Kills, Bestzeiten oder Höhe (Schleichen + Klick öffnet das Ranglisten-Menü). Das Portal in der Mitte bringt dich zurück zur Halle.</p></li>
        <li><h3>Zurück ins Survival</h3><p>Mit ${c('/minigames leave')} (oder dem Bett) geht's zurück an deinen letzten Ort – mit deinem Inventar. Läuft gerade ein Spiel, fragt dich der Server vorher, ob du wirklich gehen willst.</p></li>
      </ol>
      <p>Kein Schaden, kein Hunger, der Chat ist für alle sichtbar und deine Spielzeit läuft weiter. Alle Spiele werden an <strong>echten Spielfeldern in der Welt</strong> gespielt (keine Inventar-Spielbretter mehr) – <strong>auch auf Bedrock</strong>: Du tippst oder schlägst einfach direkt auf das Spielfeld, Menüs brauchst du dafür nicht. <strong>Fliegen</strong> ist in der Minigame-Welt erlaubt – außer bei Eisbootrennen, MLG-Wasser, Bogen-Schießstand, Schneeballschlacht, Knockback-FFA, Parkour, TNT-Run und Spleef. Den <strong>Kreativ-</strong> und den <strong>Zuschauermodus</strong> gibt es dort für niemanden. Wer sich in einen anderen Raum teleportiert, verlässt automatisch das vorherige Spiel.</p>
      <div class="callout warn"><p><strong>Kein AFK-Raum, kein Fluchtweg</strong> (<a href="regeln.html#r10-8">Regel 10.8</a>): Wer AFK ist (Spieler nach ${afkH('spieler')}, Sub nach ${afkH('sub')}, Premium nach ${afkH('premium')}), bekommt einen <strong>30-Sekunden-Countdown</strong> – bewegst du dich nicht, geht es zurück ins Survival. Dein Survival-Zustand ist eingefroren: Feuer, Effekte, Leben und Hunger sind danach genau wie vorher (Herzen heilen hier nicht). Im Kampf kommst du nicht hinein. Was du hier tust (Craften, Laufen, Springen …), zählt nicht für die Minecraft-Statistiken – Minigame-Statistiken und Server-Erfolge zählen natürlich.</p></div>

      <h2 id="spiele">Die Spiele</h2>
      <div class="mg-filters" role="group" aria-label="Spiele filtern">
        <button type="button" class="chip" data-f="alle" aria-pressed="true">Alle</button>
        <button type="button" class="chip" data-f="tisch" aria-pressed="false">🎲 Tisch &amp; Brett</button>
        <button type="button" class="chip" data-f="action" aria-pressed="false">⚡ Action-Arenen</button>
      </div>
      <ul class="games" id="mg-list">
        ${GAMES.map(gameLi).join('\n        ')}
      </ul>
      <p class="muted small">Jedes Spiel hat im Spiel eine Anleitung als Buch (Kompass → Spiel → „📖 Anleitung“ oder ${c('/minigames anleitung <Spiel>')}). Die Liste wird automatisch vom Server aktualisiert.</p>

      <h2 id="mg-raeume">Räume &amp; Passwort</h2>
      <ul>
        <li><strong>Offener Raum:</strong> jeder darf beitreten.</li>
        <li><strong>Raum mit Passwort:</strong> nur wer das Passwort kennt – perfekt, wenn du mit einer bestimmten Person spielen willst.</li>
        <li><strong>„📣 Mitspieler suchen“</strong> postet einen Klick-Knopf in den Chat.</li>
        <li>Viele Spiele haben Einstellungen, z. B. Runden (Eisbootrennen 1–10), Schwierigkeit (Minesweeper, Parkour) oder Modus und Brettgröße (Barricade).</li>
        <li>Eisbootrennen hat eine einzige große Strecke für bis zu 16 Fahrer – dort gibt es keine Passwort-Räume.</li>
        <li>Wer 2 Minuten nicht zieht oder den Raum verlässt, verliert. Damit das nicht aus Versehen passiert, gibt es beim Verlassen eine <strong>Sicherheitsabfrage</strong>.</li>
        <li><strong>Erste Minute:</strong> Verlässt jemand ein Spiel, das noch keine Minute läuft, wird es <strong>ohne Wertung abgebrochen</strong> – niemand verliert, niemand gewinnt (so lassen sich keine Siege oder Erfolge erschleichen).</li>
        <li><strong>Besondere Regeln:</strong> Kniffel allein ist erst ab 180 Punkten ein Sieg, 2048 nur mit der 2048-Kachel, beim Koffer gewinnt nur, wer mindestens 1 Item gepackt hat, und bei MLG-Wasser ist es unentschieden, wenn alle gleichzeitig scheitern. Wordle hat eine Tastatur auf dem Boden (Rot = löschen, Grün = abschicken) – du kannst das Wort aber auch in den Chat schreiben.</li>
      </ul>

      <h2 id="mg-fair">🎲 Fair und zufällig</h2>
      <ul>
        <li><strong>Wer anfängt, entscheidet immer der Zufall</strong> – egal, wer den Raum erstellt hat. Danach geht es <strong>im Uhrzeigersinn</strong> weiter.</li>
        <li>Plätze, Farben und Startpositionen werden beim Start zufällig verteilt (z. B. wer Weiß, X oder Rot spielt).</li>
        <li>Bei <strong>Mensch ärgere dich nicht</strong> und <strong>Barricade</strong> darfst du deine Farbe vor dem Start im Raum-Menü mit „🎨 Farbe wählen“ aussuchen – jede Farbe gibt es nur einmal. Wer nichts wählt, bekommt eine freie Farbe per Zufall.</li>
        <li>Würfel, Karten, Wörter und Felder sind echt zufällig – jede Würfelzahl kommt gleich oft.</li>
      </ul>

      <h2 id="mg-stats">Statistiken</h2>
      <p>Die Statistik zählt <strong>automatisch</strong> für alle Spieler – eine Anmeldung ist nicht mehr nötig. Gezählt werden: Lieblingsspiel, gespielt, gewonnen, verloren, unentschieden, Siegquote, beste Siegesserie, Punkte (Sieg 3, Unentschieden 1), Minigame-Spielzeit und Bestzeiten. Anzeigen im Kompass unter „📊 Meine Statistiken“ (als Menü) oder mit ${c('/minigames stats')}, Gesamt-Rangliste im Kompass oder mit ${c('/minigames top [Spiel]')} und auf der <a href="ranglisten.html">Ranglisten-Seite</a> – dort auch je Spiel.</p>
      <h2 id="mg-titel">🏅 Minigame-Titel</h2>
      <p>Für jedes Spiel gibt es einen eigenen Titel – zum Beispiel „Schach-Meister“, „Kniffel-König“ oder „Eis-Rennfahrer“. Du bekommst ihn nach <strong>1.000 gewerteten Siegen</strong> in diesem Spiel und wählst ihn im Kompass unter „🏅 Titel“.</p>
      <ul>
        <li><strong>Allein</strong> zählen nur erfolgreich beendete Runden, die du nicht verlassen hast.</li>
        <li><strong>Mit anderen</strong> muss das Spiel eine Mindestdauer haben. Verlässt jemand nach mindestens <strong>1 Minute</strong>, zählen Sieg und Niederlage trotzdem. Unentschieden zählen nicht.</li>
        <li>Gegen Spieler aus demselben Netz zählen keine Titel-Siege. Gegen dieselben Gegner kannst du so oft spielen, wie du willst.</li>
      </ul>
      <div class="callout warn"><p><strong>Fair bleiben:</strong> Absichtliches Verlieren lassen, Absprachen zum Punkte-Schieben oder Ausnutzen von Fehlern sind verboten (<a href="regeln.html#r10-1">Regel 10.1</a>). Als Strafe ist auch eine <strong>Minigame-Sperre</strong> möglich.</p></div>
    </div>`;

// ------------------------------------------------------------------ mods (aus mod-liste.md)
function inlineMd(t) {
  return esc(t).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/&quot;/g, '"');
}
function mods() {
  const md = fs.readFileSync('C:/Users/kunde/JustinZocktCommunity-Server/mod-liste.md', 'utf8').split(/\r?\n/);
  const top = []; let cur = null; let cat = null;
  for (const line of md) {
    let m;
    if ((m = line.match(/^## (.+)$/))) { cur = { title: m[1].replace(/\s*\(Stand[^)]*\)/, ''), cats: [], text: [] }; top.push(cur); cat = null; continue; }
    if ((m = line.match(/^### (.+)$/)) && cur) { cat = { title: m[1], items: [] }; cur.cats.push(cat); continue; }
    if ((m = line.match(/^- (.+)$/)) && cur) { if (cat) cat.items.push(m[1]); else cur.text.push(m[1]); continue; }
    if (line.trim() && cur && !line.startsWith('#')) cur.text.push(line.trim());
  }
  const sec = (t) => top.find((s) => s.title.toLowerCase().startsWith(t)) || { cats: [], text: [] };
  const ICO = { grundlagen: '🧱', leistung: '⚡', oberfl: '🖥️', bauen: '🏗️', karten: '🗺️', cheat: '☠️', sicht: '👁️', kampf: '⚔️', sonstig: '🚫' };
  const ico = (t) => { const k = Object.keys(ICO).find((x) => t.toLowerCase().startsWith(x)); return k ? ICO[k] : '•'; };
  const col = (s, cls, title) => `<div class="mod-col ${cls}">
          <h2>${title}</h2>
${s.cats.map((ct) => `          <div class="card mod-card"><h3><span aria-hidden="true">${ico(ct.title)}</span> ${esc(ct.title)}</h3><ul class="mod-list">${ct.items.map((i) => `<li>${inlineMd(i)}</li>`).join('')}</ul></div>`).join('\n')}
        </div>`;
  const hinweis = sec('hinweis').text.map(inlineMd).join(' ');
  const pruef = sec('so prüft');
  return `${head('Fair Play', 'Erlaubte &amp; verbotene Mods', 'Welche Mods und Clients du auf der JustinZocktCommunity nutzen darfst – und welche sofort zum Bann führen. <strong>Alles, was hier nicht als erlaubt steht, ist verboten.</strong>')}
    <div class="wrap">
      <div class="callout"><p>❓ <strong>Deine Mod ist nicht dabei?</strong> Dann frag <strong>vorher</strong> per Ticket im Discord-Kanal <strong>#tickets</strong> nach. Ausreden wie „Ich wusste nicht, dass die Mod verboten ist“ gelten nicht (<a href="regeln.html#r4-4">Regel 4.4</a>). Grundlage sind die <a href="regeln.html#r4">Regeln, Abschnitt 4</a>.</p></div>
      <div class="callout warn"><p>📱 <strong>Bedrock (Handy, Konsole, Windows):</strong> Auch mit Bedrock sind <strong>keine Mods, Addons, Resource-Packs, Hacks oder Clients mit Vorteilen</strong> erlaubt (z. B. Toolbox, Horion oder X-Ray-Packs). Reine Optik ohne Vorteil ist okay – im Zweifel vorher per Ticket fragen. Bedrock-Bugs dürfen nicht ausgenutzt werden (<a href="regeln.html#r11">Regel 11</a>).</p></div>
      <div class="search" role="search">
        <label for="mod-search" class="sr-only">Mods durchsuchen</label>
        <span aria-hidden="true">🔎</span>
        <input id="mod-search" type="search" placeholder="Mod suchen, z. B. Sodium, Xaero, Freecam …" autocomplete="off">
        <span class="cmd-count" id="mod-count" aria-live="polite"></span>
      </div>
      <p class="callout warn no-results" id="mod-none">Nicht in der Liste gefunden – das heißt: <strong>nicht erlaubt</strong>, solange das Team nichts anderes sagt. Frag vorher per Ticket in #tickets.</p>
      <div class="mod-cols">
        ${col(sec('erlaubt'), 'ok', '✅ Erlaubt')}
        ${col(sec('verboten'), 'bad', '⛔ Verboten')}
      </div>
      <h2>Gut zu wissen</h2>
      <p>${hinweis}</p>
      ${pruef.text.length ? `<div class="card"><h3>So prüft der Server</h3><ul>${pruef.text.map((t) => `<li>${inlineMd(t)}</li>`).join('')}</ul></div>` : ''}
    </div>`;
}

// ------------------------------------------------------------------ raenge
// Kauf-Hinweis (Ablauf, Tebex, Rueckbuchung, MwSt.) – steht auf premium.html
const PREMIUM_HINWEIS = `<div class="callout info"><p><strong>So läuft der Kauf:</strong> Im Shop meldest du dich mit deinem <strong>Minecraft-Namen</strong> an (Bedrock: Xbox-Name, Leerzeichen als <code>_</code>). Der Rang kommt automatisch auf genau diesen Account – prüfe den Namen deshalb genau. Spätestens nach ein paar Minuten ist Premium aktiv, auch wenn du offline bist.</p>
      <p>Verkäufer und Zahlungsabwickler ist <strong>Tebex</strong> (Tebex Limited) als Wiederverkäufer. Tebex stellt die Rechnung, berechnet die Steuern deines Landes und es gelten die Bedingungen von Tebex, die du beim Kauf siehst. Die Steuern kommen auf die Standardpreise drauf – den Endpreis siehst du bei Tebex vor dem Bezahlen.</p>
      <p>Wird eine Zahlung zurückgebucht oder erstattet, wird Premium sofort entfernt. Premium ist ein freiwilliger Vorteil – kein Anspruch auf bestimmte Funktionen, wenn sich der Server weiterentwickelt. Gekauftes Premium schützt nicht vor Strafen bei Regelverstößen.</p></div>`;
// Kurze Preisliste (Startseite, raenge.html)
const priceChips = () => `<ul class="price-chips" aria-label="Premium-Preise">${PREMIUM_PREISE.map((p, i) => `<li${i === PREMIUM_PREISE.length - 1 ? ' class="best"' : ''}><span>${p.dauer}<small>${i === PREMIUM_PREISE.length - 1 ? '⭐ Bester Preis · ' : ''}${p.spar > 0 ? `${p.proMonat} pro Monat · ${p.spar} % günstiger als monatlich` : 'monatlich'}</small></span><b>${p.preis}</b></li>`).join('')}</ul>`;
// Alle Premium-Vorteile – EINE Liste fuer die Premium-Karte auf raenge.html und fuer premium.html
const PREMIUM_VORTEILE = () => [
  `AFK erst nach ${afkH('premium')}`,
  `1 Home (${c('/sethome')}, ${c('/home')}) – sofort, ohne Wartezeit und ohne Abklingzeit`,
  `Keine Abklingzeit bei ${c('/spawn')}`,
  `Bis zu 70 Claims, 10 % Rabatt pro Chunk`,
  `256 Kisten-Sicherungen`,
  `Eigene Clan-Farbe (als Clan-Gründer)`,
  `Endertruhe mit 54 statt 27 Plätzen, auch mobil mit ${c('/ec')}`,
  `${c('/craft')} – mobile Werkbank`,
  `${c('/anvil')}, ${c('/stonecutter')}, ${c('/grindstone')}, ${c('/loom')} – mobile Arbeitsblöcke`,
  `${c('/tpa')} – Teleport-Anfragen an andere Spieler`,
  `Premium-Glücksrad in ${c('/rewards')} – zusätzlich zum Glücksrad für alle`,
  `Premium-Rolle im Discord`,
  `${c('/signieren')} – eigene Items signieren (Name, Datum, Uhrzeit)`,
  `${c('/invsort')} – Inventar oder Truhe sortieren`,
  `Amboss: Umbenennen ohne XP-Kosten, mit Farben`,
  `${c('/shop')} überall nutzen, nicht nur am Spawn`,
  `Etwas mehr Glück bei seltenen Funden (Bücher, Coins)`,
  `Premium-Rang in Tablist, Chat und Scoreboard`,
];
const raenge = () => `${head('Vorteile', 'Ränge &amp; Vorteile', 'Jeder freigeschaltete Spieler hat das volle Spielerlebnis. Twitch-Subs und Premium-Spieler bekommen als Dankeschön ein paar praktische Extras obendrauf. Die Zahlen kommen live vom Server.')}
    <div class="wrap">
      ${jump([['#t-spieler', '🧑 Die Ränge'], ['#vergleich', '📊 Im Vergleich'], ['#claims', '🗺️ Claims'], ['#neu', '✨ Neu'], ['#rang-bekommen', '🎟️ So bekommst du den Rang'], ['#premium-kaufen', '👑 Premium kaufen']])}
      <div class="callout info"><p>💚 <strong>Ohne Rang verpasst du nichts Wichtiges:</strong> Alle Skills, Erfolge, Minigames, Events, Clans, der Shop, Claims, Kistenschutz und dein tägliches Glücksrad gehören jedem. Sub und Premium machen manches nur etwas bequemer – zum Beispiel mit einem Home oder mobilen Arbeitsblöcken.</p></div>
      <div class="tiers">
        <article class="tier" aria-labelledby="t-spieler">
          <span class="tier-ico" aria-hidden="true">🧑</span>
          <h3 id="t-spieler">Spieler</h3>
          <p class="muted">Alle freigeschalteten Community-Mitglieder.</p>
          <p class="price">${coinsH('spieler')} <small>JC / Stunde</small></p>
          <ul>
            <li>Das volle Spielerlebnis: alle Skills, Erfolge, Events und alle Minigames</li>
            <li>Tägliches Glücksrad in ${c('/rewards')} mit allen Stufen bis Legendär</li>
            <li>Clans, Freunde, Shop und Voten</li>
            <li>Bis zu 30 Claims (Chunks), 128 Kisten-Sicherungen</li>
            <li>${c('/spawn')} jederzeit (5 Min. Abklingzeit) und dein Bett als Respawn</li>
            <li>AFK erst nach ${afkH('spieler')} ohne Eingabe</li>
          </ul>
        </article>
        <article class="tier sub" aria-labelledby="t-sub">
          <span class="badge purple tag">Twitch</span>
          <span class="tier-ico" aria-hidden="true">💜</span>
          <h3 id="t-sub">Sub</h3>
          <p class="muted">Automatisch für Twitch-Subs von JustinZockt03.</p>
          <p class="price">${coinsH('sub')} <small>JC / Stunde</small></p>
          <ul>
            <li>AFK erst nach ${afkH('sub')}</li>
            <li>1 Home (${c('/sethome')}, ${c('/home')}) – 5 s Wartezeit, 5 Min. Abklingzeit</li>
            <li>Keine Abklingzeit bei ${c('/spawn')}</li>
            <li>Bis zu 50 Claims, 5 % Rabatt pro Chunk</li>
            <li>192 Kisten-Sicherungen</li>
            <li>Eigene Clan-Farbe (als Clan-Gründer)</li>
            <li>${c('/ec')} – mobile Endertruhe</li>
            <li>${c('/craft')} – mobile Werkbank</li>
            <li>${c('/anvil')}, ${c('/stonecutter')}, ${c('/grindstone')}, ${c('/loom')} – mobile Arbeitsblöcke</li>
            <li>Sub-Glücksrad in ${c('/rewards')} – zusätzlich zum Glücksrad für alle</li>
            <li>Etwas mehr Glück bei seltenen Funden (Bücher, Coins)</li>
            <li>Sub-Rang in Tablist, Chat und Scoreboard</li>
          </ul>
        </article>
        <article class="tier premium" aria-labelledby="t-premium">
          <span class="badge gold tag">Top-Rang</span>
          <span class="tier-ico" aria-hidden="true">👑</span>
          <h3 id="t-premium">Premium</h3>
          <p class="muted">Der besondere Spieler-Rang.</p>
          <p class="price">${coinsH('premium')} <small>JC / Stunde</small></p>
          <ul>
            ${PREMIUM_VORTEILE().map((v) => `<li>${v}</li>`).join('\n            ')}
          </ul>
          <a class="btn btn-gold" href="premium.html"><span aria-hidden="true">👑</span> Premium holen – ab ${PREMIUM_PREISE[0].preis}</a>
        </article>
      </div>

      <h2 id="vergleich">Im Vergleich</h2>
      ${table(['Vorteil', 'Spieler', 'Sub', 'Premium'], [
        ['Justin Coins pro aktiver Stunde', coinsH('spieler'), coinsH('sub'), coinsH('premium')],
        ['AFK nach (ohne Eingabe)', afkH('spieler'), afkH('sub'), afkH('premium')],
        [`Homes (${c('/sethome')}, ${c('/home')})`, info('homes.spieler', '0'), info('homes.sub', '1'), info('homes.premium', '1')],
        [`${c('/home')}: Wartezeit / Abklingzeit`, '–', '5 Sek. / 5 Min.', 'sofort / keine'],
        [`Abklingzeit ${c('/spawn')}`, '5 Min.', 'keine', 'keine'],
        [`Tägliche Glücksräder (${c('/rewards')})`, 'Glücksrad', 'Glücksrad + Sub-Rad', 'Glücksrad + Premium-Rad'],
        ['Claims (Chunks) höchstens', info('claims.max_chunks', '30'), info('claims.max_chunks_sub', '50'), info('claims.max_chunks_premium', '70')],
        ['Rabatt pro Chunk', '–', info('claims.rabatt_sub_prozent', '5 %', 'prozent'), info('claims.rabatt_premium_prozent', '10 %', 'prozent')],
        ['Kisten-Sicherungen höchstens', info('claims.truhen_spieler', '128'), info('claims.truhen_sub', '192'), info('claims.truhen_premium', '256')],
        ['Clan-Farbe ändern (als Gründer)', '– (weiß)', '✅', '✅'],
        [`Mobile Endertruhe ${c('/ec')}`, '–', '✅', '✅'],
        [`Mobile Werkbank ${c('/craft')}`, '–', '✅', '✅'],
        [`Teleport-Anfragen ${c('/tpa')}`, '–', '–', '✅'],
        [`Items signieren ${c('/signieren')}`, '–', '–', '✅'],
        [`Sortieren ${c('/invsort')}`, '–', '–', '✅'],
        [`Mobiler Amboss, Steinsäge, Schleifstein, Webstuhl`, '–', '✅', '✅'],
        ['Amboss: Umbenennen ohne XP, mit Farben', '–', '–', '✅'],
        [`${c('/shop')} außerhalb des Spawns`, '–', '–', '✅'],
        ['Glück bei seltenen Funden', 'normal', 'etwas mehr', 'noch etwas mehr'],
        ['Rang in Tablist, Chat und Scoreboard', '–', 'Sub', 'Premium'],
        ['Skills, Clans, Freunde, Shop, Minigames, Erfolge, Events', '✅', '✅', '✅'],
      ], { label: 'Vergleich der Ränge', rowHead: true })}
      <p class="muted small">Wer Sub <strong>und</strong> Premium ist, bekommt von beidem das Bessere und dreht alle 3 Glücksräder. AFK heißt: Du hast eine Weile nichts gemacht. Dann zählt die Zeit nicht für Coins. Das Team (Owner, Admin, Developer, Moderator, Builder, Supporter) hat ebenfalls keine Teleport-Abklingzeit. Die Werte stellt das Team ein – Coins und AFK-Zeiten auf dieser Seite kommen direkt vom Server.</p>

      <h2 id="claims">Claims: Preise und Grenzen</h2>
      ${table(['Welt', 'Preis pro Chunk', 'Sub (−5 %)', 'Premium (−10 %)'], [
        ['Oberwelt', '2.000 JC', '1.900 JC', '1.800 JC'],
        ['Nether (×2)', '4.000 JC', '3.800 JC', '3.600 JC'],
        ['End (×3)', '6.000 JC', '5.700 JC', '5.400 JC'],
      ], { label: 'Claim-Preise', rowHead: true })}
      <p class="muted small">Grundpreis für Spieler ${info('claims.preis', '2.000')} JC – Sub und Premium bekommen ihren Rabatt auf diesen Preis (Stand der Tabelle: Standardwerte). Liegt ein Bauwerk im Chunk (z. B. Dorf, Tempel, Festung), kommt ein <strong>Strukturzuschlag</strong> dazu – der Rabatt gilt auch dafür. Kaufen mit ${c('/claim chunk')} und dem grünen Knopf in der Hotbar – ${c('/claim')} allein zeigt nur die Hilfe. Claimen geht erst ab <strong>250 Blöcken Abstand von 0/0</strong> (alle Dimensionen). Alles zu Claims, Flags und Kistenschutz: <a href="claims.html">Claims &amp; Kistenschutz</a>.</p>

      <h2 id="neu">Neu auf dem Server</h2>
      <div class="grid">
        <div class="card"><span class="icon" aria-hidden="true">🎡</span><h3>Tägliche Glücksräder</h3><p>${c('/rewards')}: Jeden Tag ein Gratis-Dreh für alle, dazu Sub- und Premium-Rad. <a href="belohnungen.html">Mehr</a></p></div>
        <div class="card"><span class="icon" aria-hidden="true">🤝</span><h3>Freunde</h3><p>Freundschaftsanfragen mit ${c('/freunde')} und mit einem Klick Rechte für alle Freunde in Kisten und Claims. <a href="claims.html#freunde">Mehr</a></p></div>
        <div class="card"><span class="icon" aria-hidden="true">🔒</span><h3>Kisten bearbeiten</h3><p>Schleichen + Rechtsklick mit leerer Hand (Bedrock: Schleichen + Schlagen): Mitglieder mit „Nur reinlegen“ oder „Nur rausnehmen“, Name, Trichter, Redstone. <a href="claims.html#kisten">Mehr</a></p></div>
        <div class="card"><span class="icon" aria-hidden="true">⚑</span><h3>Bessere Claims</h3><p>Kauf-Angebot mit Bestätigung, Rollen Besucher/Benutzen/Bauen, über 40 Flags und der Claim-Name als Leiste oben. <a href="claims.html">Mehr</a></p></div>
        <div class="card"><span class="icon" aria-hidden="true">🛡️</span><h3>Clan-Rang Ältester</h3><p>Neu zwischen Leiter und Mitglied. Den Clan-Tag über dem Kopf sehen nur noch Clan-Mitglieder. <a href="clans.html#c-raenge">Mehr</a></p></div>
        <div class="card"><span class="icon" aria-hidden="true">🏅</span><h3>Minigame-Titel</h3><p>1.000 gewertete Siege in einem Spiel = eigener Titel. <a href="minigames.html#mg-titel">Mehr</a></p></div>
        <div class="card"><span class="icon" aria-hidden="true">🛏️</span><h3>Respawn am Spawn</h3><p>Nach dem Tod landest du immer am Spawn – außer du hast ein Bett oder einen Seelenanker gesetzt.</p></div>
        <div class="card"><span class="icon" aria-hidden="true">🛡️</span><h3>Clans</h3><p>Clan-Name und -Tag sind nach der Gründung fest. Neue Clans sind weiß, die Farbe ändern Gründer mit Sub oder Premium. Die gemeinsame Clan-Spielzeit ist sichtbar (${c('/clan info')}, <a href="ranglisten.html">Ranglisten</a>).</p></div>
        <div class="card"><span class="icon" aria-hidden="true">✍️</span><h3>Signierte Bücher</h3><p>Beim Signieren bekommt ein Buch automatisch Datum und Uhrzeit.</p></div>
        <div class="card"><span class="icon" aria-hidden="true">🥚</span><h3>Drachenei</h3><p>Das Ei bekommt, wer dem ersten Enderdrachen den letzten Treffer gibt. Es ist unzerstörbar, nur der Besitzer kann es aufheben oder aus Kisten nehmen, beim Tod bleibt es bei dir, und den Besitzer wechselt es nur über den Shop.</p></div>
        <div class="card"><span class="icon" aria-hidden="true">🗳️</span><h3>Voten</h3><p>Mit ${c('/vote')} für den Server abstimmen – 150 Justin Coins pro Vote-Seite alle 24 Stunden, dazu ein täglich wechselnder Tagesbonus. <a href="belohnungen.html#voten">Mehr</a></p></div>
        <div class="card"><span class="icon" aria-hidden="true">🛠️</span><h3>Wartungsmodus</h3><p>Bei Updates gibt es einen eigenen Wartungsmodus: Dann kann nur das Team auf den Server.</p></div>
        <div class="card"><span class="icon" aria-hidden="true">📱</span><h3>Bedrock</h3><p>Auch für Bedrock (Handy, Konsole, Windows) – <a href="beitreten.html#bedrock">so geht’s</a>.</p></div>
      </div>

      <h2 id="rang-bekommen">So bekommst du den Rang</h2>
      <div class="grid-2">
        <div class="card"><span class="icon" aria-hidden="true">💜</span><h3>Sub</h3><p>Abonniere JustinZockt03 auf Twitch. Weil dein Twitch-Account beim Freischalten verbunden wurde, bekommst du den Sub-Rang <strong>automatisch</strong> – und verlierst ihn, wenn das Abo endet.</p></div>
        <div class="card"><span class="icon" aria-hidden="true">👑</span><h3>Premium</h3><p>Premium kannst du online im <a href="premium.html">Premium-Shop</a> kaufen. Im Spiel zeigt dir ${c('/premium')} deinen Status und den Link, ${c('/kaufen')} öffnet direkt den Shop-Link. Läuft die Zeit ab, enden Rang, Vorteile und Discord-Rolle automatisch. Das Team hat Premium <strong>nicht</strong> automatisch – Premium ist ein eigener Spieler-Rang.</p></div>
      </div>

      <h2 id="premium-kaufen">Premium kaufen</h2>
      <div class="premium-band">
        <div>
          <p><strong>Premium gibt es direkt hier auf der Website</strong> im Premium-Shop. Einführungspreise – Premium läuft für die gewählte Zeit und verlängert sich nicht von selbst, außer du wählst im Shop ausdrücklich ein Abo.</p>
          <p class="muted small">Ablauf, Bezahlung über Tebex, Mehrwertsteuer und Rückbuchungen: alles auf der <a href="premium.html#ablauf">Premium-Seite</a>.</p>
          <div class="btn-row"><a class="btn btn-gold" href="premium.html"><span aria-hidden="true">👑</span> Zur Premium-Seite</a>${SHOP_URL ? ext(SHOP_URL, 'Direkt zum Shop', ' class="btn btn-ghost"') : ''}</div>
        </div>
        ${priceChips()}
      </div>
      <div class="callout info"><p>Das Team (Owner, Admin, Developer, Moderator, Builder, Supporter) und seine Rechte findest du auf der Seite <a href="team.html">Team</a>. Du willst selbst ins Team? <a href="team.html#bewerben">So bewirbst du dich</a>.</p></div>
    </div>`;

// ------------------------------------------------------------------ erfolge.html (liest die Liste direkt aus Achievements.java)
const ACH_JAVA = 'C:/Users/kunde/JustinZocktCommunity-Server/justincore/src/main/java/de/justinzockt/justincore/achievements/Achievements.java';
const FRAME = { task: ['Fortschritt', 'gray'], goal: ['Ziel', 'green'], challenge: ['Aufgabe', 'gold'] };
const CAT_ICON = [['minigame', '🎮'], ['tod', '💀'], ['spielzeit', '⏱'], ['coin', '🪙'], ['skill', '📈'], ['gemeinschaft', '🛡️'], ['clan', '🛡️'], ['advent', '🎄'], ['fund', '💎'], ['vote', '🗳️'], ['pvp', '⚔️'], ['shop', '🛒'], ['handel', '🛒'], ['angel', '🎣'], ['loot', '🧰'], ['truhe', '🧰'], ['afk', '💤'], ['zahltag', '💰'], ['samml', '📦'], ['ausr', '🛡️'], ['entdeck', '🧭'], ['welt', '🧭'], ['alle', '👑']];
// Teilt die Argumente eines Java-Aufrufs an den Kommas der obersten Ebene
function splitArgs(s) {
  const out = []; let depth = 0; let cur = ''; let str = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (str) { cur += ch; if (ch === '\\') { cur += s[++i]; } else if (ch === '"') str = false; continue; }
    if (ch === '"') { str = true; cur += ch; continue; }
    if (ch === '(') depth++;
    if (ch === ')') { if (depth === 0) { out.push(cur); return out; } depth--; }
    if (ch === ',' && depth === 0) { out.push(cur); cur = ''; continue; }
    cur += ch;
  }
  out.push(cur); return out;
}
// Wertet einen einfachen Java-String-Ausdruck aus: "a" + name + "b" -> "a{Spiel}b"
const evalStr = (expr) => {
  let r = ''; const re = /"((?:[^"\\]|\\.)*)"|\b(name|t\.plainName\(\))\b/g; let m;
  while ((m = re.exec(expr))) r += m[1] !== undefined ? m[1].replace(/\\"/g, '"') : '{Spiel}';
  return r;
};
function parseErfolge() {
  const src = fs.readFileSync(ACH_JAVA, 'utf8');
  const start = src.indexOf('void buildDefs()');
  if (start < 0) throw new Error('Achievements.java: buildDefs() nicht gefunden');
  const endM = /\n {4}\}\r?\n/.exec(src.slice(start));
  let body = src.slice(start, start + (endM ? endM.index : src.length - start));
  // Weitere Erfolge stehen in eigenen Methoden (z. B. buildNewDefs) – an der Aufrufstelle einsetzen.
  // buildSecretDefs bleibt bewusst weg (geheime Erfolge).
  body = body.replace(/\n\s*(buildNewDefs)\(\);/g, (all, fn) => {
    const i = src.indexOf(`void ${fn}()`);
    if (i < 0) return '';
    const e = /\n {4}\}\r?\n/.exec(src.slice(i));
    return '\n' + src.slice(i, i + (e ? e.index : 0));
  });
  const cats = []; let cat = null;
  const UML = (t) => t.replace(/Ausruestung/g, 'Ausrüstung');
  const re = /\/\/ ---\s*(.+)|\b(?:def|newDef)\(/g; let m;
  while ((m = re.exec(body))) {
    if (m[1]) { cat = { title: UML(m[1].trim().replace(/\s*\(.*\)\s*$/, '')), items: [] }; cats.push(cat); continue; }
    const args = splitArgs(body.slice(m.index + m[0].length));
    if (args.length < 6) continue;
    const title = evalStr(args[3]); const desc = evalStr(args[4]); const frame = evalStr(args[5]);
    if (!title) continue;
    if (!cat) { cat = { title: 'Allgemein', items: [] }; cats.push(cat); }
    cat.items.push({ title, desc, frame, perGame: title.includes('{Spiel}') || desc.includes('{Spiel}') });
  }
  const n = cats.reduce((a, x) => a + x.items.length, 0);
  if (n < 5) throw new Error('Achievements.java: zu wenige Erfolge erkannt (' + n + ')');
  return cats.filter((x) => x.items.length);
}
const erfolgePage = () => {
  const cats = parseErfolge();
  const games = GAMES.map((g) => g[0]);
  const fixed = cats.reduce((a, x) => a + x.items.filter((i) => !i.perGame).length, 0);
  const per = cats.reduce((a, x) => a + x.items.filter((i) => i.perGame).length, 0);
  const total = fixed + per * games.length;
  const badge = (f) => { const [t, cl] = FRAME[f] || ['Erfolg', 'gray']; return `<span class="badge ${cl}">${t}</span>`; };
  const ico = (t) => { const k = CAT_ICON.find(([x]) => t.toLowerCase().includes(x)); return k ? k[1] : '🏆'; };
  const sec = cats.map((ct, idx) => {
    const fixedItems = ct.items.filter((i) => !i.perGame);
    const perItems = ct.items.filter((i) => i.perGame);
    const rows = fixedItems.map((i) => [`<strong>${esc(i.title)}</strong>`, esc(i.desc), badge(i.frame)]);
    if (perItems.length) {
      rows.push([`<strong>${esc(perItems.map((i) => i.title.replace(/\s*\{Spiel\}/, '').replace(/ in$/, '')).join(' / '))} in jedem Minigame</strong>`,
        `Für jedes der ${games.length} Minigames einzeln: ${esc(perItems.map((i) => i.desc.replace('{Spiel}', '„Spiel“')).join(' · '))}`,
        perItems.map((i) => badge(i.frame)).join(' ')]);
    }
    const id = 'e-' + (idx + 1);
    return `      <section aria-labelledby="${id}">
        <h2 id="${id}"><span aria-hidden="true">${ico(ct.title)}</span> ${esc(ct.title)}</h2>
        ${table(['Erfolg', 'So schaffst du ihn', 'Art'], rows, { label: 'Erfolge ' + ct.title })}
      </section>`;
  }).join('\n');
  return `${head('Erfolge', 'Alle JZC-Erfolge', `Im Fortschritte-Menü (Taste <kbd>L</kbd>) gibt es einen eigenen Reiter <strong>„JustinZocktCommunity“</strong> – mit rund ${de(total)} Erfolgen von Minigames über Skills bis zur Spielzeit.`)}
    <div class="wrap">
      <div class="callout info"><p>🏆 Jeder Erfolg erscheint mit Einblendung oben rechts. Was du schon geschafft hast, wird beim Join automatisch nachgetragen. Wer die meisten Erfolge hat (Minecraft-Fortschritte <strong>und</strong> JZC-Erfolge, ohne Rezepte), siehst du in der <a href="ranglisten.html">Rangliste „Erfolge“</a>.</p></div>
      <p class="muted small">Arten wie im Spiel: ${badge('task')} normaler Erfolg, ${badge('goal')} größeres Ziel, ${badge('challenge')} schwere Aufgabe.</p>
      <nav class="toc" aria-labelledby="erf-toc"><h2 id="erf-toc">Kategorien</h2><ol>${cats.map((ct, i) => `<li><a href="#e-${i + 1}">${esc(ct.title)}</a></li>`).join('')}</ol></nav>
${sec}
      <details><summary>Für welche Minigames gibt es eigene Erfolge?</summary><div class="details-body"><p>${esc(games.join(', '))}.</p></div></details>
    </div>`;
};

// ------------------------------------------------------------------ premium.html (eigene Kaufseite)
// Preise kommen aus lib.js (PREMIUM_PREISE), Vorteile aus PREMIUM_VORTEILE (gleiche Liste wie auf raenge.html).
// Wichtig: KEINE Streichpreise / "statt"-Preise – nur die echten Einführungspreise.
const plan = (p, i) => {
  const best = i === PREMIUM_PREISE.length - 1;
  return `<article class="plan${best ? ' best' : ''}" aria-labelledby="plan-${i}">${best ? '<span class="plan-flag">⭐ Beliebt · Bester Preis</span>' : ''}
          <h3 id="plan-${i}">${p.dauer}</h3>
          <p class="plan-price">${p.preis}</p>
          <p class="muted small">zzgl. Steuern</p>
          <p class="plan-sub">${p.spar > 0 ? `${p.proMonat} pro Monat<br><strong>${p.spar} % günstiger</strong> als monatlich` : 'Laufzeit 1 Monat<br>zum Reinschnuppern'}</p>
          ${shopBtn(`${p.dauer} kaufen`, best ? 'btn btn-gold' : 'btn btn-ghost')}
        </article>`;
};
const premium = () => `${head('Premium-Shop', '<span aria-hidden="true">👑</span> Premium kaufen', 'Hol dir den Premium-Rang mit allen Extras – ganz einfach hier über die Website im Premium-Shop. Wähle 1, 6 oder 12 Monate: Je länger, desto günstiger.')}
    <div class="wrap">
      ${jump([['#preise', '💶 Preise'], ['#vorteile', '✨ Vorteile'], ['#ablauf', '🧾 So läuft der Kauf'], ['#im-spiel', '⌨️ Im Spiel'], ['#gut-zu-wissen', 'ℹ️ Gut zu wissen']])}
      <h2 id="preise">Preise</h2>
      <p>Einführungspreise. <strong>Alle Preise zzgl. Steuern:</strong> Beim Bezahlen kommen auf die Standardpreise noch die Steuern deines Landes drauf (Tebex zeigt dir den Endpreis vor dem Bezahlen). Premium läuft für die gewählte Zeit und verlängert sich nicht von selbst, außer du wählst im Shop ausdrücklich ein Abo.</p>
      <div class="plans">
        ${PREMIUM_PREISE.map(plan).join('\n        ')}
      </div>
      <div class="btn-row">${shopBtn('👑 Zum Premium-Shop', 'btn btn-gold btn-lg')}</div>
      <p class="muted small">Der Shop öffnet sich in einem neuen Tab. Im Spiel bekommst du den Link mit ${c('/kaufen')} oder ${c('/premium')}.</p>

      <h2 id="vorteile">Das bekommst du mit Premium</h2>
      <p>Premium ist ein Dankeschön für deine Unterstützung. Alles Wichtige – Skills, Events, Minigames, Glücksrad und mehr – gibt es auch ohne Rang. Premium macht das Spielen einfach etwas bequemer:</p>
      <ul class="perk-list">
        <li>${coinsH('premium')} Justin Coins pro aktiver Stunde (Spieler: ${coinsH('spieler')}, Sub: ${coinsH('sub')})</li>
        ${PREMIUM_VORTEILE().map((v) => `<li>${v}</li>`).join('\n        ')}
      </ul>
      <p><a href="raenge.html#vergleich">Spieler, Sub und Premium im Vergleich →</a></p>

      <h2 id="ablauf">So läuft der Kauf</h2>
      <ol class="steps">
        <li><h3>Shop öffnen</h3><p>Klick auf <strong>„Zum Premium-Shop“</strong> – oder gib im Spiel ${c('/kaufen')} bzw. ${c('/premium')} ein, dann bekommst du den Link.</p></li>
        <li><h3>Mit deinem Minecraft-Namen anmelden</h3><p>Java: dein Minecraft-Name. Bedrock: dein Xbox-Name, Leerzeichen als ${c('_')}. Prüf den Namen genau – der Rang kommt auf genau diesen Account.</p></li>
        <li><h3>Laufzeit wählen und bezahlen</h3><p>1, 6 oder 12 Monate auswählen und über Tebex bezahlen.</p></li>
        <li><h3>Fertig</h3><p>Spätestens nach ein paar Minuten ist Premium aktiv – auch wenn du gerade offline bist. Mit ${c('/premium')} siehst du deinen Status.</p></li>
      </ol>
      ${PREMIUM_HINWEIS}

      <h2 id="im-spiel">Im Spiel</h2>
      <div class="grid-2">
        <div class="card"><span class="icon" aria-hidden="true">🛒</span><h3>${c('/kaufen')}</h3><p>Zeigt dir den Link zum Premium-Shop. Geht auch als ${c('/store')}, ${c('/buy')}, ${c('/premiumshop')} oder ${c('/webshop')}.</p></div>
        <div class="card"><span class="icon" aria-hidden="true">👑</span><h3>${c('/premium')}</h3><p>Zeigt deinen Premium-Status und den Link zum Shop.</p></div>
      </div>

      <h2 id="gut-zu-wissen">Gut zu wissen</h2>
      <ul>
        <li><strong>Premium ist ein eigener Spieler-Rang.</strong> Auch Team-Mitglieder haben Premium <strong>nicht</strong> automatisch.</li>
        <li><strong>Twitch-Subs</strong> bekommen den Sub-Rang automatisch über Twitch – das hat mit Premium nichts zu tun. <a href="raenge.html#rang-bekommen">So bekommst du den Rang</a></li>
        <li>Läuft die Zeit ab, enden Rang, Vorteile und Discord-Rolle automatisch.</li>
        <li>Fragen zum Kauf? Schreib ein Ticket im Discord-Kanal <strong>#tickets</strong>.</li>
      </ul>
      <div class="btn-row">${shopBtn('👑 Zum Premium-Shop', 'btn btn-gold btn-lg')}<a class="btn btn-ghost" href="raenge.html">Alle Ränge ansehen</a></div>
    </div>`;

module.exports = { ranglisten, minigames, mods, raenge, erfolgePage, premium, priceChips, PREMIUM_VORTEILE, GAMES };
