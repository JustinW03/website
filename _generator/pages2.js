// Events, Befehle, FAQ, Team, Datenschutz, Impressum, Admin
const { IP, BEDROCK, VOTE_URL, LINKS, esc, c, de, ext, head, table, coinsH, afkH, info, jump } = require('./lib.js');

// ------------------------------------------------------------------ events
// Geschenk-Verstecke am Weihnachts-Spawn (Koordinaten X Y Z auf dem Live-Server, Spawn auf Hoehe 63;
// Hinweise wie im Plugin: build/ChristmasSpawn.java). Statt Belohnungen stehen auf der Website nur Ort und Koordinaten.
const GIFTS = [
  [1, '2 63 7', 'Rotunde, neben dem Spawnpunkt'],
  [2, '13 63 -14', 'unter dem Tannenbaum im Nordosten'],
  [3, '18 63 13', 'unter dem Tannenbaum im Südosten'],
  [4, '-13 63 18', 'unter dem Tannenbaum im Südwesten'],
  [5, '-18 63 -13', 'unter dem Tannenbaum im Nordwesten'],
  [6, '6 65 -25', 'im Schlitten (Norden)'],
  [7, '8 63 16', 'hinter dem Schneemann im Südosten'],
  [8, '-8 63 -16', 'hinter dem Schneemann im Nordwesten'],
  [9, '-10 63 30', 'auf dem Eis am gefrorenen Wasserfall (Südwest)'],
  [10, '26 63 3', 'End-Schrein, hinter einer Purpursäule'],
  [11, '-23 63 0', 'hinter dem Nether-Portal'],
  [12, '5 63 34', 'am Brückenpfosten im Süden'],
  [13, '-28 64 28', 'im Südwest-Turm (geheime Tür zur Platzseite)'],
  [14, '16 67 -36', 'oben auf der Mauer im Nordosten (Eis-Parkour)'],
  [15, '-38 63 -5', 'Westtor, neben dem Banner'],
  [16, '34 63 -13', 'in der Schneewehe im Osten'],
  [17, '6 65 -17', 'auf Rudolphs Rücken'],
  [18, '12 63 -2', 'hinter einer Rotunden-Säule (Osten)'],
  [19, '-24 63 -11', 'hinter einer Laterne im Westen'],
  [20, '-4 64 -45', 'vor dem Nordtor an der Straßenlaterne'],
  [21, '32 63 -32', 'außerhalb der Mauer hinter dem Nordost-Turm'],
  [22, '11 65 -11', 'oben auf dem Geschenkeberg (Nordost)'],
  [23, '-8 63 13', 'im Iglu (Südwest)'],
  [24, '31 85 12', 'auf der schwebenden Insel im Osten (Eis-Spirale)'],
];
const SPECIAL = { 1: 'special', 6: 'special', 13: 'special', 15: 'special', 20: 'special', 24: 'xmas' };
// Kartendaten: JSON -> base64 -> umgedreht (main.js entschluesselt). Rueckseite: Ort + Koordinaten.
const adventData = () => Buffer.from(JSON.stringify(GIFTS.map(([d, xyz, hint]) => [d, hint, ['📍 ' + xyz], SPECIAL[d] || '']))).toString('base64').split('').reverse().join('');
const advent = () => `${head('Dezember', 'Adventskalender', 'Vom 1. bis 24. Dezember liegt am Weihnachts-Spawn jeden Tag ein Geschenk mit der Zahl des Tages versteckt. Hier deckst du auf, wo es liegt.')}
    <div class="wrap">
      <div class="callout info" data-season="advent-aus" hidden><p>🎄 <strong>Der Adventskalender ist gerade nicht aktiv.</strong> Er kommt am 1. Dezember zurück – ab November siehst du hier schon die Vorschau. Bis dahin: <a href="events.html">alle Events</a> und die täglichen <a href="belohnungen.html">Glücksräder &amp; Votes</a>.</p></div>
      <noscript><p class="callout">Für den Adventskalender auf dieser Seite wird JavaScript benötigt. Ohne JavaScript kannst du die Türchen nicht aufdecken – im Spiel findest du die Geschenke trotzdem am Weihnachts-Spawn.</p></noscript>

      <section class="advent-wrap" id="advent" data-season="advent" hidden aria-labelledby="h-advent">
        <div class="snow" aria-hidden="true"></div>
        <h2 id="h-advent">🎄 Adventskalender <span data-advent-year>2026</span></h2>
        <p class="advent-status" id="advent-status" aria-live="polite">Kalender wird vorbereitet …</p>
        <div class="kv">
          <div><b>1.–24.12.<span data-advent-year>2026</span></b><span>jeweils 00:00 bis 23:59 Uhr (deutsche Zeit)</span></div>
          <div><b>🎁 Geschenk suchen</b><span>am Weihnachts-Spawn liegt jeden Tag ein Geschenk mit der Zahl des Tages</span></div>
          <div><b>1 Türchen pro Tag</b><span>nur das von heute – Verpasstes verfällt</span></div>
          <div><b>Treue-Bonus</b><span>eine besondere Überraschung für alle 24 Türchen</span></div>
          <div><b>4 Adventskerzen</b><span>an den Adventssonntagen – Rechtsklick = anzünden</span></div>
        </div>
        <p class="muted small">Hier auf der Website deckst du die Verstecke auf: Jede Karte lässt sich erst an ihrem Tag umdrehen und zeigt dann den Ort und die <strong>Koordinaten</strong> des Geschenks. Öffnen musst du das Geschenk im Spiel.</p>
        <p class="advent-msg" id="advent-msg" aria-live="polite"></p>
        <div class="advent" id="advent-grid"></div>
        <script type="text/plain" id="advent-daten">${adventData()}</script>

        <h3 id="advent-orte">📍 Wo liegen die Geschenke?</h3>
        <p>Alle 24 Geschenk-Köpfe liegen am <strong>Weihnachts-Spawn</strong>. Ort und Koordinaten stehen <strong>hinter dem Türchen</strong> – klick die Karte des Tages oben an, um sie aufzudecken. Die Koordinaten sind <strong>X Y Z</strong> – auf Java siehst du deine Position mit <kbd>F3</kbd>, auf Bedrock schaltest du in den Welt-Einstellungen „Koordinaten anzeigen“ ein. Manche liegen offen, andere gut versteckt – ein paar erreichst du nur per Parkour.</p>

        <details>
          <summary>So funktioniert der Kalender im Spiel</summary>
          <div class="details-body">
            <ul>
              <li>Vom <strong>1. Dezember bis 1. Januar</strong> verwandelt sich der Spawn in den <strong>Weihnachts-Spawn</strong> mit Tannenbäumen, Schnee, Geschenken, Schlitten und Schneefall. Danach ist automatisch wieder der normale Spawn da.</li>
              <li>Am Weihnachts-Spawn sind <strong>24 Geschenk-Köpfe</strong> mit den Zahlen 1–24 versteckt. Such das Geschenk mit der <strong>heutigen Zahl</strong> und klick es an (Rechts- oder Linksklick, auf Bedrock antippen oder schlagen). Das geht nur am jeweiligen Tag und einmal pro Spieler.</li>
              <li>Der <strong>Event-NPC</strong> am Spawn und ${c('/advent')} zeigen dir nur noch den Stand: wie viele Türchen du schon hast, die Anleitung, den Countdown und deine Adventskerzen. Türchen öffnen geht dort nicht mehr.</li>
              <li><strong>Heute kein Minecraft?</strong> Im Discord-Kanal <strong>#adventskalender</strong> öffnest du mit ${c('/advent')} dein heutiges Türchen und siehst sofort, was drin ist. Abholen kannst du es im Spiel mit ${c('/justin advent abholen')} – auch an einem späteren Tag. Ab deinem <strong>ersten Login</strong> danach hast du <strong>24 Stunden</strong> Zeit, danach verfällt es. Pro Tag gibt es trotzdem nur ein Türchen. Das gilt nur für den Adventskalender, nicht für Glücksräder oder Votes.</li>
              <li>Pro Tag gibt es <strong>ein</strong> Türchen, nur das von <strong>heute</strong>. Verpasste Tage verfallen.</li>
              <li>Geschenke kommen ins Inventar. Ist es voll, fällt der Rest vor deine Füße – <strong>nur du</strong> kannst es aufheben.</li>
              <li><strong>Adventskerzen:</strong> An den Adventssonntagen steckt im Türchen zusätzlich eine rote Adventskerze (fällt der 1. Advent in den November, kommt die erste Kerze am 1.12.). Sie lässt sich <strong>nicht aufstellen</strong>. Ein <strong>Rechtsklick</strong> zündet sie an und gibt <strong>250 Justin Coins</strong> plus eine kleine Belohnung. Hast du <strong>alle 4 Kerzen</strong> angezündet, bekommst du den <strong>Adventskranz-Bonus</strong>: 3.000 Justin Coins und einen Verzauberten Goldenen Apfel. Jede Kerze brennt nur für ihren Besitzer.</li>
              <li><strong>Türchen 24:</strong> Die Weihnachts-Spitzhacke hat dieses Jahr zusätzlich <strong>Telekinesis</strong>.</li>
              <li>Beim Öffnen gibt es Titel, Sound und Schneeflocken, an besonderen Tagen Feuerwerk. Das Feuerwerk macht keinen Schaden.</li>
              <li>Beim Joinen erinnert dich der Server an dein Türchen, um 0 Uhr bekommen alle Online-Spieler Bescheid.</li>
            </ul>
            <p class="muted small">Zum Vergleich: 1 Stunde aktiv spielen = ${coinsH('spieler')} JC, 1 Chunk-Claim = 2.000 JC.</p>
          </div>
        </details>
      </section>

      <p class="muted">Es gelten die <a href="events.html#event-regeln">Event-Regeln</a>. Alle anderen Events findest du auf der Seite <a href="events.html">Events</a>.</p>
    </div>`;

const events = () => `${head('Events', 'Events', 'Am Spawn steht der NPC „Events“ – Rechtsklick zeigt dir die aktuellen Events mit Anleitung. Dazu kommen jeden Tag deine Glücksräder und Votes.')}
    <div class="wrap">
      ${jump([['#event-npc', '🎉 Event-NPC'], ['#saison', '📅 Saison-Events'], ['#taeglich', '🎡 Glücksräder &amp; Votes'], ['#event-regeln', '📜 Event-Regeln'], ['#minigames', '🎮 Minigames']])}

      <section id="event-npc" aria-labelledby="h-event-npc">
        <h2 id="h-event-npc">🎉 Aktuelle Events</h2>
        <p>Der NPC <strong>„Events“</strong> am Spawn zeigt dir per Rechtsklick (Bedrock: antippen) alle laufenden und geplanten Events mit Anleitung. Im Spiel geht das auch mit ${c('/events')}. Neue Events kündigt das Team im Spiel und im ${ext(LINKS.discord, 'Discord')} an.</p>
      </section>

      <section id="saison" aria-labelledby="h-saison">
        <h2 id="h-saison">📅 Saison-Events</h2>
        <div class="grid">
          <a class="card" href="advent.html" data-season="advent" hidden><span class="icon" aria-hidden="true">🎄</span><h3>Adventskalender</h3><p>Vom 1. bis 24. Dezember liegt am Weihnachts-Spawn jeden Tag ein Geschenk versteckt – mit Treue-Bonus und Adventskerzen.</p><span class="more">Zum Kalender <span aria-hidden="true">→</span></span></a>
          <a class="card" href="faq.html#geburtstag"><span class="icon" aria-hidden="true">🎂</span><h3>Geburtstage der Community</h3><p>Trag deinen Geburtstag im Discord-Kanal <strong>#geburtstage</strong> oder im Spiel mit ${c('/geburtstag eintragen')} ein (nur Tag und Monat). An deinem Tag gratuliert dir der Bot, und im Spiel können dir andere mit ${c('/geburtstag')} ein Geschenk machen.</p><span class="more">So geht's <span aria-hidden="true">→</span></span></a>
          <div class="card"><span class="icon" aria-hidden="true">✨</span><h3>Besondere Tage</h3><p>Zu besonderen Anlässen wie einem Geburtstag gibt es eigene Events – dann kannst du zum Beispiel mit ${c('/gratulieren')} mitmachen. Was gerade läuft, zeigt dir der Event-NPC.</p></div>
        </div>
      </section>

      <section id="taeglich" aria-labelledby="h-taeglich">
        <h2 id="h-taeglich">🎡 Jeden Tag: Glücksräder &amp; Votes</h2>
        <div class="grid-2">
          <a class="card" href="belohnungen.html#rewards"><span class="icon" aria-hidden="true">🎡</span><h3>Tägliche Glücksräder</h3><p>Mit ${c('/rewards')} drehst du jeden Tag gratis dein Glücksrad – mit Coins bei jedem Dreh und Gewinnen bis Legendär. Subs und Premium bekommen ein Extra-Rad dazu.</p><span class="more">Zu den Glücksrädern <span aria-hidden="true">→</span></span></a>
          <a class="card" href="belohnungen.html#voten"><span class="icon" aria-hidden="true">🗳️</span><h3>Voten mit Tagesbonus</h3><p>Pro Vote-Seite alle 24 Stunden Coins, Erfahrungsfläschchen und ein Tagesbonus, der jeden Tag wechselt – dazu drei Vote-Erfolge.</p><span class="more">So votest du <span aria-hidden="true">→</span></span></a>
        </div>
      </section>

      <section id="event-regeln" aria-labelledby="h-event-regeln">
        <h2 id="h-event-regeln">📜 Event-Regeln</h2>
        <ul>
          <li><strong>Fehler nicht ausnutzen:</strong> Bugs in Events (z. B. doppelt abgeholte Belohnungen, Duplizieren) dürfen nicht ausgenutzt werden. Wer so etwas findet, meldet es per Ticket in <strong>#tickets</strong> – Melden wird belohnt (<a href="regeln.html#r10-1">Regel 10.1</a>).</li>
          <li>Was durch einen ausgenutzten Fehler entstanden ist, wird entfernt. Je nach Schwere folgt eine Strafe bis hin zum Bann (<a href="regeln.html#r10-2">10.2</a>).</li>
          <li><strong>Handeln erlaubt:</strong> Event-Gegenstände dürfen gehandelt werden – aber nie gegen Echtgeld (<a href="regeln.html#r10-7">10.7</a>, <a href="regeln.html#r7-2">7.2</a>).</li>
          <li>Es gilt wie immer: ein Minecraft-Account pro Person, Zweitaccounts nur mit Erlaubnis des Teams (<a href="regeln.html#r1-4">1.4</a>).</li>
        </ul>
      </section>

      <section id="minigames" aria-labelledby="h-minigames">
        <h2 id="h-minigames">🎮 Minigames</h2>
        <p>Am Spawn steht auch der NPC „Minigames“ – Rechtsklick oder ${c('/minigames join')} bringt dich in die Minigame-Welt mit 32 Spielen. Alles dazu auf der Seite <a href="minigames.html">Minigames</a>.</p>
      </section>
    </div>`;

// ------------------------------------------------------------------ befehle
const CMDS = [
  ['allgemein', 'Allgemein & Infos', [
    ['/justin', 'Übersicht aller Befehle im Spiel. Mit der Tab-Taste siehst du alle Befehle, die du nutzen darfst.', '/hilfe, /befehle', 'hilfe help tab'],
    ['/gratulieren [Nachricht|top]', 'Gratulieren – nur während eines passenden Events (z. B. Geburtstag).', '', 'geburtstag event glückwunsch'],
    ['/geburtstag', 'Geburtstage der Community: heutige Geburtstage, alle nach Datum, Geschenk geben (nur am Geburtstag) und mit /geburtstag geschenke deine Geschenke öffnen. Eintragen: /geburtstag eintragen <Tag> <Monat> (Discord muss verbunden sein) oder im Discord-Kanal #geburtstage.', '/birthday, /gb', 'geburtstag geschenk birthday'],
    ['/justin live', 'Ist Justin gerade live? Mit klickbarem Link.', '/live', 'stream twitch'],
    ['/justin socials', 'Alle Kanäle von Justin.', '/socials', 'links'],
    ['/justin events', 'Laufende und geplante Events.', '/events', 'termine event'],
    ['/justin scoreboard', 'Scoreboard rechts an- oder ausschalten.', '/justin sb, /sb', ''],
    ['/justin schlafen', 'Zeigt, wie viele Spieler schlafen müssen, damit es Tag wird.', '/schlafen', 'bett nacht'],
    ['/discord', 'Link zum Discord.', '', ''],
    ['/twitch', 'Link zu Twitch.', '', ''],
    ['/tiktok', 'Link zu TikTok.', '', ''],
    ['/youtube', 'Link zu YouTube.', '', ''],
    ['/web', 'Link zur Webseite www.justinzockt.de im Chat.', '/website, /webseite', 'homepage seite internet'],
    ['/vote', 'Link zur Serverliste: Vote für den Server – pro Seite alle 24 Stunden 150 Justin Coins, 5 Erfahrungsfläschchen und ein Tagesbonus. Zeigt auch, wie oft du schon gevotet hast.', '/votes', 'voten abstimmen belohnung serverliste tagesbonus'],
    ['/rewards', 'Tägliche Belohnungen: Glücksrad für alle, dazu Sub-Rad und Premium-Rad für den jeweiligen Rang. Jedes Rad einmal am Tag, neu um 0:00 Uhr. Mit Vote-Knopf.', '/belohnungen, /gluecksrad, /daily', 'glücksrad belohnung täglich daily rad drehen'],
    ['/item', 'Das Item in deiner Hand im Chat zeigen – mit Tooltip zum Drüberfahren (kurze Abklingzeit).', '/showitem, /zeigeitem', 'zeigen gegenstand chat'],
    ['/afk', 'Sofort AFK gehen – bis du dich wieder bewegst.', '', 'abwesend pause'],
    ['/offhand', 'Item in der Hand mit der Zweithand tauschen (wie die Taste F – praktisch auf Bedrock).', '/oh, /zweithand', 'zweithand bedrock tauschen'],
    ['/spawneffekte <1|2|aus>', 'Speed und Sprungkraft am Spawn (Overworld + Nether): Stufe 1, Stufe 2 oder aus. Standardmäßig aus, geht nur am Spawn.', '', 'partikel effekte spawn speed sprung'],
  ]],
  ['chat', 'Chat & Ruhe', [
    ['/ignore <Spieler>', 'Nachrichten eines Spielers ausblenden (Chat und private Nachrichten).', '', 'blockieren stumm ausblenden'],
    ['/unignore <Spieler>', 'Einen ignorierten Spieler wieder einblenden.', '', 'entblocken'],
    ['/msg <Spieler> <Nachricht>', 'Private Nachricht.', '/tell, /w, /whisper, /pm', 'privat flüstern'],
    ['/r <Nachricht>', 'Auf die letzte private Nachricht antworten.', '/reply', 'antworten'],
  ]],
  ['coins', 'Justin Coins & Spielzeit', [
    ['/balance', 'Dein Guthaben an Justin Coins.', '/bal, /money, /coins', 'geld guthaben jc'],
    ['/pay <Spieler> <Betrag>', 'Coins an einen Spieler senden (nur ganze Zahlen, nicht ins Minus).', '', 'geld überweisen zahlen'],
    ['/playtime', 'Deine Spielzeit und die Zeit bis zur nächsten Stunden-Belohnung in Justin Coins.', '', 'spielzeit'],
  ]],
  ['teleport', 'Teleport, Home & PvP', [
    ['/spawn', 'Zum Spawn: 5 Sekunden stillstehen (nicht im Kampf), danach 5 Minuten Abklingzeit (Sub, Premium und Team: keine Abklingzeit).', '', 'teleport'],
    ['/sethome', 'Dein Home setzen (nicht am Spawn). Sub und Premium haben je 1 Home.', '', 'zuhause', 'Sub/Premium'],
    ['/home', 'Zu deinem Home. Sub: 5 Sekunden stillstehen (nicht im Kampf), danach 5 Minuten Abklingzeit. Premium: sofort, ohne Wartezeit und ohne Abklingzeit.', '', 'zuhause teleport', 'Sub/Premium'],
    ['/tpa <Spieler>', 'Teleport-Anfrage an einen Spieler schicken.', '', 'teleport anfrage', 'Premium'],
    ['/tpaccept', 'Eine Teleport-Anfrage annehmen.', '/tpyes', 'teleport annehmen'],
    ['/tpdeny', 'Eine Teleport-Anfrage ablehnen.', '/tpno', 'teleport ablehnen'],
    ['/pvp on', 'PvP für dich einschalten (Start: aus).', '', 'kampf'],
    ['/pvp off', 'PvP für dich ausschalten. Nach einem Kampf gilt eine Sperre von 30 Sekunden.', '', 'kampf'],
  ]],
  ['claims', 'Claims & Kistenschutz', [
    ['/claim chunk', 'Kauf-Angebot für den Chunk, in dem du stehst: Fläche, Gesamtkosten, Strukturzuschlag (Bauwerke wie Dörfer machen ihn teurer) und deine Ersparnis mit Sub/Premium. Bestätigen mit dem Knopf in deiner Hotbar, im Chat oder mit /claim bestaetigen (30 Sekunden Zeit). Grundpreis 2.000 JC, Nether 4.000 JC, End 6.000 JC; Sub 5 % und Premium 10 % Rabatt. Maximal 30 Chunks, Sub 50, Premium 70. Claimen geht erst ab 250 Blöcken Abstand von 0/0 (alle Dimensionen).', '/claim kaufen', 'grundstück schutz chunk kaufen'],
    ['/claim bestaetigen', 'Das offene Kauf-Angebot annehmen (wie der grüne Knopf in der Hotbar).', '/claim ja', 'kaufen bestätigen'],
    ['/claim abbrechen', 'Das offene Kauf-Angebot abbrechen (wie der rote Knopf).', '/claim nein', 'abbrechen'],
    ['/claim bearbeiten', 'Menü für deinen Claim: Name, Rechte für „Alle anderen“ und Freunde, Mitglieder mit Stufe Besucher, Benutzen oder Bauen, und alle Flags. Geht auch auf Bedrock.', '/claim mitglieder, /claim rechte', 'mitglieder rechte menü einstellungen'],
    ['/claim flags', 'Direkt zu den Flags deines Claims (z. B. Kistenzugriff, Türen, Explosionen, Feuer, Pflanzenwachstum, Schneefall).', '', 'flags einstellungen explosion feuer'],
    ['/claim name <Name>', 'Namen für den Chunk setzen (bis 32 Zeichen). Mit /claim name entfernen wieder löschen. Für alle verbundenen Chunks geht es im Menü.', '', 'name umbenennen'],
    ['/claim anzeige [an|aus]', 'Den Claim-Namen oben als Leiste (BossBar) ein- oder ausschalten. Ohne an/aus wird umgeschaltet.', '/claim bossbar', 'bossbar anzeige name'],
    ['/claim', 'Zeigt die Hilfe zu Claims und Kisten (kauft nichts).', '/claim hilfe', 'hilfe'],
    ['/claim info', 'Wem gehört dieser Chunk, wie heißt er und welche Rechte hast du hier?', '', ''],
    ['/claim list', 'Alle deine Chunks mit Koordinaten.', '/claim liste', ''],
    ['/claim show', 'Zeigt 10 Sekunden lang die Claims in deiner Nähe als leuchtenden Rand (grün = deins, gelb = du bist Mitglied, rot = fremd, weiß = frei). Auf der Karte sind alle Claims farbig.', '/claim zeigen', 'grenzen sehen karte'],
    ['/claims', 'Menü mit allen deinen Claims und Sicherungen – bearbeiten, löschen per Doppelklick, Knöpfe für Freunde, Claim-Anzeige und Auto-Sicherung.', '', 'menü'],
    ['/unclaim', 'Chunk freigeben, 50 % des Grundpreises zurück (der Strukturzuschlag wird nicht erstattet).', '', ''],
    ['/unclaim all', 'Alle Chunks freigeben.', '', ''],
    ['/trust <Name>', 'Volles Vertrauen: Der Spieler darf in allen deinen Claims bauen und in allen Kisten reinlegen und rausnehmen.', '', 'freund vertrauen'],
    ['/untrust <Name>', 'Volles Vertrauen wieder entfernen.', '', 'freund'],
    ['/trustlist', 'Alle Spieler mit vollem Vertrauen anzeigen.', '', 'freund'],
    ['/lock', 'Angeschauten Block (Truhe, Fass, Ofen, Spender, Braustand, Endertruhe, Regal …) oder ein Truhenboot / eine Güterlore von Hand sichern. Am Spawn geht das nicht.', '', 'truhe kiste sichern'],
    ['/lock bearbeiten', 'Menü für die angeschaute gesicherte Kiste: Name, Mitglieder mit Stufe (Kein Zugriff, Nur reinlegen, Nur rausnehmen, Reinlegen & rausnehmen), „Alle anderen“, Freunde, öffentlich an/aus und Flags (Trichter, Redstone). Schneller: Schleichen + Rechtsklick mit leerer Hand auf deine Kiste (Bedrock: Schleichen + Schlagen).', '', 'kiste bearbeiten mitglieder rechte name'],
    ['/unlock', 'Sicherung des angeschauten Blocks oder Fahrzeugs entfernen (auch /lock aus).', '', 'truhe'],
    ['/lock liste [Seite]', 'Alle deine Sicherungen im Chat – sortiert nach Art, Welt und Koordinaten.', '', 'truhen liste sicherungen'],
    ['/lock auto <aus|an|standard|liste>', 'Was beim Platzieren automatisch gesichert wird: aus, an (alle Arten), Standard (Kisten, Trichter, Öfen, Shulkerkisten, Fässer) oder Übersicht.', '', 'automatisch sichern einstellung'],
    ['/lock auto <Gruppe> <an|aus>', 'Einzelne Art an/aus, z. B. kisten, trichter, oefen, shulker, faesser, endertruhe, spender, braustand, werkbank, regale, krug, plattenspieler, lesepult, leuchtfeuer, fahrzeuge.', '', 'automatisch sichern gruppe'],
    ['/lock einstellungen', 'Menü mit grün/roten Schaltern für die Auto-Sicherung (auch über den Knopf in /claims, funktioniert auf Bedrock).', '', 'menü automatisch sichern'],
  ]],
  ['freunde', 'Freunde', [
    ['/freunde', 'Freunde-Menü: Anfragen, Freundesliste (wer online ist), Freund hinzufügen und die pauschalen Rechte für Freunde in deinen Kisten und Claims. Geht auch auf Bedrock.', '/freund, /friends, /friend', 'freunde menü rechte'],
    ['/freunde add <Name>', 'Freundschaftsanfrage schicken (auch an Offline-Spieler). Hat dir der andere schon eine geschickt, nimmst du sie damit an.', '/freunde <Name>', 'anfrage hinzufügen einladen'],
    ['/freunde annehmen [Name]', 'Anfrage annehmen. Ohne Name, wenn nur eine offen ist.', '', 'annehmen akzeptieren'],
    ['/freunde ablehnen [Name]', 'Anfrage ablehnen.', '', 'ablehnen'],
    ['/freunde entfernen <Name>', 'Freundschaft beenden.', '', 'entfernen löschen'],
    ['/freunde liste', 'Alle Freunde, wer online ist, steht in Grün.', '', 'liste'],
    ['/freunde anfragen', 'Offene Anfragen mit Knöpfen zum Annehmen und Ablehnen. Anfragen verfallen nach 7 Tagen.', '', 'anfragen'],
  ]],
  ['skills', 'Skills', [
    ['/skill', 'Skill-Menü: Level, Belohnungen, Titel wählen.', '/skills, /justin skill', 'level titel'],
    ['/skill <Skill>', 'Direkt einen Skill öffnen: mining, woodcutting, excavation, farming, fishing, combat (die deutschen Namen gehen auch).', '', 'mining woodcutting excavation farming fishing combat bergbau holz graben landwirt angeln kampf'],
    ['/skill top', 'Rangliste nach Skill-Gesamtlevel (Top 10).', '', 'rangliste'],
    ['/skill top <Skill>', 'Rangliste eines Skills (Top 10).', '', 'rangliste'],
  ]],
  ['clans', 'Clans & Nachrichten', [
    ['/clan hilfe', 'Alle Clan-Befehle im Spiel.', '/clans', ''],
    ['/clan gruenden <TAG> <Name>', 'Clan gründen (Tag 3–4 Zeichen A–Z/0–9).', '', 'gründen erstellen'],
    ['/clan info [TAG]', 'Infos zu deinem oder einem anderen Clan – mit gemeinsamer Spielzeit.', '', 'spielzeit'],
    ['/clan top', 'Rangliste der Clans (Skill-Gesamtlevel + Spielstunden).', '', 'rangliste'],
    ['/clan einladen <Spieler>', 'Spieler einladen (Gründer, Leiter, Ältester; gilt 5 Minuten).', '', ''],
    ['/clan beitreten <TAG>', 'Einladung annehmen.', '', ''],
    ['/clan ablehnen <TAG>', 'Einladung ablehnen.', '', ''],
    ['/clan verlassen', 'Clan verlassen.', '', ''],
    ['/clan kick <Spieler>', 'Mitglied entfernen (Gründer alle; Leiter Älteste und Mitglieder; Älteste nur Mitglieder).', '', 'rauswerfen'],
    ['/clan befoerdern <Spieler> [stufe]', 'Eine Stufe höher: Mitglied → Ältester (Gründer, Leiter), Ältester → Leiter (Gründer). Stufe: aeltester oder leiter.', '', 'befördern ältester leiter'],
    ['/clan degradieren <Spieler> [stufe]', 'Eine Stufe tiefer: Leiter → Ältester (Gründer), Ältester → Mitglied (Gründer, Leiter). Stufe: aeltester oder mitglied.', '', 'ältester mitglied'],
    ['/clan uebertragen <Spieler>', 'Gründerrolle abgeben (Gründer).', '', 'übertragen'],
    ['/clan farbe <Farbe>', 'Farbe des Clan-Tags (Standard weiß). Nur Gründer mit Sub- oder Premium-Rang.', '', 'farbe', 'Sub/Premium'],
    ['/clan aufloesen', 'Clan auflösen (Gründer, mit Bestätigung).', '', 'auflösen löschen'],
    ['/cc <Nachricht>', 'Nachricht in den Clan-Chat.', '/clanchat', 'clan chat'],
    ['/clan chat', 'Normalen Chat auf Clan-Chat umschalten (an/aus).', '', ''],
    ['/clan msg <TAG> <Nachricht>', 'Nachricht an einen anderen Clan.', '', 'nachricht'],
  ]],
  ['vorteile', 'Sub- & Premium-Vorteile', [
    ['/ec', 'Mobile Endertruhe öffnen – überall.', '', 'endertruhe enderchest', 'Sub/Premium'],
    ['/craft', 'Mobile Werkbank öffnen – überall.', '', 'werkbank crafting', 'Sub/Premium'],
    ['/sethome + /home', 'Ein eigenes Home. Sub: 5 Sekunden Wartezeit und 5 Minuten Abklingzeit. Premium: sofort, ohne Wartezeit und Abklingzeit.', '', 'zuhause', 'Sub/Premium'],
    ['/signieren <Text>', 'Das Item in deiner Hand signieren – mit deinem Rang, Namen, Datum und Uhrzeit (Farben wie &c erlaubt, /signieren entfernen nimmt deine Signatur wieder ab).', '/sign', 'signatur unterschrift', 'Premium'],
    ['/invsort', 'Inventar sortieren (Hotbar und Rüstung bleiben). Schaust du dabei auf eine Truhe, ein Fass oder eine Shulkerkiste, wird die sortiert. Java: Mittelklick auf einen leeren Platz in der offenen Truhe.', '/sortieren', 'sortieren ordnen truhe', 'Premium'],
    ['/anvil', 'Mobiler Amboss – überall (nicht in der Minigame-Welt).', '/amboss', 'amboss umbenennen', 'Sub/Premium'],
    ['/stonecutter', 'Mobile Steinsäge – überall.', '/steinsaege', 'steinsäge', 'Sub/Premium'],
    ['/grindstone', 'Mobiler Schleifstein – überall.', '/schleifstein', 'schleifstein entzaubern', 'Sub/Premium'],
    ['/loom', 'Mobiler Webstuhl – überall.', '/webstuhl', 'webstuhl banner', 'Sub/Premium'],
    ['/kaufen', 'Link zum Premium-Shop (Premium kaufen, auch auf premium.html der Website).', '/store, /buy, /premiumshop, /webshop', 'premium shop kaufen store buy'],
    ['/premium', 'Dein Premium-Status und der Link zum Premium-Shop.', '', 'premium status rang'],
  ]],
  ['shop', 'Shop', [
    ['/shop', 'Spieler-Marktplatz öffnen (am Spawn, mit Premium überall).', '', 'kaufen markt'],
    ['/shop verkaufen <Preis> [Menge|alle]', 'Item in der Hand zum Preis pro Stück einstellen.', '', 'verkaufen'],
    ['/shop meine', 'Eigene Angebote verwalten, nachfüllen, Preis ändern, Rücklage abholen.', '', 'angebote'],
  ]],
  ['minigames', 'Minigames', [
    ['/minigames join', 'In die Minigame-Welt (dein Inventar wird gespeichert und kommt beim Verlassen zurück).', '/mg join', 'spiele welt'],
    ['/minigames leave', 'Zurück an deinen letzten Ort in der Survival-Welt.', '/mg leave', 'zurück'],
    ['/minigames stats [Name]', 'Statistiken im Chat (zählen automatisch): Lieblingsspiel, Siege, Niederlagen, Siegquote, Serien, Spielzeit. Im Kompass als Menü.', '', 'statistik'],
    ['/minigames top [Spiel]', 'Minigame-Rangliste (Punkte: Sieg 3, Unentschieden 1).', '', 'rangliste'],
    ['/minigames anleitung <Spiel>', 'Anleitung eines Spiels als Buch.', '', 'regeln hilfe'],
    ['/minigames beitreten <Nr> [Passwort]', 'Einem Raum beitreten.', '', 'raum'],
    ['/minigames suchen', 'Im Chat Mitspieler für deinen Raum suchen.', '', 'mitspieler'],
    ['Kompass (Slot 1)', 'In der Minigame-Welt: alle Spiele (sortierbar nach Name, Kategorie, Beliebtheit, Art, Spielerzahl; filterbar nach Kategorie), Teleport in die Spielräume, Räume, Anleitungen, Statistik- und Ranglisten-Menü.', '', 'menü sortieren'],
  ]],
  ['events', 'Events', [
    ['/justin advent', 'Adventskalender: dein Fortschritt, Anleitung, Countdown und Adventskerzen (ab November sichtbar). Die Türchen öffnest du, indem du am Weihnachts-Spawn das Geschenk mit der Zahl des Tages anklickst.', '/advent', 'weihnachten türchen geschenk'],
  ]],
  ['twitch', 'Twitch-Chat (im Stream)', [
    ['!befehle', 'Im Twitch-Chat von JustinZockt03: Liste aller Chat-Befehle.', '!commands, !hilfe', 'twitch stream chat bot'],
    ['!server', 'Server-Adresse für Java und Bedrock und wie du freigeschaltet wirst.', '!ip, !mc, !minecraft', 'twitch adresse beitreten'],
    ['!premium', 'Preise und Vorteile von Premium mit Shop-Link.', '!vip, !rang', 'twitch kaufen shop'],
    ['!discord', 'Link zum Discord-Server.', '!dc', 'twitch'],
    ['!socials', 'Alle Kanäle: Twitch, TikTok (Streams + Clips), YouTube, Instagram, WhatsApp-Kanal, Discord.', '!links, !tiktok, !youtube, !instagram, !whatsapp', 'twitch'],
    ['!webseite', 'Link zu dieser Webseite. Dazu !regeln, !faq und !shop.', '!website, !web', 'twitch'],
    ['!justin', 'Infos über Justin.', '!ueber, !about', 'twitch streamer'],
    ['!uptime', 'Wie lange der Stream schon läuft.', '', 'twitch live zeit'],
    ['!watchtime [Name]', 'Wie lange du (oder jemand anders) schon im Stream zuschaust, mit Platz in der Rangliste. Gezählt wird nur, während Justin live ist.', '!wt', 'twitch zuschauen zeit'],
    ['!top', 'Die 5 Zuschauer mit der meisten Watchtime.', '', 'twitch rangliste'],
    ['!followage [Name]', 'Seit wann du (oder jemand anders) Justin folgst.', '!follow', 'twitch folgen'],
    ['!titel', 'Aktueller Stream-Titel. Mit !kategorie die aktuelle Kategorie.', '!title, !game', 'twitch'],
    ['!spieler', 'Wer gerade auf dem Minecraft-Server online ist.', '!online', 'twitch minecraft'],
    ['!lurk', 'Sag Bescheid, dass du still zuschaust. Und mit !hug <Name> umarmst du jemanden.', '!hug', 'twitch spaß'],
    ['!so <Kanal>', 'Shoutout für einen anderen Kanal.', '!shoutout', 'twitch mod', 'Twitch-Mod'],
    ['!permit <Name>', 'Der Zuschauer darf 60 Sekunden lang einen Link posten.', '', 'twitch mod link', 'Twitch-Mod'],
    ['!addcom !name <Text>', 'Eigenen Chat-Befehl anlegen. Ändern mit !editcom, löschen mit !delcom.', '!editcom, !delcom', 'twitch mod befehl', 'Twitch-Mod'],
    ['!blacklist add|remove <Wort>', 'Wort im Twitch-Chat sperren oder freigeben.', '', 'twitch mod sperren', 'Twitch-Mod'],
  ]],
];
// Kurze Hinweise unter einzelnen Befehls-Gruppen (HTML)
const CMD_NOTES = {
  allgemein: 'Glücksräder und Voten ausführlich: <a href="belohnungen.html">Glücksräder &amp; Votes</a>.',
  claims: 'Preise, Rollen, alle Flags und der Kistenschutz ausführlich: <a href="claims.html">Claims &amp; Kistenschutz</a>.',
  freunde: 'Was Freunde in deinen Kisten und Claims dürfen: <a href="claims.html#freunde">Freunde</a>.',
};
function befehle() {
  const n = CMDS.reduce((a, g) => a + g[2].length, 0);
  const groups = CMDS.map(([id, title, list]) => `      <section class="cmd-group" id="${id}" aria-labelledby="g-${id}">
        <h2 id="g-${id}">${esc(title)}</h2>
${CMD_NOTES[id] ? `        <p class="muted small">${CMD_NOTES[id]}</p>
` : ''}${list.map(([cmd, desc, alias, keys, rank]) => `        <div class="cmd"${keys || rank ? ` data-keys="${esc([keys, rank].filter(Boolean).join(' '))}"` : ''}><div>${c(cmd)}${rank ? `<span class="badge ${rank === 'Premium' ? 'gold' : 'purple'}">${esc(rank)}</span>` : ''}${alias ? `<span class="alias">auch: ${esc(alias)}</span>` : ''}</div><p>${esc(desc)}</p></div>`).join('\n')}
      </section>`).join('\n');
  return `${head('Übersicht', 'Alle Spieler-Befehle', `Alle ${n} Befehle für Spieler auf einen Blick – einfach oben suchen. Werte in &lt;spitzen Klammern&gt; musst du ausfüllen, Werte in [eckigen Klammern] sind optional.`)}
    <div class="wrap">
      <div class="search" role="search">
        <label for="cmd-search" class="sr-only">Befehle durchsuchen</label>
        <span aria-hidden="true">🔎</span>
        <input id="cmd-search" type="search" placeholder="Suchen, z. B. home, clan, coins …" autocomplete="off">
        <span class="cmd-count" id="cmd-count" aria-live="polite">${n} von ${n}</span>
      </div>
      <div class="callout info"><p>⌨️ <strong>Tipp:</strong> Jeder Befehl geht auch als ${c('/justin <befehl>')} – zum Beispiel ${c('/playtime')} oder ${c('/justin playtime')}. Und jeder ${c('/justin')}-Befehl geht auch ohne /justin, z. B. ${c('/live')} oder ${c('/skill')}. Drück im Chat die <kbd>Tab</kbd>-Taste: Dann siehst du alle Befehle, die du nutzen darfst.</p></div>
      ${jump(CMDS.map(([id, title]) => ['#' + id, esc(title)]), 'Befehls-Gruppen')}
      <p class="callout no-results" id="no-results">Kein Befehl gefunden. Versuch es mit einem anderen Wort.</p>
      <div class="callout info"><p>💬 <strong>Chat:</strong> Du kannst höchstens alle <strong>${info('chat.cooldown_sekunden', '5 Sekunden', 'dauer')}</strong> eine Nachricht schreiben (Spam-Schutz). Bei ${c('/spawn')} musst du ${info('teleport.warmup_sekunden', '5 Sekunden', 'dauer')} stillstehen, danach gilt ${info('teleport.cooldown_sekunden', '5 Minuten', 'dauer')} Abklingzeit (Sub, Premium und Team: keine). Bei ${c('/home')} gilt für Subs 5 Sekunden Wartezeit und 5 Minuten Abklingzeit, Premium kommt sofort hin. Befehle mit <span class="badge purple">Sub/Premium</span> oder <span class="badge gold">Premium</span> gibt es nur mit diesem Rang – mehr auf <a href="raenge.html">Ränge &amp; Vorteile</a>.</p></div>
${groups}
    </div>`;
}

// ------------------------------------------------------------------ FAQ
const FAQ = [
  ['start', 'Wie komme ich auf den Server?', `Über Discord, Twitch-Follow und einen Code – Schritt für Schritt auf <a href="beitreten.html">Beitreten</a>. Java: ${c(IP)}, Bedrock: ${c(BEDROCK.host)} Port ${c(BEDROCK.port)}.`],
  ['serverstart', 'Wann startet der Server?', 'Der Server startet am <strong>27. November 2026 um 14 Uhr</strong>. Bis dahin läuft in der Serverliste der Countdown „Serverstart in …“. Danach zählt der Server die Tage: „Tag 1“, „Tag 2“ und so weiter.'],
  ['version', 'Welche Minecraft-Version brauche ich?', 'Minecraft <strong>Java Edition</strong>, am besten die aktuelle Version (Versionen unter 1.21.5 werden abgewiesen). <strong>Auch für Bedrock (Handy, Konsole, Windows)</strong> – dort immer die neueste Version.'],
  ['bedrock', 'Kann ich mit Handy, Konsole oder Windows-Bedrock spielen?', `Ja! <strong>Auch für Bedrock (Handy, Konsole, Windows).</strong> Adresse ${c(BEDROCK.host)}, Port ${c(BEDROCK.port)}. Auf Xbox, PlayStation und Switch geht das über BedrockConnect oder (Xbox) die App „MC Server Connector“ – Schritt für Schritt auf <a href="beitreten.html#bedrock">Beitreten → Bedrock</a>. Menüs, Glücksräder und Minigames funktionieren auf Bedrock mit einfachem Antippen; Minigames spielst du direkt auf dem Spielfeld. Es ist immer nur <strong>ein</strong> Account freigeschaltet (Java <strong>oder</strong> Bedrock); ein Wechsel geht per Ticket, Items und Coins werden dabei nicht übertragen (<a href="regeln.html#r11">Regel 11</a>).`],
  ['coins', 'Was sind Justin Coins (JC)?', `Die Server-Währung. Du startest mit <strong>5.000 JC</strong> und bekommst für jede Stunde <strong>aktiver Spielzeit</strong> Coins: Spieler ${coinsH('spieler')} JC, Sub ${coinsH('sub')} JC, Premium ${coinsH('premium')} JC. Wer eine Weile nichts macht, ist AFK (Spieler nach ${afkH('spieler')}, Sub nach ${afkH('sub')}, Premium nach ${afkH('premium')}) – dann zählt die Zeit nicht. Dazu kommen Coins bei jedem Skill-Level, bei jedem Dreh am Glücksrad (${c('/rewards')}) und für jeden Vote. Mit ${c('/balance')} siehst du dein Guthaben, mit ${c('/pay <Spieler> <Betrag>')} schickst du Coins. JC haben keinen Echtgeld-Wert und dürfen nicht gegen Echtgeld gehandelt werden. Alle Rang-Vorteile: <a href="raenge.html">Ränge</a>.`],
  ['rewards', 'Was ist /rewards?', `Mit ${c('/rewards')} (auch ${c('/belohnungen')}, ${c('/gluecksrad')}, ${c('/daily')}) öffnest du die täglichen Belohnungen. <strong>Jeder</strong> Spieler dreht jeden Tag gratis das Glücksrad – jeder Dreh gibt immer ein paar Coins und genau einen Gewinn. Twitch-Subs haben zusätzlich das Sub-Rad, Premium das Premium-Rad; wer beides ist, dreht alle 3. Neuer Tag ist um 0:00 Uhr. Die Gewinne haben fünf Stufen von Gewöhnlich bis Legendär. Im Menü kommst du auch direkt zum Voten. Alles dazu: <a href="belohnungen.html">Glücksräder &amp; Votes</a>.`],
  ['vote', 'Kann ich für den Server voten?', `Ja – mit ${c('/vote')} oder direkt auf der <a href="${VOTE_URL}" target="_blank" rel="noopener noreferrer">Serverliste<span class="sr-only"> (öffnet in neuem Tab)</span></a>. Pro Vote-Seite bekommst du alle 24 Stunden <strong>150 Justin Coins und 5 Erfahrungsfläschchen</strong> plus einen <strong>Tagesbonus</strong>, der jeden Wochentag anders ist. Votest du offline, kommt die Belohnung beim nächsten Join. Für 1, 10 und 100 Votes gibt es Erfolge. Alles dazu: <a href="belohnungen.html#voten">Glücksräder &amp; Votes</a>.`],
  ['claims', 'Wie schütze ich mein Gebiet?', `Mit ${c('/claim chunk')} bekommst du ein Kauf-Angebot für den Chunk (16 × 16, ganze Höhe), in dem du stehst – bestätigen mit dem grünen Knopf in der Hotbar oder ${c('/claim bestaetigen')}. Grundpreis <strong>${info('claims.preis', '2.000')} JC</strong> in der Oberwelt, im Nether das Doppelte, im End das Dreifache, dazu ggf. ein Strukturzuschlag. Maximal <strong>${info('claims.max_chunks', '30')}</strong> Chunks als Spieler, 50 als Sub und 70 als Premium. Claimen geht erst ab <strong>250 Blöcken Abstand von 0/0</strong> (X oder Z) – in allen Dimensionen. In ${c('/claim bearbeiten')} stellst du Name, Mitglieder (Besucher, Benutzen, Bauen) und über 40 Flags ein. ${c('/unclaim')} gibt dir ${info('claims.rueckzahlung_prozent', '50 %', 'prozent')} des Chunk-Preises zurück. Alles im Detail: <a href="claims.html">Claims &amp; Kistenschutz</a>.`],
  ['truhen', 'Sind meine Kisten geschützt?', `Ja: <strong>Kisten, Trichter, Öfen, Shulkerkisten und Fässer</strong> werden beim Platzieren automatisch gesichert – auch außerhalb von Claims. Alles andere (Spender, Braustände, Endertruhen, Truhenboote …) sicherst du von Hand mit ${c('/lock')}. <strong>Bearbeiten:</strong> Schleichen + Rechtsklick mit leerer Hand auf deine Kiste (Bedrock: Schleichen + Schlagen) oder ${c('/lock bearbeiten')} – dort gibt es Mitglieder mit „Nur reinlegen“ oder „Nur rausnehmen“, Name, Freunde, öffentlich und die Flags Trichter und Redstone. Du hast bis zu <strong>${info('claims.truhen_spieler', '128')}</strong> Sicherungen als Spieler, ${info('claims.truhen_sub', '192')} als Sub und ${info('claims.truhen_premium', '256')} als Premium. Alles im Detail: <a href="claims.html#kisten">Kistenschutz</a>.`],
  ['freunde', 'Wie funktionieren Freunde?', `Mit ${c('/freunde add <Name>')} schickst du eine Freundschaftsanfrage, der andere nimmt sie mit ${c('/freunde annehmen')} an (Java: Klick auf den Knopf im Chat, Bedrock: im Menü ${c('/freunde')}). Im Freunde-Menü stellst du mit einem Klick ein, was <strong>alle deine Freunde</strong> in deinen Kisten und Claims dürfen. Alles im Detail: <a href="claims.html#freunde">Freunde</a>.`],
  ['spawn', 'Was gibt es am Spawn?', `Der Spawn in Overworld und Nether ist komplett <strong>schadenfrei</strong>: kein PvP, keine Monster, keine Enderman. Dort kannst du nur <strong>Truhen</strong> (Truhe, Fallentruhe, Endertruhe, Fass) benutzen – Bauen, Türen, Knöpfe, Werkbänke, Rahmen, Tiere usw. sind gesperrt. Dort sind der <a href="shop.html">Shop</a> und die NPCs „Events“ und „Minigames“. Vom 1. Dezember bis 1. Januar wird er zum Weihnachts-Spawn mit dem <a href="advent.html">Adventskalender</a>. Oben wechselt die Bossbar zwischen <span data-info-list="spawn.bossbar">Twitch, TikTok, YouTube, Discord und der Webseite</span>. Speed und Sprungkraft am Spawn sind standardmäßig <strong>aus</strong> – mit ${c('/spawneffekte <1|2|aus>')} wählst du Stufe 1, Stufe 2 oder aus (nur am Spawn). Mit ${c('/spawn')} kommst du jederzeit zurück: ${info('teleport.warmup_sekunden', '5 Sekunden', 'dauer')} stillstehen (nicht im Kampf), danach gilt ${info('teleport.cooldown_sekunden', '5 Minuten', 'dauer')} Abklingzeit. Sub, Premium und Team haben keine Abklingzeit.`],
  ['schlafen', 'Wie viele müssen schlafen, damit es Tag wird?', `Es reicht, wenn ${info('schlafen.prozent', '25 %', 'prozent')} der Spieler in der Oberwelt im Bett liegen.`],
  ['home', 'Wie viele Homes habe ich?', `Ohne Rang gibt es kein Home – dafür bringen dich ${c('/spawn')} und dein Bett zurück. <strong>Sub</strong> und <strong>Premium</strong> haben je <strong>ein Home</strong>: ${c('/sethome')} setzt es (nicht am Spawn), ${c('/home')} bringt dich hin. Subs stehen dafür 5 Sekunden still und haben danach 5 Minuten Abklingzeit, Premium kommt sofort hin – ohne Wartezeit und ohne Abklingzeit. <a href="raenge.html">Ränge</a>`],
  ['respawn', 'Wo spawne ich nach dem Tod?', 'Immer <strong>am Spawn</strong> – außer du hast ein <strong>Bett</strong> oder einen <strong>Seelenanker</strong> gesetzt, dann dort.'],
  ['pvp', 'Wie funktioniert PvP?', `PvP ist am Anfang für dich aus. Mit ${c('/pvp on')} schaltest du es ein. Kämpfen geht nur, wenn <strong>beide</strong> Spieler PvP an haben. Nach einem Kampf kannst du 30 Sekunden lang nicht umschalten. Mit der Angel kann man keine Spieler heranziehen. Fallen stellen, um Spieler mit PvP-aus zu töten, ist verboten (<a href="regeln.html#r3-3">Regel 3.3</a>).`],
  ['skills', 'Wie funktionieren die Skills?', `Einfach spielen: Mining, Woodcutting, Excavation, Farming, Fishing und Combat geben XP, und <strong>jedes</strong> Level gibt automatisch Coins und ein Upgrade. Über der Hotbar siehst du, wie viel XP du gerade sammelst. Gesetzte Blöcke, Bäume aus Setzlingen und Generator-Blöcke geben keine XP. Keine Punkte, nichts kaufen, keine Abklingzeiten. Menü: ${c('/skill')}. Alles auf <a href="skills.html">Skills</a>.`],
  ['mending', 'Wo bekomme ich Mending?', `Nicht bei Dorfbewohnern, nicht in Kisten, nicht beim normalen Angeln – nur über Skills (Excavation und Farming bei Level 75), Events, die Glücksräder (Stufe „Legendär“) und sehr seltene Bücher. Details auf <a href="verzauberungen.html">Verzauberungen</a>.`],
  ['elytra', 'Wo finde ich eine Elytra?', 'Im End, ganz oben im Sub-Glücksrad – oder als „Rentier-Flügel“ beim Treue-Bonus im <a href="advent.html">Adventskalender</a>. Jeder Elytra-Fund wird allen angesagt.'],
  ['welt', 'Wie groß ist die Welt? Wann öffnen Nether und End?', 'Die Weltgrenze liegt bei 10.000 Blöcken in jede Richtung (Overworld, Nether und End). Das <strong>End</strong> öffnet am <strong>9. Januar 2027 um 14 Uhr</strong> (der Termin kann sich noch ändern). Wann der <strong>Nether</strong> öffnet, bleibt geheim: <strong>???</strong>. Beide öffnen automatisch mit Ankündigung, den Stand siehst du auf der <a href="index.html#h-welt">Startseite</a>. Im End ist die Grenze zuerst nur 125 Blöcke groß – erst wenn der erste Enderdrache besiegt ist, wächst sie langsam (1 Block pro Sekunde) auf 10.000. Der erste Enderdrache hat 100-fache Lebenspunkte; eine Leiste oben zeigt, wie viele er noch hat. Wer mindestens 2 % des Schadens macht, bekommt 10.000 Combat-XP.'],
  ['drachenei', 'Wer bekommt das Drachenei?', 'Wer dem <strong>ersten</strong> Enderdrachen den <strong>letzten Treffer</strong> gibt. Das Ei gehört dann fest dieser Person: Es ist <strong>unzerstörbar</strong> (kein Feuer, keine Lava, keine Explosion, kein Verschwinden), niemand sonst kann es aufheben – auch kein Admin – und beim Tod verlierst du es nicht. Lässt du es fallen, bleibt es leuchtend genau an der Stelle schweben (kein Wasser, kein Void). In Truhen, Fässern und der Endertruhe kann es nur der Besitzer herausnehmen, und ein Behälter oder Rahmen mit dem Ei lässt sich nicht abbauen. Platziert ist das Ei selbst <strong>gesichert</strong> wie eine Truhe – nur der Besitzer kann es einsammeln (Schleichen + Linksklick), auch Freunde nicht. Der Chunk wird dabei <strong>nicht</strong> geclaimt. Den Besitzer wechseln kann das Ei <strong>nur über den Shop</strong> – und bietet jemand es dort an, bekommen alle eine Nachricht.'],
  ['gateways', 'Wann kann ich die End-Gateways benutzen?', 'Nach dem ersten Enderdrachen sind die Gateways zu den äußeren End-Inseln noch <strong>1 Stunde gesperrt</strong>. Über jedem Gateway zählt eine Anzeige herunter. Wer schneller zu den End-Städten will, baut sich rüber – oder wartet. Auch Enderperlen kommen in der Zeit nicht durch.'],
  ['spawner', 'Kann ich Spawner oder Loot-Truhen abbauen?', 'Nein. <strong>Spawner, Trial-Spawner und Tresore</strong> sind unzerstörbar – auch durch Explosionen und Kolben. <strong>Loot-Truhen</strong> in Bauwerken kann man nicht abbauen und nichts hineinlegen; herausnehmen geht. Soll ein Spawner oder eine Loot-Truhe wirklich weg, erstelle ein Ticket in <strong>#tickets</strong>. Ein Spawner-Ei aus dem Premium-Glücksrad ändert einen normalen Spawner genau einmal.'],
  ['zucht', 'Warum kann ich hier keine Tiere mehr züchten?', 'Pro Chunk gibt es eine Zuchtgrenze für Dorfbewohner und Tiere, damit keine Lag-Farmen entstehen. Ist sie erreicht, steht „Keine Zucht mehr hier.“ – verteil deine Tiere einfach auf mehrere Chunks. Dorfbewohner, die von Zombies getötet werden, werden immer zu Zombie-Dorfbewohnern.'],
  ['buecher', 'Sieht man, wann ein Buch signiert wurde?', 'Ja. Signierte Bücher bekommen automatisch <strong>Rang, Name, Datum und Uhrzeit</strong> der Signatur.'],
  ['wartung', 'Ich komme nicht drauf – „Wartung“?', 'Bei Updates schaltet das Team den eigenen <strong>Wartungsmodus</strong> ein. Dann können nur Teammitglieder joinen. Wie lange es dauert, steht im Discord.'],
  ['amboss', 'Gibt es „Zu teuer“ am Amboss?', 'Nein. Du zahlst einfach die hohen Level.'],
  ['mods', 'Welche Mods sind erlaubt?', 'Alles steht auf der Seite <a href="mods.html">Erlaubte &amp; verbotene Mods</a>. Kurz: Erlaubt sind z. B. Sodium, Lithium, Iris/OptiFine mit Shadern, Fabric API, Mod Menu, Distant Horizons, JEI/REI/EMI (ohne Cheat-Modus), Simple Voice Chat, Litematica (nur Anzeigen) und Minimaps <strong>ohne</strong> Radar und Höhlenanzeige. Verboten sind u. a. Hacked Clients (Wurst, Meteor, Aristois …), X-Ray, Freecam, Autoclicker, Killaura, Baritone und Seed-Cracker. Alles, was nicht in der Liste steht, ist verboten – im Zweifel vorher per Ticket in <strong>#tickets</strong> fragen.'],
  ['anticheat', 'Was macht der Anticheat?', 'Der Server prüft automatisch Client, Mods und Verhalten (Bewegung, Klickrate, Platziertempo, Reichweite). Bei Verstößen folgt ein automatischer Kick, dann Tempbann 1 Tag → 7 Tage → dauerhaft. Bekannte Cheat-Clients werden sofort gebannt. Xaero\'s Minimap und VoxelMap werden automatisch auf Fair-Play gestellt.'],
  ['voice', 'Gibt es Sprachchat?', 'Der Server ist für die Mod <strong>Simple Voice Chat</strong> vorbereitet. Die Regeln gelten auch im Sprachchat, er wird <strong>nicht aufgezeichnet</strong>. Ob er gerade aktiv ist, erfährst du im Discord.'],
  ['report', 'Jemand hält sich nicht an die Regeln – was tun?', 'Melde es per Ticket im Discord (<strong>#tickets</strong> → „Spieler melden“) mit Zeit, Koordinaten und beteiligten Spielern. Am besten mit Video – lass dafür ein Aufnahmeprogramm mit Replay-Puffer mitlaufen. Nervt dich jemand im Chat, hilft sofort <code>/ignore &lt;Spieler&gt;</code>.'],
  ['bann', 'Ich wurde gebannt – was nun?', 'Der Grund steht auf dem Bildschirm. Einen Entbannungsantrag stellst du im Discord (<strong>#tickets</strong> → „Entbannung“). Ein Antrag pro Bann, bitte ehrlich und sachlich.'],
  ['bewerben', 'Kann ich mich fürs Team bewerben?', 'Ja! Bewerbungen laufen über den Discord-Kanal <strong>#tickets</strong> (Knopf „Bewerbung“) – zum Beispiel als Cutter, Builder, Dev, Supporter oder Mod. Mehr auf der Seite <a href="team.html#bewerben">Team</a>.'],
  ['chat', 'Warum kann ich nicht schneller schreiben?', `Zum Schutz vor Spam kannst du im Chat höchstens alle <strong>${info('chat.cooldown_sekunden', '5 Sekunden', 'dauer')}</strong> eine Nachricht schreiben.`],
  ['twitchchat', 'Welche Befehle gibt es im Twitch-Chat?', 'Im Stream von JustinZockt03 antwortet der eigene Bot zum Beispiel auf <code>!server</code>, <code>!premium</code>, <code>!discord</code>, <code>!socials</code>, <code>!uptime</code>, <code>!watchtime</code> und <code>!followage</code> – alle stehen auf <a href="befehle.html#twitch">Befehle → Twitch-Chat</a>. Der Bot achtet auch auf Spam: Fremde Links, Großbuchstaben, Zeichen-Spam und Beleidigungen werden gelöscht, bei Wiederholung gibt es einen Timeout. Links darfst du posten, wenn ein Mod dir <code>!permit</code> gibt.'],
  ['erfolge', 'Gibt es Erfolge?', 'Ja! Im Fortschritte-Menü (Taste <kbd>L</kbd>) hat der Server einen eigenen Reiter „JustinZocktCommunity“ mit vielen Erfolgen – für Minigames, Tode, PvP-Kills, Spielzeit, Coins, Skills, Clans, den Adventskalender, seltene Funde, Claims, den Shop, Votes, Paychecks, AFK-Zeit, Angeln, Loot-Truhen, Full Dia und vieles mehr. Alle Erfolge auf der Seite <a href="erfolge.html">Erfolge</a>, die Rangliste nach Anzahl der Erfolge auf <a href="ranglisten.html">Ranglisten</a>.'],
  ['minigametitel', 'Gibt es Titel für Minigames?', 'Ja: Wer in einem Minigame <strong>1.000 gewertete Siege</strong> schafft, bekommt den Titel dieses Spiels (auswählen im Kompass unter „🏅 Titel“). Allein zählen nur erfolgreich beendete Runden ohne Verlassen; mit anderen gilt eine Mindestdauer, und verlässt ein Gegner nach mindestens 1 Minute, zählt der Sieg trotzdem. Mehr auf <a href="minigames.html#mg-titel">Minigames</a>.'],
  ['clanraenge', 'Welche Ränge gibt es im Clan?', 'Gründer &gt; Leiter &gt; Ältester &gt; Mitglied. Älteste dürfen einladen und Mitglieder entfernen, Leiter zusätzlich Älteste entfernen und Mitglieder zum Ältesten befördern. Befördern und degradieren geht mit <code>/clan befoerdern &lt;Spieler&gt; [stufe]</code> und <code>/clan degradieren &lt;Spieler&gt; [stufe]</code>. Den Clan-Tag über dem Kopf sehen nur Mitglieder des eigenen Clans. Mehr auf <a href="clans.html">Clans</a>.'],
  ['sub', 'Was bringt ein Twitch-Sub oder Premium?', `Vorweg: <strong>Das Spielerlebnis ist für alle vollständig</strong> – Skills, Clans, Shop, Glücksrad, Minigames, Erfolge und Events gibt es für jeden. Sub und Premium sind ein kleines Dankeschön für Unterstützung. Twitch-Subs bekommen automatisch den Sub-Rang: 1 Home, keine Abklingzeit bei ${c('/spawn')}, 50 Claims mit 5 % Rabatt, eigene Clan-Farbe (als Gründer), ${c('/ec')}, ${c('/craft')}, mobilen Amboss, Steinsäge, Schleifstein und Webstuhl, das Sub-Glücksrad, ${coinsH('sub')} JC pro Stunde und erst nach ${afkH('sub')} AFK. Premium hat zusätzlich ${c('/tpa')}, ein Home ganz ohne Wartezeit und Abklingzeit, ${c('/signieren')}, ${c('/invsort')}, kostenloses farbiges Umbenennen im Amboss, ${c('/shop')} überall, eine größere Endertruhe, das Premium-Glücksrad, 70 Claims mit 10 % Rabatt, ${coinsH('premium')} JC pro Stunde und ${afkH('premium')} bis AFK. Beide Ränge haben außerdem etwas mehr Glück bei seltenen Funden. Alles im Vergleich: <a href="raenge.html">Ränge &amp; Vorteile</a>, Premium kaufen: <a href="premium.html">Premium</a>.`],
  ['premium', 'Wie bekomme ich Premium?', `Premium kaufst du online im Premium-Shop – alle Preise, Vorteile und der Ablauf stehen auf der Seite <a href="premium.html">Premium kaufen</a>. Im Spiel zeigen dir ${c('/kaufen')} und ${c('/premium')} den Link. Premium ist ein eigener Spieler-Rang: Auch das Team hat Premium nicht automatisch.`],
  ['geburtstag', 'Wie trage ich meinen Geburtstag ein?', `Im Discord-Kanal <strong>#geburtstage</strong> klickst du auf <strong>„🎂 Geburtstag eintragen“</strong> und gibst <strong>Tag und Monat</strong> ein – oder du schreibst im Spiel <code>/geburtstag eintragen &lt;Tag&gt; &lt;Monat&gt;</code> (z. B. <code>/geburtstag eintragen 12 3</code>); dafür muss dein Discord mit Minecraft verbunden sein, das Ergebnis ist dasselbe. Ein Jahr oder dein Alter wird nicht gespeichert. Eintragen geht nur einmal; vertippt? Dann per Ticket in <strong>#tickets</strong> ändern lassen. An deinem Geburtstag gratuliert dir der Bot im Kanal (29. Februar: in Nicht-Schaltjahren am 28. Februar). Ist dein Discord mit Minecraft verknüpft, sehen alle Spieler beim Joinen deinen Geburtstag und können dir freiwillig ein Geschenk machen. Mit ${c('/geburtstag')} siehst du alle Geburtstage, mit ${c('/geburtstag geschenke')} öffnest du deine Geschenke – sie bleiben gespeichert, bis du sie abholst.`],
  ['daten', 'Welche Daten werden gespeichert?', 'Alles dazu auf der Seite <a href="datenschutz.html">Datenschutz</a>. Kurz: Was für Whitelist, Schutz und Moderation nötig ist – auch Clan-Chat und private Nachrichten.'],
];
const faq = () => `${head('Hilfe', 'Häufige Fragen', 'Die wichtigsten Antworten rund um den Server. Deine Frage ist nicht dabei? Frag im Discord über ein Ticket in #tickets.')}
    <div class="wrap">
      <nav class="toc" aria-labelledby="faq-toc"><h2 id="faq-toc">Fragen</h2><ol>${FAQ.map(([id, q]) => `<li><a href="#${id}">${esc(q)}</a></li>`).join('')}</ol></nav>
${FAQ.map(([id, q, a]) => `      <details id="${id}"><summary>${esc(q)}</summary><div class="details-body"><p>${a}</p></div></details>`).join('\n')}
    </div>`;

// ------------------------------------------------------------------ team
const Y = '✅'; const N = '<span aria-label="nein">–</span>';
const team = () => `${head('Team', 'Ränge &amp; Team-Rechte', 'Wer im Team was darf – damit du weißt, an wen du dich wenden kannst. Namen stehen bewusst nicht hier, frag im Discord.')}
    <div class="wrap">
      ${jump([['#t-raenge', 'Die Ränge'], ['#t-rechte', 'Wer darf was?'], ['#t-schutz', 'Schutzregeln'], ['#bewerben', 'Bewerben']])}
      <h2 id="t-raenge">Die Ränge</h2>
      ${table(['Rang', 'Aufgabe'], [
        ['<strong>Owner</strong>', 'Der Server-Inhaber. Hat alle Rechte und verwaltet Coins, Updates, Backups und das Dashboard.'],
        ['<strong>Admin</strong>', 'Leitet das Team: alle Moderations-Rechte, Whitelist, Welten, Spawn und Einstellungen.'],
        ['<strong style="color:#a64dff">Developer</strong>', 'Technik: Konfiguration neu laden, Lag-Analyse.'],
        ['<strong style="color:#2e4fd6">Moderator</strong>', 'Moderation: Kicks, Mutes, Banns (auch dauerhaft), Entbannungen, Griefing prüfen.'],
        ['<strong>Builder</strong>', 'Baut am Spawn (mit Kreativ-Inventar und WorldEdit).'],
        ['<strong style="color:#4da6ff">Supporter</strong>', 'Erste Ansprechperson, kann kicken, muten und bis zu 1 Tag bannen.'],
        ['<strong>Premium</strong>', 'Besonderer Spieler-Rang mit 1 Home ohne Wartezeit, /ec, /craft, /tpa, /signieren, /invsort, mobilen Arbeitsblöcken, Premium-Glücksrad, 70 Claims und den meisten Coins pro Stunde – <a href="raenge.html">alle Vorteile</a>, <a href="premium.html">Premium kaufen</a>. Kein Team-Rang: Teammitglieder haben Premium nicht automatisch.'],
        ['<strong>Sub</strong>', 'Automatisch für Twitch-Subs von JustinZockt03: Home, /ec, /craft, mobile Arbeitsblöcke, Sub-Glücksrad, 50 Claims und mehr Coins pro Stunde – <a href="raenge.html">alle Vorteile</a>.'],
        ['<strong style="color:#c8c8c8">Spieler</strong>', 'Alle freigeschalteten Community-Mitglieder – mit dem vollen Spielerlebnis.'],
      ], { label: 'Ränge' })}
      <p class="muted small">Vererbung: Moderator hat automatisch alles von Supporter. Admin hat alles von Moderator, Builder und Developer.</p>

      <h2 id="t-rechte">Wer darf was?</h2>
      ${table(['Recht', 'Supporter', 'Moderator', 'Builder', 'Developer', 'Admin'], [
        ['Kicken', Y, Y, N, N, Y],
        ['Muten / Entmuten', Y, Y, N, N, Y],
        ['Bannen', '<strong>max. 1 Tag</strong>', '✅ auch dauerhaft', N, N, '✅ auch dauerhaft'],
        ['Entbannen', N, Y, N, N, Y],
        ['Chatnachrichten löschen', Y, Y, N, N, Y],
        ['Anticheat-Meldungen, Tode, Tier-Kills ansehen', Y, Y, N, N, Y],
        ['Inventar-Backups ansehen', Y, '✅ + zurückgeben', N, N, Y],
        ['Unsichtbar (Vanish), Positionsverlauf, Zweitaccounts ansehen, Wegpunkte', N, Y, N, N, Y],
        ['Teleport', N, Y, Y, N, Y],
        ['Kreativmodus (eigenes Inventar)', N, Y, Y, N, Y],
        ['Fremde Inventare ansehen', N, '✅ nur ansehen', N, N, '✅ auch ändern'],
        ['Griefing nachsehen und zurücksetzen', N, Y, N, N, Y],
        ['Am Spawn bauen + WorldEdit', N, N, Y, N, Y],
        ['Konfiguration neu laden, Lag-Analyse', N, N, N, Y, Y],
        ['Whitelist, Nether/End/PvP an/aus, Spawn bauen, Ranglisten/Zahlungen, VPN-/Zweitaccount-Ausnahmen, fremde Claims öffnen', N, N, N, N, Y],
        ['Vorladen der Welt, Karte, Wartungsmodus, Sprachchat-Verwaltung', N, N, N, N, Y],
      ], { label: 'Team-Rechte', rowHead: true })}

      <h2 id="t-schutz">Schutzregeln im Team</h2>
      <ul>
        <li><strong>Teammitglieder kann nur ein Admin bestrafen</strong> – ein Sup kann also keinen Mod kicken.</li>
        <li><strong>Den Owner kann niemand kicken, muten oder bannen.</strong></li>
        <li>Sich selbst bestrafen geht nicht.</li>
        <li>Jede Strafe (Kick, Mute, Bann, Entbannung) wird mit dem Namen des Teamlers im Team angezeigt und im Discord-Log gespeichert. So bleibt alles nachvollziehbar.</li>
        <li>Auch Admins sind vom Anticheat <strong>nicht</strong> ausgenommen.</li>
        <li>Anweisungen des Teams sind zu befolgen. Findest du eine Entscheidung unfair, klär das per Ticket im Discord, nicht im Chat (<a href="regeln.html#r2-5">Regel 2.5</a>).</li>
      </ul>
      <p>Strafdauern: <code>30m</code> = 30 Minuten, <code>2h</code> = 2 Stunden, <code>1d</code> = 1 Tag, <code>1w</code> = 1 Woche, <code>perm</code> = dauerhaft (nur Mod/Admin). Auch eine <strong>Minigame-Sperre</strong> ist als Strafe möglich.</p>

      <h2 id="bewerben">Bewirb dich fürs Team</h2>
      <p>Du willst mithelfen? Bewerbungen laufen über den Discord-Kanal <strong>#tickets</strong>: Klick dort auf den Knopf <strong>„Bewerbung“</strong> und schreib, wofür du dich bewirbst, was du kannst und wie oft du Zeit hast.</p>
      <div class="grid">
        <div class="card"><span class="icon" aria-hidden="true">✂️</span><h3>Cutter</h3><p>Schneidet Clips und Highlights aus Justins Streams für TikTok und YouTube.</p></div>
        <div class="card"><span class="icon" aria-hidden="true">🏗️</span><h3>Builder</h3><p>Baut am Spawn und an Event-Orten. (In der Minigame-Welt gibt es keinen Kreativmodus.)</p></div>
        <div class="card"><span class="icon" aria-hidden="true">💻</span><h3>Developer</h3><p>Hilft bei Technik, Plugins und Konfiguration.</p></div>
        <div class="card"><span class="icon" aria-hidden="true">🎧</span><h3>Supporter</h3><p>Erste Ansprechperson für Fragen und Tickets.</p></div>
        <div class="card"><span class="icon" aria-hidden="true">⚖️</span><h3>Moderator</h3><p>Sorgt für Ordnung: Meldungen prüfen, Strafen, Entbannungen.</p></div>
      </div>
      <p class="muted small">Ob gerade für eine Rolle gesucht wird, steht im Discord. Bitte nur eine Bewerbung pro Rolle und kein Nachfragen im Chat – das Team meldet sich im Ticket.</p>
      <div class="btn-row"><a class="btn btn-primary" href="${LINKS.discord}" target="_blank" rel="noopener noreferrer">Zum Discord (#tickets)<span class="sr-only"> (öffnet in neuem Tab)</span></a></div>
    </div>`;

// ------------------------------------------------------------------ datenschutz
const datenschutz = () => `${head('Rechtliches', 'Datenschutz', 'Was wir speichern, warum und wie lange – für den Minecraft-Server, den Discord-Bot und diese Website.')}
    <div class="wrap">
      <div class="callout warn"><p><strong>Verantwortlich</strong> im Sinne der DSGVO ist die im <a href="impressum.html">Impressum</a> genannte Person. Kontakt für Datenschutzfragen: <a href="mailto:justinwachsmuth14@gmail.com">justinwachsmuth14@gmail.com</a> oder per Ticket im Discord.</p></div>

      <h2 id="server">1. Minecraft-Server und Discord-Bot</h2>
      <h3>Welche Daten?</h3>
      <p>Für den Betrieb speichern wir:</p>
      <ul>
        <li>Minecraft-Name und UUID, Discord-ID, Twitch-Name; bei Bedrock-Spielern zusätzlich Xbox-Gamertag und Xbox-ID</li>
        <li>IP-Adressen (<strong>90 Tage</strong>, zur Erkennung von Zweitaccounts und Bann-Umgehung)</li>
        <li><strong>Chat-Nachrichten – auch Clan-Chat und private Nachrichten (/msg)</strong></li>
        <li>Spielaktionen (Blöcke, Truhen, Positionen, Tode, Zahlungen), Spielzeit, Strafen</li>
        <li>Freiwillig: dein Geburtstag aus <strong>#geburtstage</strong> – nur <strong>Tag und Monat</strong>, kein Jahr und kein Alter; Löschen per Ticket</li>
      </ul>
      <h3>Wozu?</h3>
      <p>Whitelist-Prüfung, Schutz vor Griefing, Cheats, Bann-Umgehung und VPNs, Moderation und Beweissicherung.</p>
      <div class="callout"><p><strong>Hinweis zu privaten Chats:</strong> Clan-Chat und private Nachrichten (${c('/msg')}, ${c('/r')}, ${c('/cc')}, ${c('/clan msg')}) werden zur Moderation <strong>gespeichert</strong> und können vom <strong>Owner eingesehen</strong> werden. Der automatische Filter gilt auch dort. Schreib dort also nichts, was niemand außer dem Empfänger lesen soll.</p></div>
      <h3>Sprachchat</h3>
      <p>Der Sprachchat wird <strong>nicht aufgezeichnet</strong>.</p>
      <h3>Weitergabe</h3>
      <p>Daten werden nur vom Server-Team eingesehen und nicht an Dritte weitergegeben, außer an technische Dienstleister (Hoster, DDoS-Schutz, Discord, Twitch-Schnittstelle). Zur VPN-Erkennung wird deine IP-Adresse an den Prüfdienst proxycheck.io (Großbritannien) übermittelt; das Ergebnis wird 7 Tage gespeichert.</p>
      <h3>Premium-Kauf (Tebex)</h3>
      <p>Premium wird über <strong>Tebex</strong> (Tebex Limited, Großbritannien) verkauft. Tebex ist dabei selbst Verkäufer und Zahlungsabwickler und verarbeitet deine Zahlungs- und Rechnungsdaten in eigener Verantwortung nach seiner eigenen Datenschutzerklärung, die du beim Kauf siehst. Wir erhalten von Tebex nur, was für die Vergabe des Rangs nötig ist: deinen Minecraft-Namen, die Bestellnummer, das gekaufte Paket und ob eine Zahlung zurückgebucht wurde. Diese Angaben speichern wir zur Rangvergabe und als Nachweis, solange du Premium hast, und danach bis zu 12 Monate.</p>
      <h3>Löschung</h3>
      <p>Gelöscht werden die Daten auf Anfrage per Ticket oder spätestens <strong>12 Monate nach deinem letzten Login</strong>, außer bei laufenden Strafen.</p>
      <h3>Einwilligung</h3>
      <p>Mit „Akzeptieren“ der <a href="regeln.html">Regeln</a> im Discord stimmst du dieser Datenverarbeitung zu (<a href="regeln.html#r8">Regeln, Abschnitt 8</a>).</p>

      <h2 id="website">2. Diese Website</h2>
      <ul>
        <li><strong>Hosting:</strong> Die Seite ist eine statische Website und wird über <strong>GitHub Pages</strong> bereitgestellt (GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA). GitHub verarbeitet beim Aufruf technisch notwendige Daten (z. B. IP-Adresse, Zeitpunkt, aufgerufene Seite) in Server-Logs, um die Seite auszuliefern und vor Angriffen zu schützen (berechtigtes Interesse, Art. 6 Abs. 1 lit. f DSGVO). Dabei können Daten in die USA übertragen werden; GitHub ist nach dem EU-US Data Privacy Framework zertifiziert. Mehr dazu in der <a href="https://docs.github.com/de/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer">Datenschutzerklärung von GitHub<span class="sr-only"> (öffnet in neuem Tab)</span></a>.</li>
        <li><strong>Keine Cookies, kein Tracking:</strong> Wir setzen keine Cookies, keine Analyse-Tools und laden keine externen Schriften. Einzige Ausnahme beim Laden von außen sind die Spielerköpfe auf der Ranglisten-Seite (siehe unten).</li>
        <li><strong>Ranglisten und Server-Infos:</strong> Einige Seiten laden die Dateien <code>daten/ranglisten.json</code> und <code>daten/info.json</code> direkt von dieser Website (kein Drittanbieter). Sie werden automatisch etwa alle 15 Minuten vom Minecraft-Server übernommen. <code>ranglisten.json</code> enthält die Minecraft-Namen freigeschalteter Spieler mit Spielwerten (z. B. Coins, Spielzeit, Tode, Skills, Erfolge, Votes, Clans, Minigame-Statistik, Minecraft-Statistiken wie abgebaute Blöcke oder Kills). <code>info.json</code> enthält nur allgemeine Server-Werte (z. B. Version, Spielerzahl, Minigames, Öffnungszeiten von Nether und End) und keine personenbezogenen Daten.</li>
        <li><strong>Spielerköpfe in den Ranglisten:</strong> Auf der Seite <a href="ranglisten.html">Ranglisten</a> werden die Köpfe und Skins der Spieler als Bilder vom Dienst <strong>mc-heads.net</strong> geladen. Dabei erfährt dieser Dienst deine IP-Adresse und den angezeigten Minecraft-Namen (die Namen sind ohnehin öffentlich). Wir senden keinen Referrer mit. Ohne Bild wird der Anfangsbuchstabe angezeigt.</li>
        <li><strong>Live-Status:</strong> Auf der Startseite fragt dein Browser den Server-Status bei <strong>api.mcsrvstat.us</strong> ab. Dabei wird deine IP-Adresse an diesen Dienst übertragen. Die Abfrage enthält nur die Server-Adresse ${c(IP)}, keine weiteren Daten über dich.</li>
        <li><strong>Externe Links</strong> (Discord, Twitch, TikTok, YouTube, die Serverliste zum Voten, BedrockConnect auf GitHub) öffnen sich erst, wenn du sie anklickst. Dort gelten die Datenschutzerklärungen der jeweiligen Anbieter.</li>
      </ul>

      <h2 id="rechte">3. Deine Rechte</h2>
      <p>Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch sowie das Recht, eine erteilte Einwilligung zu widerrufen. Außerdem kannst du dich bei einer Datenschutz-Aufsichtsbehörde beschweren. Am einfachsten erreichst du uns per Ticket im Discord.</p>
      <p class="muted small">Verantwortlicher: Justin Wachsmuth, c/o IP-Management #8399, Ludwig-Erhard-Straße 18, 20459 Hamburg, justinwachsmuth14@gmail.com</p>
    </div>`;

// ------------------------------------------------------------------ impressum
const impressum = () => `${head('Rechtliches', 'Impressum', 'Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz).')}
    <div class="wrap">
      <div class="card">
        <h2 style="margin-top:0">Angaben gemäß § 5 DDG</h2>
        <p>Justin Wachsmuth<br>c/o IP-Management #8399<br>Ludwig-Erhard-Straße 18<br>20459 Hamburg</p>
        <h2>Kontakt</h2>
        <p>E-Mail: <a href="mailto:justinwachsmuth14@gmail.com">justinwachsmuth14@gmail.com</a><br>Telefon: <a href="tel:+4915732345294">015732345294</a></p>
        <h2>Redaktionell verantwortlich</h2>
        <p>Justin Wachsmuth</p>
        <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
        <p>Justin Wachsmuth<br>c/o IP-Management #8399<br>Ludwig-Erhard-Straße 18<br>20459 Hamburg</p>
      </div>
      <h2>Haftung für Inhalte</h2>
      <p>Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.</p>
      <p>Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.</p>
      <h2>Haftung für Links</h2>
      <p>Unser Angebot enthält Links zu externen Websites Dritter (z. B. Discord, Twitch, TikTok, YouTube), auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.</p>
      <h2>Urheberrecht</h2>
      <p>Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.</p>
      <h2>Hinweis</h2>
      <p>JustinZocktCommunity ist kein offizielles Minecraft-Produkt und steht in keiner Verbindung zu Mojang oder Microsoft.</p>
      <p class="muted small">Quelle: Impressum-Privatschutz</p>
    </div>`;

// ------------------------------------------------------------------ admin
const ADMIN = [
  ['Team (Sup, Mod)', [
    ['/justin kick <Name> [Grund]', 'Spieler kicken.'],
    ['/justin mute <Name> <Dauer> [Grund]', 'Chat-Sperre. Entsperren: /justin unmute <Name>.'],
    ['/justin ban <Name> <Dauer|perm> <Grund>', 'Bann mit Grund (Sup max. 1 Tag). Aufheben: /justin unban <Name>.'],
    ['/justin ac <Name> | alerts', 'Anticheat: Client, Mods, Verstöße; Meldungen an/aus.'],
    ['/justin deaths <Name>', 'Todespunkte mit Datum, Uhrzeit, Ursache – Klick = Teleport.'],
    ['/justin kills <Name> | near [Radius]', 'Wer hat welches Tier getötet (letzte 20).'],
    ['/justin vanish', 'Unsichtbar (auch in der Tablist).'],
    ['/justin wo <Name> <Zeit>', 'Wo war jemand um 14:30 / vor 2h? (14 Tage Verlauf)'],
    ['/justin alts <Name>', 'Zweitaccounts (gleiche IP) ansehen.'],
    ['/justin tp <x> <z> [nether|end]', 'Zu Koordinaten teleportieren (z. B. von der Karte).'],
    ['/tpoff <Spieler>', 'Zur letzten Position eines Spielers, auch wenn er offline ist (ab Moderator). Zum Owner nur per Anfrage.'],
    ['/justin wp set|del|list|tp <Name>', 'Eigene Wegpunkte.'],
    ['/inv <Name> [ec]', 'Survival-Inventar (mit ec: Endertruhe) eines Spielers ansehen – live, auch offline und in der Minigame-Welt (Mod; ändern: Admin).'],
    ['/ec <Name>', 'Survival-Endertruhe eines Spielers ansehen (Moderator).'],
    ['/rollback <Name>', 'Inventar-Sicherungen eines Spielers (Tod, Join, Quit, Weltwechsel …) ansehen (Supporter); wiederherstellen, Items herausnehmen, zum Ort teleportieren (Moderator).'],
    ['/justin minigames sperren <Name> [1h|3d|perm] [Grund]', 'Spieler für die Minigame-Welt sperren (Strafe). Aufheben: /justin minigames entsperren <Name>, Liste: /justin minigames gesperrt.'],
    ['[✖] vor Chatnachrichten', 'Nachricht für alle löschen (nur das Team sieht den Knopf).'],
  ]],
  ['Admin', [
    ['/justin nether|end on|off', 'Dimension öffnen oder sperren.'],
    ['/justin pvp on|off', 'PvP für alle an/aus.'],
    ['/justin whitelist add|remove|list [Name]', 'Whitelist von Hand.'],
    ['/justin build spawn [Höhe]', 'Spawn bauen (Standard 64): Zitadelle mit Turm und rotem Beacon-Strahl, Kuppel, Wassergraben, schwebenden Inseln, Toren und Portalen. Der vorherige Zustand wird gesichert.'],
    ['/justin build spawn reset', 'Letzten Spawn-Bau rückgängig machen (mit „bestaetigen“). Bis zu 5 Bauten zurück.'],
    ['/justin build netherspawn [Höhe]', 'Nether-Spawn + Netherdach bauen (vorheriger Zustand wird gesichert).'],
    ['/justin build netherspawn reset', 'Letzten Nether-Spawn-Bau rückgängig machen (mit „bestaetigen“).'],
    ['/justin tpto <Name>', 'Zu einem Spieler teleportieren (auch Klick auf [➜] im Chat).'],
    ['/justin tphere <Name>', 'Spieler zu dir holen.'],
    ['/justin makro add|del|list|<Name>', 'Häufige Befehle speichern und ausführen (je Person). Beispiel: /justin makro add tag time set day'],
    ['/justin baltop | playtimetop', 'Volle Ranglisten Coins / Spielzeit.'],
    ['/justin payments [Name]', 'Alle Zahlungen (optional von/an einen Spieler).'],
    ['/justin alts allow|deny <Name>', 'Zweitaccount-Ausnahmen.'],
    ['/justin vpn allow|deny <Name> | test <IP>', 'VPN-Ausnahmen und Test.'],
    ['/justin carry <Name> | drop', 'Spieler tragen (Schleichen + Rechtsklick).'],
    ['/justin traffic', 'Datenverkehr pro Tag + Hochrechnung.'],
    ['/justin minigames [offen on|off]', 'Minigame-Welt betreten (Team, auch wenn sie geschlossen ist – Kreativ ist dort gesperrt); für Spieler öffnen/sperren.'],
    ['/justin reload', 'Konfiguration neu laden.'],
    ['Wartungsmodus', 'Eigener Wartungsmodus: nur das Team kann joinen, die Serverliste zeigt „Wartung“ (Befehl siehe /justin im Spiel).'],
    ['/rollback <Name> sichern', 'Von Hand eine Inventar-Sicherung anlegen.'],
    ['/clearinv <Name> | /clearender <Name>', 'Survival-Inventar bzw. Endertruhe leeren (vorher automatisch gesichert).'],
    ['/searchinv <Item> [Anzahl] | /searchender <Item> [Anzahl]', 'Online-Spieler mit einem bestimmten Item finden (Inventar / Endertruhe).'],
    ['/searchenchant <Verzauberung> [Stufe]', 'Online-Spieler mit einer Verzauberung finden.'],
    ['/searchcontainer <Item> [Chunk-Radius]', 'Truhen und andere Behälter mit einem Item in der Nähe finden.'],
    ['/silentcontainer [on|off] | /anycontainer [on|off]', 'Truhen leise öffnen (ohne Animation/Geräusch) bzw. blockierte Truhen öffnen.'],
    ['/claims <Name>', 'Claims und Sicherungen eines Spielers (Rechtsklick = Teleport).'],
    ['/claim list <Name>', 'Alle Claims eines Spielers mit Welt und Koordinaten – Klick = Teleport.'],
    ['/claim show <Name>', 'Grenzen der Claims eines Spielers in deiner Welt anzeigen (orange). /claim info zeigt bei fremden Claims Besitzer, Datum und Freunde.'],
    ['/clan admin aufloesen <TAG>', 'Clan löschen.'],
    ['/clan admin kick <TAG> <Spieler>', 'Spieler aus einem Clan entfernen.'],
    ['/shop admin entfernen <AngebotsID>', 'Shop-Angebot entfernen (IDs stehen für Admins in der Lore). Items gehen in die Rücklage des Verkäufers.'],
  ]],
  ['Nur Owner', [
    ['/justin dashboard', 'Einmal-Link zum Dashboard (10 Minuten gültig, nur einmal). Der Link ist nicht mehr anklickbar: nur zum Kopieren oder per Discord-Direktnachricht – stream-sicher.'],
    ['/justin texte [overworld|nether|npc|eigene|minigames]', 'Alle schwebenden Texte (auch die festen Texte der Minigame-Welt: Halle, Türen, Raumtitel, Spielfeld-Schilder) mit Knöpfen: TP, an/aus, bearbeiten, hierher, reset. Rechtsklick auf einen Text öffnet das Bearbeiten-Menü.'],
    ['/justin text <id> verschieben [dx dy dz] | setzen <Text> | groesse <Zahl> | an | aus | reset | loeschen', 'Einen Text direkt ändern. Neuer eigener Text: /justin text neu <id> [Text].'],
    ['/justin portal nether|end <TT.MM.JJJJ> <HH:MM> | jetzt | zu', 'Öffnungs-Zeitpunkt für Nether/End setzen (öffnet automatisch, Countdown unter dem Portal).'],
    ['/justin farbe <#rrggbb> [#dunkel] | reset', 'Server-Hauptfarbe ändern (Chat, Menüs, Scoreboard, Serverliste, Webseite).'],
    ['/justin schlafen <prozent>% | <anzahl>', 'Wie viele Spieler schlafen müssen (Standard 25 %).'],
    ['/justin claims [limit <wert> | limit <Name> <wert|reset> | set <key> <wert>]', 'Claim-Limits, Preis, Erstattung, Truhen-Limits je Rang usw. ändern.'],
    ['/tpr [overworld|nether|end]', 'Zufälliger, sicherer Ort innerhalb der Weltgrenze.'],
    ['Dashboard → Karte: Rechtsklick', 'Hierhin teleportieren, Wegpunkt setzen, /tp kopieren. Unten rechts: Online-Spieler mit TP. Ebenen: Claims, Wegpunkte, Orte, Offline-Spieler, Homes, Tode (7 Tage). Oben in der Mitte: Knöpfe Oberwelt, Nether, End, Minigames.'],
    ['/justin eco summe', 'Überblick: Coins im Umlauf, Zahlungen.'],
    ['/justin eco top', 'Rangliste Coins.'],
    ['/justin eco info <Name>', 'Guthaben eines Spielers + Knöpfe.'],
    ['/justin eco give|take|set <Name> <Betrag>', 'Coins geben, abziehen oder setzen.'],
    ['/justin eco reset [Name]', 'Guthaben auf 5.000 JC (ohne Name: du selbst).'],
    ['/pausestats [an|aus|status]', 'Eigene Stats pausieren: Spielzeit, Coins pro Stunde, Tode, Kills, Skills, Minigames, Erfolge zählen nicht.'],
    ['/justin signieren [Spieler] <Text>', 'Gegenstand in der Hand signieren. Entfernen: /justin signieren entfernen [Spieler].'],
    ['/justin resetstats <Name|alle> tode|spielzeit|skills|coins|vanilla|alles', 'Statistiken zurücksetzen („vanilla“ = Minecraft-Statistiken, Advancements, Rezepte, Level; „alle“ mit Bestätigung).'],
    ['/justin reset <Name>', 'Spieler komplett zurücksetzen (inkl. Bauten).'],
    ['/justin eventitem <Name> rahmen|leuchtrahmen|licht [Menge]', 'Event-Gegenstände vergeben (unsichtbare Rahmen, Leuchtrahmen, Licht-Blöcke).'],
    ['/justin npc events|minigames|shop|skills', 'NPC mit schwebendem Schild an deine Position setzen.'],
    ['/justin npc schild <typ>', 'Nur das Schild eines NPCs an deine Position versetzen.'],
    ['/justin npc entfernen <typ>', 'NPC + Schild entfernen.'],
    ['/minigames reset <Name|ich|alle> [Spiel]', 'Minigame-Spielstände zurücksetzen – mit allen Ranglisten-Werten (Punkte, Kills, Zeiten, Höhen; bei „alle“ mit Bestätigung).'],
    ['/minigames beliebtheit reset [Spiel|alle] bestaetigen', 'Beliebtheit der Minigames (Sortierung im Kompass) neu zählen lassen; Statistiken bleiben.'],
    ['/justin webpush [jetzt]', 'Ranglisten und Server-Infos sofort auf die Website laden / Status anzeigen.'],
    ['/minigames bauen', 'Minigame-Welt (Spawn-Halle mit Türen, alle Spielräume mit je 4 Spielfeldern) neu bauen. Laufende Räume werden geschlossen.'],
    ['/clan spy', 'Clan-Chats und /msg mitlesen an/aus.'],
    ['/justin skill set <Name> <Skill|alle> <level|xp> <Wert>', 'Skill-Level oder XP setzen.'],
    ['/justin skill reset <Name> <Skill|alle>', 'Skills auf Level 1 zurücksetzen.'],
    ['/justin skill buch <Name> <telekinese|holzfaeller|seelenbindung|reparatur> [Stufe]', 'Seltenes Buch vergeben (für Events).'],
    ['/justin skill info <Name>', 'Skill-Stand eines Spielers.'],
    ['/justin skill reload', 'skills.yml neu laden.'],
    ['/justin advent stats', 'Wie viele Spieler welches Türchen geöffnet haben (nur 1.–24.12. für Spieler sichtbar).'],
    ['/justin advent schild', 'Adventskalender-Schild an deine Position setzen.'],
    ['/justin live tiktok on|off', 'TikTok-Live von Hand setzen.'],
    ['/justin tiktokfollower <Zahl>', 'TikTok-Follower für die Serverliste.'],
    ['/justin twitchlogin', 'Einmalig: Twitch für Follow-/Sub-Prüfung verbinden.'],
    ['/justin setupranks', 'Teamgruppen in LuckPerms anlegen (ergänzt nur, löscht nichts).'],
    ['/justin backup [now|list|export] | delete <Name|alle-ausser-neuestes>', 'Backups (täglich automatisch); alte Backups löschen, um Speicher zu sparen.'],
    ['/justin update [check|now]', 'Plugin-Updates (täglich automatisch).'],
  ]],
];
const admin = () => `${head('Intern', 'Admin-Bereich', 'Der echte Admin-Bereich ist das <strong>Server-Dashboard</strong>. Diese Seite erklärt, wie du hineinkommst, was es kann, und listet alle Team-, Admin- und Owner-Befehle.')}
    <div class="wrap">
      <div class="callout warn"><p>🔒 Diese Website hat <strong>keinen Login</strong> und speichert nichts. Das Dashboard läuft direkt auf dem Server und ist nur über einen persönlichen <strong>Einmal-Link</strong> erreichbar.</p></div>

      <h2>So öffnest du das Dashboard</h2>
      <ol class="steps">
        <li><h3>Link anfordern</h3><p>Den Einmal-Link kann nur der Server-Owner anfordern – im Spiel oder im Discord.</p></li>
        <li><h3>Link kopieren und öffnen</h3><p>Der Link ist im Chat <strong>nicht anklickbar</strong> (stream-sicher): Kopiere ihn oder lass ihn dir per <strong>Discord-Direktnachricht</strong> schicken und öffne ihn im Browser. Er gilt <strong>10 Minuten</strong> und <strong>nur einmal</strong>. Ohne gültigen Link gibt es nur „Nicht angemeldet“.</p></li>
        <li><h3>Arbeiten</h3><p>Danach bleibst du <strong>12 Stunden</strong> angemeldet. Neue Daten holst du mit <strong>⟳ Aktualisieren</strong>, mit <strong>Abmelden</strong> beendest du die Sitzung sofort. Am besten zu Hause öffnen, nicht in öffentlichen WLANs.</p></li>
      </ol>

      <h2>Was das Dashboard kann</h2>
      <div class="grid">
        <div class="card"><span class="icon" aria-hidden="true">👥</span><h3>Alle Spieler</h3><p>Name (auch alte Namen), Whitelist seit/entfernt am, Twitch (+ Sub), Bann und Grund, Koordinaten, Coins, Spielzeit, Tode, Chunks, Sicherungen, zuletzt online – sortier- und durchsuchbar.</p></div>
        <div class="card"><span class="icon" aria-hidden="true">➜</span><h3>Teleport: „➜ TP“, „➜ Hin-TP“, „⤓ Holen“</h3><p>Zu Spielern teleportieren – auch zur letzten Position von Offline-Spielern – und Spieler zu dir holen. Offline-Spieler werden beim nächsten Join geholt.</p></div>
        <div class="card"><span class="icon" aria-hidden="true">🗑️</span><h3>Gelöschte Nachrichten</h3><p>Welche Chat-Nachricht wer aus dem Team wann gelöscht hat – mit Absender und Text.</p></div>
        <div class="card"><span class="icon" aria-hidden="true">🔎</span><h3>Suche in allem</h3><p>Jede Liste zeigt die neuesten 500 Einträge, die Suche findet aber jeden gespeicherten Eintrag.</p></div>
        <div class="card"><span class="icon" aria-hidden="true">⚖️</span><h3>Strafen &amp; Team-Aktionen</h3><p>Kicks, Mutes, Banns und Entbannungen mit Teamler und Grund im Überblick.</p></div>
        <div class="card"><span class="icon" aria-hidden="true">💬</span><h3>Private Chats</h3><p>Clan-Chats und private Nachrichten zur Moderation.</p></div>
        <div class="card"><span class="icon" aria-hidden="true">🛒</span><h3>Shop</h3><p>Alle Angebote und Verkäufe.</p></div>
        <div class="card"><span class="icon" aria-hidden="true">🛡️</span><h3>Clans &amp; Skills</h3><p>Alle Clans mit Mitgliedern, Skill-Stände aller Spieler.</p></div>
        <div class="card"><span class="icon" aria-hidden="true">🪙</span><h3>Zahlungen &amp; Tode</h3><p>Die letzten Zahlungen, Spieler-Tode mit Ort und Ursache und Tier-Tode – dort nur noch Tiere, die durch Spieler, TNT oder Feuer gestorben sind.</p></div>
        <div class="card"><span class="icon" aria-hidden="true">🚨</span><h3>Anticheat</h3><p>Meldungen, Kicks und Banns des Anticheats.</p></div>
        <div class="card"><span class="icon" aria-hidden="true">💾</span><h3>Backups</h3><p>Überblick über die täglichen Sicherungen.</p></div>
        <div class="card"><span class="icon" aria-hidden="true">🗺️</span><h3>Karte</h3><p>Die komplette Welt-Karte – nur mit Anmeldung. Claims anklicken: Besitzer, Mitglieder, Teleport und Löschen (einzeln oder alle eines Spielers).</p></div>
      </div>

      <h2 id="befehle">Schnellreferenz: Team-, Admin- und Owner-Befehle</h2>
      <p class="muted">Dauer-Angaben: <code>30m</code>, <code>2h</code>, <code>1d</code>, <code>1w</code> oder <code>perm</code> (nur Mod/Admin). Admins haben alle Team-Befehle, der Owner hat alles. Die Owner-Befehle stehen bewusst nicht auf der Website, sondern nur in der internen Befehlsliste.</p>
      <p class="muted">Jeder ${c('/justin')}-Befehl geht auch ohne /justin, z. B. ${c('/mute')}, ${c('/ac')}, ${c('/vanish')}, ${c('/wo')} – und jeder normale Befehl auch als ${c('/justin <befehl>')}. Wo der Name schon Minecraft oder Paper gehört, mit j davor: ${c('/jban')}, ${c('/jkick')}, ${c('/jtp')}, ${c('/jreset')}, ${c('/jreload')} (außerdem ${c('/wl')} = whitelist, ${c('/sb')} = scoreboard, ${c('/hilfe')} = help). Mit <kbd>Tab</kbd> im Chat siehst du nur die Befehle, die du nutzen darfst.</p>
      <div class="search" role="search">
        <label for="admin-search" class="sr-only">Team-, Admin- und Plugin-Befehle durchsuchen</label>
        <span aria-hidden="true">🔎</span>
        <input id="admin-search" type="search" placeholder="Befehle suchen, z. B. mute, bann, vanish, rollback …" autocomplete="off">
        <span class="cmd-count" id="admin-count" aria-live="polite"></span>
      </div>
      <p class="muted" id="admin-none" style="display:none">Kein Befehl gefunden – versuch ein anderes Wort.</p>
      <div id="admin-cmds">
${ADMIN.filter(([t]) => t !== 'Nur Owner').map(([t, list]) => `      <div class="admin-group">
      <h3>${esc(t)}</h3>
      ${table(['Befehl', 'Was passiert'], list.map(([a, b]) => [c(a), esc(b)]), { label: t })}
      </div>`).join('\n')}

      <p class="muted">Inventare und Sicherungen laufen über die eigenen Befehle ${c('/inv')}, ${c('/ec <Name>')} und ${c('/rollback')} (siehe oben).</p>

      <div class="admin-group">
      <h3>Weitere Werkzeuge (Plugins)</h3>
      ${table(['Befehl', 'Was passiert'], [
        [c('/pr i'), 'Prism-Inspektor an/aus, dann Block anklicken.'],
        [c('/pr l p:Name since:1d'), 'Aktionen eines Spielers nachsehen.'],
        [c('/pr rollback p:Name since:1d r:50'), 'Griefing zurücksetzen.'],
        [c('/pr undo'), 'Rollback rückgängig machen.'],
        [c('lp user <Name> parent add <rang>'), 'Rang vergeben (sup, mod, builder, dev, admin, premium). Entfernen: parent remove.'],
      ], { label: 'Plugin-Befehle' })}
      </div>
      </div>
      <p class="muted small">Ausführliche Anleitungen liegen im Projektordner (nicht öffentlich). Diese Seite enthält bewusst keine Zugangsdaten, Server-Adressen außer ${c(IP)} oder Links zum Dashboard.</p>
    </div>`;

module.exports = { events, advent, befehle, faq, team, datenschutz, impressum, admin, CMDS, ADMIN, FAQ };
