import _Button from './Button';

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  children?: React.ReactNode;
}

export default function Modal({
  isOpen,
  title,
  message,
  type = 'info',
  children,
}: ModalProps) {
  if (!isOpen) return null;

  const iconMap = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  const borderColorMap = {
    success: 'border-success-600',
    error: 'border-danger-600',
    warning: 'border-warning-600',
    info: 'border-info-600',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-surface rounded-card shadow-pop p-6 max-w-md w-full mx-4 border-l-4 ${borderColorMap[type]}`}>
        <div className="flex items-start gap-4">
          <span className="text-2xl">{iconMap[type]}</span>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-text mb-2">{title}</h2>
            <p className="text-sm text-muted mb-4">{message}</p>
            {children}
          </div>
        </div>
        </div>
      </div>
  );
}

// Helper para mostrar modales fácilmente
export const showModal = (
  _title: string,
  _message: string,
  _type: 'success' | 'error' | 'warning' | 'info' = 'info'
): Promise<boolean> => {
  return new Promise((resolve) => {
    // Implementación en el contexto de la app
    resolve(true);
  });
};