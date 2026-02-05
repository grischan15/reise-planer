/**
 * Datum-Hilfsfunktionen für den Reise-Planer
 */

/**
 * Addiert Tage zu einem Datum
 */
export function addDays(date, days) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/**
 * Formatiert Datum als YYYY-MM-DD (für URLs)
 */
export function formatDateISO(date) {
  return date.toISOString().split('T')[0]
}

/**
 * Formatiert Datum als DD.MM.YYYY (für Anzeige)
 */
export function formatDateDE(date) {
  return date.toLocaleDateString('de-DE')
}

/**
 * Berechnet Anzahl Tage zwischen zwei Daten
 */
export function daysBetween(from, to) {
  const fromDate = new Date(from)
  const toDate = new Date(to)
  return Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24))
}

/**
 * Prüft ob ein Datum in der Vergangenheit liegt
 */
export function isPast(dateStr) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(dateStr) < today
}

/**
 * Prüft ob ein Datum-Bereich aktuell ist (heute darin)
 */
export function isCurrent(fromStr, toStr) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const from = new Date(fromStr)
  const to = new Date(toStr)
  return today >= from && today <= to
}

/**
 * Prüft ob ein Datum innerhalb der nächsten X Monate liegt
 */
export function isWithinMonths(dateStr, months) {
  const date = new Date(dateStr)
  const limit = new Date()
  limit.setMonth(limit.getMonth() + months)
  return date <= limit
}

/**
 * Berechnet Kiwi-Daten mit Flex-Offset
 * Hinflug: frühestes Datum + flex
 * Rückflug: spätestes Datum - flex
 */
export function calculateKiwiDates(dateFrom, dateTo, flex) {
  const fromDate = new Date(dateFrom)
  const toDate = new Date(dateTo)

  return {
    kiwiHin: formatDateISO(addDays(fromDate, flex)),
    kiwiRueck: formatDateISO(addDays(toDate, -flex))
  }
}
