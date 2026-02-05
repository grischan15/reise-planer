import { useState, useMemo } from 'react'
import ferienData from '../../data/ferien-hessen.json'
import { isPast, isCurrent, isWithinMonths, daysBetween } from '../utils/dateHelpers'

/**
 * Hook für Schulferien-Daten
 * - Filtert auf nächste 18 Monate
 * - Markiert vergangen/aktuell/zukünftig
 * - Jahr-Filter möglich
 */
export function useFerien(filterMonths = 18) {
  const [selectedYear, setSelectedYear] = useState(null) // null = alle

  // Ferien mit Status anreichern
  const enrichedFerien = useMemo(() => {
    return ferienData.ferien.map(ferien => ({
      ...ferien,
      tage: daysBetween(ferien.von, ferien.bis) + 1,
      isPast: isPast(ferien.bis),
      isCurrent: isCurrent(ferien.von, ferien.bis),
      isFuture: !isPast(ferien.bis) && !isCurrent(ferien.von, ferien.bis)
    }))
  }, [])

  // Gefilterte Ferien (18 Monate + Jahr-Filter)
  const filteredFerien = useMemo(() => {
    let result = enrichedFerien

    // Nur nächste X Monate
    if (filterMonths > 0) {
      result = result.filter(f => isWithinMonths(f.von, filterMonths))
    }

    // Jahr-Filter
    if (selectedYear) {
      result = result.filter(f => f.jahr === selectedYear)
    }

    return result
  }, [enrichedFerien, filterMonths, selectedYear])

  // Verfügbare Jahre
  const availableYears = useMemo(() => {
    const years = [...new Set(filteredFerien.map(f => f.jahr))]
    return years.sort()
  }, [filteredFerien])

  return {
    ferien: filteredFerien,
    allFerien: enrichedFerien,
    selectedYear,
    setSelectedYear,
    availableYears,
    bundesland: ferienData.bundesland
  }
}

export default useFerien
