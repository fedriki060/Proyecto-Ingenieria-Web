import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-btn transition-all duration-200 flex items-center gap-2 justify-center cursor-pointer';

  const variantStyles = {
    primary: 'bg-brand-600 text-surface hover:bg-brand-700 disabled:bg-brand-400',
    secondary: 'bg-gray-200 text-text hover:bg-gray-300 disabled:bg-gray-100',
    danger: 'bg-danger-600 text-surface hover:bg-red-700 disabled:bg-red-400',
    success: 'bg-success-600 text-surface hover:bg-green-700 disabled:bg-green-400',
  };

  const sizeStyles = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {isLoading ? <span className="animate-spin">⏳</span> : null}
      {children}
    </button>
  );
}