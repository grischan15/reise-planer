import { useState, useEffect } from 'react'
import { P3_COLORS } from '../shared/p3-theme'
import { P3Modal } from '../shared/components/P3Modal'

/**
 * Modal zum Bearbeiten von Destination-Daten
 */
export function DestinationEditor({
  isOpen,
  onClose,
  destination,
  onSave,
  onReset,
  getOriginalValue
}) {
  const [formData, setFormData] = useState({})

  useEffect(() => {
    if (destination) {
      setFormData({
        kiwiSlug: destination.kiwiSlug || '',
        airbnbFormat: destination.airbnbFormat || '',
        bookingFormat: destination.bookingFormat || '',
        lat: destination.lat || '',
        lon: destination.lon || ''
      })
    }
  }, [destination])

  if (!destination) return null

  const styles = {
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    field: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    label: {
      fontSize: '12px',
      color: P3_COLORS.beige,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    input: {
      padding: '10px',
      borderRadius: '6px',
      border: '1px solid rgba(255,255,255,0.2)',
      background: 'rgba(255,255,255,0.1)',
      color: P3_COLORS.textLight,
      fontSize: '13px'
    },
    original: {
      fontSize: '10px',
      color: 'rgba(255,255,255,0.4)',
      cursor: 'pointer'
    },
    modified: {
      color: '#ffc107'
    },
    buttons: {
      display: 'flex',
      gap: '10px',
      marginTop: '10px'
    },
    btnSave: {
      flex: 1,
      padding: '12px',
      borderRadius: '8px',
      border: 'none',
      background: P3_COLORS.red,
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer'
    },
    btnReset: {
      padding: '12px 16px',
      borderRadius: '8px',
      border: '1px solid rgba(255,255,255,0.2)',
      background: 'transparent',
      color: P3_COLORS.beige,
      fontSize: '14px',
      cursor: 'pointer'
    },
    info: {
      padding: '10px',
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '6px',
      fontSize: '11px',
      color: 'rgba(255,255,255,0.6)'
    }
  }

  const fields = [
    { key: 'kiwiSlug', label: 'Kiwi Slug', placeholder: 'z.B. antalya-turkei' },
    { key: 'airbnbFormat', label: 'Airbnb Format', placeholder: 'z.B. Antalya--T%C3%BCrkei' },
    { key: 'bookingFormat', label: 'Booking Format', placeholder: 'z.B. Antalya%2C+T%C3%BCrkei' },
    { key: 'lat', label: 'Latitude', placeholder: 'z.B. 36.8969', type: 'number' },
    { key: 'lon', label: 'Longitude', placeholder: 'z.B. 30.7133', type: 'number' }
  ]

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    Object.entries(formData).forEach(([key, value]) => {
      const original = getOriginalValue(destination.id, key)
      if (value !== original && value !== '') {
        onSave(destination.id, key, key === 'lat' || key === 'lon' ? parseFloat(value) : value)
      }
    })
    onClose()
  }

  const handleReset = () => {
    onReset(destination.id)
    onClose()
  }

  const isModified = (key) => {
    const original = getOriginalValue(destination.id, key)
    return formData[key] !== original && formData[key] !== ''
  }

  return (
    <P3Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${destination.name}, ${destination.country}`}
    >
      <div style={styles.info}>
        Hier kannst du die URL-Formate korrigieren, falls die generierten Links nicht funktionieren.
        Änderungen werden lokal gespeichert.
      </div>

      <form style={styles.form} onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        {fields.map(({ key, label, placeholder, type }) => (
          <div key={key} style={styles.field}>
            <label style={styles.label}>
              <span style={isModified(key) ? styles.modified : {}}>
                {label} {isModified(key) && '●'}
              </span>
              <span
                style={styles.original}
                onClick={() => handleChange(key, getOriginalValue(destination.id, key))}
                title="Original wiederherstellen"
              >
                Original: {getOriginalValue(destination.id, key)}
              </span>
            </label>
            <input
              type={type || 'text'}
              style={styles.input}
              value={formData[key] || ''}
              onChange={(e) => handleChange(key, e.target.value)}
              placeholder={placeholder}
              step={type === 'number' ? '0.0001' : undefined}
            />
          </div>
        ))}

        <div style={styles.buttons}>
          {destination.hasOverride && (
            <button type="button" style={styles.btnReset} onClick={handleReset}>
              Zurücksetzen
            </button>
          )}
          <button type="submit" style={styles.btnSave}>
            Speichern
          </button>
        </div>
      </form>
    </P3Modal>
  )
}

export default DestinationEditor
