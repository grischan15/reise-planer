import { useState, useMemo, useCallback } from 'react'
import { useStorage } from '../shared/useStorage'
import destinationsData from '../../data/destinations.json'

const OVERRIDES_KEY = 'destination_overrides'

/**
 * Hook für Destinations-Daten mit User-Overrides
 * - Lädt Default-Daten aus JSON
 * - Merged mit localStorage-Korrekturen
 * - Ermöglicht Bearbeitung einzelner Felder
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
