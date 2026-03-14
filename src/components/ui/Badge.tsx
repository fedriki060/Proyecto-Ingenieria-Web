import type { ReactNode } from 'react';

type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'primary';

type Props = {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-success-600 text-surface',
  danger: 'bg-danger-600 text-surface',
  warning: 'bg-warning-600 text-surface',
  info: 'bg-info-600 text-surface',
  primary: 'bg-brand-600 text-surface',
};

export default function Badge({ children, variant = 'primary', className = '' }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}