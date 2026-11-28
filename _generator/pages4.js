// Glücksräder & Votes (belohnungen.html), Claims, Kistenschutz & Freunde (claims.html)
// Quellen: justincore rewards.yml + rewards/*.java, config.yml (vote.*, claims.*, chests.*, freunde.*),
// protect/ClaimFlag.java, protect/ProtectMenu.java, protect/LockAccess.java, command/ClaimCommands.java, social/Friends.java.
// WICHTIG: Bei Gewinnen nur Stufen nennen – NIE Prozente, Gewichte oder Chancen.
const { VOTE_URL, esc, c, head, table, info, jump } = require('./lib.js');

// ------------------------------------------------------------------ Glücksräder & Votes
const TAGESBONUS = [
  ['Montag', '6 Eisenbarren, 16 Kohle oder 75 Justin Coins'],
  ['Dienstag', '12 Brot, 8 gebratenes Rindfleisch oder 4 Goldene Karotten'],
  ['Mittwoch', '24 Eichenstämme, 24 Fichtenstämme oder 16 Kirschstämme'],
  ['Donnerstag', '16 Redstone, 12 Lapislazuli oder 16 Netherquarz'],
  ['Freitag', '2 Enderperlen, 24 Pfeile oder 6 Erfahrungsfläschchen'],
  ['Samstag', '100 Justin Coins, 5 Goldbarren oder 1 Diamant'],
  ['Sonntag', '1 Goldener Apfel, 4 Smaragde oder 8 Erfahrungsfläschchen'],
];
const RAD_STUFEN = [
  ['Gewöhnlich', 'gray', 'Coins, Kohle, Eisen-, Kupfer- und Goldbarren, Redstone, Lapislazuli, Holzstämme, Baublöcke, Essen, Erfahrungsfläschchen, Enderperlen, Pfeile, Diamanten, ein verzaubertes Buch, ein Prüfungsschlüssel (Trial Key) oder eine Schmiedevorlage'],
  ['Selten', 'info', 'Erzblöcke (Eisen, Gold, Lapis, Redstone, Kohle), Smaragde oder Goldene Äpfel'],
  ['Sehr selten', 'purple', 'viele Coins, ein Verzauberter Goldener Apfel, ein Totem der Unsterblichkeit oder ein Diamantblock'],
  ['Ultra selten', 'gold', 'ein Schwerer Kern (Heavy Core), ein Telekinesis-Buch oder ein Timber-Buch'],
  ['Legendär', 'red', 'ein Mending-Buch oder ein Soulbound-Buch – im Sub-Rad zusätzlich eine Elytra, im Premium-Rad zusätzlich ein Spawner-Ei'],
];
const voteBtn = (text = 'Jetzt voten') => `<a class="btn btn-primary" href="${VOTE_URL}" target="_blank" rel="noopener noreferrer" data-vote-link>${text}<span class="sr-only"> (öffnet in neuem Tab)</span></a>`;

const belohnungen = () => `${head('Jeden Tag', 'Glücksräder &amp; Votes', `Mit ${c('/rewards')} drehst du jeden Tag gratis dein Glücksrad – und mit einem Vote holst du dir Coins und einen Tagesbonus. Alles geht auch auf Bedrock.`)}
    <div class="wrap">
      ${jump([['#rewards', '🎡 Glücksräder'], ['#gewinne', '🎁 Mögliche Gewinne'], ['#voten', '🗳️ Voten'], ['#tagesbonus', '📅 Tagesbonus'], ['#vote-erfolge', '🏆 Vote-Erfolge']])}

      <section id="rewards" aria-labelledby="h-rewards">
        <h2 id="h-rewards">🎡 Tägliche Glücksräder: ${c('/rewards')}</h2>
        <p>Mit ${c('/rewards')} (auch ${c('/belohnungen')}, ${c('/gluecksrad')} oder ${c('/daily')}) öffnest du das Menü „Tägliche Belohnungen“. Dort drehst du deine Räder, siehst alle möglichen Gewinne und kommst direkt zum Voten.</p>
        <div class="grid">
          <div class="card"><span class="icon" aria-hidden="true">🎡</span><h3>Glücksrad – für alle</h3><p>Jeden Tag gratis für <strong>jeden</strong> Spieler – mit allen Stufen bis Legendär. Jeder Dreh gibt <strong>immer 25–75 Coins</strong> und genau einen Gewinn.</p></div>
          <div class="card"><span class="icon" aria-hidden="true">💜</span><h3>Sub-Glücksrad</h3><p>Ein <strong>Extra-Rad</strong> für Twitch-Subs von JustinZockt03 – zusätzlich zum Glücksrad für alle. Etwas größere Mengen, immer 30–90 Coins, ganz oben eine <strong>Elytra</strong>.</p></div>
          <div class="card"><span class="icon" aria-hidden="true">👑</span><h3>Premium-Glücksrad</h3><p>Ein <strong>Extra-Rad</strong> für <a href="premium.html">Premium</a> – zusätzlich zum Glücksrad für alle. Immer 40–100 Coins, ganz oben ein <strong>Spawner-Ei</strong>.</p></div>
          <div class="card"><span class="icon" aria-hidden="true">🕛</span><h3>Jeden Tag neu</h3><p>Jedes Rad drehst du <strong>einmal am Tag</strong>. Um <strong>0:00 Uhr</strong> (deutsche Zeit) geht es wieder los. Wer Sub <strong>und</strong> Premium ist, dreht alle 3 Räder.</p></div>
        </div>
        <div class="callout info"><p>💚 <strong>Dein Rad gehört dir:</strong> Das Glücksrad für alle ist für jeden gleich und hat alle Stufen bis Legendär – auch Mending und Soulbound. Sub- und Premium-Rad nehmen dir nichts weg, sie kommen nur als Extra-Rad obendrauf.</p></div>
        <h3>So läuft ein Dreh</h3>
        <ul>
          <li>Klick im Menü auf ein Rad, das heute noch frei ist. Danach läuft eine kurze Animation.</li>
          <li><strong>Dein Gewinn steht schon vor der Animation fest.</strong> Schließt du das Menü oder verlässt du den Server, bekommst du ihn trotzdem sofort – nie doppelt und nie verloren.</li>
          <li>Ab der Stufe „Sehr selten“ wird dein Gewinn allen im Chat angesagt.</li>
          <li>Ist ein Rad heute schon gedreht, zeigt es dir, wann es wieder frei ist.</li>
        </ul>
        <div class="callout"><p>📱 <strong>Bedrock:</strong> Alles geht auch auf Bedrock (Handy, Tablet, Konsole, Windows) – einfach antippen, ganz ohne Schleichen oder Sonder-Klicks.</p></div>
      </section>

      <section id="gewinne" aria-labelledby="h-gewinne">
        <h2 id="h-gewinne">🎁 Was kann ich gewinnen?</h2>
        <p>Alle Räder haben dieselben fünf Stufen. Im Spiel zeigt dir das Fernrohr „Mögliche Gewinne“ neben jedem Rad die komplette Liste mit Mengen.</p>
        ${table(['Stufe', 'Was drin sein kann'], RAD_STUFEN.map(([a, , b]) => [`<strong>${a}</strong>`, esc(b)]), { label: 'Gewinn-Stufen der Glücksräder', rowHead: true })}
        <p class="muted small">Telekinesis, Timber, Mending und Soulbound sind eigene Server-Verzauberungen – mehr dazu bei den <a href="verzauberungen.html">Verzauberungen</a>. Das <strong>Spawner-Ei</strong> wirkt nur auf einen normalen Spawner (Rechtsklick, auf Bedrock antippen) und braucht Bau-Rechte. Jeder Spawner lässt sich nur <strong>einmal</strong> ändern – danach auch nicht mehr mit einem normalen Spawn-Ei.</p>
      </section>

      <section id="voten" aria-labelledby="h-voten">
        <h2 id="h-voten">🗳️ Für den Server voten</h2>
        <p>Mit einem Vote hilfst du der Community, gefunden zu werden – und bekommst selbst etwas dafür.</p>
        <div class="grid">
          <div class="card"><span class="icon" aria-hidden="true">🗳️</span><h3>Wo vote ich?</h3><p>Auf der Serverliste – über den Knopf hier, mit ${c('/vote')} im Spiel oder über den Vote-Knopf in ${c('/rewards')}. Im Spiel kannst du den Link einfach anklicken.</p><div class="btn-row">${voteBtn()}</div></div>
          <div class="card"><span class="icon" aria-hidden="true">🪙</span><h3>Was bekomme ich?</h3><p>Pro Vote-Seite alle 24 Stunden <strong>150 Justin Coins und 5 Erfahrungsfläschchen</strong> – dazu den <a href="#tagesbonus">Tagesbonus</a>. Hast du offline gevotet, kommt die Belohnung beim nächsten Join.</p></div>
          <div class="card"><span class="icon" aria-hidden="true">📊</span><h3>Wie oft habe ich gevotet?</h3><p>${c('/vote')} und das Vote-Feld in ${c('/rewards')} zeigen dir deine Votes von heute und insgesamt. Die fleißigsten Voter stehen in den <a href="ranglisten.html">Ranglisten</a>.</p></div>
        </div>
        <p class="muted small">So geht’s: Auf der Serverliste deinen <strong>Minecraft-Namen</strong> eingeben und den Vote bestätigen – danach sagt der Server im Chat Danke. Das klappt genauso, wenn du auf Bedrock spielst.</p>
      </section>

      <section id="tagesbonus" aria-labelledby="h-tagesbonus">
        <h2 id="h-tagesbonus">📅 Vote-Tagesbonus</h2>
        <p>Zu jedem Vote gibt es zusätzlich einen Bonus. Was es gibt, wechselt jeden Tag – du bekommst jeweils <strong>eins davon</strong>:</p>
        ${table(['Tag', 'Bonus (eins davon)'], TAGESBONUS, { label: 'Vote-Tagesbonus', rowHead: true })}
      </section>

      <section id="vote-erfolge" aria-labelledby="h-vote-erfolge">
        <h2 id="h-vote-erfolge">🏆 Vote-Erfolge</h2>
        <div class="grid">
          <div class="card"><span class="icon" aria-hidden="true">📄</span><h3>Unterstützer</h3><p>Dein erster Vote für den Server.</p></div>
          <div class="card"><span class="icon" aria-hidden="true">📖</span><h3>Treuer Fan</h3><p>10 Votes für den Server.</p></div>
          <div class="card"><span class="icon" aria-hidden="true">🌟</span><h3>Vote-Legende</h3><p>100 Votes für den Server.</p></div>
        </div>
        <p class="muted small">Die Erfolge findest du im Fortschritte-Menü (Taste <kbd>L</kbd>) im Reiter „JustinZocktCommunity“ – alle Erfolge auf der Seite <a href="erfolge.html">Erfolge</a>.</p>
        <div class="btn-row">${voteBtn('Jetzt voten')}<a class="btn btn-ghost" href="events.html">Zu den Events →</a></div>
      </section>
    </div>`;

// ------------------------------------------------------------------ Claims, Kistenschutz & Freunde
// [id, Name, Erklärung, Standard an?, Stufe ab der Mitglieder es immer dürfen (1 Benutzen, 2 Bauen, 99 = gilt für alle)]
const FLAGS_BESUCHER = [
  ['kisten', 'Kistenzugriff', 'Ungesicherte Kisten, Fässer, Öfen … öffnen', false, 1],
  ['benutzen', 'Block-Nutzung', 'Türen, Falltüren, Zauntore, Hebel, Knöpfe, Arbeitsblöcke', false, 1],
  ['druckplatten', 'Druckplatten & Stolperdrähte', 'Druckplatten, Stolperdrähte, Zielblöcke auslösen', false, 1],
  ['bett', 'Betten & Seelenanker', 'In Betten schlafen, Seelenanker benutzen', false, 1],
  ['fahrzeuge', 'Boote & Loren benutzen', 'Boote und Loren einsteigen und platzieren', true, 1],
  ['fahrzeuge-zerstoeren', 'Boote & Loren zerstören', 'Fremde Boote und Loren im Claim kaputt schlagen', false, 2],
  ['rahmen', 'Rahmen & Gemälde', 'Rahmen drehen, Items herausnehmen, Gemälde abnehmen', false, 2],
  ['ruestungsstaender', 'Rüstungsständer', 'Rüstungsständer benutzen oder zerstören', false, 2],
  ['tiere-toeten', 'Tiere verletzen/töten', 'Tiere und Dorfbewohner angreifen', false, 2],
  ['tiere-fuettern', 'Tiere füttern/züchten', 'Füttern, züchten, scheren, melken, reiten', false, 1],
  ['leinen', 'Leinen', 'Tiere anleinen oder losmachen', false, 1],
  ['handel', 'Handel mit Dorfbewohnern', 'Mit Dorfbewohnern und Händlern handeln', true, 1],
  ['ernten', 'Ernten & Düngen', 'Reife Pflanzen ernten, neu anpflanzen, Knochenmehl', false, 1],
  ['pvp', 'PvP', 'Spieler dürfen sich hier angreifen (sonst nie) – gilt für alle, auch Mitglieder', true, 99],
];
const FLAGS_UMWELT = [
  ['creeper', 'Creeper-Explosionen', 'Creeper zerstören Blöcke', false],
  ['tnt', 'TNT', 'TNT und TNT-Loren zerstören Blöcke', false],
  ['wither', 'Wither', 'Wither und Wither-Schädel zerstören Blöcke', false],
  ['feuerball', 'Feuerbälle (Ghast)', 'Ghast-Feuerbälle zerstören Blöcke', false],
  ['explosionen', 'Andere Explosionen', 'Betten, Seelenanker, Kristalle, Windkugeln …', false],
  ['feuer', 'Feuerausbreitung', 'Feuer breitet sich aus und verbrennt Blöcke', false],
  ['fluss', 'Wasser/Lava von außen', 'Flüssigkeiten fließen von außen herein', false],
  ['kolben', 'Kolben von außen', 'Kolben außerhalb dürfen Blöcke hinein- oder herausschieben', false],
  ['enderman', 'Enderman-Griefing', 'Enderman nehmen Blöcke mit', false],
  ['ravager', 'Verwüster', 'Verwüster zerstören Pflanzen und Laub', false],
  ['zombies', 'Zombies brechen Türen', 'Zombies schlagen Türen ein', false],
  ['mobs', 'Sonstiges Mob-Griefing', 'Silberfische, Füchse, Hasen, Wither-Blöcke …', false],
  ['schafe', 'Schafe fressen Gras', 'Schafe fressen Gras (wichtig für Wolle)', true],
  ['dorfbewohner', 'Dorfbewohner farmen', 'Bauern-Dorfbewohner ernten und pflanzen', true],
  ['trampeln', 'Ackerboden zertrampeln', 'Ackerboden wird zu Erde (auch durch dich selbst)', false],
  ['monster', 'Monster spawnen', 'Monster spawnen natürlich im Claim', true],
  ['monster-angriff', 'Monster greifen an', 'Monster greifen Spieler im Claim an (aus: Monster sind hier friedlich und machen keinen Schaden; Wither und Enderdrache bleiben gefährlich)', true],
  ['gras', 'Gras-/Myzel-Ausbreitung', 'Gras, Myzel und Nezel breiten sich aus', true],
  ['ranken', 'Ranken & Tropfstein', 'Ranken, Höhlenranken, Seetang und Tropfstein wachsen', true],
  ['sculk', 'Sculk-Ausbreitung', 'Sculk breitet sich aus', true],
  ['pflanzen', 'Pflanzenwachstum', 'Pflanzen und Setzlinge wachsen', true],
  ['laub', 'Laub zerfällt', 'Laub ohne Stamm zerfällt', true],
  ['korallen', 'Korallen vertrocknen', 'Korallen ohne Wasser sterben ab', true],
  ['beton', 'Beton härtet aus', 'Betonpulver wird an Wasser zu Beton', true],
  ['schneemann', 'Schneegolem-Spuren', 'Schneegolems hinterlassen Schnee', true],
  ['schneefall', 'Schneefall & Eis', 'Schnee fällt, Wasser friert', true],
  ['schmelzen', 'Schnee/Eis schmilzt', 'Schnee und Eis tauen', true],
  ['fallende-bloecke', 'Fallende Blöcke', 'Sand, Kies, Ambosse … fallen herunter', true],
];
const onOff = (v) => (v ? '<span class="badge green">an</span>' : '<span class="badge gray">aus</span>');
const ROLE = { 1: 'ab Benutzen', 2: 'nur Bauen', 99: 'gilt für alle' };
const CLAIM_CMDS = [
  ['/claim chunk', 'Kauf-Angebot für den Chunk, in dem du stehst.'],
  ['/claim bestaetigen', 'Offenes Angebot kaufen (wie der grüne Knopf). Auch /claim ja.'],
  ['/claim abbrechen', 'Offenes Angebot abbrechen (wie der rote Knopf). Auch /claim nein.'],
  ['/claim bearbeiten', 'Menü für deinen Claim: Name, Mitglieder, Rechte und Flags.'],
  ['/claim flags', 'Öffnet dasselbe Menü – dort geht es zu den Flags.'],
  ['/claim name <Name>', 'Namen setzen (bis 32 Zeichen), „-“ entfernt ihn wieder.'],
  ['/claim anzeige an|aus', 'Claim-Name als Leiste oben ein- oder ausschalten.'],
  ['/claim info', 'Wem gehört der Chunk und welche Rechte hast du hier?'],
  ['/claim list', 'Alle deine Chunks mit Koordinaten.'],
  ['/claim show', 'Grenzen der Claims in deiner Nähe für 10 Sekunden zeigen.'],
  ['/claims', 'Menü mit allen Claims und Sicherungen.'],
  ['/unclaim', 'Chunk freigeben. /unclaim all gibt alle frei.'],
  ['/claim', 'Zeigt nur die Hilfe – kauft nichts.'],
];
const LOCK_GROUPS = 'Kisten, Trichter, Öfen, Shulkerkisten, Fässer, Endertruhen, Spender &amp; Werfer, Braustände, Automatische Werkbank, Bücherregale &amp; Regale, Dekorierte Krüge, Plattenspieler, Lesepulte, Leuchtfeuer, Truhenboote &amp; Loren';

const claims = () => `${head('Dein Gebiet', 'Claims, Kistenschutz &amp; Freunde', 'Sichere dein Grundstück, schütze deine Kisten und gib deinen Freunden mit einem Klick die passenden Rechte. Alles geht auch auf Bedrock.')}
    <div class="wrap">
      ${jump([['#kaufen', '🏠 Chunk kaufen'], ['#preise', '🪙 Preise &amp; Limits'], ['#rollen', '👥 Rollen &amp; Mitglieder'], ['#flags', '⚑ Flags'], ['#anzeige', '👀 Anzeige'], ['#befehle', '⌨️ Befehle'], ['#freunde', '🤝 Freunde'], ['#kisten', '🔒 Kistenschutz']])}
      <div class="callout info"><p>🛡️ <strong>Nicht verwechseln:</strong> Hier geht es um <strong>Claims</strong> (geschützte Grundstücke). Gemeinschaften mit Tag und Clan-Chat findest du bei den <a href="clans.html">Clans</a>.</p></div>

      <section id="kaufen" aria-labelledby="h-kaufen">
        <h2 id="h-kaufen">🏠 Einen Chunk kaufen: ${c('/claim chunk')}</h2>
        <p>Ein Claim ist immer ein ganzer <strong>Chunk</strong> (16 × 16 Blöcke, die ganze Höhe). Stell dich in den Chunk und schreib ${c('/claim chunk')}. Du bekommst ein Kauf-Angebot im Chat:</p>
        <ul>
          <li><strong>Fläche:</strong> 256 Blöcke² (16 × 16) mit Chunk-Nummer – der Rand leuchtet orange.</li>
          <li><strong>Gesamtkosten</strong> für genau diesen Chunk.</li>
          <li><strong>Strukturzuschlag:</strong> Liegt ein Bauwerk im Chunk (z. B. Dorf, Tempel, Festung, Prüfungskammer), kostet er mehr. Ohne Bauwerk ist der Zuschlag 0.</li>
          <li><strong>Ersparnis mit Sub/Premium:</strong> was du mit Rang sparen würdest bzw. sparst.</li>
        </ul>
        <p>Zum Kaufen drückst du den <strong>grünen Knopf in deiner Hotbar</strong> (der rote bricht ab), klickst den Knopf im Chat oder schreibst ${c('/claim bestaetigen')}. Abbrechen: ${c('/claim abbrechen')}. Das Angebot gilt 30 Sekunden. Ist die Hotbar voll, bestätigst du im Chat. Auf Bedrock tippst du den Knopf an oder nutzt den Befehl.</p>
        <p class="muted small">${c('/claim')} allein zeigt nur die Hilfe und kauft nichts.</p>
      </section>

      <section id="preise" aria-labelledby="h-preise">
        <h2 id="h-preise">🪙 Preise &amp; Limits</h2>
        ${table(['Welt', 'Grundpreis pro Chunk', 'Sub (−5 %)', 'Premium (−10 %)'], [
          ['Oberwelt', '2.000 JC', '1.900 JC', '1.800 JC'],
          ['Nether', '4.000 JC', '3.800 JC', '3.600 JC'],
          ['End', '6.000 JC', '5.700 JC', '5.400 JC'],
        ], { label: 'Claim-Preise', rowHead: true })}
        <p class="muted small">Grundpreis in der Oberwelt ${info('claims.preis', '2.000')} JC, im Nether das Doppelte, im End das Dreifache. Sub und Premium bekommen ihren Rabatt auf diesen Preis (auch auf einen Strukturzuschlag).</p>
        <div class="grid">
          <div class="card"><span class="icon" aria-hidden="true">📦</span><h3>Wie viele Chunks?</h3><p>Spieler bis <strong>${info('claims.max_chunks', '30')}</strong>, Sub bis <strong>${info('claims.max_chunks_sub', '50')}</strong>, Premium bis <strong>${info('claims.max_chunks_premium', '70')}</strong> Chunks.</p></div>
          <div class="card"><span class="icon" aria-hidden="true">📍</span><h3>Wo darf ich claimen?</h3><p>Erst ab <strong>250 Blöcken Abstand von 0/0</strong> (X oder Z) – in Oberwelt, Nether und End gleich. Am Spawn geht es nicht.</p></div>
          <div class="card"><span class="icon" aria-hidden="true">↩️</span><h3>Wieder freigeben</h3><p>${c('/unclaim')} gibt den Chunk frei, in dem du stehst. Du bekommst die <strong>Hälfte des Chunk-Preises</strong> zurück – der Strukturzuschlag wird nicht erstattet.</p></div>
        </div>
        <p class="muted small">Unbenutzte Claims können nach längerer Inaktivität freigegeben werden.</p>
      </section>

      <section id="rollen" aria-labelledby="h-rollen">
        <h2 id="h-rollen">👥 Rollen, Mitglieder &amp; Name</h2>
        <p>In ${c('/claim bearbeiten')} stellst du alles für den Chunk ein, in dem du stehst – mit Knöpfen, also auch auf Bedrock. Es gibt drei Stufen:</p>
        ${table(['Stufe', 'Was darf man?'], [
          ['<strong>Besucher</strong>', 'Nur das, was die Besucher-Flags erlauben.'],
          ['<strong>Benutzen</strong>', 'Türen, Knöpfe, ungesicherte Kisten, Betten, Ernten, Tiere füttern, Handel … – aber nicht bauen.'],
          ['<strong>Bauen</strong>', 'Alles: bauen, abbauen, Rahmen, Rüstungsständer, Tiere, Fahrzeuge.'],
        ], { label: 'Claim-Stufen', rowHead: true })}
        <ul>
          <li><strong>Alle anderen:</strong> Welche Stufe alle haben, die kein Mitglied sind (Standard: Besucher).</li>
          <li><strong>Mitglieder:</strong> „+ Mitglied hinzufügen“ – Online-Spieler, Freunde oder per Name. Jedes Mitglied bekommt eine eigene Stufe.</li>
          <li><strong>Freunde:</strong> Welche Stufe alle deine <a href="#freunde">Freunde</a> hier haben – „Standard“ nimmt die Einstellung aus dem Freunde-Menü.</li>
          <li><strong>Name:</strong> Gib deinem Grundstück einen Namen (bis 32 Zeichen) – im Menü oder mit ${c('/claim name <Name>')}.</li>
          <li><strong>Übertragen:</strong> Name, Mitglieder, Rechte und Flags mit einem Knopf auf alle verbundenen Chunks oder auf alle deine Chunks übernehmen.</li>
        </ul>
        <p class="muted small">Du als Besitzer darfst immer alles. Wer per ${c('/trust <Name>')} volles Vertrauen hat, darf ebenfalls in all deinen Claims bauen und an all deine Kisten.</p>
      </section>

      <section id="flags" aria-labelledby="h-flags">
        <h2 id="h-flags">⚑ Alle Flags</h2>
        <p>Flags schaltest du in ${c('/claim bearbeiten')} (oder ${c('/claim flags')}) mit einem Klick an oder aus. „Standard“ zeigt, wie ein neuer Claim eingestellt ist.</p>
        <h3 id="flags-besucher">Besucher-Rechte</h3>
        <p class="muted small">Gelten für alle, deren Stufe zu niedrig ist. Mitglieder mit genug Rechten dürfen es immer.</p>
        ${table(['Flag', 'Was es erlaubt', 'Standard', 'Mitglieder'], FLAGS_BESUCHER.map(([id, n, d, def, lv]) => [`<strong>${esc(n)}</strong><br><code>${id}</code>`, esc(d), onOff(def), ROLE[lv]]), { label: 'Besucher-Flags', rowHead: true })}
        <h3 id="flags-umwelt">Umwelt</h3>
        <p class="muted small">Gelten für alles im Claim – egal wer dort ist.</p>
        ${table(['Flag', 'Was passiert, wenn es an ist', 'Standard'], FLAGS_UMWELT.map(([id, n, d, def]) => [`<strong>${esc(n)}</strong><br><code>${id}</code>`, esc(d), onOff(def)]), { label: 'Umwelt-Flags', rowHead: true })}
      </section>

      <section id="anzeige" aria-labelledby="h-anzeige">
        <h2 id="h-anzeige">👀 Claim-Anzeige &amp; Grenzen</h2>
        <div class="grid">
          <div class="card"><span class="icon" aria-hidden="true">🏷️</span><h3>Name als Leiste</h3><p>Oben am Bildschirm zeigt eine Leiste (BossBar), in wessen Claim du gerade bist – mit Namen, falls er einen hat. Ausschalten: ${c('/claim anzeige aus')}, wieder an: ${c('/claim anzeige an')}.</p></div>
          <div class="card"><span class="icon" aria-hidden="true">✨</span><h3>Grenzen sehen</h3><p>${c('/claim show')} zeigt 10 Sekunden lang die Claims in deiner Nähe mit farbigen Blöcken und Partikeln: <strong>grün</strong> = deins, <strong>gelb</strong> = du hast Rechte, <strong>rot</strong> = fremd, <strong>weiß</strong> = frei.</p></div>
          <div class="card"><span class="icon" aria-hidden="true">🚪</span><h3>Beim Betreten</h3><p>Betrittst du einen Claim, gibt es eine kurze Meldung, einen leisen Ton und einen leuchtenden Rand. Beim Kauf leuchtet der Chunk orange.</p></div>
        </div>
      </section>

      <section id="befehle" aria-labelledby="h-befehle">
        <h2 id="h-befehle">⌨️ Claim-Befehle</h2>
        ${table(['Befehl', 'Was es macht'], CLAIM_CMDS.map(([a, b]) => [c(a), esc(b)]), { label: 'Claim-Befehle' })}
        <p class="muted small">Alle Befehle mit Suche: <a href="befehle.html#claims">Befehle → Claims &amp; Kistenschutz</a>.</p>
      </section>

      <section id="freunde" aria-labelledby="h-freunde">
        <h2 id="h-freunde">🤝 Freunde: ${c('/freunde')}</h2>
        <p>Freunde bekommen <strong>pauschale Rechte</strong> in all deinen Kisten und Claims – einmal einstellen, überall gültig. ${c('/freunde')} öffnet das Menü mit Anfragen, Freundesliste (wer online ist) und den Rechten. Geht auch auf Bedrock.</p>
        ${table(['Befehl', 'Was es macht'], [
          [c('/freunde add <Name>'), 'Freundschaftsanfrage schicken (auch an Offline-Spieler).'],
          [c('/freunde annehmen [Name]'), 'Anfrage annehmen – auf Java auch per Klick im Chat.'],
          [c('/freunde ablehnen [Name]'), 'Anfrage ablehnen.'],
          [c('/freunde entfernen <Name>'), 'Freundschaft beenden.'],
          [c('/freunde liste'), 'Alle Freunde, wer online ist, steht in Grün.'],
          [c('/freunde anfragen'), 'Offene Anfragen mit Knöpfen zum Annehmen und Ablehnen.'],
        ], { label: 'Freunde-Befehle' })}
        <ul>
          <li><strong>Freunde in deinen Kisten:</strong> Kein Zugriff, Nur reinlegen, Nur rausnehmen oder Reinlegen &amp; rausnehmen.</li>
          <li><strong>Freunde in deinen Claims:</strong> Keine Rechte (Besucher), Benutzen oder Bauen.</li>
          <li>Am Anfang haben Freunde <strong>keine</strong> Rechte – du entscheidest. Für einzelne Kisten und Claims kannst du es trotzdem anders einstellen.</li>
          <li>Anfragen verfallen nach 7 Tagen. Du kannst bis zu 100 Freunde haben.</li>
        </ul>
      </section>

      <section id="kisten" aria-labelledby="h-kisten">
        <h2 id="h-kisten">🔒 Kistenschutz: ${c('/lock')}</h2>
        <p><strong>Kisten, Trichter, Öfen, Shulkerkisten und Fässer</strong> werden beim Platzieren automatisch gesichert – auch außerhalb von Claims. Alles andere, was sich sichern lässt, sicherst du von Hand: Block anschauen und ${c('/lock')}. Am Spawn geht das nicht.</p>
        <p class="muted small">Sicherbar: ${LOCK_GROUPS}.</p>
        <h3 id="kisten-bearbeiten">Kiste bearbeiten</h3>
        <p>Öffne das Menü deiner Kiste mit <strong>Schleichen + Rechtsklick mit leerer Hand</strong> – auf Bedrock auch <strong>Schleichen + Schlagen</strong> – oder schau sie an und schreib ${c('/lock bearbeiten')}.</p>
        <ul>
          <li><strong>Mitglieder</strong> mit eigener Stufe: <strong>Kein Zugriff</strong>, <strong>Nur reinlegen</strong>, <strong>Nur rausnehmen</strong> oder <strong>Reinlegen &amp; rausnehmen</strong>. „Nur reinlegen“ ist zum Beispiel perfekt für eine Spendenkiste.</li>
          <li><strong>Alle anderen:</strong> welche Stufe alle haben, die kein Mitglied sind.</li>
          <li><strong>Freunde:</strong> Stufe für alle deine Freunde – „Standard“ nimmt die Einstellung aus ${c('/freunde')}.</li>
          <li><strong>Öffentlich:</strong> Jeder darf reinlegen und rausnehmen. Abbauen darf trotzdem nur der Besitzer.</li>
          <li><strong>Name:</strong> Gib der Kiste einen Namen (bis 32 Zeichen).</li>
          <li><strong>Flags:</strong> <em>Trichter erlauben</em> (Trichter dürfen Items herausziehen und hineinfüllen – aus: nur deine eigenen gesicherten Trichter), <em>Fremde Trichter</em> (am Anfang <strong>aus</strong>: Trichter von anderen Spielern holen nichts heraus – nur deine, die von Spielern mit ${c('/trust')} und Trichter in deinem Claim) und <em>Redstone</em> (Spender und Werfer dürfen per Redstone auswerfen).</li>
          <li><strong>Doppeltruhen</strong> sind <strong>eine</strong> Sicherung: Stellst du eine Truhe an deine gesicherte Truhe, wird die zweite Hälfte damit verknüpft und zählt nicht extra – auch wenn dein Limit voll ist.</li>
          <li><strong>Sicherung entfernen:</strong> zweimal klicken – der Block bleibt stehen, ist dann aber ungesichert.</li>
        </ul>
        <div class="grid">
          <div class="card"><span class="icon" aria-hidden="true">🔔</span><h3>Sounds</h3><p>Beim Sichern hörst du einen kurzen Ton. Ist dein Limit voll, kommt ein anderer, tiefer Ton. Darfst du eine Kiste nicht öffnen, klingt sie verschlossen.</p></div>
          <div class="card"><span class="icon" aria-hidden="true">📦</span><h3>Limits</h3><p>Spieler bis <strong>${info('claims.truhen_spieler', '128')}</strong>, Sub bis <strong>${info('claims.truhen_sub', '192')}</strong>, Premium bis <strong>${info('claims.truhen_premium', '256')}</strong> Sicherungen. Eine Doppeltruhe zählt 2. Ältere Sicherungen über dem Limit bleiben erhalten.</p></div>
          <div class="card"><span class="icon" aria-hidden="true">⚙️</span><h3>Auto-Sicherung</h3><p>Mit ${c('/lock einstellungen')} (Menü mit Schaltern) oder ${c('/lock auto')} legst du fest, was beim Platzieren automatisch gesichert wird.</p></div>
        </div>
        ${table(['Befehl', 'Was es macht'], [
          [c('/lock'), 'Angeschauten Block oder ein Truhenboot / eine Güterlore sichern.'],
          [c('/unlock'), 'Sicherung entfernen (auch /lock aus).'],
          [c('/lock bearbeiten'), 'Menü: Mitglieder, Stufen, Freunde, öffentlich, Name, Flags.'],
          [c('/lock liste [Seite]'), 'Alle deine Sicherungen, nach Art sortiert.'],
          [c('/lock einstellungen'), 'Menü: was automatisch gesichert wird.'],
          [c('/lock auto aus|an|standard|liste'), 'Auto-Sicherung aus, für alles an, Standard oder Übersicht.'],
          [c('/lock auto <Gruppe> an|aus'), 'Einzelne Art an oder aus, z. B. kisten, trichter, spender.'],
          [c('/claims'), 'Menü mit allen Claims und Sicherungen.'],
        ], { label: 'Kistenschutz-Befehle' })}
      </section>
    </div>`;

module.exports = { belohnungen, claims, TAGESBONUS, RAD_STUFEN };
