'use client';

import React, { useState, useEffect } from 'react';
import { Plus, X, Package, DollarSign, Database, Tag, Image as ImageIcon, Loader2, AlignLeft, CheckCircle2, Edit2, Globe, Save } from 'lucide-react';
import { api } from '@/lib/axios';
import { toast } from 'sonner';

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProductAdded: () => void;
    product?: any;
    defaultPublic?: boolean;
}

interface Category {
    id: number;
    name: string;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onProductAdded, product, defaultPublic }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [categoryId, setCategoryId] = useState<string>('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPublic, setIsPublic] = useState(true);

    // Populate form if editing
    useEffect(() => {
        if (product) {
            setName(product.name || '');
            setDescription(product.description || '');
            setPrice(product.price?.toString() || '');
            setCategoryId(product.categoryId?.toString() || '');
            setImagePreview(product.image || null);
            setIsPublic(product.isPublic !== undefined ? product.isPublic : true);
        } else {
            // Reset for "Add" mode
            setName('');
            setDescription('');
            setPrice('');
            setCategoryId('');
            setImagePreview(null);
            setIsPublic(defaultPublic !== undefined ? defaultPublic : true);
        }
    }, [product, isOpen, defaultPublic]);

    // Fetch real categories from backend
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/categories');
                if (response.data?.success) {
                    setCategories(response.data.data);
                }
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            }
        };
        if (isOpen) fetchCategories();
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            let base64Image = undefined;
            if (image) {
                base64Image = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(image);
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = error => reject(error);
                });
            }

            const payload: any = {
                name,
                description,
                price: Number(price),
                categoryId: Number(categoryId),
                isPublic,
            };

            if (base64Image) {
                payload.image = base64Image as string;
            }

            const response = product 
                ? await api.patch(`/products/${product.id}`, payload)
                : await api.post('/products', payload);

            if (response.data?.success) {
                toast.success(product ? 'Produit mis à jour ! 🛠️' : 'Produit lancé avec succès ! 🎉', {
                    description: product ? 'Les modifications ont été enregistrées.' : 'Votre produit est maintenant visible dans votre boutique.',
                    style: { background: '#1e293b', color: 'white', border: 'none' },
                });
                setIsSuccess(true);
                setTimeout(() => {
                    onProductAdded();
                    onClose();
                    if (!product) {
                        // Reset form only on "Add"
                        setName('');
                        setDescription('');
                        setPrice('');
                        setCategoryId('');
                        setImage(null);
                        setImagePreview(null);
                    }
                    setIsSuccess(false);
                }, 1500);
            } else {
                const errorMsg = response.data?.message || 'Erreur lors de l\'ajout du produit.';
                setError(errorMsg);
                toast.error(errorMsg);
            }
        } catch (err: any) {
            console.error('Error adding product:', err);
            const errorMsg = err.response?.data?.message || 'Une erreur inattendue est survenue.';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className="relative bg-white dark:bg-[#0f172a] rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_-12px_rgba(0,0,0,0.25)] border border-slate-200 dark:border-white/10 w-full max-w-5xl animate-in zoom-in-95 duration-500">

                <div className="flex flex-col md:flex-row h-full max-h-[90vh] overflow-y-auto scrollbar-hide">

                    {/* --- LEFT SIDE: IMAGE PREVIEW --- */}
                    <div className="w-full md:w-5/12 bg-slate-50 dark:bg-white/5 p-8 flex flex-col border-b md:border-b-0 md:border-r border-slate-100 dark:border-white/5">
                        <div className="space-y-4 mb-6">
                            <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Visuel Produit</h3>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">Aperçu de l'image principale</p>
                        </div>

                        <div className="relative group aspect-[4/3] md:aspect-square mb-4 md:mb-8">
                            <input type="file" id="image" accept="image/*" onChange={(e) => {
                                if (e.target.files?.[0]) {
                                    setImage(e.target.files[0]);
                                    setImagePreview(URL.createObjectURL(e.target.files[0]));
                                }
                            }} className="hidden" />

                            <label htmlFor="image" className="relative flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-slate-300 dark:border-white/10 rounded-2xl sm:rounded-[2rem] cursor-pointer group-hover:border-[#E67E22] group-hover:bg-[#E67E22]/5 transition-all overflow-hidden bg-white dark:bg-slate-900/50">
                                {imagePreview ? (
                                    <>
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <ImageIcon className="text-white" size={32} />
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-4 sm:p-6">
                                        <div className="size-10 sm:size-16 bg-slate-100 dark:bg-white/5 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-4 text-slate-400 group-hover:text-[#E67E22] transition-colors">
                                            <Plus size={24} />
                                        </div>
                                        <p className="text-[9px] sm:text-[11px] font-black uppercase tracking-widest text-slate-400">Ajouter une photo</p>
                                    </div>
                                )}
                            </label>
                        </div>

                        <div className="p-6 bg-[#E67E22]/5 rounded-3xl border border-[#E67E22]/10 mt-auto">
                            <p className="text-[10px] font-bold text-[#E67E22] leading-relaxed">
                                <span className="block font-black mb-1 italic uppercase">Conseil :</span>
                                Utilisez des images de haute qualité avec un éclairage naturel pour augmenter vos chances de vente de 30%.
                            </p>
                        </div>
                    </div>

                    {/* --- RIGHT SIDE: FORM FIELDS --- */}
                    <div className="w-full md:w-7/12 p-8 md:p-12 relative flex flex-col">
                        <button onClick={onClose} className="absolute top-6 right-6 size-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 hover:bg-red-500 hover:text-white transition-all z-20">
                            <X size={20} />
                        </button>

                        <div className="mb-6 md:mb-8">
                            <h3 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tighter italic mb-1 uppercase">
                                {product ? 'Modifier l\'annonce' : defaultPublic ? 'Publier l\'annonce' : 'Nouveau Brouillon'}
                            </h3>
                            <div className="h-1 w-12 bg-[#E67E22] rounded-full" />
                            <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-[0.2em]">
                                {product ? 'Mis à jour de vos stocks' : defaultPublic ? 'Visible sur la page d\'accueil' : 'Enregistré dans votre inventaire privé'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-500/10 text-red-500 border border-red-500/20 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-top-2">
                                    {error}
                                </div>
                            )}

                            {/* Name */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest ml-1">Titre de l'annonce</label>
                                <div className="relative">
                                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hidden sm:block" size={16} />
                                    <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="ex: Basket Nike Air Max..." className="w-full sm:pl-12 pl-6 pr-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-white/5 border border-transparent focus:border-[#E67E22]/50 focus:ring-4 focus:ring-[#E67E22]/5 outline-none transition-all text-sm font-bold text-slate-800 dark:text-white" required />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest ml-1">Description (Optionnel)</label>
                                <div className="relative">
                                    <AlignLeft className="absolute left-4 top-4 text-slate-400 hidden sm:block" size={16} />
                                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Décrivez votre produit..." className="w-full sm:pl-12 pl-6 pr-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-white/5 border border-transparent focus:border-[#E67E22]/50 outline-none transition-all text-sm font-bold min-h-[80px] sm:min-h-[100px] resize-none text-slate-800 dark:text-white" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Price */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest ml-1">Prix ($)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hidden sm:block" size={16} />
                                        <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" placeholder="0.00" className="w-full sm:pl-12 pl-6 pr-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-white/5 border border-transparent focus:border-[#E67E22]/50 outline-none transition-all text-sm font-bold text-slate-800 dark:text-white" required />
                                    </div>
                                </div>
                                {/* Category */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest ml-1">Catégorie</label>
                                    <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full px-4 sm:px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-white/5 border border-transparent focus:border-[#E67E22]/50 outline-none transition-all text-sm font-bold appearance-none cursor-pointer text-slate-800 dark:text-white" required>
                                        <option value="">...</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Visibility Toggle */}
                            <div className="flex items-center justify-between p-4 sm:p-5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-transparent hover:border-[#E67E22]/20 transition-all cursor-pointer group/toggle" onClick={() => setIsPublic(!isPublic)}>
                                <div className="space-y-0.5 sm:space-y-1">
                                    <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[#E67E22]">Visibilité publique</p>
                                    <p className="text-[10px] sm:text-[11px] font-bold text-slate-500">Rendre ce produit visible sur la page d'accueil</p>
                                </div>
                                <div className={`w-10 sm:w-12 h-5 sm:h-6 rounded-full relative transition-all duration-300 ${isPublic ? 'bg-[#E67E22]' : 'bg-slate-300 dark:bg-white/10'}`}>
                                    <div className={`absolute top-0.5 bottom-0.5 w-4 bg-white rounded-full transition-all duration-300 ${isPublic ? 'right-0.5 sm:right-1' : 'left-0.5 sm:left-1'}`} />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || isSuccess}
                                className={`w-full text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black text-[11px] sm:text-[12px] uppercase tracking-[0.2em] shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-80 flex items-center justify-center gap-3 mt-2 ${isSuccess
                                    ? 'bg-emerald-500 shadow-emerald-500/20'
                                    : 'bg-[#E67E22] shadow-orange-500/20'
                                    }`}
                            >
                                {isSuccess ? (
                                    <>
                                        <CheckCircle2 size={20} className="animate-in zoom-in" />
                                        {product ? 'Mis à jour !' : defaultPublic ? 'Publié !' : 'Enregistré !'}
                                    </>
                                ) : isSubmitting ? (
                                    <div className="flex items-center gap-3">
                                        <Loader2 className="animate-spin" size={20} />
                                        <span>{product ? 'Modification...' : defaultPublic ? 'Publication...' : 'Enregistrement...'}</span>
                                    </div>
                                ) : (
                                    <>
                                        {product ? <Edit2 size={18} /> : defaultPublic ? <Globe size={18} /> : <Save size={18} />}
                                        {product ? 'Enregistrer les modifications' : defaultPublic ? 'Publier sur le site' : 'Sauvegarder le brouillon'}
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};