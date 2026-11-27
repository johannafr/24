# Persönlicher Adventskalender

Mobile-first Adventskalender für GitHub Pages mit Supabase-Anmeldung, Bewertungen und drei Arten von Türchen.

## Dateien

- `index.html` – Seitenstruktur und Login
- `style.css` – Gestaltung
- `script.js` – Kalender, Anmeldung, Bewertungen und Statistik
- `videos.js` – Inhalt der 24 Türchen
- `supabase-config.js` – Project URL und öffentlicher Publishable Key
- `supabase-function-index.ts` – Edge Function; dieser Code muss in Supabase in `advent-api/index.ts` eingesetzt werden

## Wichtiger nächster Schritt: Edge Function aktualisieren

Die bisher bereitgestellte Edge Function kennt noch keinen Endpunkt zum Abrufen vorhandener Bewertungen. Daher muss sie aktualisiert werden:

1. Supabase → Edge Functions → `advent-api` → `index.ts`
2. Den gesamten bisherigen Inhalt ersetzen durch den Inhalt aus `supabase-function-index.ts`.
3. Deploy ausführen.
4. Die JWT-Verifikation für `advent-api` ausgeschaltet lassen.
5. Das Secret `ADVENT_ACCESS_CODE` bleibt serverseitig hinterlegt.

Die Tabellen `ratings`, `login_attempts` und `advent_sessions` sowie die SQL-Funktion `register_login_attempt` müssen bereits angelegt sein. `SUPABASE_SERVICE_ROLE_KEY` wird von Supabase als serverseitige Umgebungsvariable bereitgestellt. Niemals diesen Schlüssel in `supabase-config.js` oder in GitHub Pages eintragen.

## GitHub Pages einrichten

Lade die Dateien `index.html`, `style.css`, `script.js`, `videos.js` und `supabase-config.js` in das Root-Verzeichnis deines GitHub-Pages-Repositories hoch. `README.md` und `supabase-function-index.ts` sind Dokumentation/Backend-Code und werden nicht von der Website benötigt.

## Türchen-Inhalte in `videos.js`

### 1. Video

```js
{
  day: 1,
  type: "video",
  title: "Eine Überraschung",
  videoId: "YOUTUBE_VIDEO_ID",
  message: "Viel Freude damit!"
}
```

Die Video-ID ist der elfstellige Teil einer YouTube-URL, z. B. aus `https://www.youtube.com/watch?v=dQw4w9WgXcQ` die ID `dQw4w9WgXcQ`.

### 2. Link-Button

```js
{
  day: 2,
  type: "link",
  title: "Eine kleine Überraschung",
  buttonText: "Hier öffnen",
  url: "https://example.com",
  message: "Ich habe etwas für dich."
}
```

Nur vollständige `https://`- oder `http://`-Links werden als Button ausgegeben. Der Link öffnet in einem neuen Tab.

### 3. Fun Fact

```js
{
  day: 3,
  type: "fact",
  title: "Schon gewusst?",
  fact: "Oktopusse haben drei Herzen."
}
```

`message` ist bei allen Typen optional. Der Fun Fact steht im Feld `fact`.

## Bewertungen

- Nach Anmeldung kann jedes freigeschaltete Türchen mit 0 bis 10 Herzen bewertet werden.
- Die Bewertung kann jederzeit geändert werden.
- Pro Jahr und Türchen wird nur der zuletzt gespeicherte Wert aufbewahrt.
- Die Daten werden über die Edge Function gespeichert; der Browser erhält keinen Service-Role-Key.

## Statistik

Ab dem 25. Dezember (Zeitzone Europe/Vienna) wird die Statistik freigeschaltet:
- Top 10 Türchen
- Durchschnitt aller abgegebenen Bewertungen
- Bewertungsverlauf für alle 24 Tage

## Sitzungen und Datenschutz

Nach erfolgreicher Anmeldung wird ein zufälliges Sitzungstoken im Local Storage des Browsers gespeichert. Die Sitzung läuft nach 90 Tagen ab oder wenn die Person sich abmeldet bzw. die Browserdaten löscht. Der Zugangscode wird nicht gespeichert.

Ein Sitzungstoken im Local Storage ist ein Bearer-Token. Wer Zugriff auf den Browser bzw. dessen lokale Website-Daten hat, kann es möglicherweise verwenden. Die Seite vermeidet dynamisches Einfügen von Benutzereingaben als HTML, aber wie bei jeder Browser-App sollte der Code und alle eingebundenen Skripte vertrauenswürdig bleiben.

Der Publishable Key ist für die Verwendung im Browser gedacht. Niemals den `service_role`-Key oder andere geheime Schlüssel in die Website-Dateien eintragen.

## Freischaltung

- Der Kalender ist aktuell auf das Adventsjahr 2026 eingestellt (`ADVENT_YEAR` in `script.js`).
- Im November 2026 gilt vorübergehend der Testmodus: Es öffnen sich so viele Türchen wie der Kalendertag (maximal 24).
- Vor November 2026 bleiben die Türchen geschlossen.
- Ab dem 1. Dezember 2026 gilt wieder die normale tägliche Freischaltung.
- Ab dem 24. Dezember 2026 und in den Folgejahren bleiben alle Türchen geöffnet.
- Für ein neues Adventsjahr muss `ADVENT_YEAR` in `script.js` angepasst werden.

Die Kalender-Türchen selbst werden clientseitig anhand des Datums in Europe/Vienna freigeschaltet. Das ist eine Anzeige-Funktion und keine manipulationssichere Zugangssperre. Die Statistik wird zusätzlich serverseitig erst ab dem 25. Dezember freigegeben.
