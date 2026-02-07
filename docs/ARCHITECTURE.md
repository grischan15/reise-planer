# Reise-Planer v2.0 - Architektur

**Stand:** Februar 2026
**Tech Stack:** React 18 + Vite + P3 Design System

---

## 1. Projektstruktur

```
reise-planer/
├── index.html              # Vite Entry Point
├── package.json            # Dependencies
├── vite.config.js          # Vite Konfiguration
│
├── data/                   # JSON-Datenbanken
│   ├── ferien-hessen.json  # Schulferien (Quelle: Kultusministerium)
│   └── destinations.json   # Reiseziele + Abflug-Städte
│
├── src/
│   ├── main.jsx           # React Root
│   ├── App.jsx            # Haupt-Komponente (State + Layout)
│   │
│   ├── components/        # UI-Komponenten
│   │   ├── FerienPicker.jsx      # Ferien-Auswahl Karten
│   │   ├── DestinationSelect.jsx # Ziel-Dropdown
│   │   ├── DestinationEditor.jsx # Modal zum Korrigieren
│   │   ├── TravelForm.jsx        # Parameter-Formular
│   │   ├── URLResultList.jsx     # Ergebnis-Liste
│   │   └── index.js              # Barrel Export
│   │
│   ├── hooks/             # Custom React Hooks
│   │   ├── useFerien.js          # Ferien-Logik
│   │   ├── useDestinations.js    # Ziele + Overrides
│   │   ├── useURLGenerator.js    # URL-Generierung
│   │   └── index.js              # Barrel Export
│   │
│   ├── utils/             # Hilfsfunktionen
│   │   ├── dateHelpers.js        # Datum-Berechnungen
│   │   ├── urlBuilders.js        # URL-Templates
│   │   └── index.js              # Barrel Export
│   │
│   └── shared/            # P3 Design System
│       ├── p3-theme.js           # Farben, Spacing, etc.
│       ├── useStorage.js         # localStorage Hook
│       └── components/
│           ├── P3Button.jsx
│           ├── P3Modal.jsx
│           └── P3Slider.jsx
│
├── docs/                  # Dokumentation
│   ├── README.md
│   ├── ARCHITECTURE.md           # Diese Datei
│   ├── Reise_Recherche_Workflow.md
│   └── Shared_Components_Library.md
│
├── _legacy/               # Alte HTML-Version
│   └── 2026_02_04_Reise_URL_Generator_v1_1.html
│
└── .github/
    └── workflows/
        └── deploy.yml     # GitHub Pages Deployment
```

---

## 2. Datenfluss

```
┌─────────────────────────────────────────────────────────────────┐
│                         App.jsx                                  │
│  ┌───────────────┐ ┌────────────────┐ ┌──────────────────┐     │
│  │  useFerien()  │ │useDestinations │ │ useURLGenerator()│     │
│  │               │ │                │ │                  │     │
│  │ ferien-       │ │ destinations.  │ │ Parameter State  │     │
│  │ hessen.json   │ │ json           │ │ URL-Generierung  │     │
│  │               │ │ + localStorage │ │                  │     │
│  └───────┬───────┘ └───────┬────────┘ └─────────┬────────┘     │
│          │                 │                    │               │
│          ▼                 ▼                    ▼               │
│  ┌───────────────┐ ┌───────────────┐ ┌──────────────────┐      │
│  │ FerienPicker  │ │ Destination   │ │   TravelForm     │      │
│  │               │ │ Select        │ │                  │      │
│  │ Klick →       │ │               │ │ Datum, Reisende  │      │
│  │ setDates()    │ │ Klick →       │ │ Abflug, etc.     │      │
│  └───────────────┘ │ setSelectedId │ └──────────────────┘      │
│                    └───────────────┘                            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    "URLs generieren"                     │   │
│  │                         Button                           │   │
│  └────────────────────────────┬────────────────────────────┘   │
│                               │                                 │
│                               ▼                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    URLResultList                         │   │
│  │                                                          │   │
│  │  ✈️ Kiwi Flüge    🏨 Booking    🏠 Airbnb              │   │
│  │  🚗 Mietwagen     ⚠️ Reisehinweise  🌤️ Wetter          │   │
│  │                                                          │   │
│  │  [Alle Tabs öffnen]  [URLs kopieren]                    │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Hooks im Detail

### 3.1 useFerien(filterMonths)

**Quelle:** `data/ferien-hessen.json`
**Persistenz:** Keine (readonly)

| Funktion | Beschreibung |
|----------|--------------|
| Laden | JSON-Import zur Build-Zeit |
| Anreicherung | Tage berechnen, isPast/isCurrent/isFuture markieren |
| Filterung | Nächste X Monate + Jahr-Filter |

**Reise-Zeitraum-Logik:**
- Offizieller Ferienbeginn -2 Tage (Samstag vor Start)
- Offizielles Ferienende +2 Tage (Sonntag nach Ende)

### 3.2 useDestinations()

**Quelle:** `data/destinations.json`
**Persistenz:** `localStorage['destination_overrides']`

| Funktion | Beschreibung |
|----------|--------------|
| Laden | JSON-Import + localStorage merge |
| Overrides | User-Korrekturen pro Destination |
| Reset | Einzelne Destination auf Original zurücksetzen |

**Override-Struktur:**
```json
{
  "antalya": {
    "kiwiSlug": "korrigierter-slug",
    "airbnbFormat": "Korrigiertes-Format"
  }
}
```

### 3.3 useURLGenerator()

**Persistenz:** Keine (Session-only)

| State | Default | Beschreibung |
|-------|---------|--------------|
| dateFrom | '' | Frühester Hinflug (YYYY-MM-DD) |
| dateTo | '' | Spätester Rückflug (YYYY-MM-DD) |
| flex | 3 | Flexibilität ±Tage |
| adults | 3 | Anzahl Erwachsene |
| bedrooms | 2 | Min. Schlafzimmer |
| checkedBags | 1 | Aufgabegepäck p.P. |
| departureCity | 'frankfurt-am-main' | Abflug-Stadt |
| radius | 500 | Suchradius km |
| driverAge | 35 | Fahrer-Alter |

---

## 4. URL-Templates

### 4.1 Kiwi.com (Flüge)

```
https://www.kiwi.com/de/search/results/
  {departureCity}-deutschland-{radius}km/
  {kiwiSlug}/
  {kiwiHin}_flex{flex}/
  {kiwiRueck}_flex{flex}/
  ?adults={adults}&bags={bagsString}
```

**Flex-Berechnung:**
- `kiwiHin = dateFrom + flex` (Mitte des Suchfensters)
- `kiwiRueck = dateTo - flex` (Mitte des Suchfensters)

### 4.2 Booking.com

```
https://www.booking.com/searchresults.de.html
  ?ss={bookingFormat}
  &checkin={dateFrom}
  &checkout={dateTo}
  &group_adults={adults}
  &no_rooms={bedrooms}
  &nflt=ht_id%3D201  # Apartments-Filter
```

### 4.3 Airbnb

```
https://www.airbnb.de/s/{airbnbFormat}/homes
  ?checkin={dateFrom}
  &checkout={dateTo}
  &adults={adults}
  &min_bedrooms={bedrooms}
```

### 4.4 Kiwi Cars

```
https://cars.kiwi.com/search-results
  ?locationName={name}
  &coordinates={lat},{lon}
  &driversAge={driverAge}
  &puDay/Month/Year={dateFrom}
  &doDay/Month/Year={dateTo}
```

---

## 5. Persistenz-Layer

| Daten | Speicherort | Lebensdauer |
|-------|-------------|-------------|
| Ferien | JSON (Build) | Permanent |
| Destinations | JSON (Build) | Permanent |
| User-Overrides | localStorage | Browser-Session |
| Suchparameter | React State | Tab-Session |

---

## 6. Deployment

### GitHub Actions Workflow

```yaml
on: push (main)

jobs:
  build:
    - npm ci
    - npm run build
    - Upload ./dist

  deploy:
    - Deploy to GitHub Pages
```

**URL:** `https://{username}.github.io/reise-planer/`

### Vite Config

```javascript
export default defineConfig({
  base: '/reise-planer/',  // GitHub Pages Subpath
  plugins: [react()]
})
```

---

## 7. Erweiterungspunkte

### Neue Destination hinzufügen

1. `data/destinations.json` erweitern:
```json
{
  "id": "neue-destination",
  "name": "Neue Stadt",
  "country": "Land",
  "countryDE": "Land (deutsch)",
  "kiwiSlug": "neue-stadt-land",
  "airbnbFormat": "Neue-Stadt--Land",
  "bookingFormat": "Neue+Stadt%2C+Land",
  "lat": 0.0000,
  "lon": 0.0000
}
```

### Neues Portal hinzufügen

1. `src/utils/urlBuilders.js`:
   - `buildNeuesPortalURL()` Funktion
   - In `generateAllURLs()` Array einfügen

### Ferien für anderes Bundesland

1. Neue JSON-Datei: `data/ferien-{bundesland}.json`
2. In `useFerien.js`: Import anpassen oder dynamisch laden

---

## 8. Known Issues & Workarounds

| Issue | Workaround |
|-------|------------|
| Popup-Blocker | Tabs mit 300ms Verzögerung öffnen |
| URL-Formate ändern sich | User-Override-System im Editor |
| Kein API-Zugriff | URL-basierte Suche (manuelles Preis-Ablesen) |

---

## 9. Performance

- **Bundle Size:** ~200KB (React + App)
- **JSON-Daten:** Zur Build-Zeit gepackt (kein Runtime-Fetch)
- **Rendering:** Alle Berechnungen in `useMemo` gecached

---

*Dokumentation erstellt: Februar 2026*
