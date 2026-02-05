/**
 * URL-Builder für verschiedene Reiseportale
 */

/**
 * Generiert Gepäck-String für Kiwi
 * z.B. "1.1_1.0_1.0-" für 3 Personen, 1 Aufgabegepäck
 */
export function generateBagsString(adults, checkedBags) {
  const bags = []
  for (let i = 0; i < adults; i++) {
    bags.push(i < checkedBags ? '1.1' : '1.0')
  }
  return bags.join('_') + '-'
}

/**
 * Kiwi.com Flugsuche URL
 */
export function buildKiwiURL({ departureCity, radius, destination, kiwiHin, kiwiRueck, flex, adults, bagsString }) {
  return `https://www.kiwi.com/de/search/results/${departureCity}-deutschland-${radius}km/${destination.kiwiSlug}/${kiwiHin}_flex${flex}/${kiwiRueck}_flex${flex}/?returnToDifferentAirport=false&adults=${adults}&children=0&infants=0&bags=${bagsString}`
}

/**
 * Booking.com Unterkunftssuche URL
 */
export function buildBookingURL({ destination, checkin, checkout, adults, bedrooms }) {
  return `https://www.booking.com/searchresults.de.html?ss=${destination.bookingFormat}&checkin=${checkin}&checkout=${checkout}&group_adults=${adults}&no_rooms=${bedrooms}&nflt=ht_id%3D201%3Bentire_place_bedroom_count%3D${bedrooms}`
}

/**
 * Airbnb Unterkunftssuche URL
 */
export function buildAirbnbURL({ destination, checkin, checkout, adults, bedrooms }) {
  return `https://www.airbnb.de/s/${destination.airbnbFormat}/homes?checkin=${checkin}&checkout=${checkout}&adults=${adults}&min_bedrooms=${bedrooms}`
}

/**
 * Kiwi Cars Mietwagensuche URL
 */
export function buildKiwiCarsURL({ destination, puDate, doDate, driverAge }) {
  const pu = new Date(puDate)
  const dropoff = new Date(doDate)

  return `https://cars.kiwi.com/search-results?preflang=de&locationName=${destination.name}&dropLocationName=${destination.name}&coordinates=${destination.lat}%2C${destination.lon}&dropCoordinates=${destination.lat}%2C${destination.lon}&driversAge=${driverAge}&puDay=${pu.getDate()}&puMonth=${pu.getMonth() + 1}&puYear=${pu.getFullYear()}&puMinute=0&puHour=10&doDay=${dropoff.getDate()}&doMonth=${dropoff.getMonth() + 1}&doYear=${dropoff.getFullYear()}&doMinute=0&doHour=10&ftsType=C&dropFtsType=C`
}

/**
 * Google Suche für Auswärtiges Amt Reisehinweise
 */
export function buildReisehinweiseURL({ destination }) {
  const query = encodeURIComponent(`auswärtiges amt reisehinweise ${destination.countryDE}`)
  return `https://www.google.de/search?q=${query}`
}

/**
 * Google Suche für Wetter
 */
export function buildWetterURL({ destination }) {
  const query = encodeURIComponent(`wetter.de reisewetter ${destination.name} ${destination.countryDE}`)
  return `https://www.google.de/search?q=${query}`
}

/**
 * Generiert alle URLs für eine Suche
 */
export function generateAllURLs(params) {
  const {
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
  } = params

  const bagsString = generateBagsString(adults, checkedBags)

  return [
    {
      type: 'flight',
      name: 'Kiwi.com - Flüge',
      shortName: 'Flüge',
      icon: '✈️',
      color: '#007bff',
      url: buildKiwiURL({ departureCity, radius, destination, kiwiHin, kiwiRueck, flex, adults, bagsString })
    },
    {
      type: 'accommodation',
      name: 'Booking.com - Apartments',
      shortName: 'Booking',
      icon: '🏨',
      color: '#28a745',
      url: buildBookingURL({ destination, checkin: dateFrom, checkout: dateTo, adults, bedrooms })
    },
    {
      type: 'accommodation',
      name: 'Airbnb - Unterkünfte',
      shortName: 'Airbnb',
      icon: '🏠',
      color: '#28a745',
      url: buildAirbnbURL({ destination, checkin: dateFrom, checkout: dateTo, adults, bedrooms })
    },
    {
      type: 'car',
      name: 'Kiwi Cars - Mietwagen',
      shortName: 'Mietwagen',
      icon: '🚗',
      color: '#ffc107',
      url: buildKiwiCarsURL({ destination, puDate: dateFrom, doDate: dateTo, driverAge })
    },
    {
      type: 'info',
      name: 'Auswärtiges Amt - Reisehinweise',
      shortName: 'Reisehinweise',
      icon: '⚠️',
      color: '#dc3545',
      url: buildReisehinweiseURL({ destination })
    },
    {
      type: 'info',
      name: 'Wetter.de - Reisewetter',
      shortName: 'Wetter',
      icon: '🌤️',
      color: '#dc3545',
      url: buildWetterURL({ destination })
    }
  ]
}
