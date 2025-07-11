"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { createPortal } from 'react-dom';

// Modal configuration interface
export interface ModalConfig {
  id: string;
  type: 'ai_insight' | 'assessment_deep_dive' | 'strategy_planner' | 'business_trends' | 'standard' | 'confirmation' | 'form';
  size: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  title: string;
  content: ReactNode;
  onClose?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  showCloseButton?: boolean;
  showBackdrop?: boolean;
  closeOnEscape?: boolean;
  closeOnBackdropClick?: boolean;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  className?: string;
}

// Modal context interface
interface ModalContextType {
  openModal: (config: Omit<ModalConfig, 'id'>) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  modals: ModalConfig[];
}

// Create context
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Modal component
interface ModalProps {
  config: ModalConfig;
  onClose: () => void;
}

function Modal({ config, onClose }: ModalProps) {
  const {
    size = 'md',
    title,
    content,
    onConfirm,
    onCancel,
    showCloseButton = true,
    showBackdrop = true,
    closeOnEscape = true,
    closeOnBackdropClick = true,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    loading = false,
    className = ''
  } = config;

  // Handle escape key
  React.useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closeOnEscape, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle confirm
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  // Handle cancel
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  // Size classes
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-4xl'
  };

  // Modal content
  const modalContent = (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      {showBackdrop && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}

      {/* Modal container */}
      <div className="flex min-h-full items-center justify-center p-4 relative z-10">
        <div 
          className={`bg-white rounded-xl shadow-2xl w-full ${sizeClasses[size]} ${className}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
              {title}
            </h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Content */}
          <div id="modal-description" className="p-6">
            {content}
          </div>

          {/* Footer */}
          {(onConfirm || onCancel) && (
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              {onCancel && (
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {cancelText}
                </button>
              )}
              {onConfirm && (
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {loading && (
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  {confirmText}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Render with portal
  return createPortal(modalContent, document.body);
}

// Provider component
export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modals, setModals] = useState<ModalConfig[]>([]);

  const openModal = useCallback((config: Omit<ModalConfig, 'id'>) => {
    const modal = { ...config, id: crypto.randomUUID() };
    setModals(prev => [...prev, modal]);
    return modal.id;
  }, []);

  const closeModal = useCallback((id: string) => {
    setModals(prev => {
      const modal = prev.find(m => m.id === id);
      if (modal?.onClose) {
        modal.onClose();
      }
      return prev.filter(m => m.id !== id);
    });
  }, []);

  const closeAllModals = useCallback(() => {
    setModals(prev => {
      prev.forEach(modal => {
        if (modal.onClose) {
          modal.onClose();
        }
      });
      return [];
    });
  }, []);

  return (
    <ModalContext.Provider value={{ openModal, closeModal, closeAllModals, modals }}>
      {children}
      {modals.map(modal => (
        <Modal
          key={modal.id}
          config={modal}
          onClose={() => closeModal(modal.id)}
        />
      ))}
    </ModalContext.Provider>
  );
};

// Hook to use modal context
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

// Convenience hooks for specific modal types
export const useAIModal = () => {
  const { openModal } = useModal();
  
  return {
    openAIInsight: (content: ReactNode, title = 'AI Insight') => 
      openModal({
        type: 'ai_insight',
        size: 'lg',
        title,
        content,
        showCloseButton: true,
        closeOnEscape: true,
        closeOnBackdropClick: true
      }),
    
    openAssessmentDeepDive: (content: ReactNode, title = 'Assessment Deep Dive') =>
      openModal({
        type: 'assessment_deep_dive',
        size: 'xl',
        title,
        content,
        showCloseButton: true,
        closeOnEscape: true,
        closeOnBackdropClick: true
      }),
    
    openStrategyPlanner: (content: ReactNode, title = 'Strategy Planner') =>
      openModal({
        type: 'strategy_planner',
        size: 'full',
        title,
        content,
        showCloseButton: true,
        closeOnEscape: true,
        closeOnBackdropClick: false
      })
  };
};

export const useConfirmationModal = () => {
  const { openModal } = useModal();
  
  return {
    confirm: (message: string, onConfirm: () => void, title = 'Confirm Action') =>
      openModal({
        type: 'confirmation',
        size: 'sm',
        title,
        content: <p className="text-gray-700">{message}</p>,
        onConfirm,
        confirmText: 'Confirm',
        cancelText: 'Cancel'
      })
  };
}; 