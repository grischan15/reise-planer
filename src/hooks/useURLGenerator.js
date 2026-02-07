import { useState, useMemo, useCallback } from 'react'
import { calculateKiwiDates, formatDateISO } from '../utils/dateHelpers'
import { generateAllURLs } from '../utils/urlBuilders'

/**
 * Hook für URL-Generierung und Suchparameter
 *
 * Verwaltet alle Reise-Suchparameter (Datum, Reisende, Abflug, etc.)
 * und generiert Such-URLs für alle Portale.
 *
 * Unterstützte Portale:
 * - Kiwi.com (Flüge) - mit Flex-Datum-Berechnung
 * - Booking.com (Apartments)
 * - Airbnb (Unterkünfte)
 * - Kiwi Cars (Mietwagen)
 * - Auswärtiges Amt (Reisehinweise via Google)
 * - Wetter.de (Reisewetter via Google)
 *
 * @returns {Object} State, Setters und Actions
 * @returns {string} returns.dateFrom - Frühestes Hinflugdatum
 * @returns {string} returns.dateTo - Spätestes Rückflugdatum
 * @returns {number} returns.flex - Flexibilität in Tagen (1-4)
 * @returns {number} returns.adults - Anzahl Erwachsene
 * @returns {number} returns.bedrooms - Anzahl Schlafzimmer
 * @returns {number} returns.checkedBags - Anzahl Aufgabegepäck
 * @returns {string} returns.departureCity - Abflug-Stadt ID
 * @returns {number} returns.radius - Suchradius in km
 * @returns {number} returns.driverAge - Alter des Fahrers
 * @returns {Array} returns.urls - Generierte URL-Objekte
 * @returns {Object|null} returns.kiwiDates - Berechnete Kiwi-Flex-Daten
 * @returns {function} returns.generateURLs - URLs für Destination generieren
 * @returns {function} returns.openURL - Einzelne URL öffnen (index)
 * @returns {function} returns.openAllURLs - Alle URLs öffnen (async)
 * @returns {function} returns.copyURLs - URLs in Zwischenablage kopieren (async)
 * @returns {function} returns.setFerienDates - Ferien-Zeitraum übernehmen
 *
 * @example
 * const { dateFrom, setDateFrom, generateURLs, urls, openAllURLs } = useURLGenerator()
 */
export function useURLGenerator() {
  // Reisedaten
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [flex, setFlex] = useState(3)

  // Reisende
  const [adults, setAdults] = useState(3)
  const [bedrooms, setBedrooms] = useState(2)
  const [checkedBags, setCheckedBags] = useState(1)

  // Abflug
  const [departureCity, setDepartureCity] = useState('frankfurt-am-main')
  const [radius, setRadius] = useState(500)
  const [driverAge, setDriverAge] = useState(35)

  // Generierte URLs
  const [urls, setUrls] = useState([])

  // Berechnete Kiwi-Daten
  const kiwiDates = useMemo(() => {
    if (!dateFrom || !dateTo) return null
    return calculateKiwiDates(dateFrom, dateTo, flex)
  }, [dateFrom, dateTo, flex])

  // URLs generieren
  const generateURLs = useCallback((destination) => {
    if (!destination || !dateFrom || !dateTo) {
      return []
    }

    const { kiwiHin, kiwiRueck } = calculateKiwiDates(dateFrom, dateTo, flex)

    const generated = generateAllURLs({
      destination,
      dateFrom,
      dateTo,
      kiwiHin,
      kiwiRueck,
      flex,
      adults,
      bedrooms,
      checkedBags,
      departureCity,
      radius,
      driverAge
    })

    setUrls(generated)
    return generated
  }, [dateFrom, dateTo, flex, adults, bedrooms, checkedBags, departureCity, radius, driverAge])

  // Einzelnen Tab öffnen
  const openURL = useCallback((index) => {
    if (urls[index]) {
      window.open(urls[index].url, '_blank', 'noopener,noreferrer')
    }
  }, [urls])

  // Alle Tabs öffnen (mit Verzögerung gegen Popup-Blocker)
  const openAllURLs = useCallback(async () => {
    let opened = 0
    let blocked = 0

    for (let i = 0; i < urls.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300))
      try {
        const win = window.open(urls[i].url, '_blank', 'noopener,noreferrer')
        if (win) {
          opened++
        } else {
          blocked++
        }
      } catch {
        blocked++
      }
    }

    return { opened, blocked }
  }, [urls])

  // Alle URLs als Text kopieren
  const copyURLs = useCallback(async () => {
    const text = urls.map(u => `${u.icon} ${u.name}\n${u.url}`).join('\n\n')
    await navigator.clipboard.writeText(text)
    return text
  }, [urls])

  // Ferien-Zeitraum setzen
  const setFerienDates = useCallback((von, bis) => {
    setDateFrom(von)
    setDateTo(bis)
  }, [])

  return {
    // State
    dateFrom,
    dateTo,
    flex,
    adults,
    bedrooms,
    checkedBags,
    departureCity,
    radius,
    driverAge,
    urls,
    kiwiDates,

    // Setters
    setDateFrom,
    setDateTo,
    setFlex,
    setAdults,
    setBedrooms,
    setCheckedBags,
    setDepartureCity,
    setRadius,
    setDriverAge,
    setFerienDates,

    // Actions
    generateURLs,
    openURL,
    openAllURLs,
    copyURLs
  }
}

export default useURLGenerator
