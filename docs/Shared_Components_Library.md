# P3 Shared Components Library
**Version:** 1.0  
**Erstellt:** Januar 2026  
**Referenz-Projekt:** P3 Craving Log  

---

## 📋 Übersicht

Diese Komponenten wurden im P3 Craving Log Projekt entwickelt und sind **wiederverwendbar für alle P3 Apps**.

```
📁 src/shared/
├── p3-theme.js              # Design System
├── useStorage.js            # localStorage Hook
└── components/
    ├── P3Button.jsx         # Buttons
    ├── P3Modal.jsx          # Modals/Popups
    └── P3Slider.jsx         # Slider/Dot-Selector
```

---

## 🎨 p3-theme.js

### Zweck
Zentrales Design System mit P3 Corporate Design + Neurodivergenz-Optimierungen.

### Enthält
| Export | Beschreibung |
|--------|--------------|
| `P3_COLORS` | Alle Farben (red, blue, beige, success, warning, bgDark, etc.) |
| `P3_TYPOGRAPHY` | Schriftgrößen (h1-h4, body, small, button, stat) |
| `P3_SPACING` | Abstände (xs, sm, md, lg, xl, xxl) |
| `P3_TOUCH` | Touch-Target-Größen (minTarget 48px, largeTarget 64px, hugeTarget 80px) |
| `P3_SHADOWS` | Schatten (sm, md, lg, glow) |
| `P3_ANIMATIONS` | Animationszeiten (fast, normal, slow) |
| `P3_BUTTON_STYLES` | Vordefinierte Button-Styles (primary, secondary, ghost, huge) |
| `P3_CARD_STYLES` | Karten-Styles (default, elevated) |
| `P3_MODAL_STYLES` | Modal-Styles (overlay, content, header, title) |
| `p3Gradient()` | Funktion für P3 Gradient |
| `getIntensityColor(value)` | Farbe basierend auf 1-10 Wert |
| `getZoneInfo(zone)` | Zone-Infos (leicht/mittel/stark/extrem) |
| `TRIGGERS` | Trigger-Definitionen (App-spezifisch, anpassbar) |

### Verwendung
```javascript
import { P3_COLORS, P3_BUTTON_STYLES, getIntensityColor } from './shared/p3-theme';

// Farbe verwenden
<div style={{ backgroundColor: P3_COLORS.bgDark }}>

// Button-Style verwenden
<button style={P3_BUTTON_STYLES.primary}>

// Dynamische Farbe
<div style={{ color: getIntensityColor(7) }}> // Orange
```

### P3 Hauptfarben
```
P3 Rot:    #c60a0f
P3 Blau:   #25313a  
P3 Beige:  #d5d4c7
```

---

## 💾 useStorage.js

### Zweck
localStorage Hook mit automatischer JSON-Serialisierung.

### Exports
| Export | Beschreibung |
|--------|--------------|
| `useStorage(key, initialValue)` | Generischer localStorage Hook |
| `useCravingStorage()` | Spezifischer Hook für Craving-App (als Beispiel) |

### Verwendung (generisch)
```javascript
import { useStorage } from './shared/useStorage';

// Einfacher Wert
const [name, setName] = useStorage('userName', '');

// Array
const [items, setItems] = useStorage('myItems', []);
setItems([...items, newItem]);

// Objekt
const [settings, setSettings] = useStorage('settings', { theme: 'dark' });
setSettings(prev => ({ ...prev, theme: 'light' }));
```

### Für neue App anpassen
Die `useCravingStorage()` Funktion kann als Template für app-spezifische Storage-Hooks dienen. Kopieren und anpassen:
- Felder umbenennen
- Berechnungsfunktionen anpassen
- Neue Hilfsfunktionen hinzufügen

---

## 🔘 P3Button.jsx

### Zweck
Wiederverwendbare Buttons mit P3 Styling, Touch-Feedback und Haptic.

### Exports
| Komponente | Beschreibung |
|------------|--------------|
| `P3Button` | Standard-Button mit Varianten |
| `P3ZoneButton` | Emoji-Button für Auswahl (Tap + Hold) |
| `P3IconButton` | Runder Icon-Button |

### P3Button Props
```javascript
<P3Button 
  variant="primary"     // 'primary' | 'secondary' | 'ghost' | 'huge'
  onClick={handleClick}
  disabled={false}
  fullWidth={false}
  style={{}}            // Zusätzliche Styles
>
  Button Text
</P3Button>
```

### P3ZoneButton Props (für Auswahl-UIs)
```javascript
<P3ZoneButton
  emoji="🔥"
  label="Stark"
  sublabel="6-7"
  color="#e66300"
  selected={true}
  onTap={() => {}}      // Normaler Klick
  onHold={() => {}}     // Gehalten (500ms)
/>
```

### P3IconButton Props
```javascript
<P3IconButton
  icon="📊"             // Emoji oder Text
  onClick={() => {}}
  size={44}             // Größe in px
/>
```

---

## 🪟 P3Modal.jsx

### Zweck
Modal/Popup mit Overlay, Animation und ESC-zum-Schließen.

### Exports
| Komponente | Beschreibung |
|------------|--------------|
| `P3Modal` | Standard-Modal |
| `P3ConfirmModal` | Bestätigungs-Dialog (Ja/Nein) |

### P3Modal Props
```javascript
<P3Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Modal Titel"
  showClose={true}      // X-Button zeigen
>
  <p>Modal Inhalt hier</p>
</P3Modal>
```

### P3ConfirmModal Props
```javascript
<P3ConfirmModal
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  onConfirm={() => handleDelete()}
  title="Löschen?"
  message="Willst du das wirklich löschen?"
  confirmText="Ja, löschen"
  cancelText="Abbrechen"
  variant="danger"      // 'danger' | 'warning' | 'success'
/>
```

---

## 📊 P3Slider.jsx

### Zweck
Slider und Dot-Selector für Werteeingabe (1-10 Skalen).

### Exports
| Komponente | Beschreibung |
|------------|--------------|
| `P3Slider` | Klassischer Slider |
| `P3DotSelector` | Punkte zum Antippen (besser für Touch/Neurodivergenz) |

### P3DotSelector Props (empfohlen)
```javascript
<P3DotSelector
  label="Energie-Level"
  icon="⚡"
  value={energy}        // 1-10 oder null
  onChange={setEnergy}
  count={10}            // Anzahl Punkte
  colorByValue={false}  // Farbe nach Wert (grün→rot)
/>
```

### P3Slider Props
```javascript
<P3Slider
  label="Intensität"
  icon="🔥"
  value={intensity}
  onChange={setIntensity}
  min={1}
  max={10}
  showValue={true}
  colorByValue={true}
/>
```

---

## 🚀 Neue App starten (Checkliste)

### 1. Projekt-Ordner erstellen
```
neue-app/
├── index.html          # Kopieren + App-Name anpassen
├── package.json        # Kopieren + Name/Description anpassen
├── vite.config.js      # Kopieren (unverändert)
└── src/
    ├── main.jsx        # Kopieren (unverändert)
    ├── App.jsx         # Neu schreiben
    ├── shared/         # KOMPLETT KOPIEREN ✅
    │   ├── p3-theme.js
    │   ├── useStorage.js
    │   └── components/
    └── components/     # Neu schreiben (app-spezifisch)
```

### 2. In p3-theme.js anpassen (optional)
- `TRIGGERS` Array für neue App
- Zusätzliche semantische Farben
- App-spezifische Konstanten

### 3. useStorage.js anpassen
- `useCravingStorage()` kopieren → umbenennen
- Felder für neue App definieren
- Berechnungsfunktionen anpassen

### 4. Terminal-Befehle
```bash
cd neue-app
npm install
npm run dev
```

---

## 📱 APK Build (Capacitor)

### Einmalig einrichten
```bash
npm run cap:init
npm run cap:add
```

### APK bauen
```bash
npm run build
npm run cap:sync
npm run cap:open      # Öffnet Android Studio
```

In Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**

---

## 📝 Versionshistorie

| Version | Datum | Änderungen |
|---------|-------|------------|
| 1.0 | 01/2026 | Initial aus P3 Craving Log extrahiert |

---

## 🔗 Referenzen

- **Referenz-Projekt:** P3 Craving Log v1.3
- **Design-Grundlage:** p3-design-system.js, Neurodivergenz_UI_Guidelines
- **Workflow:** App-Entwicklung-Workflow_v1_0

