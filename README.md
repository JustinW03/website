# Website der JustinZocktCommunity

Eine reine, statische Website (HTML, CSS, JavaScript). Kein Build-Tool, kein Framework, keine Datenbank.
Alle Dateien in diesem Ordner hochladen – fertig.

| Datei | Inhalt |
|---|---|
| `index.html` | Startseite mit Server-Adresse, Kopieren-Knopf, Live-Status, Socials |
| `beitreten.html` | Schritt für Schritt auf die Whitelist – auch für Bedrock (Handy, Windows, Xbox, PlayStation, Switch) |
| `regeln.html` | Alle Serverregeln mit Inhaltsverzeichnis (jede Regel verlinkbar, z. B. `regeln.html#r3-1`) |
| `skills.html` | Skills, Belohnungen pro Level, Verbesserungen, XP-Tabellen, Titel |
| `erfolge.html` | Alle JZC-Erfolge (wird automatisch aus `Achievements.java` erzeugt) |
| `verzauberungen.html` | Seelenbindung, Telekinese, Holzfäller, Mending, seltene Bücher |
| `clans.html`, `shop.html`, `events.html` | Clans, Spieler-Shop, Adventskalender (Türchen öffnen sich erst am jeweiligen Tag; vom 25.12. bis 31.10. ausgeblendet, ab 1.11. Vorschau) |
| `mods.html`, `raenge.html`, `minigames.html`, `ranglisten.html` | Erlaubte/verbotene Mods (aus `mod-liste.md`), Ränge & Vorteile, Minigames, Ranglisten |
| `befehle.html` | Alle Spieler-Befehle mit Suche |
| `faq.html`, `team.html` | Häufige Fragen, Ränge und Team-Rechte |
| `datenschutz.html`, `impressum.html` | Rechtliches – **vor dem Veröffentlichen ausfüllen!** |
| `admin.html` | Erklärung des Dashboards + Befehle für das Team (wird von Suchmaschinen nicht aufgenommen) |
| `style.css`, `main.js` | Aussehen und kleine Funktionen (Menü, Kopieren, Live-Status, Suche) |

Ansehen auf dem eigenen PC: einfach `index.html` doppelklicken.

---

## ⚠️ Vor dem Veröffentlichen

1. **Impressum ausfüllen** (`impressum.html`): Ersetze `[Name]`, `[Anschrift]` und `[E-Mail]` durch echte Angaben. In Deutschland ist das Pflicht. Die Platzhalter sind auf der Seite gelb markiert.
2. **Datenschutz ausfüllen** (`datenschutz.html`): `[E-Mail]` und `[Hosting-Anbieter …]` ersetzen (z. B. „GitHub Pages (GitHub Inc., USA)“ oder „Cloudflare Pages (Cloudflare Inc., USA)“).
3. Zum Ändern eine Datei mit einem Texteditor öffnen (z. B. Notepad++ oder VS Code), Text suchen, ändern, speichern.

---

## Weg A: Kostenlos mit GitHub Pages

1. Auf **github.com** ein kostenloses Konto anlegen.
2. Oben rechts **+** → **New repository**. Name z. B. `justinzockt-website`, **Public** auswählen, **Create repository**.
3. Auf der neuen Seite **uploading an existing file** anklicken und **alle Dateien aus diesem Ordner** (nicht den Ordner selbst) hineinziehen. Unten **Commit changes**.
4. Im Repository **Settings** → links **Pages**.
5. Bei **Source**: „Deploy from a branch“, Branch **main**, Ordner **/ (root)** → **Save**.
6. Nach 1–2 Minuten steht oben die Adresse, z. B. `https://DEINNAME.github.io/justinzockt-website/`. Die Seite ist jetzt online.
7. Eigene Domain: unter **Settings → Pages → Custom domain** z. B. `www.justinzockt.de` eintragen → **Save**. Danach den DNS-Eintrag setzen (siehe unten). Wenn der Haken „DNS check successful“ erscheint, **Enforce HTTPS** anhaken.

CNAME-Ziel bei GitHub Pages: **`DEINNAME.github.io`** (ohne Repository-Namen, ohne https).

## Weg B: Kostenlos mit Cloudflare Pages

1. Auf **dash.cloudflare.com** ein kostenloses Konto anlegen.
2. Links **Workers & Pages** → **Erstellen / Create** → Reiter **Pages** → **Upload assets** (Dateien hochladen).
3. Projektname z. B. `justinzockt` → **Create project**.
4. **Alle Dateien aus diesem Ordner** hineinziehen → **Deploy site**.
5. Die Seite ist sofort unter `https://justinzockt.pages.dev` erreichbar.
6. Eigene Domain: im Projekt **Custom domains** → **Set up a custom domain** → `www.justinzockt.de` eintragen. Cloudflare zeigt dir dann den DNS-Eintrag an.

CNAME-Ziel bei Cloudflare Pages: **`DEINPROJEKT.pages.dev`** (z. B. `justinzockt.pages.dev`).

Änderungen später: bei GitHub die geänderte Datei erneut hochladen; bei Cloudflare im Projekt **Create new deployment** und alle Dateien erneut hochladen.

---

## Domain: www.justinzockt.de

Die Domain **justinzockt.de** gehört dir schon (INWX), es muss nichts gekauft werden.

1. In INWX bei **justinzockt.de** → **DNS** einen Eintrag anlegen:

   | Typ | Name | Ziel |
   |---|---|---|
   | CNAME | `www` | `DEINNAME.github.io` (bei GitHub Pages) **oder** `DEINPROJEKT.pages.dev` (bei Cloudflare) |

2. Bei GitHub (**Settings → Pages → Custom domain**) bzw. Cloudflare (**Custom domains**) `www.justinzockt.de` eintragen.
3. Optional, damit auch `justinzockt.de` ohne „www“ im Browser funktioniert: in INWX eine **Webweiterleitung** von `justinzockt.de` auf `https://www.justinzockt.de`.
   - Wichtig: Nur die **Web**-Weiterleitung einrichten.
   - Den SRV-Eintrag `_minecraft._tcp` nicht anfassen, sonst funktioniert `justinzockt.de` im Minecraft-Client nicht mehr.

**Achtung:** Den bestehenden Eintrag für **`play`** (Minecraft-Server) **nicht anfassen**! Der `www`-Eintrag ist zusätzlich und stört den Minecraft-Server nicht.

DNS-Änderungen brauchen meist 5–30 Minuten, manchmal bis zu 24 Stunden. HTTPS (Schloss-Symbol) kommt danach automatisch von GitHub bzw. Cloudflare.

---

## Gut zu wissen
- **Live-Status** auf der Startseite: kommt von `api.mcsrvstat.us` (kostenlos, kein Konto). Der Wert wird dort zwischengespeichert und kann ein paar Minuten alt sein. Ist der Dienst nicht erreichbar, zeigt die Seite „Status gerade nicht abrufbar“.
- **Keine Cookies, kein Tracking, keine externen Schriften, kein Speichern im Browser** – das hält den Datenschutz einfach. Animationen werden bei „Bewegung reduzieren“ (Betriebssystem-Einstellung) abgeschaltet.
- **Admin-Bereich:** `admin.html` hat keinen Login und enthält keine Geheimnisse. Das echte Admin-Werkzeug ist das Server-Dashboard (`/justin dashboard`). Die Seite ist für Suchmaschinen gesperrt (`noindex`), aber für jeden mit Link sichtbar.
- **Inhalte ändern sich?** Wenn sich Regeln, Skills oder Befehle im Spiel ändern, muss auch die Website angepasst werden (z. B. `regeln.html`, `skills.html`, `befehle.html`).

---

## Ranglisten (ranglisten.html) – automatisch aktuell
Die Seite liest `daten/ranglisten.json`. Diese Datei holt ein GitHub-Automatismus **alle 15 Minuten** vom Minecraft-Server (bis zu 4 Versuche mit Pausen; nur gültige Daten werden gespeichert, sonst bleibt die alte Datei stehen). Es werden nur Namen und Zahlen übertragen: Coins, Spielzeit, Tode, Skills, Erfolge, Minigames, Clans und Clan-Spielzeit. Die Seite zeigt „Stand: vor X Minuten“.

**Einmal einrichten (nur bei GitHub Pages, 2 Minuten):**
1. Im GitHub-Projekt: **Settings → Secrets and variables → Actions → New repository secret**
2. Name: `SERVER_API_URL`
3. Wert: deine Dashboard-Adresse aus der `config.yml` (`dashboard.url`) plus `/api/ranglisten.json`. Beispiel: `http://DEINE-SERVER-ADRESSE:PORT/api/ranglisten.json`. Diese Adresse gehört nur ins Secret, nirgends sonst ins Projekt.
4. **Actions → „Ranglisten aktualisieren“ → Run workflow** einmal von Hand starten. Danach läuft es alle 15 Minuten von selbst.
5. Wichtig: Der Ordner `.github` muss mit hochgeladen werden. Er ist unter Windows evtl. versteckt: im Explorer **Ansicht → Ausgeblendete Elemente** anhaken.

**Server-Infos (`daten/info.json`):** Derselbe Automatismus holt auch `/api/info.json` (Version, Hauptfarbe, Coins pro Stunde je Rang, AFK-Zeiten, Nether/End-Öffnung, alle Minigames, Spielerzahl). Die Adresse wird aus dem Secret abgeleitet (`ranglisten.json` → `info.json`), ein zweites Secret ist nicht nötig. Fehlt die Datei oder ist sie leer (`"stand": 0`), zeigt die Website die eingebauten Standardwerte.

Warum so? Die Website läuft mit HTTPS, der Minecraft-Server liefert nur HTTP. Browser blockieren das Mischen. GitHub holt die Daten deshalb im Hintergrund ab und legt sie direkt zur Website.
Abschalten im Server: `dashboard.public-api: false` in der `config.yml`.

## Website neu erzeugen
**Bedrock-Adresse, Port und Vote-Link** stehen oben in `_generator/lib.js` (`BEDROCK`, `VOTE_URL`, `BEDROCK_DNS`). Dort ändern, dann neu erzeugen.

Alle Seiten werden aus den echten Server-Dateien gebaut: Regeln, `skills.yml` und die Befehlslisten in `_generator/pages2.js`.
Nach Änderungen in `website/_generator`:
1. `node build.js` ausführen. Das erzeugt alle Seiten und `hochladen/BEFEHLE.md`.
2. Danach `node check.js` ausführen. Das prüft alle Links.

Den Ordner `_generator` musst du **nicht** mit hochladen.
