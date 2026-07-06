import React from 'react';

export function Card({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`bg-white border border-zinc-200 rounded-3xl p-5 shadow-sm ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`border-b border-zinc-150 pb-4 mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '', ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`text-base font-extrabold text-zinc-900 ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardBody({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`border-t border-zinc-150 pt-4 mt-4 ${className}`} {...props}>
      {children}
    </div>
  );
}
