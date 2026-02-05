# Reise-Planer v2.0

React-basierte Reise-Recherche-App zur automatischen Generierung von Such-URLs.

## Features

- **Ferien-Picker**: Schulferien Hessen (18 Monate Vorschau)
- **Ziel-Auswahl**: 15+ Urlaubsziele mit editierbaren Daten
- **URL-Generator**: Kiwi, Booking, Airbnb, Mietwagen
- **GitHub Pages**: Von überall nutzbar

## Entwicklung

```bash
npm install
npm run dev
```

## Build & Deploy

```bash
npm run build
# Automatisch via GitHub Actions
```

## Ordnerstruktur

```
reise-planer/
├── docs/           # Dokumentation
├── data/           # JSON-Datenbanken
├── src/
│   ├── components/ # UI-Komponenten
│   ├── hooks/      # Custom Hooks
│   ├── shared/     # P3 Design System
│   └── utils/      # Hilfsfunktionen
├── _legacy/        # Alte HTML-Version
└── .github/        # CI/CD Workflows
```

## Dokumentation

- [URL-Syntax & Workflow](./Reise_Recherche_Workflow.md)
- [Shared Components](./Shared_Components_Library.md)
