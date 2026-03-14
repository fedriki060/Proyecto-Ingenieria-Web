import React from 'react';
import Button from './Button';

type StateType = 'loading' | 'error' | 'empty' | 'success';

interface StateMessageProps {
  type: StateType;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export default function StateMessage({
  type,
  title,
  description,
  actionText,
  onAction,
}: StateMessageProps) {
  const iconMap = {
    loading: '⏳',
    error: '❌',
    empty: '📭',
    success: '✅',
  };

  const colorMap = {
    loading: 'text-info-600',
    error: 'text-danger-600',
    empty: 'text-muted',
    success: 'text-success-600',
  };

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 rounded-card border border-border bg-surface`}>
      <span className={`text-5xl mb-4 ${colorMap[type]}`}>{iconMap[type]}</span>
      <h3 className="text-lg font-semibold text-text mb-2">{title}</h3>
      <p className="text-sm text-muted text-center mb-6 max-w-md">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" onClick={onAction} size="sm">
          {actionText}
        </Button>
      )}
    </div>
  );
}