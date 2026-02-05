import { P3_COLORS } from '../shared/p3-theme'

/**
 * Destination-Auswahl mit Edit-Button
 */
export function DestinationSelect({
  destinations,
  selectedId,
  onChange,
  onEditClick
}) {
  const styles = {
    container: {
      display: 'flex',
      gap: '10px',
      alignItems: 'flex-end'
    },
    group: {
      flex: 1
    },
    label: {
      display: 'block',
      marginBottom: '6px',
      fontSize: '14px',
      fontWeight: '600',
      color: P3_COLORS.beige
    },
    select: {
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      border: '2px solid rgba(255,255,255,0.2)',
      background: 'rgba(255,255,255,0.1)',
      color: P3_COLORS.textLight,
      fontSize: '14px',
      cursor: 'pointer'
    },
    option: {
      background: P3_COLORS.bgDark,
      color: P3_COLORS.textLight
    },
    editBtn: {
      padding: '12px 16px',
      borderRadius: '8px',
      border: 'none',
      background: 'rgba(255,255,255,0.1)',
      color: P3_COLORS.beige,
      cursor: 'pointer',
      fontSize: '14px',
      whiteSpace: 'nowrap',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    badge: {
      display: 'inline-block',
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: '#ffc107',
      marginLeft: '6px'
    }
  }

  const selected = destinations.find(d => d.id === selectedId)

  return (
    <div style={styles.container}>
      <div style={styles.group}>
        <label style={styles.label}>Reiseziel</label>
        <select
          style={styles.select}
          value={selectedId}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="" style={styles.option}>-- Bitte wählen --</option>
          {destinations.map(d => (
            <option key={d.id} value={d.id} style={styles.option}>
              {d.name}, {d.country} {d.hasOverride ? '●' : ''}
            </option>
          ))}
        </select>
      </div>

      {selectedId && (
        <button
          style={styles.editBtn}
          onClick={onEditClick}
          title="Zieldaten bearbeiten"
        >
          ✏️ Edit
          {selected?.hasOverride && <span style={styles.badge} />}
        </button>
      )}
    </div>
  )
}

export default DestinationSelect
