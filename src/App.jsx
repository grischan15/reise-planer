import { useState } from 'react'
import { P3_COLORS } from './shared/p3-theme'

// Hooks
import { useFerien } from './hooks/useFerien'
import { useDestinations } from './hooks/useDestinations'
import { useURLGenerator } from './hooks/useURLGenerator'

// Components
import { FerienPicker } from './components/FerienPicker'
import { DestinationSelect } from './components/DestinationSelect'
import { DestinationEditor } from './components/DestinationEditor'
import { TravelForm } from './components/TravelForm'
import { URLResultList } from './components/URLResultList'

function App() {
  // Hooks
  const {
    ferien,
    availableYears,
    selectedYear,
    setSelectedYear
  } = useFerien(18)

  const {
    destinations,
    departureCities,
    selectedId,
    setSelectedId,
    selectedDestination,
    updateDestination,
    resetDestination,
    getOriginalValue
  } = useDestinations()

  const {
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
    generateURLs,
    openURL,
    openAllURLs,
    copyURLs
  } = useURLGenerator()

  // Local state
  const [showEditor, setShowEditor] = useState(false)

  // Handlers
  const handleFerienSelect = (von, bis) => {
    setFerienDates(von, bis)
  }

  const handleGenerate = () => {
    if (!selectedDestination) {
      alert('Bitte Reiseziel auswählen!')
      return
    }
    if (!dateFrom || !dateTo) {
      alert('Bitte Reisezeitraum eingeben!')
      return
    }
    generateURLs(selectedDestination)
  }

  // Styles
  const styles = {
    app: {
      minHeight: '100vh',
      background: P3_COLORS.bgDark,
      color: P3_COLORS.textLight,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    container: {
      maxWidth: '900px',
      margin: '0 auto',
      padding: '20px'
    },
    header: {
      marginBottom: '24px',
      paddingBottom: '16px',
      borderBottom: `2px solid ${P3_COLORS.red}`
    },
    title: {
      margin: 0,
      fontSize: '24px',
      color: P3_COLORS.textLight,
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    version: {
      fontSize: '12px',
      color: P3_COLORS.beige,
      fontWeight: 'normal'
    },
    section: {
      marginBottom: '20px'
    },
    generateBtn: {
      width: '100%',
      padding: '16px',
      borderRadius: '10px',
      border: 'none',
      background: P3_COLORS.red,
      color: 'white',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px'
    },
    generateBtnDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    }
  }

  const canGenerate = selectedDestination && dateFrom && dateTo

  return (
    <div style={styles.app}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>
            Reise-Planer
            <span style={styles.version}>v2.0</span>
          </h1>
        </header>

        {/* Ferien-Auswahl */}
        <section style={styles.section}>
          <FerienPicker
            ferien={ferien}
            availableYears={availableYears}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            onSelect={handleFerienSelect}
            selectedFrom={dateFrom}
            selectedTo={dateTo}
          />
        </section>

        {/* Destination */}
        <section style={styles.section}>
          <DestinationSelect
            destinations={destinations}
            selectedId={selectedId}
            onChange={setSelectedId}
            onEditClick={() => setShowEditor(true)}
          />
        </section>

        {/* Travel Form */}
        <TravelForm
          dateFrom={dateFrom}
          dateTo={dateTo}
          flex={flex}
          adults={adults}
          bedrooms={bedrooms}
          checkedBags={checkedBags}
          departureCity={departureCity}
          radius={radius}
          driverAge={driverAge}
          departureCities={departureCities}
          kiwiDates={kiwiDates}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
          onFlexChange={setFlex}
          onAdultsChange={setAdults}
          onBedroomsChange={setBedrooms}
          onCheckedBagsChange={setCheckedBags}
          onDepartureCityChange={setDepartureCity}
          onRadiusChange={setRadius}
          onDriverAgeChange={setDriverAge}
        />

        {/* Generate Button */}
        <button
          style={{
            ...styles.generateBtn,
            ...(canGenerate ? {} : styles.generateBtnDisabled)
          }}
          onClick={handleGenerate}
          disabled={!canGenerate}
        >
          URLs generieren
        </button>

        {/* Results */}
        {urls.length > 0 && selectedDestination && (
          <URLResultList
            urls={urls}
            destination={selectedDestination}
            dateFrom={dateFrom}
            dateTo={dateTo}
            adults={adults}
            onOpenURL={openURL}
            onOpenAll={openAllURLs}
            onCopyAll={copyURLs}
          />
        )}

        {/* Destination Editor Modal */}
        <DestinationEditor
          isOpen={showEditor}
          onClose={() => setShowEditor(false)}
          destination={selectedDestination}
          onSave={updateDestination}
          onReset={resetDestination}
          getOriginalValue={getOriginalValue}
        />
      </div>
    </div>
  )
}

export default App
