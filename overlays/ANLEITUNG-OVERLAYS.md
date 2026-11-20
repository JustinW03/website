# Stream-Overlays – JustinZockt Community

Zwei Overlays, die Zuschauer auf deinen Minecraft-Server holen:

| Datei | Wofür | Größe |
|---|---|---|
| `twitch-overlay.html` | Streamlabs Desktop (Twitch) | 1920 × 1080, durchsichtig |
| `tiktok-overlay.html` | TikTok LIVE Studio | **1:1 = 1080 × 1080** (Standard), umschaltbar auf 9:16 (1080 × 1920) oder 16:9 (1920 × 1080), durchsichtig |
| `vorschau.html` | Zum Anschauen im Browser (Doppelklick) | – |

Jede HTML-Datei funktioniert **allein**. Du brauchst keine weiteren Dateien.
Nur die Schriftarten (Montserrat, Press Start 2P) werden beim Start von Google Fonts geladen. Ohne Internet wird eine ähnliche Ersatzschrift genommen.

---

## 1. Erst mal anschauen

Doppelklick auf **`vorschau.html`**. Dort siehst du beide Overlays über einem Beispiel-Minecraft-Bild.
Mit den Knöpfen oben kannst du ausprobieren:
- **Spielbild:** Tag / Schnee (hell) / Nacht (dunkel). So siehst du, ob alles auf hellem und dunklem Spielbild lesbar ist.
- **Botschaft:** „Animation“ zeigt den normalen Ablauf. 1–5 zeigt eine Botschaft fest an.
- **Twitch-Ecke:** wo die Karte steht.
- **TikTok-Bedienfelder zeigen:** blaue Kästen zeigen ungefähr, wo TikTok Profil, Kommentare und Herzen/Geschenke hinlegt. Das Overlay bleibt außerhalb dieser Kästen.

---

## 2. Twitch: Einbinden in Streamlabs Desktop

1. In deiner Szene bei **Quellen** auf **+** klicken.
2. **Browserquelle** wählen und dann **Quelle hinzufügen**. Name z. B. „Server-Werbung“.
3. Haken bei **Lokale Datei** setzen und dann `twitch-overlay.html` auswählen.
4. **Breite: 1920**, **Höhe: 1080**.
5. **Eigene CSS:** komplett **leer** lassen. Den Standard-Text dort löschen, falls einer drin steht.
6. **„Quelle herunterfahren, wenn nicht sichtbar“: AUS**.
7. „Szene aktualisieren, wenn sie aktiv wird“ darf an oder aus sein.
8. Fertig. Die Quelle über dem Spiel und unter der Webcam anordnen und **nicht** verkleinern. Das Overlay ist schon 1920×1080 groß und an sich durchsichtig.

**Nach Änderungen an der Datei:** Rechtsklick auf die Quelle, dann **Eigenschaften** und dort **„Cache der aktuellen Seite aktualisieren“**. Alternativ die Quelle einmal aus- und wieder einschalten.

### Was passiert in der Twitch-Karte?
Unten links steht eine schmale Karte mit „SPIEL MIT AUF MEINEM SERVER“ und „JAVA & BEDROCK“. Darin wechseln sich diese Botschaften ab, je 7 Sekunden:
1. `play.justinzockt.de` (Java 26.3, ältere ab 1.21.5)
2. `bedrock.justinzockt.de` (Port 15314, Handy/Konsole/Windows)
3. „Tippe !discord im Chat“ (Whitelist über Discord, Twitch-Follow nötig)
4. Features: Clans, Claims, Skills, Shop & Coins, 25+ Minigames, Adventskalender, Events
5. (aus) Sub-Rang mit Vorteilen. Kannst du in der Datei mit `an: true` einschalten.

Über der Karte erscheint eine kleine Anzeige „**X Spieler online**“. Die Zahl kommt live von `api.mcsrvstat.us`. Wenn der Server offline ist, 0 Spieler hat oder die Abfrage nicht klappt, verschwindet die Anzeige einfach.

---

## 3. TikTok: Einbinden in TikTok LIVE Studio

In TikTok LIVE Studio heißt die Webseiten-Quelle **„Link“**. Das ist das Gleiche wie die Browserquelle in OBS/Streamlabs.

1. Studio auf **Hochformat** (Portrait, 9:16) stellen.
2. Bei den Quellen auf **„+ Quelle hinzufügen“** und dann **„Link“** klicken.
3. Als Adresse eintragen:
   - **Lokal:** `file:///C:/Users/kunde/JustinZocktCommunity-Server/hochladen/overlays/tiktok-overlay.html`. Falls der Ordner woanders liegt, den Pfad anpassen. Schrägstriche `/` verwenden, keine `\`.
   - **Oder online** (empfohlen bei TikTok, siehe Abschnitt 6): `https://www.justinzockt.de/overlays/tiktok-overlay.html`
4. Größe passend zum Format einstellen: **1080 × 1080** (1:1, Standard), **1080 × 1920** (9:16) oder **1920 × 1080** (16:9).
   Format wechseln: im Link `?format=9:16` oder `?format=16:9` anhängen, z. B. `https://www.justinzockt.de/overlays/tiktok-overlay.html?format=9:16`.
   Oder dauerhaft oben in der Datei bei `format: "1:1"` ändern.
5. Die Link-Quelle in der Liste **über** das Spiel/die Aufnahme legen.

**Transparenz:** Das Overlay hat einen durchsichtigen Hintergrund. Ob TikTok LIVE Studio Link-Quellen durchsichtig anzeigt, ist offiziell nicht dokumentiert und hängt von der Version ab. Bitte einmal kurz testen:
- **Siehst du das Spiel hinter dem Overlay?** Dann ist alles gut.
- **Ist der Hintergrund schwarz/weiß oder wird nur ein kleiner Kasten angezeigt?** TikTok LIVE Studio nutzt einen älteren eingebauten Browser, der damit manchmal Probleme hat. Dann so ausweichen:
  1. Das Overlay in **Streamlabs/OBS** in einer Hochformat-Szene (1080×1920) als Browserquelle einbinden. Das geht genauso wie in Abschnitt 2, nur mit 1080 × 1920.
  2. In Streamlabs/OBS die **Virtuelle Kamera** starten.
  3. In TikTok LIVE Studio die virtuelle Kamera als **Kamera-Quelle** hinzufügen. Dann ist das komplette Bild samt Overlay drin.

### Was passiert im TikTok-Overlay?
- **Ganz oben** steht die Anzeige „X Spieler gerade online“ (nur wenn Spieler online sind), **darunter** ein Banner: „SPIEL MIT AUF MEINEM SERVER – JustinZockt Community“ mit dem Abzeichen „KOSTENLOS“.
- Darunter erscheint die Live-Anzeige „X Spieler gerade online“, falls Spieler online sind.
- Darunter wechselt **alle 4 Sekunden ohne Pause** eine große Karte: Server-IP, Bedrock-Adresse + Port, Whitelist über Discord, 25+ Minigames.
- Die untere Hälfte bleibt frei für Kommentare, Herzen und Geschenke.

**Tipp:** Schreib die Server-IP auch in deine **TikTok-Bio** und pinne einen Kommentar mit `play.justinzockt.de` und `bedrock.justinzockt.de : 15314`. Darauf verweist das Overlay.

---

## 4. Texte, Farben und Zeiten ändern (ohne Programmieren)

1. Rechtsklick auf `twitch-overlay.html` (oder `tiktok-overlay.html`), dann **Öffnen mit** und **Editor** (Notepad).
2. Ganz oben steht der Block **`var CONFIG = { ... }`**. Nur dort etwas ändern.
3. Speichern (Strg+S) und in Streamlabs den Cache aktualisieren (siehe oben).

Regeln:
- Texte bleiben in `"Anführungszeichen"`.
- Kommas am Zeilenende **nicht löschen**.
- `true` = an, `false` = aus.
- Text zwischen `*Sternchen*` wird **rot** hervorgehoben, z. B. `"play.*justinzockt*.de"`.

Beispiele:

| Was | Wo im CONFIG | Beispiel |
|---|---|---|
| Ecke der Twitch-Karte | `ecke:` | `"unten-rechts"` |
| Sekunden pro Botschaft | `dauer:` | `10` |
| Größe | `skalierung:` | `0.85` (kleiner), `1.2` (größer) |
| Hauptfarbe | `farben: { haupt: ... }` | `"#00c853"` (grün) |
| Botschaft aus | in der Botschaft `an:` | `an: false` |
| Neue Botschaft | Zeile bei `botschaften` kopieren und Text ändern | – |
| Funken/Glanz/Leuchten aus | `zeigePartikel` / `zeigeShine` / `zeigeGlow` | `false` |
| Spieler-Anzeige aus | `serverStatus: { an: ... }` | `false` |
| Karte ab und zu ausblenden (Twitch) | `pauseNachRunde:` | `20` (nach jeder Runde 20 s weg) |
| Pause zwischen Karten (TikTok) | `pauseZwischenKarten:` | `0` (immer sichtbar) |
| Format (TikTok) | `format:` | `"1:1"`, `"9:16"` oder `"16:9"` |
| Abstand von oben (TikTok, je Format) | `abstandOben:` | `{ "1:1": 90, "9:16": 250, "16:9": 90 }` |

Wenn nach einer Änderung **gar nichts mehr angezeigt** wird, fehlt meist ein Komma oder ein Anführungszeichen. Vergleiche dann mit einer anderen Zeile oder mach die Änderung rückgängig (Strg+Z).

---

## 5. URL-Parameter: umstellen ohne die Datei zu ändern

Hinter den Dateinamen kannst du `?` und Einstellungen schreiben, getrennt durch `&`.
In Streamlabs dafür **„Lokale Datei“ abhaken** und als **URL** eintragen, z. B.:

```
file:///C:/Users/kunde/JustinZocktCommunity-Server/hochladen/overlays/twitch-overlay.html?ecke=unten-rechts&dauer=8&farbe=ff1f3d
```

(Mit „Lokale Datei“ angehakt gehen keine Parameter. Dann gilt nur, was im CONFIG steht.)

| Parameter | Bedeutung | Beispiel |
|---|---|---|
| `ecke` | Ecke (nur Twitch): `unten-links`, `unten-rechts`, `oben-links`, `oben-rechts` | `ecke=oben-rechts` |
| `dauer` | Sekunden pro Botschaft | `dauer=8` |
| `farbe` | Hauptfarbe, Hex **ohne #** | `farbe=ff1f3d` |
| `farbe2` | Dunkle Farbe, Hex ohne # | `farbe2=b3001b` |
| `skala` | Größe | `skala=0.9` |
| `rand` | Abstand zum Rand in px (Twitch) | `rand=50` |
| `breite` | Breite der Karte in px (Twitch) | `breite=640` |
| `deckkraft` | Hintergrund-Deckkraft 0–1 | `deckkraft=0.75` |
| `pause` | Twitch: Pause nach Runde, TikTok: Pause zwischen Karten (Sek.) | `pause=0` |
| `nur` | Nur bestimmte Botschaften (Nummern) | `nur=1,2` |
| `status` | Spieler-Anzeige an/aus | `status=0` |
| `statusurl` | Andere JSON-Adresse für die Spieler-Anzeige | – |
| `partikel`, `shine`, `glow` | Effekte an/aus | `partikel=0` |
| `titel` | Überschrift ersetzen | `titel=JETZT MITSPIELEN` |
| `format` | TikTok: 1:1, 9:16 oder 16:9 | `format=9:16` |
| `oben` | TikTok: Abstand von oben in px | `oben=120` |
| `banner`, `karten` | TikTok: Banner / Karten an/aus | `karten=0` |
| `slide` | Eine Botschaft **fest** anzeigen (für Tests/Screenshots) | `slide=2` |
| `testbg` | Test-Hintergrund `hell`, `dunkel`, `mc`. **Nur zum Testen, nie im Stream!** | `testbg=hell` |
| `zonen` | TikTok: Bedienfelder als blaue Kästen zeigen (nur Test) | `zonen=1` |
| `statusdemo` | Spieler-Anzeige mit Beispielzahl (nur Test) | `statusdemo=12` |

---

## 6. Online hosten (falls lokale Dateien nicht gehen)

Manche Programme (vor allem TikTok LIVE Studio) laden lokale Dateien nicht zuverlässig. Dann die Dateien auf deine Website legen:

1. Per FTP oder im Dateimanager deines Webhosters den Ordner **`overlays`** im Hauptverzeichnis von justinzockt.de anlegen. Das ist meist `public_html` oder `htdocs`.
2. `twitch-overlay.html`, `tiktok-overlay.html` (und gern `vorschau.html`) hochladen.
3. Testen im Browser:
   - `https://www.justinzockt.de/overlays/twitch-overlay.html`
   - `https://www.justinzockt.de/overlays/tiktok-overlay.html`
4. In Streamlabs: Browserquelle mit **„Lokale Datei“ aus** und die URL eintragen. Dort gehen dann auch URL-Parameter wie `?ecke=unten-rechts`.
5. In TikTok LIVE Studio: **Link**-Quelle mit dieser URL.

Hinweise:
- Nach dem Hochladen einer geänderten Datei in Streamlabs „Cache aktualisieren“, sonst siehst du noch die alte Version.
- Die Overlays enthalten keine geheimen Daten. Jeder darf sie sehen.
- Wenn die Website über GitHub Pages, Netlify o. Ä. läuft, einfach den Ordner `overlays` mit ins Projekt legen.

---

## 7. Häufige Probleme

| Problem | Lösung |
|---|---|
| Schwarzer/weißer Hintergrund statt durchsichtig (Streamlabs) | Feld „Eigene CSS“ leeren, Cache aktualisieren. Kein `testbg` in der URL! |
| Overlay zu groß/zu klein | Quelle auf 1920×1080 lassen und mit `skalierung` bzw. `skala=` die Größe ändern. Die Quelle nicht mit der Maus ziehen. |
| Spieler-Anzeige fehlt | Normal, wenn der Server offline ist oder 0 Spieler hat. Bei 0 Spielern trotzdem zeigen: `zeigeBeiNull: true`. |
| Schrift sieht anders aus | Kein Internet, deshalb wird die Ersatzschrift genommen. Funktioniert trotzdem. |
| Animation ruckelt | `partikel=0` oder `zeigePartikel: false` setzen. In Streamlabs unter Einstellungen, Erweitert, die Hardwarebeschleunigung für Browserquellen anlassen. |
| Text zu lang | Wird automatisch kleiner gemacht, damit nichts abgeschnitten wird. Trotzdem lieber kurz halten. |

## 7. TikTok ohne Link (Video oder Bild)
Nimmt TikTok LIVE Studio keinen Link an, nutze die fertigen Dateien in `tiktok-ohne-link/`:
- `tiktok-overlay.webm`: Video, 1:1 (1080×1080), durchsichtiger Hintergrund, 16 Sekunden. Alle 4 Nachrichten wechseln (je 4 s) mit kurzer Überblendung, in Dauerschleife.
  TikTok LIVE Studio → **Quelle hinzufügen → Medien/Video** → Datei wählen → **Wiederholen (Loop)** einschalten.
- `tiktok-bild-1.png` … `tiktok-bild-4.png`: einzelne Nachrichten als durchsichtige Bilder (Quelle **Bild**). Am besten Bild 1 (Java-IP) oder Bild 2 (Bedrock).
- Ändern: Text in `tiktok-overlay.html` ändern und mir Bescheid geben. Ich erzeuge dann Video und Bilder neu.
