import { useAdminTranslation, useProducts } from '@/features/admin-dashboard/hooks';
import { Product } from '@/features/admin-dashboard/types';
import { useAdminSearch } from '@/features/admin-dashboard/context';

const ProductTable: React.FC = () => {
    const { t } = useAdminTranslation();
    const { searchQuery } = useAdminSearch();
    const { products, isLoading, error } = useProducts({ searchQuery });

    return (
        <div className="mb-8 glass-card rounded-3xl overflow-hidden border-0">
            <div className="p-8 border-b border-gray-100/50 dark:border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{t.dashboard.products.title}</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest opacity-80">Listing des stocks en temps réel</p>
                </div>
                <div className="flex flex-wrap gap-3 items-center">
                    <button className="px-6 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all">{t.dashboard.products.all_markets}</button>
                    <FilterButton label="Virunga" />
                    <FilterButton label="Birere" />
                    <FilterButton label="Alanine" />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-white/5">
                            <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t.dashboard.products.headers.product}</th>
                            <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t.dashboard.products.headers.seller}</th>
                            <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t.dashboard.products.headers.price}</th>
                            <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t.dashboard.products.headers.market}</th>
                            <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t.dashboard.products.headers.update}</th>
                            <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">{t.dashboard.products.headers.actions}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100/50 dark:divide-white/5">
                        {isLoading ? (
                            <LoadingSkeletons />
                        ) : error ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-red-500 italic font-medium">
                                    {error}
                                </td>
                            </tr>
                        ) : products.length > 0 ? (
                            products.map((product) => (
                                <ProductRow key={product.id} product={product} editLabel={t.dashboard.products.edit} />
                            ))
                        ) : (
                             <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic font-medium">
                                    {t.dashboard.products.empty || "Aucun produit trouvé."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="p-6 border-t border-gray-100/50 dark:border-white/5 flex items-center justify-between bg-slate-50/30 dark:bg-white/5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {t.dashboard.products.pagination.showing} {products.length > 0 ? 1 : 0}-{products.length} {t.dashboard.products.pagination.products}
                </p>
                <div className="flex gap-3">
                    <button className="h-9 px-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black text-slate-600 dark:text-slate-300 hover:scale-105 transition-all shadow-sm uppercase tracking-wider">{t.dashboard.products.pagination.prev}</button>
                    <button className="h-9 px-5 bg-slate-900 dark:bg-emerald-600 text-white rounded-xl text-[10px] font-black hover:scale-105 transition-all shadow-lg shadow-slate-200/50 dark:shadow-none uppercase tracking-wider">{t.dashboard.products.pagination.next}</button>
                </div>
            </div>
        </div>
    );
};

const ProductRow: React.FC<{ product: Product; editLabel: string }> = ({ product, editLabel }) => (
    <tr key={product.id} className="hover:bg-slate-50/80 dark:hover:bg-white/5 transition-all group">
        <td className="px-8 py-5 whitespace-nowrap">
            <div className="flex items-center gap-4">
                <div className={`size-11 rounded-xl flex items-center justify-center ${product.iconBg} shadow-sm group-hover:scale-110 transition-transform`}>
                    <span className={`material-symbols-outlined ${product.iconColor}`}>shopping_bag</span>
                </div>
                <p className="font-bold text-slate-700 dark:text-slate-200 text-sm group-hover:text-emerald-600 transition-colors">{product.name}</p>
            </div>
        </td>
        <td className="px-8 py-5 text-sm text-slate-500 font-medium whitespace-nowrap">{product.seller}</td>
        <td className="px-8 py-5 font-black text-slate-900 dark:text-white text-sm whitespace-nowrap">
            {Number(product.price).toLocaleString('fr-FR')} FC
        </td>
        <td className="px-8 py-5 text-sm whitespace-nowrap">
            <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wider uppercase ${
                product.market === 'Virunga' ? 'bg-blue-50 text-blue-600' :
                product.market === 'Birere' ? 'bg-emerald-50 text-emerald-600' :
                'bg-purple-50 text-purple-600'
            }`}>
                {product.market}
            </span>
        </td>
        <td className="px-8 py-5 text-[11px] text-slate-400 font-bold whitespace-nowrap uppercase tracking-wider font-mono">{product.lastUpdate}</td>
        <td className="px-8 py-5 text-right">
            <button className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide transition-all">{editLabel}</button>
        </td>
    </tr>
);

const LoadingSkeletons = () => (
    <>
        {Array(5).fill(0).map((_, i) => (
            <tr key={i} className="animate-pulse">
                <td className="px-8 py-5"><div className="h-4 bg-slate-200 rounded w-3/4"></div></td>
                <td className="px-8 py-5"><div className="h-4 bg-slate-200 rounded w-1/2"></div></td>
                <td className="px-8 py-5"><div className="h-4 bg-slate-200 rounded w-1/4"></div></td>
                <td className="px-8 py-5"><div className="h-4 bg-slate-200 rounded w-1/3"></div></td>
                <td className="px-8 py-5"><div className="h-4 bg-slate-200 rounded w-1/4"></div></td>
                <td className="px-8 py-5"></td>
            </tr>
        ))}
    </>
);

const FilterButton: React.FC<{ label: string }> = ({ label }) => (
    <button className="px-5 py-2 bg-background text-muted-foreground border border-border/50 text-[11px] font-black rounded-xl hover:bg-muted hover:border-border transition-all shadow-sm uppercase tracking-wider">
        {label}
    </button>
);

export default ProductTable;



