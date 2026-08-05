"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
    X, User, Mail, Phone, MapPin, ShieldCheck,
    Camera, BadgeCheck, CheckCircle2, Loader2, Store
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/auth.service';
import { toast } from 'sonner';
import useT from '@/i18n/useT';
import { mapBackendError } from '@/utils/errors';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const EditProfileModal = ({ isOpen, onClose }: EditProfileModalProps) => {
    const { t } = useT();
    const { user, updateUser } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        province: '',
        commune: '',
        boutiqueName: '',
    });

    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [coverPicture, setCoverPicture] = useState<File | null>(null);
    const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (user && isOpen) {
            setFormData({
                fullName: user.fullName || '',
                email: user.email || '',
                phone: user.phone || '',
                province: user.province || '',
                commune: user.commune || '',
                boutiqueName: user.boutiqueName || '',
            });
            setPreviewUrl(user.avatarUrl || null);
            setCoverPreviewUrl(user.coverUrl || null);
        }
    }, [user, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfilePicture(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverPicture(file);
            setCoverPreviewUrl(URL.createObjectURL(file));
        }
    };

    const compressImage = (file: File, maxW: number, maxH: number): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new window.Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    let w = img.width, h = img.height;
                    if (w > h) { if (w > maxW) { h *= maxW / w; w = maxW; } }
                    else { if (h > maxH) { w *= maxH / h; h = maxH; } }
                    const canvas = document.createElement('canvas');
                    canvas.width = w; canvas.height = h;
                    canvas.getContext('2d')?.drawImage(img, 0, 0, w, h);
                    resolve(canvas.toDataURL('image/jpeg', 0.8));
                };
                img.onerror = reject;
            };
            reader.onerror = reject;
        });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updateData: any = { ...formData };

            if (profilePicture) updateData.profilePicture = await compressImage(profilePicture, 400, 400);
            if (coverPicture) updateData.coverPicture = await compressImage(coverPicture, 1200, 600);

            // Nettoyage des champs vides
            Object.keys(updateData).forEach(key => {
                if (updateData[key] === '' || updateData[key] === null) delete updateData[key];
            });

            const response = await authService.updateProfile(updateData);
            if (response.success) {
                updateUser(response.user);
                toast.success(t('editProfile.updateSuccess'));
                onClose();
            } else {
                toast.error(t('editProfile.updateError'));
            }
        } catch (error: any) {
            console.error("Update profile error:", error);
            toast.error(mapBackendError(error, t));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
            <div className="relative w-full sm:max-w-2xl lg:max-w-3xl bg-white dark:bg-[#111] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95dvh] sm:max-h-[90vh]">

                {/* ── Header ── */}
                <div className="flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5 border-b border-gray-100 dark:border-white/5 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="size-9 sm:size-10 rounded-xl bg-orange-50 flex items-center justify-center">
                            <User className="size-4 sm:size-5 text-[#E67E22]" />
                        </div>
                        <div>
                            <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white leading-none">{t('editProfile.title')}</h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{t('editProfile.subtitle')}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2.5 bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl transition-all active:scale-90"
                    >
                        <X className="size-4 sm:size-5 text-gray-500" />
                    </button>
                </div>

                {/* ── Scrollable Body ── */}
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex flex-col lg:flex-row flex-1 overflow-y-auto">

                        {/* ── Left panel: Avatar ── */}
                        <aside className="lg:w-52 xl:w-56 shrink-0 flex flex-col items-center gap-4 px-6 sm:px-8 py-6 lg:py-8 bg-gray-50/70 dark:bg-white/2 border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-white/5">

                            {/* Avatar */}
                            <div className="relative">
                                <div className="size-24 sm:size-28 rounded-full overflow-hidden border-4 border-white dark:border-[#222] shadow-xl bg-gradient-to-br from-[#E67E22] to-[#2D5A27]">
                                    {previewUrl ? (
                                        <img className="w-full h-full object-cover" src={previewUrl} alt="Avatar" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <User className="size-10 text-white/80" />
                                        </div>
                                    )}
                                </div>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 bg-[#E67E22] hover:bg-[#cf6d18] text-white p-2 rounded-full shadow-lg active:scale-95 transition-all border-2 border-white dark:border-[#222]"
                                >
                                    <Camera className="size-3.5" />
                                </button>
                            </div>

                            {/* Name + role badge */}
                            <div className="text-center">
                                <p className="text-sm font-black text-gray-900 dark:text-white truncate max-w-[160px]">
                                    {formData.fullName || t('editProfile.userFallback')}
                                </p>
                                <span className={`inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${user?.role === 'VENDOR' ? 'bg-orange-50 text-[#E67E22]' : 'bg-green-50 text-[#2D5A27]'}`}>
                                    <BadgeCheck className="size-2.5" />
                                    {user?.role === 'VENDOR' ? t('editProfile.vendorCertified') : t('editProfile.clientVerified')}
                                </span>
                            </div>

                            {/* Photo actions */}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full py-2.5 px-3 border-2 border-dashed border-[#E67E22]/30 hover:border-[#E67E22] hover:bg-orange-50 text-[#E67E22] rounded-xl font-bold text-xs transition-all active:scale-95"
                            >
                                {t('editProfile.changePhoto')}
                            </button>

                            <input type="file" ref={coverInputRef} onChange={handleCoverChange} className="hidden" accept="image/*" />
                            <button
                                type="button"
                                onClick={() => coverInputRef.current?.click()}
                                className="w-full py-2.5 px-3 bg-[#2D5A27]/5 hover:bg-[#2D5A27]/10 border border-[#2D5A27]/20 hover:border-[#2D5A27]/40 text-[#2D5A27] dark:text-green-400 rounded-xl font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5"
                            >
                                <Camera className="size-3.5" />
                                {t('editProfile.coverPhoto')}
                            </button>

                            {coverPreviewUrl && (
                                <div className="w-full h-16 rounded-xl overflow-hidden border border-gray-100 opacity-80">
                                    <img src={coverPreviewUrl} alt="Couverture" className="w-full h-full object-cover" />
                                </div>
                            )}

                            {/* Statut */}
                            <div className="w-full mt-auto pt-2 lg:pt-0">
                                <div className="bg-white dark:bg-white/5 rounded-2xl p-3.5 border border-gray-100 dark:border-white/5 flex items-center gap-3">
                                    <div className={`size-8 rounded-xl flex items-center justify-center shrink-0 ${user?.isVerified ? 'bg-green-50' : 'bg-orange-50'}`}>
                                        <ShieldCheck className={`size-4 ${user?.isVerified ? 'text-[#2D5A27]' : 'text-[#E67E22]'}`} />
                                    </div>
                                    <div>
                                        <p className={`font-black text-[10px] uppercase tracking-[0.12em] ${user?.isVerified ? 'text-[#2D5A27]' : 'text-[#E67E22]'}`}>
                                            {t('editProfile.accountStatus')}
                                        </p>
                                        <p className="text-[10px] font-semibold text-gray-400 mt-0.5">
                                            {user?.isVerified ? t('editProfile.verifiedStatus') : t('editProfile.pendingStatus')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* ── Right panel: Form fields ── */}
                        <div className="flex-1 px-5 sm:px-8 py-6 lg:py-8 space-y-5">

                            {/* Section title */}
                            <div className="flex items-center gap-2.5">
                                <div className="size-7 rounded-lg bg-green-50 flex items-center justify-center">
                                    <CheckCircle2 className="size-3.5 text-[#2D5A27]" />
                                </div>
                                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                                    {t('editProfile.sectionPersonal')}
                                </h3>
                            </div>

                            {/* Fields grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                {/* Nom Complet */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">{t('editProfile.labelFullName')}</label>
                                    <div className="relative">
                                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-[#E67E22]" />
                                        <input
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder={t('editProfile.placeholderFullName')}
                                            type="text"
                                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E67E22]/30 focus:border-[#E67E22]/50 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">{t('editProfile.labelEmail')}</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-[#E67E22]" />
                                        <input
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="email@exemple.com"
                                            type="email"
                                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E67E22]/30 focus:border-[#E67E22]/50 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Téléphone */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">{t('editProfile.labelPhone')}</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-[#2D5A27]" />
                                        <input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+243 xxx xxx xxx"
                                            type="tel"
                                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2D5A27]/30 focus:border-[#2D5A27]/50 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Province */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">{t('editProfile.labelProvince')}</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-[#2D5A27]" />
                                        <input
                                            name="province"
                                            value={formData.province}
                                            onChange={handleChange}
                                            placeholder="Ex: Nord-Kivu"
                                            type="text"
                                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2D5A27]/30 focus:border-[#2D5A27]/50 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Commune */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">{t('editProfile.labelCommune')}</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-[#2D5A27]" />
                                        <input
                                            name="commune"
                                            value={formData.commune}
                                            onChange={handleChange}
                                            placeholder="Ex: Goma"
                                            type="text"
                                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2D5A27]/30 focus:border-[#2D5A27]/50 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Boutique — Vendeur uniquement, pleine largeur */}
                                {user?.role === 'VENDOR' && (
                                    <div className="space-y-1.5 sm:col-span-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">{t('editProfile.labelBoutique')}</label>
                                        <div className="relative">
                                            <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-[#E67E22]" />
                                            <input
                                                name="boutiqueName"
                                                value={formData.boutiqueName}
                                                onChange={handleChange}
                                                placeholder={t('editProfile.placeholderBoutique')}
                                                type="text"
                                                className="w-full bg-orange-50/50 dark:bg-orange-500/5 border border-orange-100 dark:border-orange-500/20 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E67E22]/30 focus:border-[#E67E22]/50 transition-all"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Footer Actions ── */}
                    <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 px-5 sm:px-8 py-4 sm:py-5 border-t border-gray-100 dark:border-white/5 bg-gray-50/80 dark:bg-white/2 shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="sm:w-auto px-6 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 rounded-xl font-bold text-sm hover:bg-gray-100 dark:hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {t('editProfile.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="sm:w-auto px-8 py-3 bg-[#E67E22] hover:bg-[#cf6d18] text-white rounded-xl font-black text-sm shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 min-w-[180px]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    {t('editProfile.saving')}
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="size-4" />
                                    {t('editProfile.save')}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;