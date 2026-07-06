import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  const baseStyle = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all select-none shadow-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-50';

  const variants = {
    primary: 'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500 hover:border-transparent disabled:bg-zinc-100 disabled:text-zinc-400 disabled:border-zinc-200',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500 hover:border-transparent disabled:bg-zinc-100 disabled:text-zinc-400 disabled:border-zinc-200',
    secondary: 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200',
    danger: 'bg-red-650 hover:bg-red-700 text-white border border-red-500 hover:border-transparent disabled:bg-zinc-100 disabled:text-zinc-400 disabled:border-zinc-200',
    outline: 'bg-transparent border border-zinc-350 hover:bg-zinc-50 text-zinc-650',
    ghost: 'bg-transparent hover:bg-zinc-50 text-zinc-500 hover:text-zinc-800 shadow-none border-transparent',
  };

  const sizes = {
    sm: 'py-1.5 px-3 text-xs gap-1.5',
    md: 'py-2.5 px-5 text-sm gap-2',
    lg: 'py-3 px-6 text-base gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
}
