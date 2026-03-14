import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  clickable?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className = '', clickable = false, onClick }: CardProps) {
  return (
    <div
      className={`rounded-card border border-border bg-surface p-4 shadow-card transition-all duration-200 ${
        clickable ? 'hover:shadow-pop cursor-pointer hover:-translate-y-1' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}