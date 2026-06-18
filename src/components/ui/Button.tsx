'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const buttonVariants = {
  default: 'bg-blue-600 text-white hover:bg-blue-700 px-4 py-3 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 px-4 py-3 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
  outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  ghost: 'hover:bg-gray-100 text-gray-700 px-4 py-3 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  danger: 'bg-red-600 text-white hover:bg-red-700 px-4 py-3 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
};

const buttonSizes = {
  default: '',
  sm: 'px-3 py-2 text-xs',
  lg: 'px-6 py-4 text-base',
  icon: 'h-10 w-10 p-2',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          buttonVariants[variant],
          buttonSizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
