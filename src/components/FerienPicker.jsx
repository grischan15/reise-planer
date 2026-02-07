import { P3_COLORS } from '../shared/p3-theme'
import { formatDateDE, daysBetween } from '../utils/dateHelpers'

/**
 * Ferien-Auswahl Komponente
 *
 * Zeigt Schulferien (Hessen) als anklickbare Karten mit Jahr-Filter.
 * Ein Klick auf eine Ferienkarte übernimmt den Zeitraum ins Suchformular.
 *
 * @component
 * @param {Object} props
 * @param {Array<Object>} props.ferien - Array von Ferien-Objekten (aus useFerien Hook)
 * @param {Array<number>} props.availableYears - Verfügbare Jahre für Filter-Tabs
 * @param {number|null} props.selectedYear - Aktuell gefiltertes Jahr (null = alle)
 * @param {function} props.onYearChange - Callback wenn Jahr-Tab geklickt wird
 * @param {function} props.onSelect - Callback(von, bis) wenn Ferien ausgewählt werden
 * @param {string} props.selectedFrom - Aktuell gewähltes Startdatum (für Hervorhebung)
 * @param {string} props.selectedTo - Aktuell gewähltes Enddatum (für Hervorhebung)
 *
 * @example
 * <FerienPicker
 *   ferien={ferien}
 *   availableYears={[2026, 2027]}
 *   selectedYear={2026}
 *   onYearChange={setSelectedYear}
 *   onSelect={(von, bis) => setDates(von, bis)}
 *   selectedFrom={dateFrom}
 *   selectedTo={dateTo}
 * />
 */
export function FerienPicker({
  ferien,
  availableYears,
  selectedYear,
  onYearChange,
  onSelect,
  selectedFrom,
  selectedTo
}) {
  const styles = {
    container: {
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '20px'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
      flexWrap: 'wrap',
      gap: '10px'
    },
    title: {
      margin: 0,
      fontSize: '16px',
      color: P3_COLORS.beige
    },
    yearTabs: {
      display: 'flex',
      gap: '8px'
    },
    yearTab: (active) => ({
      padding: '6px 14px',
      border: 'none',
      borderRadius: '20px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: active ? '600' : '400',
      background: active ? P3_COLORS.red : 'rgba(255,255,255,0.1)',
      color: active ? 'white' : P3_COLORS.beige,
      transition: 'all 0.2s'
    }),
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
      gap: '10px'
    },
    card: (ferien, isSelected) => ({
      padding: '12px',
      borderRadius: '8px',
      cursor: ferien.isPast ? 'not-allowed' : 'pointer',
      opacity: ferien.isPast ? 0.4 : 1,
      background: isSelected
        ? P3_COLORS.red
        : ferien.isCurrent
          ? 'rgba(40, 167, 69, 0.3)'
          : 'rgba(255,255,255,0.1)',
      border: isSelected
        ? `2px solid ${P3_COLORS.red}`
        : ferien.isCurrent
          ? '2px solid #28a745'
          : '2px solid transparent',
      transition: 'all 0.2s',
      textAlign: 'center'
    }),
    emoji: {
      fontSize: '24px',
      marginBottom: '4px'
    },
    name: {
      fontSize: '13px',
      fontWeight: '600',
      color: P3_COLORS.textLight,
      marginBottom: '4px'
    },
    dates: {
      fontSize: '11px',
      color: P3_COLORS.beige,
      marginBottom: '2px'
    },
    days: {
      fontSize: '10px',
      color: 'rgba(255,255,255,0.5)'
    },
    badge: {
      display: 'inline-block',
      padding: '2px 6px',
      borderRadius: '10px',
      fontSize: '9px',
      fontWeight: '600',
      marginTop: '4px'
    },
    currentBadge: {
      background: '#28a745',
      color: 'white'
    }
  }

  const isSelected = (f) => {
    return selectedFrom === f.von && selectedTo === f.bis
  }

  const handleClick = (f) => {
    if (f.isPast) return
    onSelect(f.von, f.bis)
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Schulferien Hessen</h3>
        <div style={styles.yearTabs}>
          <button
            style={styles.yearTab(!selectedYear)}
            onClick={() => onYearChange(null)}
          >
            Alle
          </button>
          {availableYears.map(year => (
            <button
              key={year}
              style={styles.yearTab(selectedYear === year)}
              onClick={() => onYearChange(year)}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.grid}>
        {ferien.map(f => (
          <div
            key={f.id}
            style={styles.card(f, isSelected(f))}
            onClick={() => handleClick(f)}
          >
            <div style={styles.emoji}>{f.emoji}</div>
            <div style={styles.name}>{f.name}</div>
            <div style={styles.dates}>
              {formatDateDE(new Date(f.von))} - {formatDateDE(new Date(f.bis))}
            </div>
            <div style={styles.days}>{f.tage} Tage</div>
            {f.isCurrent && (
              <span style={{...styles.badge, ...styles.currentBadge}}>JETZT</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default FerienPicker
