# Reise-Planer v2.0

React-basierte Reise-Recherche-App zur automatischen Generierung von Such-URLs für Flüge, Unterkünfte und Mietwagen.

## Features

- **Ferien-Picker**: Schulferien Hessen (18 Monate Vorschau) - Klick übernimmt Zeitraum
- **15+ Urlaubsziele**: Mit editierbaren URL-Formaten (Korrekturen lokal speicherbar)
- **6 Portale**: Kiwi Flüge, Booking, Airbnb, Kiwi Cars, Reisehinweise, Wetter
- **Alle Tabs öffnen**: Mit einem Klick alle Suchergebnisse öffnen

## Live Demo

👉 **[reise-planer auf GitHub Pages](https://grischan15.github.io/reise-planer/)**

## Entwicklung

```bash
# Dependencies installieren
npm install

# Dev Server starten
npm run dev

# Build erstellen
npm run build
```

## Projektstruktur

```
reise-planer/
├── docs/           # Dokumentation
│   ├── ARCHITECTURE.md      # Architektur & Datenfluss
│   ├── Reise_Recherche_Workflow.md
│   └── Shared_Components_Library.md
├── data/           # JSON-Datenbanken
│   ├── destinations.json    # 15 Reiseziele
│   └── ferien-hessen.json   # Schulferien Hessen
├── src/
│   ├── components/ # UI-Komponenten (JSDoc dokumentiert)
│   ├── hooks/      # Custom Hooks (JSDoc dokumentiert)
│   ├── shared/     # P3 Design System
│   └── utils/      # Hilfsfunktionen
├── _legacy/        # Alte HTML-Version
└── .github/        # CI/CD Workflows
```

## Zieldaten korrigieren

Falls ein generierter Link nicht funktioniert:
1. Ziel auswählen
2. "Edit" Button klicken
3. URL-Format korrigieren
4. Speichern (wird lokal in localStorage gespeichert)

## Tech Stack

- React 18 + Vite
- P3 Design System
- GitHub Pages (Hosting)
- localStorage (User-Korrekturen)

## Lizenz

MIT
