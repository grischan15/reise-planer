import { useState } from 'react'
import { P3_COLORS } from '../shared/p3-theme'

/**
 * Liste der generierten URLs mit Aktionen
 */
export function URLResultList({
  urls,
  destination,
  dateFrom,
  dateTo,
  adults,
  onOpenURL,
  onOpenAll,
  onCopyAll
}) {
  const [status, setStatus] = useState(null)
  const [copying, setCopying] = useState(false)

  const styles = {
    container: {
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '12px',
      padding: '16px'
    },
    header: {
      marginBottom: '16px'
    },
    summary: {
      background: 'rgba(0, 123, 255, 0.1)',
      border: '1px solid rgba(0, 123, 255, 0.3)',
      borderRadius: '8px',
      padding: '12px',
      marginBottom: '16px',
      fontSize: '14px',
      color: P3_COLORS.textLight
    },
    actions: {
      display: 'flex',
      gap: '10px',
      marginBottom: '16px',
      flexWrap: 'wrap'
    },
    btnPrimary: {
      padding: '12px 20px',
      borderRadius: '8px',
      border: 'none',
      background: P3_COLORS.red,
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    btnSecondary: {
      padding: '12px 20px',
      borderRadius: '8px',
      border: '1px solid rgba(255,255,255,0.2)',
      background: 'transparent',
      color: P3_COLORS.beige,
      fontSize: '14px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    quickLinks: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
      marginBottom: '16px'
    },
    quickLink: (color) => ({
      padding: '8px 14px',
      borderRadius: '6px',
      border: 'none',
      background: color,
      color: color === '#ffc107' ? '#333' : 'white',
      fontSize: '13px',
      cursor: 'pointer',
      fontWeight: '500'
    }),
    urlList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    },
    urlItem: (color) => ({
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '8px',
      padding: '12px',
      borderLeft: `4px solid ${color}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: '12px'
    }),
    urlContent: {
      flex: 1,
      minWidth: 0
    },
    urlTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: P3_COLORS.textLight,
      marginBottom: '4px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    urlLink: {
      fontSize: '11px',
      color: 'rgba(255,255,255,0.5)',
      wordBreak: 'break-all'
    },
    urlBtn: {
      padding: '8px 14px',
      borderRadius: '6px',
      border: 'none',
      background: 'rgba(255,255,255,0.1)',
      color: P3_COLORS.beige,
      fontSize: '12px',
      cursor: 'pointer',
      whiteSpace: 'nowrap'
    },
    status: (type) => ({
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '16px',
      background: type === 'success'
        ? 'rgba(40, 167, 69, 0.2)'
        : 'rgba(255, 193, 7, 0.2)',
      border: `1px solid ${type === 'success' ? '#28a745' : '#ffc107'}`,
      fontSize: '13px',
      color: P3_COLORS.textLight
    })
  }

  const handleOpenAll = async () => {
    setStatus({ type: 'loading', message: `Öffne ${urls.length} Tabs...` })
    const result = await onOpenAll()
    if (result.blocked === 0) {
      setStatus({ type: 'success', message: `Alle ${result.opened} Tabs geöffnet!` })
    } else {
      setStatus({
        type: 'warning',
        message: `${result.opened} von ${urls.length} Tabs geöffnet. ${result.blocked} blockiert - nutze die Buttons unten.`
      })
    }
  }

  const handleCopy = async () => {
    setCopying(true)
    await onCopyAll()
    setCopying(false)
    setStatus({ type: 'success', message: 'URLs in Zwischenablage kopiert!' })
    setTimeout(() => setStatus(null), 3000)
  }

  if (urls.length === 0) return null

  const formatDate = (d) => new Date(d).toLocaleDateString('de-DE')
  const days = Math.ceil((new Date(dateTo) - new Date(dateFrom)) / (1000*60*60*24)) + 1

  return (
    <div style={styles.container}>
      <div style={styles.summary}>
        <strong>{destination.name}, {destination.country}</strong><br/>
        {formatDate(dateFrom)} - {formatDate(dateTo)} ({days} Tage) | {adults} Reisende
      </div>

      <div style={styles.actions}>
        <button style={styles.btnPrimary} onClick={handleOpenAll}>
          Alle Tabs öffnen ({urls.length})
        </button>
        <button style={styles.btnSecondary} onClick={handleCopy}>
          {copying ? 'Kopiert!' : 'URLs kopieren'}
        </button>
      </div>

      {status && (
        <div style={styles.status(status.type)}>
          {status.message}
        </div>
      )}

      <div style={styles.quickLinks}>
        {urls.map((url, i) => (
          <button
            key={i}
            style={styles.quickLink(url.color)}
            onClick={() => onOpenURL(i)}
          >
            {url.icon} {url.shortName}
          </button>
        ))}
      </div>

      <div style={styles.urlList}>
        {urls.map((url, i) => (
          <div key={i} style={styles.urlItem(url.color)}>
            <div style={styles.urlContent}>
              <div style={styles.urlTitle}>
                {url.icon} {url.name}
              </div>
              <div style={styles.urlLink}>{url.url}</div>
            </div>
            <button style={styles.urlBtn} onClick={() => onOpenURL(i)}>
              Öffnen
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default URLResultList
