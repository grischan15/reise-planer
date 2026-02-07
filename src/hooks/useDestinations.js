import { useState, useMemo, useCallback } from 'react'
import { useStorage } from '../shared/useStorage'
import destinationsData from '../../data/destinations.json'

/** localStorage Key für User-Overrides */
const OVERRIDES_KEY = 'destination_overrides'

/**
 * Hook für Destinations-Daten mit User-Overrides
 *
 * Lädt Reiseziele aus JSON und merged sie mit localStorage-Korrekturen.
 * Ermöglicht Benutzern, fehlerhafte URL-Formate zu korrigieren.
 *
 * Datenquelle: data/destinations.json (15+ Ziele)
 * Overrides: localStorage['destination_overrides']
 *
 * @returns {Object} Destinations-State und -Actions
 * @returns {Array<Object>} returns.destinations - Alle Ziele (mit Overrides gemerged)
 * @returns {Array<Object>} returns.departureCities - Abflug-Städte
 * @returns {string} returns.selectedId - Aktuell gewählte Destination-ID
 * @returns {function} returns.setSelectedId - Destination auswählen
 * @returns {Object|null} returns.selectedDestination - Gewählte Destination
 * @returns {function} returns.updateDestination - Feld überschreiben (destId, field, value)
 * @returns {function} returns.resetDestination - Overrides löschen (destId)
 * @returns {function} returns.getOriginalValue - Originalwert holen (destId, field)
 *
 * @example
 * const { destinations, selectedId, setSelectedId, updateDestination } = useDestinations()
 */
export function useDestinations() {
  const [overrides, setOverrides] = useStorage(OVERRIDES_KEY, {})
  const [selectedId, setSelectedId] = useState('')

  // Destinations mit Overrides mergen
  const destinations = useMemo(() => {
    return destinationsData.destinations.map(dest => {
      const override = overrides[dest.id] || {}
      return {
        ...dest,
        ...override,
        hasOverride: Object.keys(override).length > 0
      }
    })
  }, [overrides])

  // Aktuell ausgewählte Destination
  const selectedDestination = useMemo(() => {
    return destinations.find(d => d.id === selectedId) || null
  }, [destinations, selectedId])

  // Destination-Feld überschreiben
  const updateDestination = useCallback((destId, field, value) => {
    setOverrides(prev => ({
      ...prev,
      [destId]: {
        ...(prev[destId] || {}),
        [field]: value
      }
    }))
  }, [setOverrides])

  // Alle Overrides einer Destination löschen
  const resetDestination = useCallback((destId) => {
    setOverrides(prev => {
      const next = { ...prev }
      delete next[destId]
      return next
    })
  }, [setOverrides])

  // Original-Wert einer Destination holen
  const getOriginalValue = useCallback((destId, field) => {
    const original = destinationsData.destinations.find(d => d.id === destId)
    return original ? original[field] : null
  }, [])

  return {
    destinations,
    departureCities: destinationsData.departureCities,
    selectedId,
    setSelectedId,
    selectedDestination,
    updateDestination,
    resetDestination,
    getOriginalValue,
    overrides
  }
}

export default useDestinations
