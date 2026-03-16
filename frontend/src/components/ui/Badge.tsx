
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost' | 'promo';
  size?: 'xs' | 'sm';
  icon?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'xs',
  icon,
  className = '',
}) => {
  const baseStyles = "inline-flex items-center gap-1 font-black uppercase tracking-tighter rounded-lg";
  
  const variants = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-deep-blue/10 text-deep-blue dark:bg-white/10 dark:text-white",
    success: "bg-green-500/10 text-green-500",
    warning: "bg-orange-500/10 text-orange-500",
    danger: "bg-red-500/10 text-red-500",
    ghost: "bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400",
    promo: "badge-promo",
  };

  const sizes = {
    xs: "px-2 py-0.5 text-[8px]",
    sm: "px-2.5 py-1 text-[10px]",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {icon && <span className="material-symbols-outlined text-[12px]">{icon}</span>}
      {children}
    </span>
  );
};
