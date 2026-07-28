'use client';

import React, { useState, useEffect } from 'react';
import {
    Plus, X, Package, DollarSign, Database, Tag, Image as ImageIcon,
    Loader2, AlignLeft, CheckCircle2, Edit2, Globe, Save, ChevronDown,
    Banknote, Percent, Camera, Trash2,
} from 'lucide-react';

import { getCategories, addProduct, updateProduct } from '@/features/products/services/product.service';
import { toast } from 'sonner';
import { Category } from '@/types/category.types';

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProductAdded: () => void;
    product?: any;
    defaultPublic?: boolean;
}

const MAX_PHOTOS = 5;
const EXCHANGE_RATE = 2800; // 1 USD = 2800 FC (taux provisoire — à remplacer par une API bancaire)
const UNITS = ['Pièce', 'Kg', 'Litre', 'Sac', 'Boîte', 'Douzaine', 'Mètre', 'Gramme'];

/** Compress and convert an image File to a base64 JPEG string */
async function compressImage(file: File, maxSize = 800): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            const img = new window.Image();
            img.src = e.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;
                if (width > height) {
                    if (width > maxSize) { height *= maxSize / width; width = maxSize; }
                } else {
                    if (height > maxSize) { width *= maxSize / height; height = maxSize; }
                }
                canvas.width = width;
                canvas.height = height;
                canvas.getContext('2d')?.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.8));
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
    isOpen, onClose, onProductAdded, product, defaultPublic,
}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [originalPrice, setOriginalPrice] = useState('');
    const [categoryId, setCategoryId] = useState<string>('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('Pièce');
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPublic, setIsPublic] = useState(true);
    const [currency, setCurrency] = useState<'USD' | 'FC'>('USD');

    // Populate form if editing
    useEffect(() => {
        if (product) {
            setName(product.name || '');
            setDescription(product.description || '');
            setPrice(product.price?.toString() || '');
            setOriginalPrice(product.oldPrice?.toString() || '');
            setCategoryId(product.categoryId?.toString() || '');
            setQuantity(product.stockQuantity?.toString() || '');
            setUnit(product.unit || 'Pièce');
            setIsPublic(product.isPublic !== undefined ? product.isPublic : true);
            // Keep existing images for edit mode
            const imgs = product.images?.length ? product.images : (product.image ? [product.image] : []);
            setExistingImages(imgs);
            setPhotos([]);
        } else {
            setName(''); setDescription(''); setPrice(''); setOriginalPrice('');
            setCategoryId(''); setQuantity(''); setUnit('Pièce');
            setIsPublic(defaultPublic !== undefined ? defaultPublic : true);
            setExistingImages([]); setPhotos([]);
        }
        setError(null);
    }, [product, isOpen, defaultPublic]);

    // Fetch real categories from backend
    useEffect(() => {
        if (!isOpen) return;
        getCategories().then((res) => {
            if (res?.success) setCategories(res.data || []);
        }).catch(console.error);
    }, [isOpen]);

    const totalPhotos = existingImages.length + photos.length;
    const canAddMore = totalPhotos < MAX_PHOTOS;

    const handleAddPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const remaining = MAX_PHOTOS - totalPhotos;
        if (files.length > remaining) {
            toast.warning(`Vous pouvez ajouter au maximum ${MAX_PHOTOS} photos. Seules les ${remaining} premières ont été ajoutées.`);
        }
        const toAdd = files.slice(0, remaining).map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setPhotos((prev) => [...prev, ...toAdd]);
    };

    const removeExistingImage = (idx: number) =>
        setExistingImages((prev) => prev.filter((_, i) => i !== idx));
    const removeNewPhoto = (idx: number) =>
        setPhotos((prev) => prev.filter((_, i) => i !== idx));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // Compress all new photos to base64
            const newBase64s = await Promise.all(photos.map((p) => compressImage(p.file)));

            const allImages = [...existingImages, ...newBase64s];
            const mainImage = allImages[0] || undefined;

            const priceUSD = currency === 'USD' ? Number(price) : Number(price) / EXCHANGE_RATE;
            const origPriceUSD = originalPrice
                ? (currency === 'USD' ? Number(originalPrice) : Number(originalPrice) / EXCHANGE_RATE)
                : undefined;

            const payload: any = {
                name,
                description,
                price: priceUSD,
                originalPrice: origPriceUSD,
                categoryId: Number(categoryId),
                stockQuantity: Number(quantity) || 0,
                unit,
                isPublic,
                image: mainImage,
                images: allImages,
            };

            const response = product
                ? await updateProduct(product.id, payload)
                : await addProduct(payload);

            if (response?.success) {
                toast.success(product ? 'Produit mis à jour !' : 'Produit lancé avec succès !', {
                    description: product
                        ? 'Les modifications ont été enregistrées.'
                        : 'Votre produit est maintenant visible dans votre boutique.',
                    style: { background: '#2D5A27', color: 'white', border: '1px solid #E67E22' },
                });
                setIsSuccess(true);
                setTimeout(() => {
                    onProductAdded();
                    onClose();
                    setIsSuccess(false);
                }, 1500);
            } else {
                const msg = response?.message || "Erreur lors de l'enregistrement du produit.";
                setError(msg);
                toast.error(msg);
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Une erreur inattendue est survenue.';
            setError(msg);
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const convertedPrice = price
        ? (currency === 'USD'
            ? `≈ ${(Number(price) * EXCHANGE_RATE).toLocaleString()} FC`
            : `≈ ${(Number(price) / EXCHANGE_RATE).toFixed(2)} $`)
        : null;

    const discount = price && originalPrice && Number(originalPrice) > Number(price)
        ? Math.round((1 - Number(price) / Number(originalPrice)) * 100)
        : null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className="relative bg-white dark:bg-black rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_-12px_rgba(0,0,0,0.25)] border border-black/10 dark:border-white/10 w-full max-w-5xl animate-in zoom-in-95 duration-500">
                <div className="flex flex-col md:flex-row h-full max-h-[90vh] overflow-y-auto scrollbar-hide">

                    {/* --- LEFT SIDE: MULTI-PHOTO UPLOAD (Desktop Only) --- */}
                    <div className="hidden md:flex w-full md:w-5/12 bg-white/50 dark:bg-white/5 p-8 flex-col border-r border-black/10 dark:border-white/5">
                        <div className="space-y-1 mb-4">
                            <h3 className="text-2xl font-black text-black dark:text-white tracking-tight">Photos du Produit</h3>
                            <p className="text-xs font-medium text-black/50 uppercase tracking-widest">
                                Jusqu'à {MAX_PHOTOS} photos · {totalPhotos}/{MAX_PHOTOS} ajoutées
                            </p>
                        </div>

                        {/* Photo Grid */}
                        <div className="grid grid-cols-2 gap-3 flex-1">
                            {/* Existing images */}
                            {existingImages.map((src, i) => (
                                <div key={`existing-${i}`} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-white/5 group">
                                    <img src={src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                                    {i === 0 && (
                                        <span className="absolute top-2 left-2 bg-[#E67E22] text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-md">
                                            Principale
                                        </span>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(i)}
                                        className="absolute top-2 right-2 size-7 bg-red-500 text-white rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}
                            {/* New photos */}
                            {photos.map((p, i) => (
                                <div key={`new-${i}`} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-white/5 group">
                                    <img src={p.preview} alt={`Photo ${existingImages.length + i + 1}`} className="w-full h-full object-cover" />
                                    {existingImages.length === 0 && i === 0 && (
                                        <span className="absolute top-2 left-2 bg-[#E67E22] text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-md">
                                            Principale
                                        </span>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removeNewPhoto(i)}
                                        className="absolute top-2 right-2 size-7 bg-red-500 text-white rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}
                            {/* Add more slot */}
                            {canAddMore && (
                                <label htmlFor="photos-desktop" className="aspect-square rounded-2xl border-2 border-dashed border-black/20 dark:border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-[#E67E22] hover:bg-[#E67E22]/5 transition-all">
                                    <input
                                        id="photos-desktop"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleAddPhotos}
                                    />
                                    <Camera size={22} className="text-black/30 mb-2" />
                                    <span className="text-[9px] font-black uppercase tracking-wider text-black/30">Ajouter</span>
                                </label>
                            )}
                        </div>

                        <div className="p-4 bg-[#E67E22]/5 rounded-2xl border border-[#E67E22]/10 mt-4">
                            <p className="text-[10px] font-bold text-[#E67E22] leading-relaxed">
                                <span className="block font-black mb-1 italic uppercase">Conseil :</span>
                                Ajoutez jusqu'à <strong>5 photos</strong> de qualité (éclairage naturel, plusieurs angles) pour augmenter vos chances de vente de 30%.
                            </p>
                        </div>
                    </div>

                    {/* --- RIGHT SIDE: FORM FIELDS --- */}
                    <div className="w-full md:w-7/12 p-8 md:p-10 relative flex flex-col overflow-y-auto">
                        <button onClick={onClose} className="absolute top-6 right-6 size-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-black/50 hover:bg-red-500 hover:text-white transition-all z-20">
                            <X size={20} />
                        </button>

                        <div className="mb-6">
                            <h3 className="text-2xl md:text-3xl font-black text-black dark:text-white tracking-tighter italic mb-1 uppercase">
                                {product ? "Modifier l'annonce" : defaultPublic ? "Publier l'annonce" : 'Nouveau Brouillon'}
                            </h3>
                            <div className="h-1 w-12 bg-[#E67E22] rounded-full" />
                            <p className="text-[10px] font-bold text-black/40 mt-2 uppercase tracking-[0.2em]">
                                {product ? 'Mis à jour de vos stocks' : defaultPublic ? "Visible sur la page d'accueil" : 'Enregistré dans votre inventaire privé'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5 flex-1">
                            {error && (
                                <div className="bg-red-500/10 text-red-500 border border-red-500/20 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-top-2">
                                    {error}
                                </div>
                            )}

                            {/* Mobile Photo Upload */}
                            <div className="md:hidden space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-black text-black/40 dark:text-white/50 uppercase tracking-widest">
                                        Photos ({totalPhotos}/{MAX_PHOTOS} max)
                                    </label>
                                    {totalPhotos > 0 && <span className="text-[9px] font-black text-[#E67E22]">{MAX_PHOTOS - totalPhotos} emplacement(s) restant(s)</span>}
                                </div>
                                <div className="flex gap-2 overflow-x-auto pb-1">
                                    {existingImages.map((src, i) => (
                                        <div key={i} className="relative shrink-0 w-16 h-16 rounded-xl overflow-hidden">
                                            <img src={src} alt="" className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => removeExistingImage(i)} className="absolute top-0.5 right-0.5 size-5 bg-red-500 text-white rounded-full flex items-center justify-center"><X size={8} /></button>
                                        </div>
                                    ))}
                                    {photos.map((p, i) => (
                                        <div key={i} className="relative shrink-0 w-16 h-16 rounded-xl overflow-hidden">
                                            <img src={p.preview} alt="" className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => removeNewPhoto(i)} className="absolute top-0.5 right-0.5 size-5 bg-red-500 text-white rounded-full flex items-center justify-center"><X size={8} /></button>
                                        </div>
                                    ))}
                                    {canAddMore && (
                                        <label htmlFor="photos-mobile" className="shrink-0 w-16 h-16 rounded-xl border-2 border-dashed border-black/20 dark:border-white/10 flex flex-col items-center justify-center cursor-pointer">
                                            <input id="photos-mobile" type="file" accept="image/*" multiple className="hidden" onChange={handleAddPhotos} />
                                            <Camera size={16} className="text-black/30" />
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* Name */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-black/40 dark:text-white/50 uppercase tracking-widest ml-1">Titre de l'annonce</label>
                                <div className="relative">
                                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40" size={16} />
                                    <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="ex: Basket Nike Air Max..." className="w-full pl-12 pr-6 py-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-transparent focus:border-[#E67E22]/50 focus:ring-4 focus:ring-[#E67E22]/5 outline-none transition-all text-sm font-bold text-black dark:text-white" required />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-black/40 dark:text-white/50 uppercase tracking-widest ml-1">Description (Optionnel)</label>
                                <div className="relative">
                                    <AlignLeft className="absolute left-4 top-4 text-black/40" size={16} />
                                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Décrivez votre produit..." className="w-full pl-12 pr-6 py-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-transparent focus:border-[#E67E22]/50 outline-none transition-all text-sm font-bold min-h-[80px] resize-none text-black dark:text-white" />
                                </div>
                            </div>

                            {/* Price + Original Price */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Prix actuel */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between ml-1">
                                        <label className="text-[10px] font-black text-black/40 dark:text-white/50 uppercase tracking-widest">Prix ({currency})</label>
                                        <div className="flex gap-1">
                                            {(['USD', 'FC'] as const).map((curr) => (
                                                <button key={curr} type="button"
                                                    onClick={() => {
                                                        if (price) {
                                                            const val = Number(price);
                                                            setPrice(curr === 'FC' && currency === 'USD' ? (val * EXCHANGE_RATE).toFixed(0) : curr === 'USD' && currency === 'FC' ? (val / EXCHANGE_RATE).toFixed(2) : price);
                                                        }
                                                        if (originalPrice) {
                                                            const val = Number(originalPrice);
                                                            setOriginalPrice(curr === 'FC' && currency === 'USD' ? (val * EXCHANGE_RATE).toFixed(0) : curr === 'USD' && currency === 'FC' ? (val / EXCHANGE_RATE).toFixed(2) : originalPrice);
                                                        }
                                                        setCurrency(curr);
                                                    }}
                                                    className={`px-3 py-1 rounded-md text-[10px] font-black transition-all ${currency === curr ? 'bg-[#E67E22] text-white shadow-sm' : 'bg-black/5 dark:bg-white/5 text-black/40 hover:text-black hover:bg-black/10'}`}
                                                >{curr}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="relative group/price">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40 transition-colors group-focus-within/price:text-[#E67E22]">
                                            {currency === 'USD' ? <DollarSign size={16} /> : <Banknote size={16} />}
                                        </div>
                                        <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" placeholder="0.00"
                                            className="w-full pl-12 pr-28 py-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-transparent focus:border-[#E67E22]/50 outline-none transition-all text-sm font-bold text-black dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" required />
                                        {convertedPrice && (
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <span className="text-[9px] font-black text-[#E67E22] bg-[#E67E22]/5 px-2 py-1 rounded-lg border border-[#E67E22]/10">{convertedPrice}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Ancien prix (barré) */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between ml-1">
                                        <label className="text-[10px] font-black text-black/40 dark:text-white/50 uppercase tracking-widest">Ancien Prix (Optionnel)</label>
                                        {discount && (
                                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[9px] font-black rounded-md border border-emerald-500/20">
                                                -{discount}%
                                            </span>
                                        )}
                                    </div>
                                    <div className="relative group/orig">
                                        <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40 transition-colors group-focus-within/orig:text-emerald-500" size={16} />
                                        <input value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} type="number" placeholder="Prix avant promo"
                                            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-transparent focus:border-emerald-500/50 outline-none transition-all text-sm font-bold text-black dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Category + Stock */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Catégorie */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-black/40 dark:text-white/50 uppercase tracking-widest ml-1">Catégorie</label>
                                    <div className="relative">
                                        <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40" size={16} />
                                        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full pl-12 pr-10 py-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-transparent focus:border-[#E67E22]/50 outline-none transition-all text-sm font-bold appearance-none cursor-pointer text-black dark:text-white" required>
                                            <option value="" className="bg-white dark:bg-black">...</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id} className="bg-white dark:bg-black">{cat.name}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 pointer-events-none" size={16} />
                                    </div>
                                </div>

                                {/* Quantité */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-black/40 dark:text-white/50 uppercase tracking-widest ml-1">Quantité en stock</label>
                                    <div className="relative">
                                        <Database className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40" size={16} />
                                        <input value={quantity} onChange={(e) => setQuantity(e.target.value)} type="number" placeholder="ex: 100"
                                            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-transparent focus:border-[#E67E22]/50 outline-none transition-all text-sm font-bold text-black dark:text-white" required />
                                    </div>
                                </div>
                            </div>

                            {/* Unit */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-black/40 dark:text-white/50 uppercase tracking-widest ml-1">Unité de mesure</label>
                                <div className="relative">
                                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40" size={16} />
                                    <select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full pl-12 pr-10 py-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-transparent focus:border-[#E67E22]/50 outline-none transition-all text-sm font-bold appearance-none cursor-pointer text-black dark:text-white">
                                        {UNITS.map((u) => <option key={u} value={u} className="bg-white dark:bg-black">{u}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 pointer-events-none" size={16} />
                                </div>
                            </div>

                            {/* Visibility Toggle */}
                            <div className="flex items-center justify-between p-4 bg-black/5 dark:bg-white/5 rounded-2xl border border-transparent hover:border-[#E67E22]/20 transition-all cursor-pointer" onClick={() => setIsPublic(!isPublic)}>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#E67E22]">Visibilité publique</p>
                                    <p className="text-[10px] font-bold text-black/40">Rendre ce produit visible sur la page d'accueil</p>
                                </div>
                                <div className={`w-12 h-6 rounded-full relative transition-all duration-300 ${isPublic ? 'bg-[#E67E22]' : 'bg-black/20 dark:bg-white/10'}`}>
                                    <div className={`absolute top-0.5 bottom-0.5 w-5 bg-white rounded-full shadow transition-all duration-300 ${isPublic ? 'right-0.5' : 'left-0.5'}`} />
                                </div>
                            </div>

                            {/* Submit */}
                            <button type="submit" disabled={isSubmitting || isSuccess}
                                className={`w-full text-white py-5 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-80 flex items-center justify-center gap-3 ${isSuccess ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-[#E67E22] shadow-orange-500/20'}`}>
                                {isSuccess ? (
                                    <><CheckCircle2 size={20} className="animate-in zoom-in" /> {product ? 'Mis à jour !' : defaultPublic ? 'Publié !' : 'Enregistré !'}</>
                                ) : isSubmitting ? (
                                    <><Loader2 className="animate-spin" size={20} /> <span>{product ? 'Modification...' : defaultPublic ? 'Publication...' : 'Enregistrement...'}</span></>
                                ) : (
                                    <>{product ? <Edit2 size={18} /> : defaultPublic ? <Globe size={18} /> : <Save size={18} />}
                                        {product ? 'Enregistrer les modifications' : defaultPublic ? 'Publier sur le site' : 'Sauvegarder le brouillon'}</>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
