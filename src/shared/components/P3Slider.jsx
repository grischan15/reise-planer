// ============================================
// P3Slider - Wiederverwendbarer Slider
// 🔄 WIEDERVERWENDBAR für alle P3 Apps
// ============================================

import React, { useState } from 'react';
import { P3_COLORS, P3_TOUCH, P3_ANIMATIONS, getIntensityColor } from '../p3-theme';

/**
 * P3-gestylter Slider für Energie/Intensität
 * 
 * @param {Object} props
 * @param {string} props.label - Label über dem Slider
 * @param {string} props.icon - Emoji-Icon
 * @param {number} props.value - Aktueller Wert (1-10)
 * @param {Function} props.onChange - Value Change Handler
 * @param {number} props.min - Minimum (default: 1)
 * @param {number} props.max - Maximum (default: 10)
 * @param {boolean} props.showValue - Wert anzeigen (default: true)
 * @param {boolean} props.colorByValue - Farbe nach Wert (default: false)
 */
export function P3Slider({
  label,
  icon,
  value,
  onChange,
  min = 1,
  max = 10,
  showValue = true,
  colorByValue = false,
  style = {},
}) {
  const containerStyle = {
    backgroundColor: P3_COLORS.bgElevated,
    borderRadius: P3_TOUCH.radiusMd,
    padding: '16px',
    ...style,
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  };

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: P3_COLORS.textPrimary,
    fontSize: '14px',
    fontWeight: 600,
  };

  const valueStyle = {
    backgroundColor: colorByValue ? getIntensityColor(value) : P3_COLORS.bgCard,
    color: P3_COLORS.white,
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: 700,
    minWidth: '40px',
    textAlign: 'center',
  };

  const sliderContainerStyle = {
    position: 'relative',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
  };

  const sliderTrackStyle = {
    position: 'absolute',
    width: '100%',
    height: '8px',
    backgroundColor: P3_COLORS.bgCard,
    borderRadius: '4px',
  };

  const sliderFillStyle = {
    position: 'absolute',
    height: '8px',
    backgroundColor: colorByValue ? getIntensityColor(value) : P3_COLORS.red,
    borderRadius: '4px',
    width: `${((value - min) / (max - min)) * 100}%`,
    transition: `all ${P3_ANIMATIONS.fast}`,
  };

  const sliderInputStyle = {
    position: 'absolute',
    width: '100%',
    height: '40px',
    opacity: 0,
    cursor: 'pointer',
    zIndex: 1,
    margin: 0,
  };

  const sliderThumbStyle = {
    position: 'absolute',
    width: '24px',
    height: '24px',
    backgroundColor: P3_COLORS.white,
    borderRadius: '50%',
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
    left: `calc(${((value - min) / (max - min)) * 100}% - 12px)`,
    pointerEvents: 'none',
    transition: `all ${P3_ANIMATIONS.fast}`,
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <span style={labelStyle}>
          {icon && <span>{icon}</span>}
          {label}
        </span>
        {showValue && value !== null && (
          <span style={valueStyle}>{value}</span>
        )}
        {showValue && value === null && (
          <span style={{ ...valueStyle, opacity: 0.5 }}>—</span>
        )}
      </div>
      
      <div style={sliderContainerStyle}>
        <div style={sliderTrackStyle} />
        <div style={sliderFillStyle} />
        <div style={sliderThumbStyle} />
        <input
          type="range"
          min={min}
          max={max}
          value={value || min}
          onChange={(e) => onChange?.(parseInt(e.target.value))}
          style={sliderInputStyle}
        />
      </div>
    </div>
  );
}

/**
 * Diskrete Punkte-Auswahl (Alternative zum Slider)
 * Besser für Touch und Neurodivergenz
 */
export function P3DotSelector({
  label,
  icon,
  value,
  onChange,
  count = 10,
  colorByValue = false,
  style = {},
}) {
  const containerStyle = {
    backgroundColor: P3_COLORS.bgElevated,
    borderRadius: P3_TOUCH.radiusMd,
    padding: '16px',
    ...style,
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  };

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: P3_COLORS.textPrimary,
    fontSize: '14px',
    fontWeight: 600,
  };

  const valueStyle = {
    backgroundColor: colorByValue && value ? getIntensityColor(value) : P3_COLORS.bgCard,
    color: P3_COLORS.white,
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: 700,
    minWidth: '40px',
    textAlign: 'center',
  };

  const dotsContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '4px',
  };

  const handleDotClick = (index) => {
    const newValue = index + 1;
    // Toggle: Wenn gleicher Wert, auf null setzen
    onChange?.(value === newValue ? null : newValue);
    
    if (navigator.vibrate) navigator.vibrate(10);
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <span style={labelStyle}>
          {icon && <span>{icon}</span>}
          {label}
        </span>
        <span style={valueStyle}>
          {value !== null ? value : '—'}
        </span>
      </div>
      
      <div style={dotsContainerStyle}>
        {Array.from({ length: count }, (_, i) => {
          const dotValue = i + 1;
          const isSelected = value !== null && dotValue <= value;
          const dotColor = colorByValue ? getIntensityColor(dotValue) : P3_COLORS.red;
          
          return (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: isSelected ? dotColor : P3_COLORS.bgCard,
                cursor: 'pointer',
                transition: `all ${P3_ANIMATIONS.fast}`,
                transform: isSelected ? 'scale(1.1)' : 'scale(1)',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default P3Slider;
