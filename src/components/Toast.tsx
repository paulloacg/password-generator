'use client';

import { useEffect, useState } from 'react';
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const toastStyles = {
  success: {
    container: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    icon: 'text-green-600 dark:text-green-400',
    title: 'text-green-800 dark:text-green-200',
    message: 'text-green-700 dark:text-green-300'
  },
  error: {
    container: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    icon: 'text-red-600 dark:text-red-400',
    title: 'text-red-800 dark:text-red-200',
    message: 'text-red-700 dark:text-red-300'
  },
  warning: {
    container: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    icon: 'text-yellow-600 dark:text-yellow-400',
    title: 'text-yellow-800 dark:text-yellow-200',
    message: 'text-yellow-700 dark:text-yellow-300'
  },
  info: {
    container: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    icon: 'text-blue-600 dark:text-blue-400',
    title: 'text-blue-800 dark:text-blue-200',
    message: 'text-blue-700 dark:text-blue-300'
  }
};

const toastIcons = {
  success: CheckCircleIcon,
  error: XMarkIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon
};

export default function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const styles = toastStyles[type];
  const IconComponent = toastIcons[type];

  useEffect(() => {
    // Animar entrada
    const showTimer = setTimeout(() => setIsVisible(true), 10);
    
    // Auto-close
    const closeTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(closeTimer);
    };
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(id);
    }, 300); // Tempo da animação de saída
  };

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out
        ${isVisible && !isLeaving 
          ? 'translate-x-0 opacity-100' 
          : 'translate-x-full opacity-0'
        }
        max-w-sm w-full border rounded-lg shadow-lg pointer-events-auto
        ${styles.container}
      `}
      role="alert"
      aria-live="polite"
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <IconComponent 
              className={`w-5 h-5 ${styles.icon}`} 
              aria-hidden="true" 
            />
          </div>
          
          <div className="ml-3 w-0 flex-1">
            <p className={`text-sm font-medium ${styles.title}`}>
              {title}
            </p>
            {message && (
              <p className={`mt-1 text-sm ${styles.message}`}>
                {message}
              </p>
            )}
          </div>
          
          <div className="ml-4 flex-shrink-0 flex">
            <button
              type="button"
              className={`
                inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2
                ${styles.icon} hover:opacity-75 focus:ring-offset-gray-50 focus:ring-gray-600
              `}
              onClick={handleClose}
              aria-label="Fechar notificação"
            >
              <XMarkIcon className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Barra de progresso */}
      <div className="h-1 bg-black/10 dark:bg-white/10 rounded-b-lg overflow-hidden">
        <div 
          className={`h-full bg-current ${styles.icon} animate-[shrink_${duration}ms_linear_forwards]`}
          style={{
            animation: `shrink ${duration}ms linear forwards`
          }}
        />
      </div>
    </div>
  );
}

// Componente Container para gerenciar múltiplos toasts
export interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

export interface ToastContainerProps {
  toasts: ToastData[];
  onRemoveToast: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const positionStyles = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4'
};

export function ToastContainer({ 
  toasts, 
  onRemoveToast, 
  position = 'top-right' 
}: ToastContainerProps) {
  return (
    <div 
      className={`fixed z-50 ${positionStyles[position]} space-y-2`}
      aria-live="polite"
      aria-label="Notificações"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={onRemoveToast}
        />
      ))}
    </div>
  );
}

// Hook para gerenciar toasts
export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = (toast: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearToasts = () => {
    setToasts([]);
  };

  // Funções de conveniência
  const success = (title: string, message?: string, duration?: number) => 
    addToast({ type: 'success', title, message, duration });
  
  const error = (title: string, message?: string, duration?: number) => 
    addToast({ type: 'error', title, message, duration });
  
  const warning = (title: string, message?: string, duration?: number) => 
    addToast({ type: 'warning', title, message, duration });
  
  const info = (title: string, message?: string, duration?: number) => 
    addToast({ type: 'info', title, message, duration });

  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    success,
    error,
    warning,
    info
  };
}