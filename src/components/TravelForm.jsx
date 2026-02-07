import { P3_COLORS } from '../shared/p3-theme'
import { formatDateDE, daysBetween } from '../utils/dateHelpers'

/**
 * Formular für alle Reiseparameter
 *
 * Enthält drei Sektionen:
 * 1. Reisezeitraum (Datum von/bis, Flexibilität) + berechnete Kiwi-Daten
 * 2. Reisende & Gepäck (Anzahl, Schlafzimmer, Aufgabegepäck)
 * 3. Abflughafen (Stadt, Radius, Fahrer-Alter für Mietwagen)
 *
 * @component
 * @param {Object} props
 * @param {string} props.dateFrom - Frühestes Hinflugdatum (YYYY-MM-DD)
 * @param {string} props.dateTo - Spätestes Rückflugdatum (YYYY-MM-DD)
 * @param {number} props.flex - Flexibilität in Tagen (1-4)
 * @param {number} props.adults - Anzahl Erwachsene
 * @param {number} props.bedrooms - Anzahl Schlafzimmer
 * @param {number} props.checkedBags - Anzahl Aufgabegepäck
 * @param {string} props.departureCity - Abflug-Stadt ID (z.B. "frankfurt-am-main")
 * @param {number} props.radius - Suchradius um Abflug-Stadt in km
 * @param {number} props.driverAge - Alter des Fahrers für Mietwagen
 * @param {Array<Object>} props.departureCities - Verfügbare Abflug-Städte
 * @param {Object|null} props.kiwiDates - Berechnete Kiwi-Flex-Daten {kiwiHin, kiwiRueck}
 * @param {function} props.onDateFromChange - Callback für Startdatum-Änderung
 * @param {function} props.onDateToChange - Callback für Enddatum-Änderung
 * @param {function} props.onFlexChange - Callback für Flex-Änderung
 * @param {function} props.onAdultsChange - Callback für Erwachsene-Änderung
 * @param {function} props.onBedroomsChange - Callback für Schlafzimmer-Änderung
 * @param {function} props.onCheckedBagsChange - Callback für Gepäck-Änderung
 * @param {function} props.onDepartureCityChange - Callback für Stadt-Änderung
 * @param {function} props.onRadiusChange - Callback für Radius-Änderung
 * @param {function} props.onDriverAgeChange - Callback für Alter-Änderung
 */
export function TravelForm({
  dateFrom,
  dateTo,
  flex,
  adults,
  bedrooms,
  checkedBags,
  departureCity,
  radius,
  driverAge,
  departureCities,
  kiwiDates,
  onDateFromChange,
  onDateToChange,
  onFlexChange,
  onAdultsChange,
  onBedroomsChange,
  onCheckedBagsChange,
  onDepartureCityChange,
  onRadiusChange,
  onDriverAgeChange
}) {
  const styles = {
    section: {
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '16px'
    },
    sectionTitle: {
      margin: '0 0 12px 0',
      fontSize: '14px',
      color: P3_COLORS.beige,
      fontWeight: '600'
    },
    row: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      gap: '12px'
    },
    field: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    label: {
      fontSize: '12px',
      color: 'rgba(255,255,255,0.6)'
    },
    input: {
      padding: '10px',
      borderRadius: '6px',
      border: '1px solid rgba(255,255,255,0.2)',
      background: 'rgba(255,255,255,0.1)',
      color: P3_COLORS.textLight,
      fontSize: '14px'
    },
    select: {
      padding: '10px',
      borderRadius: '6px',
      border: '1px solid rgba(255,255,255,0.2)',
      background: 'rgba(255,255,255,0.1)',
      color: P3_COLORS.textLight,
      fontSize: '14px',
      cursor: 'pointer'
    },
    option: {
      background: P3_COLORS.bgDark,
      color: P3_COLORS.textLight
    },
    calculated: {
      background: 'rgba(0, 123, 255, 0.1)',
      border: '1px solid rgba(0, 123, 255, 0.3)',
      borderRadius: '8px',
      padding: '12px',
      marginTop: '12px'
    },
    calcTitle: {
      fontSize: '12px',
      color: '#007bff',
      marginBottom: '8px',
      fontWeight: '600'
    },
    calcGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '8px',
      fontSize: '12px'
    },
    calcItem: {
      color: 'rgba(255,255,255,0.8)'
    },
    calcValue: {
      color: P3_COLORS.textLight,
      fontWeight: '600'
    }
  }

  const travelDays = dateFrom && dateTo ? daysBetween(dateFrom, dateTo) + 1 : 0

  return (
    <>
      {/* Reisezeitraum */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Reisezeitraum</h4>
        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>Frühester Hinflug</label>
            <input
              type="date"
              style={styles.input}
              value={dateFrom}
              onChange={(e) => onDateFromChange(e.target.value)}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Spätester Rückflug</label>
            <input
              type="date"
              style={styles.input}
              value={dateTo}
              onChange={(e) => onDateToChange(e.target.value)}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Flexibilität</label>
            <select
              style={styles.select}
              value={flex}
              onChange={(e) => onFlexChange(parseInt(e.target.value))}
            >
              <option value="1" style={styles.option}>±1 Tag</option>
              <option value="2" style={styles.option}>±2 Tage</option>
              <option value="3" style={styles.option}>±3 Tage</option>
              <option value="4" style={styles.option}>±4 Tage</option>
            </select>
          </div>
        </div>

        {kiwiDates && (
          <div style={styles.calculated}>
            <div style={styles.calcTitle}>Berechnete Suchdaten</div>
            <div style={styles.calcGrid}>
              <div style={styles.calcItem}>
                Kiwi Hinflug: <span style={styles.calcValue}>{formatDateDE(new Date(kiwiDates.kiwiHin))}</span>
              </div>
              <div style={styles.calcItem}>
                Kiwi Rückflug: <span style={styles.calcValue}>{formatDateDE(new Date(kiwiDates.kiwiRueck))}</span>
              </div>
              <div style={styles.calcItem}>
                Reisetage: <span style={styles.calcValue}>{travelDays} Tage</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reisende & Gepäck */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Reisende & Gepäck</h4>
        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>Erwachsene</label>
            <select
              style={styles.select}
              value={adults}
              onChange={(e) => onAdultsChange(parseInt(e.target.value))}
            >
              {[1,2,3,4,5].map(n => (
                <option key={n} value={n} style={styles.option}>{n}</option>
              ))}
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Schlafzimmer</label>
            <select
              style={styles.select}
              value={bedrooms}
              onChange={(e) => onBedroomsChange(parseInt(e.target.value))}
            >
              {[1,2,3,4].map(n => (
                <option key={n} value={n} style={styles.option}>{n}</option>
              ))}
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Aufgabegepäck</label>
            <select
              style={styles.select}
              value={checkedBags}
              onChange={(e) => onCheckedBagsChange(parseInt(e.target.value))}
            >
              <option value="0" style={styles.option}>0 (nur Handgepäck)</option>
              <option value="1" style={styles.option}>1</option>
              <option value="2" style={styles.option}>2</option>
              <option value="3" style={styles.option}>3</option>
            </select>
          </div>
        </div>
      </div>

      {/* Abflughafen */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Abflughafen</h4>
        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>Abflug-Zentrum</label>
            <select
              style={styles.select}
              value={departureCity}
              onChange={(e) => onDepartureCityChange(e.target.value)}
            >
              {departureCities.map(city => (
                <option key={city.id} value={city.id} style={styles.option}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Radius</label>
            <select
              style={styles.select}
              value={radius}
              onChange={(e) => onRadiusChange(parseInt(e.target.value))}
            >
              <option value="300" style={styles.option}>300 km</option>
              <option value="400" style={styles.option}>400 km</option>
              <option value="500" style={styles.option}>500 km</option>
              <option value="600" style={styles.option}>600 km</option>
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Fahrer-Alter</label>
            <input
              type="number"
              style={styles.input}
              value={driverAge}
              onChange={(e) => onDriverAgeChange(parseInt(e.target.value))}
              min="18"
              max="99"
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default TravelForm
