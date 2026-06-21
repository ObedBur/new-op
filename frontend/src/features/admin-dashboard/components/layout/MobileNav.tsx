import React from 'react';
import { NAV_ITEMS } from '@/features/admin-dashboard/constants';
import { useAdminTranslation } from '@/features/admin-dashboard/hooks';
import Link from 'next/link';

interface MobileNavProps {
    activeView: string;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeView }) => {
    const { t } = useAdminTranslation();
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border-sep p-2 flex justify-around items-center lg:hidden z-50 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            {NAV_ITEMS.map((item) => (
                <Link
                    key={item.id}
                    href={item.href}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeView === item.view ? 'text-primary scale-110' : 'text-muted'
                        }`}
                >
                    <span className={`material-symbols-outlined ${activeView === item.view ? 'font-bold' : ''}`}>
                        {item.icon}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-tighter">
                        {t.nav[item.translationKey]}
                    </span>
                </Link>
            ))}
        </nav>
    );
};

export default MobileNav;


