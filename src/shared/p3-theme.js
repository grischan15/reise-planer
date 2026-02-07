// ============================================
// P3 DESIGN SYSTEM - ERWEITERT FÜR APPS
// Version: 2.0
// Basis: p3-design-system.js + Neurodivergenz UI Guidelines
// 🔄 WIEDERVERWENDBAR für alle P3 Apps
// ============================================

// ========== FARBEN ==========
export const P3_COLORS = {
  // Hauptfarben (Original P3)
  red: '#c60a0f',           // P3 Rot - Primär-Aktionen
  blue: '#25313a',          // P3 Dunkelblau
  beige: '#d5d4c7',         // P3 Beige - Text auf dunkel
  white: '#ffffff',
  black: '#333333',
  gray: '#c4c4c4',
  
  // Gradient
  gradientStart: '#25313a',
  gradientEnd: '#26323a',
  gradientAngle: '140deg',
  
  // APP-ERWEITERUNGEN
  // Dark Mode Hintergründe
  bgDark: '#1a1f24',        // Haupthintergrund
  bgCard: '#252d35',        // Karten-Hintergrund
  bgElevated: '#2d363f',    // Erhöhte Elemente
  
  // Semantische Farben
  success: '#2d8a4e',       // Erfolg, Tage Clean
  warning: '#e6a700',       // Warnung
  danger: '#c60a0f',        // Gleich wie red
  
  // Intensitäts-Zonen (Craving)
  intensityLow: '#4a9f5c',      // 1-3: Grün
  intensityMedium: '#e6a700',   // 4-5: Gelb
  intensityHigh: '#e66300',     // 6-7: Orange
  intensityExtreme: '#c60a0f',  // 8-10: Rot
  
  // Text-Varianten
  textPrimary: '#d5d4c7',   // Haupttext (beige)
  textLight: '#d5d4c7',     // Alias für beige - helle Schrift auf dunklem Hintergrund
  textSecondary: '#9aa3ab', // Gedämpfter Text
  textMuted: '#6b7280',     // Sehr gedämpft
};

// ========== TYPOGRAFIE ==========
export const P3_TYPOGRAPHY = {
  fontFamily: "'Avenir', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  
  // Überschriften
  h1: { fontSize: '32px', lineHeight: 1.2, fontWeight: 700 },
  h2: { fontSize: '24px', lineHeight: 1.2, fontWeight: 700 },
  h3: { fontSize: '20px', lineHeight: 1.3, fontWeight: 600 },
  h4: { fontSize: '18px', lineHeight: 1.3, fontWeight: 600 },
  
  // Fließtext
  body: { fontSize: '16px', lineHeight: 1.5, fontWeight: 400 },
  small: { fontSize: '14px', lineHeight: 1.4, fontWeight: 400 },
  tiny: { fontSize: '12px', lineHeight: 1.3, fontWeight: 400 },
  
  // Spezial
  button: { fontSize: '16px', lineHeight: 1, fontWeight: 600 },
  buttonLarge: { fontSize: '18px', lineHeight: 1, fontWeight: 600 },
  stat: { fontSize: '36px', lineHeight: 1, fontWeight: 700 },
  emoji: { fontSize: '28px', lineHeight: 1 },
};

// ========== SPACING ==========
export const P3_SPACING = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
};

// ========== NEURODIVERGENZ-OPTIMIERTE GRÖßEN ==========
export const P3_TOUCH = {
  // Mindestgrößen für Touch-Targets (WCAG + Neurodivergenz)
  minTarget: '48px',        // Minimum nach WCAG
  comfortTarget: '56px',    // Komfortabel
  largeTarget: '64px',      // Für Stress-Situationen
  hugeTarget: '80px',       // Hauptaktionen
  
  // Border Radius
  radiusSm: '8px',
  radiusMd: '12px',
  radiusLg: '16px',
  radiusFull: '9999px',
};

// ========== SCHATTEN ==========
export const P3_SHADOWS = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
  md: '0 4px 6px rgba(0, 0, 0, 0.3)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.3)',
  glow: `0 0 20px ${P3_COLORS.red}40`,  // Roter Glow für Craving
};

// ========== ANIMATIONEN ==========
export const P3_ANIMATIONS = {
  fast: '100ms',
  normal: '200ms',
  slow: '300ms',
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
};

// ========== VORDEFINIERTE STYLES ==========

// Button-Varianten
export const P3_BUTTON_STYLES = {
  primary: {
    backgroundColor: P3_COLORS.red,
    color: P3_COLORS.white,
    border: 'none',
    borderRadius: P3_TOUCH.radiusMd,
    fontFamily: P3_TYPOGRAPHY.fontFamily,
    ...P3_TYPOGRAPHY.button,
    cursor: 'pointer',
    transition: `all ${P3_ANIMATIONS.normal} ${P3_ANIMATIONS.easing}`,
    minHeight: P3_TOUCH.largeTarget,
    padding: `${P3_SPACING.md} ${P3_SPACING.lg}`,
  },
  
  secondary: {
    backgroundColor: P3_COLORS.bgElevated,
    color: P3_COLORS.textPrimary,
    border: `1px solid ${P3_COLORS.gray}40`,
    borderRadius: P3_TOUCH.radiusMd,
    fontFamily: P3_TYPOGRAPHY.fontFamily,
    ...P3_TYPOGRAPHY.button,
    cursor: 'pointer',
    transition: `all ${P3_ANIMATIONS.normal} ${P3_ANIMATIONS.easing}`,
    minHeight: P3_TOUCH.comfortTarget,
    padding: `${P3_SPACING.md} ${P3_SPACING.lg}`,
  },
  
  ghost: {
    backgroundColor: 'transparent',
    color: P3_COLORS.textSecondary,
    border: 'none',
    borderRadius: P3_TOUCH.radiusMd,
    fontFamily: P3_TYPOGRAPHY.fontFamily,
    ...P3_TYPOGRAPHY.button,
    cursor: 'pointer',
    transition: `all ${P3_ANIMATIONS.normal} ${P3_ANIMATIONS.easing}`,
    minHeight: P3_TOUCH.minTarget,
    padding: `${P3_SPACING.sm} ${P3_SPACING.md}`,
  },
  
  // Großer Aktions-Button (für Craving)
  huge: {
    backgroundColor: P3_COLORS.red,
    color: P3_COLORS.white,
    border: 'none',
    borderRadius: P3_TOUCH.radiusLg,
    fontFamily: P3_TYPOGRAPHY.fontFamily,
    ...P3_TYPOGRAPHY.buttonLarge,
    cursor: 'pointer',
    transition: `all ${P3_ANIMATIONS.normal} ${P3_ANIMATIONS.easing}`,
    minHeight: P3_TOUCH.hugeTarget,
    padding: `${P3_SPACING.lg} ${P3_SPACING.xl}`,
    boxShadow: P3_SHADOWS.md,
  },
};

// Card-Styles
export const P3_CARD_STYLES = {
  default: {
    backgroundColor: P3_COLORS.bgCard,
    borderRadius: P3_TOUCH.radiusMd,
    padding: P3_SPACING.md,
    boxShadow: P3_SHADOWS.sm,
  },
  elevated: {
    backgroundColor: P3_COLORS.bgElevated,
    borderRadius: P3_TOUCH.radiusLg,
    padding: P3_SPACING.lg,
    boxShadow: P3_SHADOWS.md,
  },
};

// Modal-Styles
export const P3_MODAL_STYLES = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: P3_SPACING.md,
  },
  content: {
    backgroundColor: P3_COLORS.bgCard,
    borderRadius: P3_TOUCH.radiusLg,
    padding: P3_SPACING.lg,
    maxWidth: '400px',
    width: '100%',
    maxHeight: '80vh',
    overflow: 'auto',
    boxShadow: P3_SHADOWS.lg,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: P3_SPACING.md,
  },
  title: {
    ...P3_TYPOGRAPHY.h3,
    color: P3_COLORS.textPrimary,
    margin: 0,
  },
};

// ========== HELPER FUNKTIONEN ==========

// Gradient generieren
export const p3Gradient = (angle = P3_COLORS.gradientAngle) => 
  `linear-gradient(${angle}, ${P3_COLORS.gradientStart}, ${P3_COLORS.gradientEnd})`;

// Intensitäts-Farbe basierend auf Wert (1-10)
export const getIntensityColor = (value) => {
  if (value <= 3) return P3_COLORS.intensityLow;
  if (value <= 5) return P3_COLORS.intensityMedium;
  if (value <= 7) return P3_COLORS.intensityHigh;
  return P3_COLORS.intensityExtreme;
};

// Zone-Info basierend auf Intensität
export const getZoneInfo = (zone) => {
  const zones = {
    leicht: { emoji: '😤', label: 'Leicht', range: '1-3', color: P3_COLORS.intensityLow, default: 2 },
    mittel: { emoji: '😰', label: 'Mittel', range: '4-5', color: P3_COLORS.intensityMedium, default: 5 },
    stark: { emoji: '🔥', label: 'Stark', range: '6-7', color: P3_COLORS.intensityHigh, default: 7 },
    extrem: { emoji: '💀', label: 'Extrem', range: '8-10', color: P3_COLORS.intensityExtreme, default: 9 },
  };
  return zones[zone] || zones.mittel;
};

// Trigger-Definitionen
export const TRIGGERS = [
  { id: 'stress', emoji: '😰', label: 'Stress' },
  { id: 'müde', emoji: '😴', label: 'Müde' },
  { id: 'gewohnheit', emoji: '☕', label: 'Gewohnheit' },
  { id: 'langeweile', emoji: '😐', label: 'Langeweile' },
  { id: 'alkohol', emoji: '🍺', label: 'Alkohol' },
  { id: 'sozial', emoji: '👥', label: 'Sozial' },
  { id: 'essen', emoji: '🍽️', label: 'Nach Essen' },
  { id: 'beziehung', emoji: '💔', label: 'Beziehung' },
  { id: 'andere', emoji: '❓', label: 'Andere' },
];

// ========== DEFAULT EXPORT ==========
const P3Theme = {
  colors: P3_COLORS,
  typography: P3_TYPOGRAPHY,
  spacing: P3_SPACING,
  touch: P3_TOUCH,
  shadows: P3_SHADOWS,
  animations: P3_ANIMATIONS,
  buttons: P3_BUTTON_STYLES,
  cards: P3_CARD_STYLES,
  modals: P3_MODAL_STYLES,
  // Helpers
  gradient: p3Gradient,
  getIntensityColor,
  getZoneInfo,
  triggers: TRIGGERS,
};

export default P3Theme;
