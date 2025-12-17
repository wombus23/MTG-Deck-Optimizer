'use client';

import { Fragment, ReactNode } from 'react';
import { clsx } from 'clsx';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-4xl',
  };

  return (
    <Fragment>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={clsx(
            'relative w-full',
            sizes[size],
            'bg-mtg-card border-2 border-mtg-border rounded-xl',
            'shadow-2xl shadow-black/50',
            'animate-scale-in'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header gradient */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-mtg-gold/50 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 text-mtg-textMuted hover:text-mtg-text transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Title */}
          {title && (
            <div className="px-6 pt-6 pb-2">
              <h2 className="text-xl font-display text-mtg-text">{title}</h2>
            </div>
          )}

          {/* Content */}
          <div className={clsx('p-6', title && 'pt-2', 'mtg-scrollbar max-h-[80vh] overflow-y-auto')}>
            {children}
          </div>

          {/* Footer gradient */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-mtg-border to-transparent" />
        </div>
      </div>
    </Fragment>
  );
}

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger';
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-mtg-textMuted mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-mtg-textMuted hover:text-mtg-text transition-colors"
        >
          {cancelText}
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={clsx(
            'px-4 py-2 text-sm font-medium rounded-md transition-colors',
            variant === 'danger'
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-mtg-gold text-mtg-dark hover:bg-mtg-goldLight'
          )}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}
