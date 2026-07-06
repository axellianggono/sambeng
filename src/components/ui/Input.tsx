import React from 'react';

interface BaseInputProps {
  label: string;
  error?: string;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, BaseInputProps {}
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, BaseInputProps {}
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement>, BaseInputProps {
  options: { value: string; label: string }[];
  placeholderOption?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wide">{label}</label>
      <input
        className={`w-full px-4 py-3 bg-white border border-zinc-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-zinc-800 font-medium placeholder-zinc-400 transition-all ${
          error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
}

export function TextArea({ label, error, className = '', rows = 3, ...props }: TextAreaProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wide">{label}</label>
      <textarea
        rows={rows}
        className={`w-full px-4 py-3 bg-white border border-zinc-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-zinc-800 font-medium placeholder-zinc-400 transition-all resize-none ${
          error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
}

export function Select({ label, options, placeholderOption, error, className = '', ...props }: SelectProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wide">{label}</label>
      <select
        className={`w-full px-4 py-3 bg-white border border-zinc-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-zinc-800 font-medium cursor-pointer transition-all ${
          error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''
        } ${className}`}
        {...props}
      >
        {placeholderOption && <option value="">{placeholderOption}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
}
