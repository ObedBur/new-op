import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  warning?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, success, warning, icon, rightElement, className = '', ...props }, ref) => {
    
    // Determine the current state color and icon
    let statusClass = 'border-slate-200 dark:border-slate-700 focus:border-emerald-600 focus:ring-emerald-600/10';
    let statusIcon = null;

    if (error) {
      statusClass = 'border-red-500 focus:border-red-500 focus:ring-red-500/10';
      statusIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-red-500">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
        </svg>
      );
    } else if (success) {
      statusClass = 'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/10';
      statusIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-emerald-500">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
        </svg>
      );
    } else if (warning) {
      statusClass = 'border-orange-500 focus:border-orange-500 focus:ring-orange-500/10';
      statusIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-orange-500">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
        </svg>
      );
    }

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={props.id}
            className="text-slate-600 dark:text-slate-300 text-sm font-semibold leading-normal ml-1"
          >
            {label}
          </label>
        )}
        <div className="relative group">
          {icon && (
            <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${error ? 'text-red-400' : success ? 'text-emerald-400' : warning ? 'text-orange-400' : 'text-slate-400 group-focus-within:text-emerald-600'}`}>
              {icon}
            </div>
          )}

          <input
            ref={ref}
            className={`
              flex w-full rounded-2xl border bg-white dark:bg-slate-900 
              h-12 text-base font-medium transition-all duration-300 shadow-sm
              placeholder:text-slate-400 text-slate-800 dark:text-white
              focus:outline-none focus:ring-4
              disabled:opacity-50 disabled:cursor-not-allowed
              ${icon ? 'pl-12' : 'pl-5'}
              ${(rightElement || statusIcon) ? 'pr-12' : 'pr-5'}
              ${statusClass}
              ${className}
            `}
            {...props}
          />

          <div className="absolute inset-y-0 right-0 pr-4 flex items-center gap-2">
            {statusIcon}
            {rightElement}
          </div>
        </div>

        {error && <p className="text-red-500 text-xs font-medium mt-1 ml-1 animate-fade-in">{error}</p>}
        {success && <p className="text-emerald-600 text-xs font-medium mt-1 ml-1 animate-fade-in">{success}</p>}
        {warning && <p className="text-orange-600 text-xs font-medium mt-1 ml-1 animate-fade-in">{warning}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
