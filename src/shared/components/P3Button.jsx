// ============================================
// P3Button - Wiederverwendbarer Button
// 🔄 WIEDERVERWENDBAR für alle P3 Apps
// ============================================

import React, { useState } from 'react';
import { P3_BUTTON_STYLES, P3_COLORS, P3_ANIMATIONS } from '../p3-theme';

/**
 * P3-gestylter Button mit Varianten und Touch-Feedback
 * 
 * @param {Object} props
 * @param {string} props.variant - 'primary' | 'secondary' | 'ghost' | 'huge'
 * @param {React.ReactNode} props.children - Button-Inhalt
 * @param {Function} props.onClick - Click Handler
 * @param {boolean} props.disabled - Deaktiviert
 * @param {boolean} props.fullWidth - Volle Breite
 * @param {Object} props.style - Zusätzliche Styles
 */
export function P3Button({ 
  variant = 'primary', 
  children, 
  onClick, 
  disabled = false,
  fullWidth = false,
  style = {},
  ...props 
}) {
  const [isPressed, setIsPressed] = useState(false);

  // Basis-Style aus Theme holen
  const baseStyle = P3_BUTTON_STYLES[variant] || P3_BUTTON_STYLES.primary;

  // Kombinierter Style
  const combinedStyle = {
    ...baseStyle,
    ...(fullWidth && { width: '100%' }),
    ...(disabled && { 
      opacity: 0.5, 
      cursor: 'not-allowed',
      pointerEvents: 'none',
    }),
    ...(isPressed && { 
      transform: 'scale(0.96)',
      opacity: 0.9,
    }),
    ...style,
  };

  // Haptic Feedback (wenn verfügbar)
  const handleClick = (e) => {
    if (disabled) return;
    
    // Vibration API für Haptic Feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    
    onClick?.(e);
  };

  return (
    <button
      style={combinedStyle}
      onClick={handleClick}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * Emoji-Button für Zonen-Auswahl (Intensität)
 */
export function P3ZoneButton({ 
  emoji, 
  label, 
  sublabel,
  color,
  selected = false,
  onTap,
  onHold,
  style = {},
}) {
  const [isPressed, setIsPressed] = useState(false);
  const [holdTimer, setHoldTimer] = useState(null);

  const buttonStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: selected ? color : P3_COLORS.bgElevated,
    border: `2px solid ${selected ? color : P3_COLORS.bgElevated}`,
    borderRadius: '12px',
    padding: '12px 8px',
    minWidth: '72px',
    minHeight: '80px',
    cursor: 'pointer',
    transition: `all ${P3_ANIMATIONS.fast}`,
    transform: isPressed ? 'scale(0.95)' : 'scale(1)',
    opacity: isPressed ? 0.9 : 1,
    ...style,
  };

  const emojiStyle = {
    fontSize: '28px',
    marginBottom: '4px',
  };

  const labelStyle = {
    fontSize: '12px',
    fontWeight: 600,
    color: selected ? P3_COLORS.white : P3_COLORS.textPrimary,
  };

  const sublabelStyle = {
    fontSize: '10px',
    color: selected ? P3_COLORS.white : P3_COLORS.textSecondary,
    marginTop: '2px',
  };

  // Touch/Hold Logic
  const handleTouchStart = () => {
    setIsPressed(true);
    
    // Hold-Timer starten (500ms)
    const timer = setTimeout(() => {
      if (navigator.vibrate) navigator.vibrate(30);
      onHold?.();
    }, 500);
    
    setHoldTimer(timer);
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
    
    // Wenn Hold-Timer noch läuft = normaler Tap
    if (holdTimer) {
      clearTimeout(holdTimer);
      setHoldTimer(null);
      if (navigator.vibrate) navigator.vibrate(10);
      onTap?.();
    }
  };

  return (
    <button
      style={buttonStyle}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={() => {
        setIsPressed(false);
        if (holdTimer) clearTimeout(holdTimer);
      }}
    >
      <span style={emojiStyle}>{emoji}</span>
      <span style={labelStyle}>{label}</span>
      {sublabel && <span style={sublabelStyle}>{sublabel}</span>}
    </button>
  );
}

/**
 * Icon-Button (für Header, Close, etc.)
 */
export function P3IconButton({ 
  icon, 
  onClick, 
  size = 44,
  style = {},
}) {
  const [isPressed, setIsPressed] = useState(false);

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: `${size * 0.5}px`,
    transition: `all ${P3_ANIMATIONS.fast}`,
    transform: isPressed ? 'scale(0.9)' : 'scale(1)',
    ...style,
  };

  return (
    <button
      style={buttonStyle}
      onClick={onClick}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      {icon}
    </button>
  );
}

export default P3Button;
