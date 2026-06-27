'use client';

import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useEffect } from 'react';

// Modal Component
export function Modal({ isOpen, onClose, title, children, footer, size = 'md' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`relative bg-white rounded-lg shadow-xl ${sizeClasses[size]} w-full mx-4 max-h-96 overflow-y-auto`}>
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-slate-200 bg-white">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="sticky bottom-0 flex gap-3 p-6 border-t border-slate-200 bg-white justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// Confirmation Dialog
export function ConfirmDialog({ isOpen, onClose, title, message, onConfirm, confirmText = 'Delete', variant = 'danger' }) {
  const variants = {
    danger: { icon: AlertTriangle, color: 'text-red-600', buttonClass: 'btn-danger' },
    warning: { icon: AlertTriangle, color: 'text-yellow-600', buttonClass: 'btn-warning' },
    info: { icon: Info, color: 'text-blue-600', buttonClass: 'btn-primary' },
    success: { icon: CheckCircle, color: 'text-green-600', buttonClass: 'btn-success' },
  };

  const config = variants[variant];
  const Icon = config.icon;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={config.buttonClass}
          >
            {confirmText}
          </button>
        </>
      }
    >
      <div className="flex gap-4">
        <Icon className={`w-6 h-6 ${config.color} flex-shrink-0 mt-0.5`} />
        <div>
          <p className="text-slate-700">{message}</p>
        </div>
      </div>
    </Modal>
  );
}

// Toast-style Alert
export function Alert({ type = 'info', title, message, onClose }) {
  const types = {
    success: 'bg-green-50 border-green-200 text-green-900',
    error: 'bg-red-50 border-red-200 text-red-900',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    info: 'bg-blue-50 border-blue-200 text-blue-900',
  };

  useEffect(() => {
    if (type !== 'error') {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [type, onClose]);

  return (
    <div className={`p-4 rounded-lg border ${types[type]} flex items-start gap-3`}>
      <div className="flex-1">
        {title && <p className="font-semibold mb-1">{title}</p>}
        {message && <p className="text-sm">{message}</p>}
      </div>
      <button
        onClick={onClose}
        className="text-current hover:opacity-70 transition-opacity"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

// Loading Skeleton
export function Skeleton({ className = '' }) {
  return (
    <div className={`bg-slate-200 animate-pulse rounded ${className}`} />
  );
}

// Empty State
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {Icon && <Icon className="w-12 h-12 text-slate-300 mb-4" />}
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-center mb-6 max-w-sm">{description}</p>
      {action}
    </div>
  );
}

// Badge Component
export function Badge({ variant = 'default', children }) {
  const variants = {
    default: 'bg-slate-100 text-slate-700',
    primary: 'bg-blue-100 text-blue-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    purple: 'bg-purple-100 text-purple-700',
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]}`}>
      {children}
    </span>
  );
}

// Progress Bar
export function ProgressBar({ value, label, color = 'blue' }) {
  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
  };

  return (
    <div>
      {label && (
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">{label}</span>
          <span className="text-sm font-semibold text-slate-900">{value}%</span>
        </div>
      )}
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${colors[color]}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

// Card Component
export function Card({ children, className = '', hover = true }) {
  return (
    <div
      className={`bg-white rounded-lg border border-slate-200 p-6 ${
        hover ? 'hover:shadow-lg transition-shadow' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

// Button Group
export function ButtonGroup({ children, vertical = false }) {
  return (
    <div className={`flex gap-2 ${vertical ? 'flex-col' : 'flex-row'}`}>
      {children}
    </div>
  );
}

// Stat Card
export function StatCard({ label, value, change, icon: Icon, color = 'blue' }) {
  const colorClasses = {
    blue: 'from-blue-100 to-blue-200 text-blue-700',
    green: 'from-green-100 to-green-200 text-green-700',
    red: 'from-red-100 to-red-200 text-red-700',
    purple: 'from-purple-100 to-purple-200 text-purple-700',
  };

  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
          {change && (
            <p className={`text-sm font-semibold mt-2 ${change.positive ? 'text-green-600' : 'text-red-600'}`}>
              {change.positive ? '↑' : '↓'} {change.value}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
}

export default {
  Modal,
  ConfirmDialog,
  Alert,
  Skeleton,
  EmptyState,
  Badge,
  ProgressBar,
  Card,
  ButtonGroup,
  StatCard,
};
