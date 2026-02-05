// ============================================
// useStorage - localStorage Hook
// 🔄 WIEDERVERWENDBAR für alle P3 Apps
// Version: 1.2 - Mit lastReportDate
// ============================================

import { useState, useEffect, useCallback } from 'react';

/**
 * Hook für persistente Datenspeicherung in localStorage
 * 
 * @param {string} key - Schlüssel für localStorage
 * @param {any} initialValue - Initialwert falls nichts gespeichert
 * @returns {[any, Function, Function]} - [value, setValue, removeValue]
 * 
 * @example
 * const [cravings, setCravings] = useStorage('cravings', []);
 * setCravings([...cravings, newCraving]);
 */
export function useStorage(key, initialValue) {
  // State initialisieren mit Wert aus localStorage oder initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Fehler beim Laden von "${key}":`, error);
      return initialValue;
    }
  });

  // Wert setzen und in localStorage speichern
  const setValue = useCallback((value) => {
    try {
      // Funktion oder direkter Wert?
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Fehler beim Speichern von "${key}":`, error);
    }
  }, [key, storedValue]);

  // Wert entfernen
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Fehler beim Entfernen von "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

/**
 * Hook für die Craving-App Datenstruktur
 * Bietet typisierte Methoden für Cravings und Rückfälle
 * 
 * @returns {Object} - Methoden und Daten für Craving-Tracking
 */
export function useCravingStorage() {
  const [cravings, setCravings] = useStorage('p3_cravings', []);
  const [relapses, setRelapses] = useStorage('p3_relapses', []);
  const [settings, setSettings] = useStorage('p3_settings', {
    startDate: new Date().toISOString().split('T')[0],
    theme: 'dark',
    autoSaveDelay: 3000,
    hapticFeedback: true,
    lastReportDate: null,  // NEU: Wann wurde zuletzt ein Report geteilt?
  });

  // Craving hinzufügen
  const addCraving = useCallback((craving) => {
    const newCraving = {
      id: `crv_${Date.now()}`,
      timestamp: new Date().toISOString(),
      intensity: craving.intensity,
      zone: craving.zone,
      energy: craving.energy || null,
      triggers: craving.triggers || [],
    };
    setCravings(prev => [...prev, newCraving]);
    return newCraving;
  }, [setCravings]);

  // Rückfall hinzufügen
  const addRelapse = useCallback((relapse) => {
    const newRelapse = {
      id: `rel_${Date.now()}`,
      timestamp: new Date().toISOString(),
      quantity: relapse.quantity,
      energy: relapse.energy || null,
      triggers: relapse.triggers || [],
    };
    setRelapses(prev => [...prev, newRelapse]);
    return newRelapse;
  }, [setRelapses]);

  // Letzten Rückfall finden
  const getLastRelapse = useCallback(() => {
    if (relapses.length === 0) return null;
    return relapses.reduce((latest, current) => 
      new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest
    );
  }, [relapses]);

  // Tage clean berechnen
  const getDaysClean = useCallback(() => {
    const lastRelapse = getLastRelapse();
    const startDate = lastRelapse 
      ? new Date(lastRelapse.timestamp)
      : new Date(settings.startDate);
    
    const now = new Date();
    const diffTime = Math.abs(now - startDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, [getLastRelapse, settings.startDate]);

  // Cravings für heute
  const getTodaysCravings = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return cravings.filter(c => c.timestamp.startsWith(today));
  }, [cravings]);

  // Cravings für diese Woche
  const getWeeksCravings = useCallback(() => {
    const now = new Date();
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    return cravings.filter(c => new Date(c.timestamp) >= weekAgo);
  }, [cravings]);

  // Cravings für letzten Monat
  const getMonthsCravings = useCallback(() => {
    const now = new Date();
    const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
    return cravings.filter(c => new Date(c.timestamp) >= monthAgo);
  }, [cravings]);

  // NEU: Cravings für bestimmte Anzahl Tage
  const getCravingsForDays = useCallback((days) => {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);
    return cravings.filter(c => new Date(c.timestamp) >= startDate);
  }, [cravings]);

  // NEU: Rückfälle für bestimmte Anzahl Tage
  const getRelapsesForDays = useCallback((days) => {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);
    return relapses.filter(r => new Date(r.timestamp) >= startDate);
  }, [relapses]);

  // Durchschnittliche Intensität berechnen
  const getAverageIntensity = useCallback((cravingsList = cravings) => {
    if (cravingsList.length === 0) return 0;
    const sum = cravingsList.reduce((acc, c) => acc + c.intensity, 0);
    return Math.round((sum / cravingsList.length) * 10) / 10;
  }, [cravings]);

  // Durchschnittliche Energie berechnen
  const getAverageEnergy = useCallback((cravingsList = cravings) => {
    const withEnergy = cravingsList.filter(c => c.energy !== null);
    if (withEnergy.length === 0) return null;
    const sum = withEnergy.reduce((acc, c) => acc + c.energy, 0);
    return Math.round((sum / withEnergy.length) * 10) / 10;
  }, [cravings]);

  // Top Trigger berechnen
  const getTopTriggers = useCallback((cravingsList = cravings, limit = 5) => {
    const triggerCounts = {};
    cravingsList.forEach(c => {
      (c.triggers || []).forEach(t => {
        triggerCounts[t] = (triggerCounts[t] || 0) + 1;
      });
    });
    
    return Object.entries(triggerCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([trigger, count]) => ({ trigger, count }));
  }, [cravings]);

  // NEU: Letztes Report-Datum speichern
  const setLastReportDate = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      lastReportDate: new Date().toISOString(),
    }));
  }, [setSettings]);

  // NEU: Letztes Report-Datum abrufen
  const getLastReportDate = useCallback(() => {
    return settings.lastReportDate;
  }, [settings.lastReportDate]);

  // Alle Daten exportieren (für Backup)
  const exportData = useCallback(() => {
    return {
      cravings,
      relapses,
      settings,
      exportedAt: new Date().toISOString(),
    };
  }, [cravings, relapses, settings]);

  // Alle Daten zurücksetzen
  const resetAllData = useCallback(() => {
    setCravings([]);
    setRelapses([]);
    setSettings({
      startDate: new Date().toISOString().split('T')[0],
      theme: 'dark',
      autoSaveDelay: 3000,
      hapticFeedback: true,
      lastReportDate: null,
    });
  }, [setCravings, setRelapses, setSettings]);

  return {
    // Rohdaten
    cravings,
    relapses,
    settings,
    
    // Setters
    setCravings,
    setRelapses,
    setSettings,
    
    // Aktionen
    addCraving,
    addRelapse,
    
    // Berechnungen
    getDaysClean,
    getLastRelapse,
    getTodaysCravings,
    getWeeksCravings,
    getMonthsCravings,
    getCravingsForDays,      // NEU
    getRelapsesForDays,      // NEU
    getAverageIntensity,
    getAverageEnergy,
    getTopTriggers,
    
    // Report
    setLastReportDate,       // NEU
    getLastReportDate,       // NEU
    
    // Utilities
    exportData,
    resetAllData,
  };
}

export default useStorage;
