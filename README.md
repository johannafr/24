# Video-Adventskalender

Eine statische, für Smartphones optimierte Adventskalender-Website für GitHub Pages.

## Dateien

- `index.html` – Seitenstruktur
- `style.css` – Gestaltung und responsive Layout
- `script.js` – tägliche Freischaltung und Videoanzeige
- `videos.js` – hier werden die 24 YouTube-Videos eingetragen

## YouTube-Videos eintragen

Öffne `videos.js`. Für jedes Türchen trägst du die YouTube-Video-ID ein.

Beispiel-Link:
`https://www.youtube.com/watch?v=dQw4w9WgXcQ`

Die Video-ID ist der Teil nach `v=`:
`dQw4w9WgXcQ`

Dann z. B.:
`{ day: 1, title: "Eine kleine Überraschung", videoId: "dQw4w9WgXcQ", message: "Für dich." }`

Du kannst auch nur `videoId` eintragen und Titel/Nachricht unverändert lassen.

## Auf GitHub Pages veröffentlichen

1. Melde dich bei GitHub an und erstelle ein neues Repository, z. B. `adventskalender`.
2. Lade alle fünf Dateien aus diesem Ordner in das Repository hoch (nicht nur die ZIP-Datei).
3. Öffne im Repository **Settings → Pages**.
4. Unter **Build and deployment** wähle **Deploy from a branch**.
5. Wähle den Branch `main` und den Ordner `/ (root)`, dann **Save**.
6. Nach dem Veröffentlichen zeigt GitHub Pages die Website-Adresse an.

## Freischaltung

- Vor dem 1. Dezember sind alle Türchen verschlossen.
- Ab 1. Dezember öffnet sich täglich das entsprechende Türchen.
- Bereits geöffnete Türchen bleiben verfügbar.
- Ab 24. Dezember sind alle Türchen geöffnet.

Die Freischaltung richtet sich nach dem lokalen Datum des Geräts, auf dem die Seite geöffnet wird. Sie ist keine sichere Zugangssperre: Besucher können beispielsweise die Geräteuhr oder den Browser-Code verändern.

## Gestaltung

- Minimalistischer Hintergrund in Schwarz und Anthrazit
- Quadratische Kacheln
- Wechselnde Nummern-/Herzfarben in Weiß und Flieder (`#A47DAB`)
- Kleine Herzen diagonal gegenüber der Zahl
- Nummern-Schrift: Bitcount Single
- Kein Hintergrundmusik- oder Audioelement

## Hinweise zu YouTube

Die Videos werden über `youtube-nocookie.com` eingebettet. Das ist der datenschutzfreundlichere Einbettungsmodus, garantiert aber keine werbefreie Wiedergabe. YouTube Premium kann bei eingebetteten Videos je nach Situation helfen, eine vollständige Garantie gibt es nicht.
