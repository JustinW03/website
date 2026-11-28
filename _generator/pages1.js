// Startseite, Beitreten, Regeln, Verzauberungen, Clans, Shop
const fs = require('fs');
const { IP, BEDROCK, VOTE_URL, BEDROCK_DNS, LINKS, esc, c, de, ext, head, table, DEF, coinsH, info, jump, shopBtn } = require('./lib.js');
const { Y } = require('./skills.js');
const { priceChips } = require('./pages3.js');

const SOCIAL = [
  ['discord', 'Discord', 'Whitelist, Tickets, News', '💬'],
  ['twitch', 'Twitch', 'JustinZockt03 live', '📺'],
  ['tiktok', 'TikTok', '@justinzockt03live', '🎵'],
  ['youtube', 'YouTube', '@JustinZockt03', '▶️'],
];
const socials = () => `<div class="socials">${SOCIAL.map(([k, n, s, i]) => `<a class="social" href="${LINKS[k]}" target="_blank" rel="noopener noreferrer"><span class="s-ico" aria-hidden="true">${i}</span><span>${n}<small>${s}</small></span><span class="sr-only"> (öffnet in neuem Tab)</span></a>`).join('')}</div>`;

// ------------------------------------------------------------------ index
const cube = (cls) => `<div class="cube ${cls}"><i></i><i></i><i></i><i></i><i></i><i></i></div>`;
const MARQUEE = ['6 Skills bis Level 100', '33 Minigames', 'Java & Bedrock', 'Tägliche Glücksräder', 'Clans & Clan-Rangliste', 'Freunde', 'Spieler-Shop', 'Eigene Verzauberungen', 'Adventskalender', 'Claims & Kistenschutz', 'Fair Play & Anticheat', 'Twitch-Sub-Vorteile', 'Erfolge & Ranglisten'];
const marquee = () => `<div class="marquee" aria-hidden="true"><div class="marquee-track">${[0, 1].map((k) => `<div${k ? ' aria-hidden="true"' : ''} style="display:flex">${MARQUEE.map((m) => `<span>${esc(m)}</span>`).join('')}</div>`).join('')}</div></div>`;
// Oeffentliche Termine (Nether bleibt geheim: nur "???")
const END_OPEN = '13. Januar 2027 um 14 Uhr';
const SERVERSTART = '27. November 2026 um 14 Uhr';
const portals = () => `<div class="portals">
          <article class="portal nether" data-portal="nether" aria-labelledby="pt-nether"><h3 id="pt-nether"><span aria-hidden="true">🔥</span> Nether <span class="portal-state closed">???</span></h3><p class="portal-text">Wann der Nether öffnet, bleibt ein Geheimnis: ??? – lass dich überraschen!</p><div class="countdown" hidden></div></article>
          <article class="portal end" data-portal="end" aria-labelledby="pt-end"><h3 id="pt-end"><span aria-hidden="true">🌌</span> End <span class="portal-state soon">Bald</span></h3><p class="portal-text">Das End öffnet am ${END_OPEN} (der Termin kann sich noch ändern).</p><div class="countdown" hidden></div></article>
        </div>`;

const index = () => `    <section class="hero">
      <canvas class="hero-canvas" aria-hidden="true"></canvas>
      <div class="hero-aurora" aria-hidden="true"><span></span><span></span><span></span></div>
      <div class="wrap hero-grid">
        <div class="hero-text">
          <span class="eyebrow">Minecraft Java &amp; Bedrock · Community-Server</span>
          <h1><span class="line">Willkommen in der</span> <span class="line grad-text">JustinZocktCommunity</span></h1>
          <p class="lead">Der Survival-Server von Streamer JustinZockt03: faire Regeln, Skills mit Belohnungen bei jedem Level, Clans, Spieler-Shop, 33 Minigames, Events und ein Team, das aufpasst. <strong>Auch für Bedrock (Handy, Konsole, Windows).</strong></p>
          <div class="ip-box">
            <span class="label">Server-Adresse</span>
            <span class="ip" id="server-ip">${IP}</span>
            <button class="btn btn-primary copy-btn" type="button" data-copy="${IP}" aria-describedby="server-ip">📋 Kopieren</button>
          </div>
          <div class="ip-box ip-bedrock">
            <span class="label">Bedrock (Handy, Konsole, Windows)</span>
            <span class="ip" id="bedrock-ip">${BEDROCK.host} <small class="port">Port ${BEDROCK.port}</small></span>
            <button class="btn btn-ghost copy-btn" type="button" data-copy="${BEDROCK.host}" aria-describedby="bedrock-ip">📋 Kopieren</button>
          </div>
          <p class="small"><a href="beitreten.html#bedrock">So spielst du mit Bedrock – auch auf Xbox, PlayStation und Switch →</a></p>
          <p class="sr-only" id="copy-status" aria-live="polite"></p>
          <div class="status-card" id="server-status" data-host="${IP}" aria-live="polite">
            <div class="status-line"><span class="dot" aria-hidden="true"></span><span class="status-text">Status wird geladen …</span></div>
            <div class="status-meta">Live-Abfrage über api.mcsrvstat.us</div>
            <ul class="player-list" hidden aria-label="Spieler, die gerade online sind"></ul>
            <noscript><p class="status-meta">Für den Live-Status wird JavaScript benötigt.</p></noscript>
          </div>
          <div class="btn-row">
            <a class="btn btn-primary" href="beitreten.html">So kommst du auf die Whitelist →</a>
            <a class="btn btn-ghost" href="${LINKS.discord}" target="_blank" rel="noopener noreferrer">Zum Discord<span class="sr-only"> (öffnet in neuem Tab)</span></a>
          </div>
          <p class="hero-premium"><a href="premium.html"><span aria-hidden="true">👑</span> <strong>Premium</strong> kannst du jetzt direkt hier auf der Website kaufen <span aria-hidden="true">→</span></a></p>
        </div>
        <div class="hero-scene" aria-hidden="true">
          <div class="scene">
            <div class="scene-glow"></div>
            <div class="orbit"></div>
            ${cube('c1')}${cube('c2')}${cube('c3')}${cube('c4')}${cube('c5')}
          </div>
        </div>
      </div>
      <div class="wrap">
        <dl class="stats">
          <div class="stat"><dt>Minigames</dt><dd><span data-count="26" data-info-len="minigames">26</span></dd></div>
          <div class="stat"><dt>Skills</dt><dd><span data-count="6">6</span><small>bis Lvl 100</small></dd></div>
          <div class="stat"><dt>Coins pro Stunde</dt><dd><span data-count="${DEF.coins.spieler}" data-info-count="coins_pro_stunde.spieler">${de(DEF.coins.spieler)}</span><small>JC</small></dd></div>
          <div class="stat"><dt>Gerade online</dt><dd><span data-online>–</span></dd></div>
        </dl>
      </div>
    </section>
    ${marquee()}

    <section id="premium" aria-labelledby="h-premium">
      <div class="wrap">
        <div class="premium-band">
          <div>
            <h2 id="h-premium"><span aria-hidden="true">👑</span> Premium – direkt hier kaufen</h2>
            <p>Der besondere Spieler-Rang als Dankeschön für deine Unterstützung: 1 Home ganz ohne Wartezeit, ${c('/tpa')}, Endertruhe mit 54 Plätzen, ${c('/signieren')}, ${c('/invsort')}, ${c('/shop')} überall, ein eigenes Premium-Glücksrad, 70 Claims mit 10 % Rabatt und ${coinsH('premium')} JC pro Stunde. Spielen kannst du alles auch ohne Rang – Premium macht es nur ein bisschen bequemer.</p>
            <div class="btn-row"><a class="btn btn-gold" href="premium.html">Premium ansehen <span aria-hidden="true">→</span></a>${shopBtn('Zum Premium-Shop', 'btn btn-ghost')}</div>
          </div>
          ${priceChips()}
        </div>
      </div>
    </section>

    <section aria-labelledby="h-start">
      <div class="wrap">
        <h2 id="h-start">In 3 Schritten auf den Server</h2>
        <ol class="steps">
          <li><h3>Discord beitreten</h3><p>Tritt dem ${ext(LINKS.discord, 'Discord-Server')} bei und akzeptiere die Regeln.</p></li>
          <li><h3>Twitch verbinden &amp; folgen</h3><p>Verbinde im Kanal #freischalten deinen Twitch-Account und folge ${ext(LINKS.twitch, 'JustinZockt03')}.</p></li>
          <li><h3>Code holen &amp; eingeben</h3><p>Verbinde dich mit ${c(IP)} (Java) oder ${c(BEDROCK.host)}, Port ${c(BEDROCK.port)} (Bedrock) – du siehst einen persönlichen Code. Den gibst du im Discord ein, fertig. <a href="beitreten.html">Ausführliche Anleitung →</a></p></li>
        </ol>
      </div>
    </section>

    <section aria-labelledby="h-features">
      <div class="wrap">
        <h2 id="h-features">Was dich erwartet</h2>
        <div class="grid">
          <a class="card" href="skills.html"><span class="icon" aria-hidden="true">📈</span><h3>6 Skills bis Level 100</h3><p>Mining, Woodcutting, Excavation, Farming, Fishing und Combat – jedes Level bringt Coins und ein Upgrade, dazu gibt es Items und Titel.</p><span class="more">Zu den Skills <span aria-hidden="true">→</span></span></a>
          <a class="card" href="minigames.html"><span class="icon" aria-hidden="true">🎮</span><h3>33 Minigames</h3><p>Von 4 Gewinnt und Schach bis Reducto und Eisbootrennen – jedes Spiel mit eigenem Raum, echten Spielfeldern und Statistik.</p><span class="more">Zu den Minigames <span aria-hidden="true">→</span></span></a>
          <a class="card" href="raenge.html"><span class="icon" aria-hidden="true">💎</span><h3>Ränge: Sub &amp; Premium</h3><p>Alle spielen das volle Spiel. Twitch-Subs bekommen automatisch ein paar Extras wie ein Home, ${c('/ec')}, ${c('/craft')} und mobile Arbeitsblöcke. Premium bringt noch etwas mehr – z. B. ${c('/tpa')} und ein Home ohne Wartezeit.</p><span class="more">Alle Ränge im Vergleich <span aria-hidden="true">→</span></span></a>
          <a class="card" href="verzauberungen.html"><span class="icon" aria-hidden="true">📕</span><h3>Eigene Verzauberungen</h3><p>Soulbound, Telekinesis und Timber I–III. Mending gibt es nur über Skills, Events, die Glücksräder und seltene Funde.</p><span class="more">Zu den Verzauberungen <span aria-hidden="true">→</span></span></a>
          <a class="card" href="clans.html"><span class="icon" aria-hidden="true">🛡️</span><h3>Clans</h3><p>Gründe deinen Clan mit eigenem Tag und Farbe, nutze den Clan-Chat und kämpf dich in der Clan-Rangliste nach oben.</p><span class="more">Zu den Clans <span aria-hidden="true">→</span></span></a>
          <a class="card" href="shop.html"><span class="icon" aria-hidden="true">🛒</span><h3>Spieler-Shop</h3><p>Verkaufe deine Items zu deinem eigenen Preis in Justin Coins – am Spawn mit ${c('/shop')}.</p><span class="more">Zum Shop <span aria-hidden="true">→</span></span></a>
          <a class="card" href="advent.html" data-season="advent" hidden><span class="icon" aria-hidden="true">🎄</span><h3>Adventskalender</h3><p>Vom 1. bis 24. Dezember liegt am Weihnachts-Spawn jeden Tag ein Geschenk mit der Zahl des Tages versteckt – such es und klick es an. Mit Treue-Bonus für alle, die kein Türchen verpassen.</p><span class="more">Zum Kalender <span aria-hidden="true">→</span></span></a>
          <a class="card" href="claims.html"><span class="icon" aria-hidden="true">🏠</span><h3>Claims &amp; Kistenschutz</h3><p>Sichere dein Grundstück mit ${c('/claim chunk')} ab ${info('claims.preis', '2.000')} JC – mit Rollen, Flags und Namen. Kisten, Öfen, Trichter, Shulkerkisten und Fässer werden automatisch gesichert.</p><span class="more">Zu den Claims <span aria-hidden="true">→</span></span></a>
          <a class="card" href="faq.html#coins"><span class="icon" aria-hidden="true">🪙</span><h3>Justin Coins</h3><p>5.000 JC zum Start und ${coinsH('spieler')} JC pro aktiver Stunde – dazu Coins für Skills, Glücksräder und Votes.</p><span class="more">Mehr erfahren <span aria-hidden="true">→</span></span></a>
          <a class="card" href="erfolge.html"><span class="icon" aria-hidden="true">🏆</span><h3>Erfolge</h3><p>Eigener Reiter im Fortschritte-Menü (Taste L) – von Minigame-Siegen über Votes, Angeln und Loot-Truhen bis 1.000 Stunden Spielzeit.</p><span class="more">Zu den Erfolgen <span aria-hidden="true">→</span></span></a>
          <a class="card" href="belohnungen.html"><span class="icon" aria-hidden="true">🎡</span><h3>Glücksräder &amp; Votes</h3><p>Mit ${c('/rewards')} drehst du jeden Tag gratis das Glücksrad – Coins gibt es bei jedem Dreh. Subs und Premium bekommen zusätzlich ein eigenes Rad.</p><span class="more">Zu den Glücksrädern <span aria-hidden="true">→</span></span></a>
          <a class="card" href="claims.html#freunde"><span class="icon" aria-hidden="true">🤝</span><h3>Freunde</h3><p>Schick Freundschaftsanfragen mit ${c('/freunde')} und gib deinen Freunden mit einem Klick Rechte in deinen Kisten und Claims.</p><span class="more">So geht’s <span aria-hidden="true">→</span></span></a>
          <a class="card" href="mods.html"><span class="icon" aria-hidden="true">🛡️</span><h3>Fair Play</h3><p>Automatischer Anticheat, klare Mod-Liste und ein aufmerksames Team. PvP nur, wenn beide es eingeschaltet haben.</p><span class="more">Erlaubte Mods <span aria-hidden="true">→</span></span></a>
        </div>
      </div>
    </section>



    <section aria-labelledby="h-welt">
      <div class="wrap">
        <h2 id="h-welt">Live: Welt-Status &amp; Ranglisten</h2>
        <div class="callout info"><p>🚀 <strong>Serverstart: ${SERVERSTART}.</strong> Danach zählt der Server die Tage – „Tag 1“, „Tag 2“ … stehen in der Tabliste und in der Serverliste.</p></div>
        <p class="muted">Das <strong>End</strong> öffnet am ${END_OPEN} – der Termin kann sich noch ändern. Wann der <strong>Nether</strong> öffnet? <strong>???</strong> Das bleibt eine Überraschung. Beide Dimensionen öffnen automatisch, mit Ankündigung im Spiel.</p>
        ${portals()}
        <div class="grid-2">
          <a class="card" href="ranglisten.html"><span class="icon" aria-hidden="true">🏆</span><h3>Ranglisten</h3><p>Coins, Spielzeit, Skills, Erfolge, Clans und jedes Minigame – automatisch aktualisiert.</p><span class="more">Zu den Ranglisten <span aria-hidden="true">→</span></span></a>
          <a class="card" href="events.html"><span class="icon" aria-hidden="true">🎉</span><h3>Events</h3><p>Aktuelle Events, Event-Regeln und im Dezember der Adventskalender.</p><span class="more">Zu den Events <span aria-hidden="true">→</span></span></a>
        </div>
      </div>
    </section>

    <section id="voten" aria-labelledby="h-voten">
      <div class="wrap">
        <h2 id="h-voten">🎡 Glücksräder &amp; Votes</h2>
        <div class="grid">
          <a class="card" href="belohnungen.html#rewards" id="rewards"><span class="icon" aria-hidden="true">🎡</span><h3>Tägliche Glücksräder</h3><p>Jeden Tag gratis drehen mit ${c('/rewards')} – Coins bei jedem Dreh und Gewinne bis Legendär. Subs und Premium bekommen ein Extra-Rad dazu.</p><span class="more">Zu den Glücksrädern <span aria-hidden="true">→</span></span></a>
          <div class="card"><span class="icon" aria-hidden="true">🗳️</span><h3>Für den Server voten</h3><p>Pro Vote-Seite alle 24 Stunden <strong>150 Justin Coins und 5 Erfahrungsfläschchen</strong> – dazu ein Tagesbonus, der jeden Tag wechselt. <a href="belohnungen.html#voten">So votest du</a></p><div class="btn-row"><a class="btn btn-primary" href="${VOTE_URL}" target="_blank" rel="noopener noreferrer" data-vote-link>Jetzt voten<span class="sr-only"> (öffnet in neuem Tab)</span></a></div></div>
          <div class="card"><span class="icon" aria-hidden="true">🛠️</span><h3>Wartung</h3><p class="callout warn" data-wartung hidden>🛠️ <strong>Gerade läuft eine Wartung.</strong> Schau im Discord, wann es weitergeht.</p><p>Bei Updates schaltet das Team den <strong>Wartungsmodus</strong> ein. Dann kann nur das Team auf den Server, und in der Serverliste steht „Wartung“. Wann es weitergeht, steht im ${ext(LINKS.discord, 'Discord')}.</p></div>
        </div>
      </div>
    </section>

    <section aria-labelledby="h-socials">
      <div class="wrap">
        <h2 id="h-socials">Folge Justin</h2>
        ${socials()}
      </div>
    </section>`;


// ------------------------------------------------------------------ Bedrock-Anleitung (Teil von beitreten.html)
const bedrock = () => {
  const D = BEDROCK_DNS;
  return `
      <section id="bedrock" aria-labelledby="h-bedrock">
        <h2 id="h-bedrock">📱 Mit Bedrock spielen (Handy, Tablet, Windows, Konsole)</h2>
        <p>Der Server ist ein Java-Server, aber über <strong>Geyser</strong> und <strong>Floodgate</strong> kannst du auch mit der <strong>Bedrock-Edition</strong> mitspielen – auf derselben Welt, mit denselben Spielern. Du brauchst dafür <strong>kein</strong> Java-Konto, nur dein Microsoft-Konto (Xbox-Gamertag). Die Whitelist läuft genau wie oben über Discord.</p>
        <div class="kv"><div><b>Adresse</b><span>${c(BEDROCK.host)}</span></div><div><b>Port</b><span>${c(BEDROCK.port)}</span></div><div><b>Name</b><span>frei wählbar, z. B. „JustinZocktCommunity“</span></div></div>
        <div class="ip-box"><span class="ip" id="ip-bedrock">${BEDROCK.host} <small class="port">Port ${BEDROCK.port}</small></span><button class="btn btn-primary copy-btn" type="button" data-copy="${BEDROCK.host}" aria-describedby="ip-bedrock">📋 Adresse kopieren</button></div>
        <div class="callout info"><p>ℹ️ Halte Minecraft immer auf dem <strong>neuesten Stand</strong> – sonst kann die Verbindung fehlschlagen. Manche Java-Funktionen sehen auf Bedrock etwas anders aus (z. B. Menüs oder Schilder), funktionieren aber. Es gelten <a href="regeln.html#r11">dieselben Regeln</a>. Mods und Addons mit Vorteilen sind auch auf Bedrock verboten (<a href="mods.html">Mods</a>).</p></div>

        <h3 id="bedrock-handy">Handy &amp; Tablet (iPhone, iPad, Android)</h3>
        <ol class="steps">
          <li><h3>Minecraft öffnen</h3><p>Starte Minecraft und melde dich mit deinem <strong>Microsoft-Konto</strong> an.</p></li>
          <li><h3>Server-Reiter</h3><p>Tippe auf <strong>Spielen</strong> und wechsle oben zum Reiter <strong>Server</strong>.</p></li>
          <li><h3>Server hinzufügen</h3><p>Scrolle nach unten und tippe auf <strong>Server hinzufügen</strong>. Trage als <strong>Serveradresse</strong> ${c(BEDROCK.host)} und als <strong>Port</strong> ${c(BEDROCK.port)} ein. Der Name ist egal.</p></li>
          <li><h3>Speichern &amp; verbinden</h3><p>Tippe auf <strong>Speichern</strong> und danach auf den neuen Server. Beim ersten Mal siehst du deinen Freischalt-Code – weiter wie <a href="#whitelist">oben</a> beschrieben.</p></li>
        </ol>

        <h3 id="bedrock-windows">Windows-PC (Minecraft für Windows / Bedrock)</h3>
        <ol class="steps">
          <li><h3>Richtige Version starten</h3><p>Starte im Minecraft Launcher <strong>Minecraft für Windows</strong> (Bedrock-Edition) – nicht die Java Edition. Spielst du Java, nimm einfach ${c(IP)}.</p></li>
          <li><h3>Server hinzufügen</h3><p><strong>Spielen</strong> → Reiter <strong>Server</strong> → ganz unten <strong>Server hinzufügen</strong>. Adresse ${c(BEDROCK.host)}, Port ${c(BEDROCK.port)}.</p></li>
          <li><h3>Verbinden</h3><p>Speichern, Server anklicken, Code merken und im Discord eingeben.</p></li>
        </ol>

        <h3 id="bedrock-konsole">Konsole: Xbox, PlayStation, Nintendo Switch</h3>
        <p>Auf Konsolen kann man in Minecraft <strong>keine eigenen Server hinzufügen</strong> – es gibt nur die vorgegebenen „Featured Server“. Mit einem kleinen Trick geht es trotzdem: <strong>BedrockConnect</strong>. Dabei stellst du an der Konsole einen anderen <strong>DNS-Server</strong> ein. Klickst du danach einen Featured Server an, öffnet sich stattdessen eine Serverliste, in die du unsere Adresse eintragen kannst.</p>
        <div class="callout warn"><p>⚠️ <strong>DNS-Adressen (Stand ${D.stand}, laut ${ext('https://github.com/Pugmatt/BedrockConnect', 'github.com/Pugmatt/BedrockConnect')}):</strong> Xbox und Switch: Primär ${c(D.haupt)}, Sekundär ${c(D.zweit)}. PlayStation: Primär ${c(D.playstation)}, Sekundär ${c(D.zweit)}. Alternative in Deutschland (betrieben von ZAP-Hosting): ${c(D.deutschland)}. Klappt eine Adresse nicht, findest du die aktuelle Liste auf der BedrockConnect-Seite. BedrockConnect ist ein freies Projekt und gehört nicht zu uns. Zurück stellst du DNS einfach wieder auf <strong>Automatisch</strong>.</p></div>

        <h4>Schritt 1: DNS an der Konsole ändern</h4>
        <ul>
          <li><strong>Xbox (One / Series):</strong> Einstellungen → Allgemein → Netzwerkeinstellungen → Erweiterte Einstellungen → DNS-Einstellungen → <strong>Manuell</strong>. Primär ${c(D.haupt)}, Sekundär ${c(D.zweit)}.</li>
          <li><strong>PlayStation 5:</strong> Einstellungen → Netzwerk → Einstellungen → Internetverbindung einrichten → deine Verbindung → Erweiterte Einstellungen → DNS-Einstellungen <strong>Manuell</strong>. Primär ${c(D.playstation)}, Sekundär ${c(D.zweit)} → OK und Verbindung testen lassen.</li>
          <li><strong>PlayStation 4:</strong> Einstellungen → Netzwerk → Internetverbindung einrichten → WLAN oder LAN → <strong>Benutzerdefiniert</strong> → IP-Adresse „Automatisch“ → DHCP-Hostname „Nicht angeben“ → DNS <strong>Manuell</strong>: Primär ${c(D.playstation)}, Sekundär ${c(D.zweit)} → MTU „Automatisch“ → Proxy „Nicht verwenden“ → Verbindung testen.</li>
          <li><strong>Nintendo Switch:</strong> Systemeinstellungen → Internet → Interneteinstellungen → dein Netzwerk → Einstellungen ändern → DNS-Einstellungen <strong>Manuell</strong>. Primär ${c(D.haupt)}, Sekundär ${c(D.zweit)} → Speichern.</li>
        </ul>
        <h4>Schritt 2: Über einen Featured Server zur Serverliste</h4>
        <ol>
          <li>Minecraft starten → <strong>Spielen</strong> → Reiter <strong>Server</strong>.</li>
          <li>Einen der Featured Server anklicken, z. B. <strong>The Hive</strong>, <strong>Mineville</strong>, <strong>Lifeboat</strong>, <strong>Galaxite</strong> oder <strong>Enchanted</strong>. Statt des Servers öffnet sich jetzt das BedrockConnect-Menü.</li>
          <li>Dort <strong>Connect to a Server</strong> wählen und Adresse ${c(BEDROCK.host)} und Port ${c(BEDROCK.port)} eintragen. Mit „Add to server list“ speicherst du den Server für das nächste Mal.</li>
          <li>Verbinden – Freischalt-Code merken und im Discord eingeben.</li>
        </ol>
        <h4>Alternative für Xbox: App „MC Server Connector“</h4>
        <p>Auf der Xbox gibt es im Microsoft Store die kostenlose App <strong>„MC Server Connector“</strong>. Dort trägst du Adresse ${c(BEDROCK.host)} und Port ${c(BEDROCK.port)} ein und startest Minecraft über die App – der Server taucht dann im Reiter <strong>Freunde</strong> als LAN-Spiel auf. Für PlayStation und Switch gibt es so eine App nicht, dort nimmst du die DNS-Methode.</p>
        <p class="muted small">Klappt etwas nicht? Melde dich mit Gamertag und Konsole per Ticket in <strong>#tickets</strong>.</p>
      </section>
`;
};

// ------------------------------------------------------------------ beitreten
const beitreten = () => `${head('Whitelist', 'So kommst du auf den Server', 'Der Server ist nur für die Community: Du brauchst Discord und einen Twitch-Follow bei JustinZockt03. Die Freischaltung dauert nur ein paar Minuten.')}
    <div class="wrap">
      <div class="callout"><p><strong>Das brauchst du:</strong> Minecraft <strong>Java Edition</strong> (aktuelle Version empfohlen, ältere Versionen unter 1.21.5 werden abgewiesen) <strong>oder Minecraft Bedrock</strong> (Handy, Tablet, Windows, Xbox, PlayStation, Switch – immer die aktuelle Version), einen Discord-Account und einen Twitch-Account.</p></div>
      <nav class="toc" aria-labelledby="bt-toc"><h2 id="bt-toc">Auf dieser Seite</h2><ol><li><a href="#whitelist">Auf die Whitelist (Java &amp; Bedrock)</a></li><li><a href="#bedrock">Mit Bedrock spielen</a></li><li><a href="#bedrock-handy">Handy &amp; Tablet</a></li><li><a href="#bedrock-windows">Windows-PC</a></li><li><a href="#bedrock-konsole">Xbox, PlayStation, Switch</a></li><li><a href="#gut-zu-wissen">Gut zu wissen</a></li><li><a href="#erster-join">Dein erster Join</a></li></ol></nav>
      <h2 id="whitelist">Auf die Whitelist</h2>
      <ol class="steps">
        <li><h3>Discord-Server beitreten</h3><p>Tritt dem ${ext(LINKS.discord, 'Discord der JustinZocktCommunity')} bei. Du musst Mitglied bleiben – wer den Discord verlässt, fliegt sofort von der Whitelist.</p></li>
        <li><h3>Regeln lesen und akzeptieren</h3><p>Lies im Kanal <strong>#regeln</strong> die <a href="regeln.html">Serverregeln</a> und klick auf <strong>„Gelesen und akzeptiert“</strong>. Damit stimmst du auch der Datenverarbeitung nach <a href="regeln.html#r8">Punkt 8</a> zu.</p></li>
        <li><h3>Twitch verbinden</h3><p>Klick im Kanal <strong>#freischalten</strong> auf <strong>Freischalten</strong> → <strong>Twitch verbinden</strong> und bestätige den angezeigten Code auf <strong>twitch.tv/activate</strong>. Dabei wird <strong>kein Passwort</strong> übertragen – nur dein Twitch-Name.</p></li>
        <li><h3>JustinZockt03 auf Twitch folgen</h3><p>Der Bot prüft, ob du ${ext(LINKS.twitch, 'JustinZockt03')} folgst. Falls nicht, bekommst du einen Link zum Folgen und einen Knopf „Erneut prüfen“. Wer später entfolgt, wird automatisch wieder von der Whitelist entfernt.</p></li>
        <li><h3>Mit dem Server verbinden und Code holen</h3><p><strong>Java:</strong> Füge in Minecraft unter Mehrspieler den Server ${c(IP)} hinzu und verbinde dich. <strong>Bedrock:</strong> Verbinde dich mit ${c(BEDROCK.host)}, Port ${c(BEDROCK.port)} – wie das auf deinem Gerät geht, steht <a href="#bedrock">weiter unten</a>. Du wirst noch abgewiesen und siehst auf dem Bildschirm deinen <strong>persönlichen Code</strong> (z. B. ${c('MK3-LZD')}).</p>
          <div class="ip-box"><span class="ip" id="ip2">${IP}</span><button class="btn btn-primary copy-btn" type="button" data-copy="${IP}" aria-describedby="ip2">📋 Kopieren</button></div><p class="sr-only" id="copy-status" aria-live="polite"></p></li>
        <li><h3>Code im Discord eingeben</h3><p>Gib den Code im Discord ein. Bedrock-Spieler geben dabei ihren <strong>Xbox-Gamertag</strong> (Name des Microsoft-Kontos) an. Du bist sofort <strong>freigeschaltet</strong>, bekommst die Rolle „Whitelist“ und kannst direkt losspielen.</p></li>
      </ol>
${bedrock()}

      <h2 id="gut-zu-wissen">Gut zu wissen</h2>
      <ul>
        <li><strong>Ein Account pro Person:</strong> Ein Discord-Konto = ein Twitch-Konto = ein Minecraft-Account. Zweitaccounts nur mit Erlaubnis des Teams.</li>
        <li><strong>Java oder Bedrock – nicht beides:</strong> Es ist immer nur <strong>ein</strong> Account gleichzeitig freigeschaltet. Einen Wechsel beantragst du per Ticket in <strong>#tickets</strong>. Deine Items darfst du vorher per Truhe oder über andere Spieler zum neuen Account bringen; Coins werden nicht übertragen (<a href="regeln.html#r11-6">Regel 11.6</a>).</li>
        <li><strong>Kein VPN/Proxy:</strong> VPNs und Proxys werden automatisch erkannt und abgewiesen. Spielen Geschwister oder Mitbewohner im selben Netz, meldet euch kurz per Ticket.</li>
        <li><strong>Twitch-Subs</strong> bekommen automatisch den Sub-Rang mit Vorteilen wie ${c('/ec')}, ${c('/craft')} und mehr Coins pro Stunde – alles auf <a href="raenge.html">Ränge &amp; Vorteile</a>.</li>
        <li><strong>Gebannte Accounts</strong> können sich nicht freischalten.</li>
        <li><strong>Mods:</strong> Nur Mods aus der <a href="mods.html">Mod-Liste</a> sind erlaubt. Unsicher? Frag vorher per Ticket in <strong>#tickets</strong>.</li>
      </ul>

      <h2 id="erster-join">Dein erster Join</h2>
      <p>Du landest am Spawn und bekommst einen Start-Guide im Chat. Der Spawn ist komplett sicher: kein Schaden, kein PvP, keine Monster. Tipp: Lass ein Aufnahmeprogramm mitlaufen (z. B. OBS mit Replay-Puffer, NVIDIA ShadowPlay/Instant Replay, AMD ReLive, Xbox Game Bar), damit du Regelverstöße anderer beweisen kannst.</p>
      <div class="grid">
        <a class="card" href="befehle.html"><span class="icon" aria-hidden="true">⌨️</span><h3>Wichtige Befehle</h3><p>${c('/spawn')}, ${c('/rewards')}, ${c('/freunde')}, ${c('/claim chunk')}, ${c('/skill')} …</p><span class="more">Alle Befehle →</span></a>
        <a class="card" href="faq.html"><span class="icon" aria-hidden="true">❓</span><h3>Fragen?</h3><p>Die häufigsten Fragen und Antworten auf einen Blick.</p><span class="more">Zu den FAQ →</span></a>
        <a class="card" href="${LINKS.discord}" target="_blank" rel="noopener noreferrer"><span class="icon" aria-hidden="true">🎫</span><h3>Hilfe im Discord</h3><p>Im Kanal <strong>#tickets</strong> gibt es Tickets für Fragen, Spieler-Meldungen, Entbannungsanträge und Bewerbungen.</p><span class="more">Zum Discord →</span><span class="sr-only"> (öffnet in neuem Tab)</span></a>
      </div>
    </div>`;

// ------------------------------------------------------------------ regeln (aus serverregeln.md)
function inline(t) {
  let s = esc(t);
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(https?:\/\/[^\s)]+)/g, (u) => {
    // Links auf die eigene Website werden zu internen Links
    const own = u.match(/^https:\/\/www\.justinzockt\.de\/([\w.#-]*)$/);
    if (own) return `<a href="${own[1] || 'index.html'}">${u.replace(/^https:\/\//, '')}</a>`;
    return `<a href="${u}" target="_blank" rel="noopener noreferrer">${u.replace(/^https:\/\//, '')}<span class="sr-only"> (öffnet in neuem Tab)</span></a>`;
  });
  s = s.replace(/&quot;/g, '"');
  // Querverweise wie (3.2), (7.2), Punkt 8, Punkt 5
  s = s.replace(/\((\d+)\.(\d+)\)/g, '(<a href="#r$1-$2">$1.$2</a>)');
  s = s.replace(/siehe (\d+)\)/g, 'siehe <a href="#r$1">$1</a>)');
  s = s.replace(/Punkt (\d+)(?![.\d])/g, '<a href="#r$1">Punkt $1</a>');
  return s;
}
function regeln() {
  const md = fs.readFileSync('C:/Users/kunde/JustinZocktCommunity-Server/serverregeln.md', 'utf8').split(/\r?\n/);
  const sections = []; let intro = []; let outro = '';
  for (const line of md) {
    if (line.startsWith('# ')) continue;
    const h = line.match(/^## (\d+)\. (.+)$/);
    if (h) { sections.push({ nr: h[1], title: h[2], items: [] }); continue; }
    const it = line.match(/^(\d+)\.(\d+) (.+)$/);
    if (it) { sections[sections.length - 1].items.push({ a: it[1], b: it[2], text: it[3] }); continue; }
    if (line.startsWith('**Mit')) { outro = line; continue; }
    if (line.trim() && !sections.length) intro.push(line);
  }
  const toc = sections.map((s) => `<li><a href="#r${s.nr}">${esc(s.title)}</a></li>`).join('');
  const body = sections.map((s) => `<section class="rule-section" id="r${s.nr}" aria-labelledby="rh${s.nr}">
        <h2 id="rh${s.nr}">${s.nr}. ${esc(s.title)}</h2>
        <ol class="rules">
${s.items.map((i) => `          <li id="r${i.a}-${i.b}"><a class="nr" href="#r${i.a}-${i.b}" aria-label="Regel ${i.a}.${i.b} verlinken">${i.a}.${i.b}</a> ${inline(i.text)}</li>`).join('\n')}
        </ol>
      </section>`).join('\n');
  return `${head('Serverregeln', 'Regeln der JustinZocktCommunity', esc(intro.join(' ')).replace(/&quot;/g, '"'))}
    <div class="wrap">
      <div class="callout info"><p>🧩 <strong>Mods:</strong> Welche Mods und Clients erlaubt oder verboten sind, steht ausführlich auf der Seite <a href="mods.html">Erlaubte &amp; verbotene Mods</a> (<a href="#r4">Regel 4</a>). Fragen, Meldungen, Entbannung und Bewerbungen laufen über den Discord-Kanal <strong>#tickets</strong>.</p></div>
      <nav class="toc" aria-labelledby="toc-h"><h2 id="toc-h">Inhalt</h2><ol>${toc}<li><a href="#welt-besonderheiten">Besonderheiten der Welt</a></li></ol></nav>
${body}
      <section class="rule-section" id="welt-besonderheiten" aria-labelledby="rh-welt">
        <h2 id="rh-welt">Gut zu wissen: Besonderheiten der Welt</h2>
        <p>Das sind keine zusätzlichen Regeln, sondern Einstellungen des Servers, damit die Welt fair und schön bleibt:</p>
        <ul>
          <li><strong>Spawner, Trial-Spawner und Tresore</strong> sind unzerstörbar – auch durch Explosionen oder Kolben. Soll einer weg, erstelle ein Ticket in <strong>#tickets</strong>.</li>
          <li><strong>Loot-Truhen</strong> in Bauwerken (Truhen, Fallentruhen und Fässer, die von der Welt erzeugt wurden) kann man nicht abbauen und nichts hineinlegen. Herausnehmen geht natürlich. Soll eine weg: Ticket.</li>
          <li><strong>Claimen</strong> geht erst ab 250 Blöcken Abstand von 0/0 (X oder Z) – in Oberwelt, Nether und End. Alles zu Claims: <a href="claims.html">Claims &amp; Kistenschutz</a>.</li>
          <li><strong>Zucht:</strong> Pro Chunk gibt es eine Grenze für Dorfbewohner und Tiere, damit es keine Lag-Farmen gibt. Ist sie erreicht, steht „Keine Zucht mehr hier.“</li>
          <li><strong>Dorfbewohner</strong>, die von Zombies getötet werden, werden immer zu Zombie-Dorfbewohnern.</li>
          <li><strong>Angeln:</strong> Mit der Angel kann man keine Spieler heranziehen oder stören.</li>
          <li><strong>Items</strong> am Boden verschwinden erst nach 5 Minuten.</li>
          <li><strong>Am Spawn</strong> können End-Kristalle nicht gesprengt werden, und Enderman spawnen dort nicht.</li>
          <li><strong>End:</strong> Bis der erste Enderdrache besiegt ist, ist die Grenze im End nur 125 Blöcke groß. Danach wächst sie langsam (1 Block pro Sekunde) auf 10.000. Der erste Drache hat 100-fache Lebenspunkte, eine Leiste oben zeigt sie an.</li>
        </ul>
      </section>
      <div class="callout"><p>${inline(outro)}</p></div>
      <p class="muted small">Jede Regel hat einen eigenen Link: Klick auf die Nummer, um direkt auf sie zu verweisen (z. B. <a href="#r3-1">regeln.html#r3-1</a>).</p>
    </div>`;
}

// ------------------------------------------------------------------ verzauberungen
function verzauberungen() {
  const v = Y.verzauberungen;
  const NAME = { seelenbindung: 'Soulbound', reparatur: 'Mending', telekinese: 'Telekinesis', holzfaeller: 'Timber I' };
  const skillBooks = Object.values(Y.skills).map((s) => [esc(s.name), String(s.buch.level), NAME[s.buch.art]]);
  return `${head('Magie', 'Eigene Verzauberungen', 'Auf der JustinZocktCommunity gibt es drei eigene Verzauberungen – Soulbound, Telekinesis und Timber – und Mending ist etwas ganz Besonderes. Alle gibt es nur über Skills, Events, die Glücksräder und sehr seltene Funde.')}
    <div class="wrap">
      <div class="grid">
        <div class="card"><span class="icon" aria-hidden="true">👻</span><h3>Soulbound</h3><p><strong>Der Gegenstand bleibt beim Tod erhalten.</strong> (Seelenbindung)</p><p>Für Ausrüstung: Rüstung, Werkzeug, Waffe. Amboss-Kosten: ${v.seelenbindung['amboss-kosten']} Level.</p></div>
        <div class="card"><span class="icon" aria-hidden="true">🔧</span><h3>Mending</h3><p><strong>Das echte Mending (Reparatur)</strong> – aber sehr selten.</p><p>Es gibt Mending <strong>nicht</strong> bei Dorfbewohnern, <strong>nicht</strong> in Kisten und <strong>nicht</strong> beim normalen Angeln. Nur über Skills, Events, die Glücksräder und die sehr seltenen Bücher unten.</p></div>
        <div class="card"><span class="icon" aria-hidden="true">🧲</span><h3>Telekinesis</h3><p><strong>Drops und Erfahrung landen direkt in deinem Inventar.</strong></p><p>Für Spitzhacke, Axt, Schaufel, Hacke oder Schere. Amboss-Kosten: ${v.telekinese['amboss-kosten']} Level.</p></div>
        <div class="card"><span class="icon" aria-hidden="true">🌲</span><h3>Timber I–III</h3><p><strong>Fällt einen ganzen Baum auf einmal:</strong> bis zu ${v.holzfaeller['max-bloecke'].join(' / ')} Stämme (Stufe I / II / III). (Holzfäller)</p><p>Nur für Äxte. Beim <strong>Schleichen</strong> ist es aus. Bei natürlichen Bäumen zählt jeder gefällte Stamm für den Skill Woodcutting. Amboss-Kosten: ${v.holzfaeller['amboss-kosten']} Level.</p></div>
      </div>

      <h2 id="gegenstaende">Worauf geht welche Verzauberung?</h2>
      <p>Hier steht <strong>alles</strong>, worauf du das Buch im Amboss anwenden kannst. Was nicht in der Liste steht, nimmt das Buch nicht an.</p>
      <div class="grid">
        <div class="card"><h3>👻 Soulbound</h3><p>Alles, was Haltbarkeit hat:</p><ul>
          <li><strong>Rüstung:</strong> Helm, Brustpanzer, Hose und Stiefel aus Leder, Kette, Kupfer, Eisen, Gold, Diamant und Netherit, dazu der Schildkrötenpanzer</li>
          <li><strong>Waffen:</strong> Schwerter und Speere (Holz, Stein, Kupfer, Eisen, Gold, Diamant, Netherit), Bogen, Armbrust, Dreizack, Streitkolben</li>
          <li><strong>Werkzeuge:</strong> Spitzhacken, Äxte, Schaufeln und Hacken (Holz, Stein, Kupfer, Eisen, Gold, Diamant, Netherit), Schere, Feuerzeug, Pinsel, Angel, Karottenrute, Wirrpilzrute</li>
          <li><strong>Sonstiges:</strong> Schild, Elytra, Wolfsrüstung</li>
        </ul></div>
        <div class="card"><h3>🔧 Mending</h3><p>Das echte Minecraft-Mending – es geht auf alles, was auch im normalen Minecraft Mending bekommen kann:</p><ul>
          <li><strong>Rüstung:</strong> Helm, Brustpanzer, Hose und Stiefel aus Leder, Kette, Kupfer, Eisen, Gold, Diamant und Netherit, dazu der Schildkrötenpanzer</li>
          <li><strong>Waffen:</strong> Schwerter und Speere (alle Materialien), Bogen, Armbrust, Dreizack, Streitkolben</li>
          <li><strong>Werkzeuge:</strong> Spitzhacken, Äxte, Schaufeln und Hacken (alle Materialien), Schere, Feuerzeug, Pinsel, Angel, Karottenrute, Wirrpilzrute</li>
          <li><strong>Sonstiges:</strong> Schild, Elytra</li>
        </ul></div>
        <div class="card"><h3>🧲 Telekinesis</h3><p>Nur Abbau-Werkzeuge:</p><ul>
          <li><strong>Spitzhacken:</strong> Holz, Stein, Kupfer, Eisen, Gold, Diamant, Netherit</li>
          <li><strong>Äxte:</strong> Holz, Stein, Kupfer, Eisen, Gold, Diamant, Netherit</li>
          <li><strong>Schaufeln:</strong> Holz, Stein, Kupfer, Eisen, Gold, Diamant, Netherit</li>
          <li><strong>Hacken:</strong> Holz, Stein, Kupfer, Eisen, Gold, Diamant, Netherit</li>
          <li><strong>Schere</strong></li>
        </ul></div>
        <div class="card"><h3>🌲 Timber I–III</h3><p>Nur Äxte:</p><ul>
          <li><strong>Äxte:</strong> Holz, Stein, Kupfer, Eisen, Gold, Diamant, Netherit</li>
        </ul></div>
      </div>

      <h2>So wendest du ein Buch an</h2>
      <ol>
        <li>Lege den Gegenstand links und das Buch rechts in einen <strong>Amboss</strong>.</li>
        <li>Zahle die Erfahrungslevel (siehe oben). „Zu teuer“ gibt es auf dem Server nicht.</li>
        <li>Fertig. Hat der Gegenstand die Verzauberung schon in gleicher oder höherer Stufe, passiert nichts. Eigene Bücher lassen sich <strong>nicht miteinander kombinieren</strong> – ein Buch mit höherer Stufe ersetzt die niedrigere.</li>
      </ol>

      <h2>Woher bekomme ich die Bücher?</h2>
      <h3>1. Aus den Skills – garantiert</h3>
      <p>Jeder Skill gibt dir genau ein seltenes Buch (<a href="skills.html">mehr zu Skills</a>):</p>
      ${table(['Skill', 'Level', 'Buch'], skillBooks, { label: 'Bücher aus Skills' })}
      <h3>2. Sehr seltene Funde beim Angeln und in Kisten</h3>
      <p>Mit viel Glück findest du beim Angeln oder in einer <strong>neu geöffneten</strong> Kiste in Bauwerken (Dungeons, Tempel, Schiffe, Festungen …) eines der Bücher. Telekinesis und Timber sind <strong>sehr selten</strong>, Soulbound und Mending sind <strong>noch seltener</strong>. Timber ist meistens Stufe I, manchmal Stufe II.</p>
      <div class="callout info"><p>🌧️ <strong>Regen-Bonus:</strong> Bei Regen oder Gewitter hast du beim Angeln etwas mehr Glück – und Fische beißen für alle schneller.</p></div>
      <h3>3. Tägliche Glücksräder</h3>
      <p>In den Glücksrädern von ${c('/rewards')} stecken Telekinesis und Timber in der Stufe „Ultra selten“, Mending und Soulbound in der Stufe „Legendär“ – in jedem Rad, also auch im Rad für alle. Mehr bei den <a href="belohnungen.html#gewinne">Glücksrädern</a>.</p>
      <h3>4. Events</h3>
      <p>Im <a href="advent.html">Adventskalender</a> im Dezember stecken einige seltene Bücher – welche, verraten die Geschenke erst an ihrem Tag.</p>

      <h3>5. Seltene Coins</h3>
      <p>Beim Angeln und in Truhen kann statt eines Buches auch ein <strong>seltener Coin</strong> auftauchen, der <strong>10, 50, 100 oder 1.000 Justin Coins</strong> wert ist. Je höher der Wert, desto seltener der Fund. Beim Angeln gibt ein Coin außerdem so viel Fishing-XP, wie er wert ist.</p>
      <p>Seltene Bücher und Elytren tragen im Text den Vermerk <strong>„Gefunden von: Name, am Datum um Uhrzeit“</strong> – so sieht man immer, wer sie entdeckt hat.</p>

      <h2>Ansagen für Seltenes</h2>
      <p>Wer ein seltenes Buch oder eine <strong>Elytra</strong> findet, wird <strong>allen Spielern mit Sound angesagt</strong>. Elytren gibt es im End, ganz oben im Sub-Glücksrad – oder als „Rentier-Flügel“ beim Treue-Bonus im Adventskalender.</p>
      <p class="muted small">Event-Gegenstände wie seltene Bücher dürfen gehandelt werden, aber nicht gegen Echtgeld (<a href="regeln.html#r10-7">Regel 10.7</a>).</p>
    </div>`;
}

// ------------------------------------------------------------------ clans
const clans = () => {
  const colors = [['gold', '#ffaa00'], ['gelb', '#ffff55'], ['gruen', '#55ff55'], ['dunkelgruen', '#00aa00'], ['tuerkis', '#55ffff'], ['blau', '#5599ff'], ['dunkelblau', '#3355dd'], ['lila', '#aa55ff'], ['pink', '#ff55ff'], ['rot', '#ff5555'], ['orange', '#ff8800'], ['weiss', '#ffffff'], ['grau', '#aaaaaa']];
  const cmds = [
    ['/clan gruenden <TAG> <Name>', 'Clan gründen. Der Tag hat 3–4 Zeichen (A–Z, 0–9), der Name bis zu 32 Zeichen. Beispiel: /clan gruenden JZC Justins Crew', 'Alle'],
    ['/clan info [TAG]', 'Infos zu deinem oder einem anderen Clan: Gründer, Punkte, gemeinsame Spielzeit, Mitglieder (wer online ist).', 'Alle'],
    ['/clan top', 'Rangliste der Clans.', 'Alle'],
    ['/clan einladen <Spieler>', 'Spieler einladen. Die Einladung gilt 5 Minuten.', 'Gründer, Leiter, Ältester'],
    ['/clan beitreten <TAG>', 'Einladung annehmen (oder im Chat auf den Knopf klicken).', 'Eingeladene'],
    ['/clan ablehnen <TAG>', 'Einladung ablehnen.', 'Eingeladene'],
    ['/clan verlassen', 'Clan verlassen. Als Gründer musst du die Rolle vorher übertragen; als letztes Mitglied löst du den Clan auf.', 'Mitglieder'],
    ['/cc <Nachricht>', 'Nachricht in den Clan-Chat (auch /clanchat).', 'Mitglieder'],
    ['/clan chat', 'Deinen normalen Chat auf Clan-Chat umschalten (an/aus).', 'Mitglieder'],
    ['/clan msg <TAG> <Nachricht>', 'Nachricht an einen anderen Clan.', 'Mitglieder'],
    ['/clan kick <Spieler>', 'Mitglied entfernen. Leiter entfernen Älteste und Mitglieder, Älteste nur Mitglieder.', 'Gründer, Leiter, Ältester'],
    ['/clan befoerdern <Spieler> [aeltester|leiter]', 'Eine Stufe höher: Mitglied → Ältester (Gründer oder Leiter), Ältester → Leiter (nur Gründer). Mit Stufe direkt dorthin.', 'Gründer, Leiter'],
    ['/clan degradieren <Spieler> [aeltester|mitglied]', 'Eine Stufe tiefer: Leiter → Ältester (nur Gründer), Ältester → Mitglied (Gründer oder Leiter).', 'Gründer, Leiter'],
    ['/clan uebertragen <Spieler>', 'Gründerrolle abgeben (mit Sicherheitsabfrage). Der alte Gründer wird Leiter.', 'Gründer'],
    ['/clan farbe <Farbe>', 'Farbe des Clan-Tags ändern (Standard: weiß): benannte Farbe oder #RRGGBB (Sub/Premium), Farbverlauf #RRGGBB:#RRGGBB (nur Premium). Siehe Farbwähler unten.', 'Gründer (Sub/Premium)'],
    ['/clan endertruhe', 'Gemeinsame Clan-Endertruhe (3 Reihen) für alle Mitglieder – ab 10 Mitgliedern. Fällt der Clan unter 10, bleibt der Inhalt erhalten, man kann dann nur noch herausnehmen. Beim Auflösen bekommt der Gründer den Inhalt.', 'alle Mitglieder (ab 10)'],
    ['/clan aufloesen', 'Clan auflösen (mit Bestätigung, nicht rückgängig zu machen).', 'Gründer'],
  ];
  return `${head('Gemeinsam stark', 'Clans', 'Gründe mit deinen Freunden einen Clan: eigener Tag im Chat, Clan-Chat, gemeinsame Spielzeit und eine Rangliste, in der ihr euch mit anderen Clans messt.')}
    <div class="wrap">
      <div class="grid">
        <div class="card"><span class="icon" aria-hidden="true">🏷️</span><h3>Dein Clan-Tag</h3><p>3–4 Zeichen (A–Z, 0–9). Im Chat steht <strong>nur der Tag</strong> vor deinem Namen – in deiner Clan-Farbe. Über deinem Kopf sehen den Tag <strong>nur Mitglieder deines eigenen Clans</strong>. <strong>Tag und Name lassen sich nach der Gründung nicht mehr ändern</strong> – überleg sie dir also gut.</p></div>
        <div class="card"><span class="icon" aria-hidden="true">👥</span><h3>Keine Größenbegrenzung</h3><p>Ein Clan kann beliebig viele Mitglieder haben. Jeder Spieler kann in genau einem Clan sein.</p></div>
        <div class="card"><span class="icon" aria-hidden="true">🏆</span><h3>Clan-Rangliste</h3><p>${c('/clan top')}: Punkte = <strong>Skill-Gesamtlevel + Spielstunden</strong> aller Mitglieder. Wird alle 5 Minuten aktualisiert.</p></div>
        <div class="card"><span class="icon" aria-hidden="true">⏱</span><h3>Clan-Spielzeit</h3><p>Die Spielzeit aller Mitglieder wird zusammengezählt. Du siehst sie in ${c('/clan info')} und in der <a href="ranglisten.html">Clan-Spielzeit-Rangliste</a>.</p></div>
        <div class="card"><span class="icon" aria-hidden="true">💬</span><h3>Clan-Chat</h3><p>${c('/cc <Nachricht>')} oder dauerhaft umschalten mit ${c('/clan chat')}. Andere Clans erreichst du mit ${c('/clan msg <TAG>')}.</p></div>
      </div>

      ${jump([['#c-raenge', 'Ränge im Clan'], ['#c-befehle', 'Alle Clan-Befehle'], ['#c-farben', 'Clan-Farben'], ['#c-msg', 'Private Nachrichten']])}
      <h2 id="c-raenge">Ränge im Clan</h2>
      <p>Die Reihenfolge: <strong>Gründer &gt; Leiter &gt; Ältester &gt; Mitglied</strong>. Den eigenen Rang kann niemand selbst ändern.</p>
      ${table(['Rang', 'Darf'], [
        ['<strong>Gründer</strong>', 'Alles: einladen, alle entfernen, jeden zwischen Mitglied und Leiter befördern oder degradieren, Gründerrolle übertragen, Clan auflösen. Farbe ändern mit Sub oder Premium, Farbverlauf nur mit Premium.'],
        ['<strong>Leiter</strong>', 'Einladen, Älteste und Mitglieder entfernen, Mitglieder zum Ältesten befördern und Älteste wieder zum Mitglied machen.'],
        ['<strong>Ältester</strong>', 'Einladen und normale Mitglieder entfernen.'],
        ['<strong>Mitglied</strong>', 'Clan-Chat, Clan-Nachrichten, Infos und Rangliste, Clan verlassen.'],
      ], { label: 'Clan-Ränge' })}

      <h2 id="c-befehle">Alle Clan-Befehle</h2>
      ${table(['Befehl', 'Was passiert', 'Wer'], cmds.map(([a, b, w]) => [c(a), esc(b), w]), { label: 'Clan-Befehle' })}
      <p>Eine Übersicht bekommst du im Spiel auch mit ${c('/clan hilfe')}.</p>

      <h2 id="c-farben">Clan-Farben</h2>
      <p>Jeder neue Clan ist <strong>weiß</strong>. Die Farbe ändert nur der <strong>Gründer</strong> – mit ${c('/clan farbe …')} im Chat:</p>
      ${table(['So geht’s', 'Befehl', 'Wer'], [
        ['Benannte Farbe', c('/clan farbe <Name>'), 'Gründer mit Sub oder Premium'],
        ['Eigene Farbe', c('/clan farbe #RRGGBB'), 'Gründer mit Sub oder Premium'],
        ['Farbverlauf (2 oder 3 Farben)', c('/clan farbe #RRGGBB:#RRGGBB') + '<br>' + c('/clan farbe #RRGGBB:#RRGGBB:#RRGGBB'), 'Gründer mit <a href="premium.html">Premium</a>'],
      ], { label: 'Clan-Farbe ändern', rowHead: true })}
      <p class="muted small">Ein paar benannte Farben (im Spiel zeigt ${c('/clan farbe')} alle):</p>
      <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(140px,1fr))">
        ${colors.map(([n, h]) => `<div class="card" style="padding:12px 14px"><span style="font-family:var(--mono);font-weight:800;color:${h}">[JZC]</span> <code>${n}</code></div>`).join('\n        ')}
      </div>

      <section class="clan-picker card" id="clan-picker" aria-labelledby="h-picker">
        <h3 id="h-picker">🎨 Farbwähler: So sieht dein Clan-Tag aus</h3>
        <noscript><p>Für den Farbwähler wird JavaScript benötigt. Das Format im Spiel: ${c('/clan farbe #RRGGBB')} für eine Farbe oder ${c('/clan farbe #RRGGBB:#RRGGBB')} (bis zu 3 Farben) für einen Verlauf.</p></noscript>
        <div class="cp-body" hidden>
          <div class="cp-row">
            <label for="cp-tag"><strong>Clan-Tag</strong> <span class="muted small">(nur Vorschau)</span></label>
            <input id="cp-tag" type="text" maxlength="5" value="JZC" autocomplete="off" spellcheck="false">
          </div>
          <fieldset class="cp-mode">
            <legend><strong>Art</strong></legend>
            <label><input type="radio" name="cp-mode" value="eins" checked> Eine Farbe</label>
            <label><input type="radio" name="cp-mode" value="verlauf"> Verlauf <span class="badge gold">Premium</span></label>
          </fieldset>
          <div class="cp-colors">
            <label>Farbe 1 <input type="color" id="cp-c1" value="#ff1f3d"></label>
            <label class="cp-grad">Farbe 2 <input type="color" id="cp-c2" value="#ffd700"></label>
            <label class="cp-grad"><input type="checkbox" id="cp-3"> 3. Farbe <input type="color" id="cp-c3" value="#5599ff"></label>
          </div>
          <div class="cp-presets" id="cp-presets" aria-label="Vorschläge"></div>
          <div class="cp-preview" aria-live="polite"><span class="cp-b">[</span><span id="cp-out">JZC</span><span class="cp-b">]</span> <span class="cp-name">DeinName</span><span class="cp-msg">: Hallo zusammen!</span></div>
          <p class="cp-hint muted small" id="cp-hint"></p>
          <div class="cp-cmd"><code id="cp-cmd">/clan farbe #ff1f3d</code><button class="btn btn-primary" type="button" id="cp-copy" data-copy="/clan farbe #ff1f3d">📋 Kopieren</button></div>
          <p class="muted small">Im Spiel in den Chat eingeben. Auf Bedrock tippst du den Befehl einfach ab. Die Seite speichert nichts.</p>
        </div>
      </section>

      <h2 id="c-msg">Private Nachrichten</h2>
      <p>Mit ${c('/msg <Spieler> <Nachricht>')} schreibst du jemandem privat (auch ${c('/tell')}, ${c('/w')}, ${c('/whisper')}, ${c('/pm')}). Antworten geht mit ${c('/r <Nachricht>')} (auch ${c('/reply')}).</p>

      <div class="callout warn">
        <p><strong>Regeln &amp; Datenschutz:</strong> Clan-Chat und private Nachrichten unterliegen denselben Regeln wie der normale Chat. Der <strong>automatische Filter gilt überall</strong>. Zur Moderation werden diese Nachrichten <strong>gespeichert</strong> und können vom Owner eingesehen werden (<a href="regeln.html#r10-6">Regel 10.6</a>, <a href="datenschutz.html">Datenschutz</a>).</p>
        <p>Clan-Tags und -Namen dürfen nicht beleidigend sein und keine Werbung enthalten – das Team darf unpassende Clans auflösen. Clan-Kriege nur im Rahmen der PvP-Regeln (<a href="regeln.html#r10-5">Regel 10.5</a>).</p>
      </div>
      <div class="callout info"><p>🏠 <strong>Claims für den Clan:</strong> Jedes Mitglied claimt mit seinem eigenen Limit. Clan-Mitglieder bekommen <strong>nicht automatisch</strong> Zugriff auf deine Claims und Kisten – das entscheidest du selbst: über ${c('/freunde')}, als Mitglied in ${c('/claim bearbeiten')} oder in ${c('/lock bearbeiten')}. Preise, Rollen und Flags: <a href="claims.html">Claims &amp; Kistenschutz</a>.</p></div>
    </div>`;
};

// ------------------------------------------------------------------ shop
const shop = () => `${head('Handel', 'Spieler-Shop', 'Der Marktplatz der Community: Du stellst deine Items mit deinem eigenen Preis ein, andere kaufen sie mit Justin Coins – auch wenn du offline bist.')}
    <div class="wrap">
      <div class="callout"><p>📍 Der Shop ist <strong>am Spawn</strong> erreichbar (mit Premium überall außer in der Minigame-Welt). Bist du woanders, bringt dich ${c('/spawn')} hin. Im Kreativ- oder Zuschauermodus kannst du nichts einstellen, kaufen oder herausnehmen.</p></div>

      <h2>Kaufen</h2>
      <ol class="steps">
        <li><h3>Marktplatz öffnen</h3><p>Gib am Spawn ${c('/shop')} ein. Du siehst alle Angebote mit Preis pro Stück und Lagerbestand.</p></li>
        <li><h3>Suchen &amp; sortieren</h3><p>Sortiere nach „Neueste zuerst“, „Älteste zuerst“, „Billigste zuerst“, „Teuerste zuerst“, „Name (A–Z)“, „Name (Z–A)“, „Meist gelagert“ oder „Meiste Verkäufe“ und suche nach Item-Name oder Verkäufer. Linksklick auf den Sortier-Knopf schaltet weiter, Rechtsklick zurück (auf Bedrock: antippen).</p></li>
        <li><h3>Menge wählen &amp; bestätigen</h3><p>Klick auf ein Angebot, wähle die Menge (feste Mengen oder eigene Menge im Chat eingeben) und bestätige. Du siehst vorher Gesamtpreis und dein Guthaben.</p></li>
      </ol>

      <h2>Verkaufen</h2>
      <ol class="steps">
        <li><h3>Item in die Hand nehmen</h3><p>Nimm das Item, das du verkaufen willst, in die Hand.</p></li>
        <li><h3>Angebot erstellen</h3><p>Entweder im Shop-Menü auf „Verkaufen“ klicken und den Preis im Chat eingeben, oder direkt: ${c('/shop verkaufen <Preis pro Stück> [Menge|alle]')}. Der Preis liegt zwischen 1 und 10.000.000 JC pro Stück.</p></li>
        <li><h3>Items sind im Shop</h3><p>Die eingestellten Items sind <strong>aus deinem Inventar weg</strong> und liegen im Shop-Lager – bis sie verkauft werden oder du sie wieder herausnimmst.</p></li>
      </ol>

      <h2>Deine Angebote verwalten</h2>
      <p>Mit ${c('/shop meine')} (am Spawn) öffnest du deine Angebote. Dort kannst du:</p>
      <ul>
        <li><strong>Nachfüllen:</strong> weitere gleiche Items ins Lager legen (Name, Verzauberungen und Haltbarkeit müssen exakt gleich sein).</li>
        <li><strong>Preis ändern</strong> – gilt sofort für alle Käufer.</li>
        <li><strong>Items herausnehmen</strong> oder das Angebot <strong>löschen</strong> (Items gehen zurück ins Inventar).</li>
        <li><strong>Rücklage abholen:</strong> Items, die nicht in dein Inventar gepasst haben oder die das Team entfernt hat, warten dort auf dich.</li>
      </ul>
      <p>Wird etwas verkauft, bekommst du die Coins sofort. Bist du online, siehst du eine Nachricht; warst du offline, bekommst du beim nächsten Join eine Übersicht aller Verkäufe.</p>

      <h2>Befehle</h2>
      ${table(['Befehl', 'Was passiert'], [
        [c('/shop'), 'Marktplatz öffnen (am Spawn, mit Premium überall)'],
        [c('/shop verkaufen <Preis> [Menge|alle]'), 'Item in der Hand zum Preis pro Stück einstellen'],
        [c('/shop meine'), 'Eigene Angebote verwalten, Rücklage abholen'],
      ], { label: 'Shop-Befehle' })}

      <div class="callout warn"><p><strong>Fair bleiben:</strong> Angebote müssen ehrlich sein. Irreführende Namen oder absichtlich falsche Preise, um andere zu täuschen, gelten als Betrug (<a href="regeln.html#r10-4">Regel 10.4</a>). Fehler im Shop dürfen nicht ausgenutzt werden (<a href="regeln.html#r10-1">10.1</a>). Handel gegen Echtgeld ist verboten (<a href="regeln.html#r7-2">7.2</a>).</p></div>
      <p>Mehr zu Justin Coins findest du in den <a href="faq.html#coins">FAQ</a>.</p>
    </div>`;

module.exports = { index, beitreten, regeln, verzauberungen, clans, shop, socials };
