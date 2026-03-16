'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLink {
  id: string;
  label: string;
  icon: string;
}

interface DesktopNavProps {
  navLinks: NavLink[];
}

export const DesktopNav: React.FC<DesktopNavProps> = ({ navLinks }) => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="hidden lg:flex items-center gap-6 mx-4">
      {navLinks.map((link) => (
        <Link 
          key={link.id} 
          href={link.id}
          className={`text-sm font-bold transition-colors ${isActive(link.id) ? 'text-primary' : 'text-gray-600 dark:text-gray-400 hover:text-primary'}`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};
