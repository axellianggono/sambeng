import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info' | 'success';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  type = 'info',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;
  
  const buttonColors = {
    danger: 'bg-red-600 hover:bg-red-700 text-white border border-red-500 hover:border-transparent',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white border border-amber-400 hover:border-transparent',
    info: 'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500 hover:border-transparent',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500 hover:border-transparent',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 max-w-sm w-full shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
        <div>
          <h3 className="text-lg font-bold text-zinc-900">{title}</h3>
          <p className="text-sm text-zinc-500 mt-2 leading-relaxed">{message}</p>
        </div>
        <div className="flex gap-3 text-xs font-bold justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="py-2.5 px-5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`py-2.5 px-5 rounded-xl transition-colors cursor-pointer ${buttonColors[type]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
