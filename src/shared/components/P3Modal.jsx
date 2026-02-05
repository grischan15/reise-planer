// ============================================
// P3Modal - Wiederverwendbarer Modal
// 🔄 WIEDERVERWENDBAR für alle P3 Apps
// ============================================

import React, { useEffect } from 'react';
import { P3_MODAL_STYLES, P3_COLORS, P3_ANIMATIONS } from '../p3-theme';
import { P3IconButton } from './P3Button';

/**
 * P3-gestylter Modal mit Overlay und Animation
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Modal sichtbar
 * @param {Function} props.onClose - Close Handler
 * @param {string} props.title - Modal Titel
 * @param {React.ReactNode} props.children - Modal Inhalt
 * @param {boolean} props.showClose - Close-Button zeigen (default: true)
 */
export function P3Modal({ 
  isOpen, 
  onClose, 
  title, 
  children,
  showClose = true,
  style = {},
}) {
  // Body-Scroll verhindern wenn Modal offen
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // ESC-Taste zum Schließen
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Overlay-Klick schließt Modal
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div 
      style={{
        ...P3_MODAL_STYLES.overlay,
        animation: `fadeIn ${P3_ANIMATIONS.normal} ${P3_ANIMATIONS.easing}`,
      }}
      onClick={handleOverlayClick}
    >
      <div 
        style={{
          ...P3_MODAL_STYLES.content,
          animation: `slideUp ${P3_ANIMATIONS.normal} ${P3_ANIMATIONS.easing}`,
          ...style,
        }}
      >
        {/* Header */}
        {(title || showClose) && (
          <div style={P3_MODAL_STYLES.header}>
            <h3 style={P3_MODAL_STYLES.title}>{title}</h3>
            {showClose && (
              <P3IconButton 
                icon="✕" 
                onClick={onClose}
                style={{ color: P3_COLORS.textSecondary }}
              />
            )}
          </div>
        )}
        
        {/* Content */}
        {children}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Bestätigungs-Modal für einfache Ja/Nein Dialoge
 */
export function P3ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Bestätigen',
  message,
  confirmText = 'Ja',
  cancelText = 'Abbrechen',
  variant = 'danger', // 'danger' | 'warning' | 'success'
}) {
  const confirmColor = {
    danger: P3_COLORS.red,
    warning: P3_COLORS.warning,
    success: P3_COLORS.success,
  }[variant];

  return (
    <P3Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p style={{ 
        color: P3_COLORS.textPrimary, 
        marginBottom: '24px',
        lineHeight: 1.5,
      }}>
        {message}
      </p>
      
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={onClose}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '8px',
            border: `1px solid ${P3_COLORS.gray}40`,
            backgroundColor: 'transparent',
            color: P3_COLORS.textPrimary,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {cancelText}
        </button>
        <button
          onClick={() => {
            onConfirm?.();
            onClose?.();
          }}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: confirmColor,
            color: P3_COLORS.white,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {confirmText}
        </button>
      </div>
    </P3Modal>
  );
}

export default P3Modal;
