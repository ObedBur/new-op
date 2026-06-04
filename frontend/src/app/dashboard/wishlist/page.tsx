'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WishlistPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/settings?tab=favorites');
    }, [router]);

    return (
        <div className="min-h-[50vh] flex items-center justify-center">
            <div className="animate-pulse text-xs font-bold text-slate-400">Redirection vers vos favoris...</div>
        </div>
    );
}
