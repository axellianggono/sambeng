import React from 'react';

export function TableContainer({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm ${className}`} {...props}>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export function Table({ children, className = '', ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return <table className={`w-full text-left border-collapse ${className}`} {...props}>{children}</table>;
}

export function Thead({ children, className = '', ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead {...props}>
      <tr className={`border-b border-zinc-200 bg-zinc-50/50 text-xs font-bold text-zinc-500 uppercase tracking-wider ${className}`}>
        {children}
      </tr>
    </thead>
  );
}

export function Tbody({ children, className = '', ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={`divide-y divide-zinc-200 text-sm text-zinc-650 ${className}`} {...props}>{children}</tbody>;
}

export function Tr({ children, className = '', ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={`hover:bg-zinc-50/50 transition-all ${className}`} {...props}>{children}</tr>;
}

export function Th({ children, className = '', ...props }: React.ThHTMLAttributes<HTMLTableHeaderCellElement>) {
  return <th className={`py-4 px-6 ${className}`} {...props}>{children}</th>;
}

export function Td({ children, className = '', ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={`py-4 px-6 ${className}`} {...props}>{children}</td>;
}
