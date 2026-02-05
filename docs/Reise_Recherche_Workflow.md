# Reise-Recherche-Workflow - Framework

**Version:** 1.1  
**Erstellt:** 2026-02-04  
**Status:** Aktiv  
**Zweck:** Automatisierte Suche nach günstigen Reiseoptionen (Flug + Unterkunft + Mietwagen)

---

## 1. Übersicht

### 1.1 Problemstellung

Manuelle Flugsuche über mehrere Portale ist zeitaufwändig und unübersichtlich. Dieses Framework ermöglicht:

- Günstige Flugziele automatisch finden (Anywhere-Suche)
- Passende Unterkünfte mit korrekten Daten suchen
- Mietwagen-Optionen ermitteln
- Nebenkosten (Anfahrt, Parken) einkalkulieren
- Gesamtkosten pro Destination vergleichen

### 1.2 Parameter-Template

| Parameter | Platzhalter | Beispiel |
|-----------|-------------|----------|
| Reisende | `[ANZAHL]` | 3 |
| Hinreise (frühestes Datum) | `[DATUM-EARLIEST]` | 2026-03-28 |
| Rückreise (spätestes Datum) | `[DATUM-LATEST]` | 2026-04-12 |
| Flexibilität | `[FLEX]` | 3 Tage |
| Abflug-Radius | `[RADIUS]` | 500km |
| Abflug-Zentrum | `[ABFLUG-ORT]` | Frankfurt |
| Budget Flug p.P. | `[BUDGET-FLUG]` | 300€ |
| Budget Gesamt p.P. | `[BUDGET-GESAMT]` | 1000€ |
| Schlafzimmer | `[ZIMMER]` | 2 |
| Gepäck | `[GEPAECK]` | 1.1_1.0_1.0- |

### 1.3 Nebenkosten-Formel

Bei Abflug nicht ab Heimatflughafen:

```
Treibstoffkosten = (Entfernung in km × 2) × 0,16€
Parkkosten = Reisetage × 10€
Nebenkosten gesamt = Treibstoffkosten + Parkkosten
```

---

## 2. Datumslogik

### 2.1 Flexibilitäts-Berechnung

Um den maximalen Suchzeitraum abzudecken, wird die Flexibilität auf die Mitte des gewünschten Zeitraums angewendet:

```
Eingabe:
- Frühester Hinflug: [DATUM-EARLIEST]
- Spätester Rückflug: [DATUM-LATEST]
- Flexibilität: [FLEX] Tage

Berechnung:
- Kiwi Hinflug-Datum = [DATUM-EARLIEST] + [FLEX] Tage
- Kiwi Rückflug-Datum = [DATUM-LATEST] - [FLEX] Tage

Beispiel (Flex = 3):
- Eingabe: 28.03. bis 12.04.
- Kiwi Hinflug: 31.03. (flex3 sucht 28.03-03.04.)
- Kiwi Rückflug: 09.04. (flex3 sucht 06.04-12.04.)
```

### 2.2 Unterkunft/Mietwagen-Daten

Für Booking, Airbnb und Mietwagen werden die tatsächlichen Randdaten verwendet:

```
Checkin/Pickup = [DATUM-EARLIEST]
Checkout/Return = [DATUM-LATEST]
```

---

## 3. URL-Templates

### 3.1 Kiwi.com - Flüge

#### Anywhere-Suche (Kartenansicht)
```
https://www.kiwi.com/de/search/map/[ABFLUG-ORT]-deutschland-[RADIUS]km/anywhere/[KIWI-HIN]_flex[FLEX]/[KIWI-RUECK]_flex[FLEX]/?adults=[ANZAHL]&children=0&infants=0&bags=[GEPAECK]
```

#### Gezielte Suche (Ergebnisliste)
```
https://www.kiwi.com/de/search/results/[ABFLUG-ORT]-deutschland-[RADIUS]km/[ZIEL-SLUG]/[KIWI-HIN]_flex[FLEX]/[KIWI-RUECK]_flex[FLEX]/?returnToDifferentAirport=false&adults=[ANZAHL]&children=0&infants=0&bags=[GEPAECK]
```

#### Parameter

| Parameter | Beschreibung | Format |
|-----------|--------------|--------|
| `[ABFLUG-ORT]` | Stadt (lowercase, Bindestriche) | frankfurt-am-main |
| `[RADIUS]` | Umkreis in km | 500 |
| `[ZIEL-SLUG]` | Ziel (lowercase, Bindestriche) | antalya-turkei |
| `[KIWI-HIN]` | Berechnetes Hinflug-Datum | YYYY-MM-DD |
| `[KIWI-RUECK]` | Berechnetes Rückflug-Datum | YYYY-MM-DD |
| `[FLEX]` | Flexibilität in Tagen | 3 |
| `[ANZAHL]` | Anzahl Reisende | 3 |
| `[GEPAECK]` | Gepäck-Code | 1.1_1.0_1.0- |

#### Gepäck-Codes

| Code | Bedeutung |
|------|-----------|
| `1.0` | Nur Handgepäck |
| `1.1` | Handgepäck + 1 Aufgabegepäck |
| Format | `Person1_Person2_Person3-` |

---

### 3.2 Airbnb - Unterkünfte

```
https://www.airbnb.de/s/[ORT]--[LAND]/homes?checkin=[CHECKIN]&checkout=[CHECKOUT]&adults=[ANZAHL]&min_bedrooms=[ZIMMER]
```

| Parameter | Beschreibung | Format |
|-----------|--------------|--------|
| `[ORT]` | Stadt | Antalya |
| `[LAND]` | Land (URL-encoded) | T%C3%BCrkei |
| `[CHECKIN]` | Frühestes Datum | YYYY-MM-DD |
| `[CHECKOUT]` | Spätestes Datum | YYYY-MM-DD |
| `[ANZAHL]` | Gäste | 3 |
| `[ZIMMER]` | Min. Schlafzimmer | 2 |

---

### 3.3 Booking.com - Unterkünfte

```
https://www.booking.com/searchresults.de.html?ss=[ORT]%2C+[LAND]&checkin=[CHECKIN]&checkout=[CHECKOUT]&group_adults=[ANZAHL]&no_rooms=[ZIMMER]&nflt=ht_id%3D201%3Bentire_place_bedroom_count%3D[ZIMMER]
```

| Parameter | Beschreibung | Format |
|-----------|--------------|--------|
| `ss` | Suchbegriff | ORT%2C+LAND |
| `checkin` | Frühestes Datum | YYYY-MM-DD |
| `checkout` | Spätestes Datum | YYYY-MM-DD |
| `group_adults` | Anzahl Erwachsene | 3 |
| `no_rooms` | Anzahl Zimmer | 2 |
| `nflt` | Filter (Apartments) | ht_id%3D201 |

---

### 3.4 Kiwi Cars - Mietwagen

```
https://cars.kiwi.com/search-results?preflang=de&locationName=[ORT]&dropLocationName=[ORT]&coordinates=[LAT]%2C[LON]&dropCoordinates=[LAT]%2C[LON]&driversAge=[ALTER]&puDay=[PU-TAG]&puMonth=[PU-MONAT]&puYear=[PU-JAHR]&puMinute=0&puHour=10&doDay=[DO-TAG]&doMonth=[DO-MONAT]&doYear=[DO-JAHR]&doMinute=0&doHour=10&ftsType=C&dropFtsType=C
```

| Parameter | Beschreibung |
|-----------|--------------|
| `locationName` | Abholort |
| `coordinates` | LAT%2CLON |
| `driversAge` | Alter des Fahrers |
| `puDay/Month/Year` | Pickup-Datum (frühestes) |
| `doDay/Month/Year` | Dropoff-Datum (spätestes) |

---

## 4. Ziel-Referenzdaten

### 4.1 Ziel-Slugs & Koordinaten

| Ziel | Land | Kiwi-Slug | Airbnb-Format | Koordinaten |
|------|------|-----------|---------------|-------------|
| Antalya | Türkei | antalya-turkei | Antalya--T%C3%BCrkei | 36.8969, 30.7133 |
| Marrakesch | Marokko | marrakesch-marokko | Marrakesch--Marokko | 31.6295, -7.9811 |
| Agadir | Marokko | agadir-marokko | Agadir--Marokko | 30.4278, -9.5981 |
| Tirana | Albanien | tirana-albanien | Tirana--Albanien | 41.3275, 19.8187 |
| Larnaka | Zypern | larnaka-zypern | Larnaka--Zypern | 34.9229, 33.6232 |
| Paphos | Zypern | paphos-zypern | Paphos--Zypern | 34.7754, 32.4245 |
| Sal | Kap Verde | sal-kap-verde | Sal--Kap-Verde | 16.7356, -22.9435 |
| Banjul | Gambia | banjul-gambia | Banjul--Gambia | 13.4549, -16.5790 |
| Palma | Spanien | palma-spanien | Palma--Spanien | 39.5696, 2.6502 |
| Hurghada | Ägypten | hurghada-agypten | Hurghada--Ägypten | 27.2579, 33.8116 |
| Sharm el Sheikh | Ägypten | sharm-el-sheikh-agypten | Sharm-El-Sheikh--Ägypten | 27.9158, 34.3300 |
| Faro | Portugal | faro-portugal | Faro--Portugal | 37.0194, -7.9322 |
| Malaga | Spanien | malaga-spanien | Malaga--Spanien | 36.6749, -4.4991 |
| Tunis | Tunesien | tunis-tunesien | Tunis--Tunesien | 36.8065, 10.1815 |
| Djerba | Tunesien | djerba-tunesien | Djerba--Tunesien | 33.8076, 10.8451 |

### 4.2 Flughäfen im Radius (ab Frankfurt)

| Flughafen | Code | Entfernung | Fahrzeit | Kosten (10 Tage)* |
|-----------|------|------------|----------|-------------------|
| Frankfurt | FRA | 0 km | - | 0€ |
| Frankfurt-Hahn | HHN | 120 km | 1:15h | ~140€ |
| Köln/Bonn | CGN | 190 km | 2:00h | ~160€ |
| Stuttgart | STR | 200 km | 2:00h | ~165€ |
| Nürnberg | NUE | 230 km | 2:15h | ~175€ |
| Dortmund | DTM | 230 km | 2:30h | ~175€ |
| Düsseldorf | DUS | 230 km | 2:30h | ~175€ |
| Düsseldorf-Weeze | NRN | 250 km | 2:45h | ~180€ |
| Memmingen | FMM | 280 km | 2:45h | ~190€ |
| Basel | BSL | 280 km | 2:45h | ~190€ |
| Eindhoven | EIN | 300 km | 3:00h | ~195€ |
| Brüssel-Charleroi | CRL | 320 km | 3:15h | ~205€ |
| München | MUC | 400 km | 3:45h | ~230€ |
| Mailand-Malpensa | MXP | 500 km | 5:00h | ~260€ |
| Paris-Orly | ORY | 580 km | 5:30h | ~285€ |

*Kosten = (km × 2 × 0,16€) + (10 × 10€)

---

## 5. Workflow-Ablauf

```
┌─────────────────────────────────────────────────────────────┐
│  1. EINGABE                                                 │
│     → Reisezeitraum (von/bis)                               │
│     → Ziel (oder "Anywhere")                                │
│     → Anzahl Reisende                                       │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  2. DATEN BERECHNEN                                         │
│     → Kiwi-Daten (mit Flex-Offset)                          │
│     → Unterkunft-Daten (Randdaten)                          │
│     → Mietwagen-Daten (Randdaten)                           │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  3. URLs GENERIEREN                                         │
│     → Kiwi Flug-URL                                         │
│     → Booking.com URL                                       │
│     → Airbnb URL                                            │
│     → Kiwi Cars URL                                         │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  4. TABS ÖFFNEN                                             │
│     → Neues Chrome-Fenster                                  │
│     → Alle URLs als separate Tabs                           │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  5. PREISE AUSLESEN (manuell oder automatisiert)            │
│     → Flugpreis notieren                                    │
│     → Unterkunftspreis notieren                             │
│     → Mietwagenpreis notieren                               │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  6. KALKULATION                                             │
│     → Nebenkosten addieren (falls nicht Heimatflughafen)    │
│     → Gesamtkosten berechnen                                │
│     → Pro-Person-Kosten berechnen                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Implementierungsoptionen

### 6.1 Option A: Chrome MCP + Claude

- Interaktive Ausführung im Claude-Chat
- Chrome-Browser wird gesteuert
- Preise werden automatisch ausgelesen
- Output als Tabelle/Excel

### 6.2 Option B: n8n + APIs

- Vollautomatisierter Workflow
- Kiwi Tequila API (kostenlos, 3000 Req/Monat)
- Schedulebar (täglich, wöchentlich)
- Alerts bei günstigen Preisen

### 6.3 Option C: URL-Generator Script

- HTML/JavaScript im Browser
- Generiert alle URLs automatisch
- Öffnet Tabs mit einem Klick
- Preise manuell ablesen

### 6.4 Option D: Excel + Formeln

- URL-Generierung via Formeln
- Manuelles Öffnen und Eintragen
- Einfachste Lösung, keine Abhängigkeiten

---

## 7. Bekannte Einschränkungen

### 7.1 Portale ohne direkte URLs

| Portal | Problem | Workaround |
|--------|---------|------------|
| Billiger-Mietwagen.de | Session-URLs | Kiwi Cars nutzen |
| Check24 | Session-URLs | Manuell suchen |
| DiscoverCars | Session-URLs | Manuell suchen |
| Kayak | Session-URLs | Manuell suchen |

### 7.2 API-Limitierungen

- **Kiwi Tequila:** Kostenlos bis 3000 Requests/Monat
- **Booking.com:** Nur Affiliate-API
- **Airbnb:** Keine öffentliche API

### 7.3 Preisdynamik

Preise ändern sich minütlich. Alle Ergebnisse sind Momentaufnahmen.

---

## 8. Versionierung

| Version | Datum | Änderungen |
|---------|-------|------------|
| 1.0 | 2026-02-04 | Initial (Ostern-spezifisch) |
| 1.1 | 2026-02-04 | Allgemeines Framework, Präferenzen entfernt |

---

## 9. Verwandte Dokumente

| Dokument | Zweck |
|----------|-------|
| `2026_02_04_Reise_URL_Generator_v1_0.html` | Browser-Script zum Öffnen aller Tabs |
| `[DATUM]_Reisesuche_[ZIEL]_Ergebnisse.md` | Konkrete Suchergebnisse |

---

*Ende des Framework-Dokuments*
