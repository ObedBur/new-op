"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
    X, User, Mail, Phone, MapPin, ShieldCheck,
    Lock, Camera, BadgeCheck, CheckCircle2, Loader2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/auth.service';
import { toast } from 'sonner';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const EditProfileModal = ({ isOpen, onClose }: EditProfileModalProps) => {
    const { user, updateUser } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        city: '',
        oldPassword: '',
        password: '',
        confirmPassword: '',
        transactionPin: '',
    });

    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (user && isOpen) {
            setFormData({
                fullName: user.fullName || '',
                email: user.email || '',
                phone: user.phone || '',
                city: user.province || '', // Assuming city/province mapping
                oldPassword: '',
                password: '',
                confirmPassword: '',
                transactionPin: '',
            });
            setPreviewUrl(user.avatarUrl || null);
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
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password && formData.password !== formData.confirmPassword) {
            toast.error("Les nouveaux mots de passe ne correspondent pas");
            return;
        }

        setLoading(true);
        try {
            const updateData: any = { ...formData };

            if (profilePicture) {
                // Lecture du fichier en Base64
                const reader = new FileReader();
                const base64Promise = new Promise((resolve) => {
                    reader.onloadend = () => resolve(reader.result);
                });
                reader.readAsDataURL(profilePicture);
                updateData.profilePicture = await base64Promise;
            }

            // Nettoyage des champs vides
            Object.keys(updateData).forEach(key => {
                if (updateData[key] === '' || updateData[key] === null) {
                    delete updateData[key];
                }
            });
            delete updateData.confirmPassword;

            const response = await authService.updateProfile(updateData);

            if (response.success) {
                updateUser(response.user);
                toast.success("Profil mis à jour avec succès");
                onClose();
            } else {
                toast.error("Erreur lors de la mise à jour");
            }
        } catch (error: any) {
            console.error("Update profile error:", error);
            toast.error(error.response?.data?.message || "Une erreur est survenue");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 overflow-y-auto">
            <div className="relative w-full max-w-5xl bg-white dark:bg-[#151b2c] rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden animate-in fade-in zoom-in duration-300">

                {/* Header */}
                <div className="flex justify-between items-center p-8 border-b border-gray-50 dark:border-white/5 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-[#eef2ff] flex items-center justify-center">
                            <User className="size-5 text-[#4f46e5]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-[#1e293b] dark:text-white leading-none">Modifier mon profil</h2>
                            <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest mt-1.5">Mise à jour de vos informations</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 rounded-2xl transition-all active:scale-90"
                    >
                        <X className="size-5 text-[#64748b]" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 lg:p-12 max-h-[75vh] overflow-y-auto">
                    <div className="flex flex-col lg:flex-row gap-12">

                        {/* Sidebar / Profile Overview */}
                        <aside className="w-full lg:w-1/3 space-y-8">
                            <div className="bg-[#f8fafc] dark:bg-white/2 p-10 rounded-[2.5rem] flex flex-col items-center border border-gray-50 dark:border-white/5">
                                <div className="relative group">
                                    <div className="size-40 rounded-full overflow-hidden border-8 border-white dark:border-[#151b2c] shadow-2xl relative bg-gray-100">
                                        {previewUrl ? (
                                            <img
                                                className="w-full h-full object-cover"
                                                src={previewUrl}
                                                alt="Aperçu du profil"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <User className="size-20 text-gray-300" />
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute bottom-2 right-2 bg-[#002db3] text-white p-3 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all border-4 border-white dark:border-[#151b2c]"
                                    >
                                        <Camera className="size-5" />
                                    </button>
                                </div>
                                <div className="mt-8 text-center text-ellipsis overflow-hidden w-full px-2">
                                    <h1 className="text-2xl font-black text-[#1e293b] dark:text-white leading-tight flex items-center justify-center gap-2">
                                        {formData.fullName || 'Utilisateur'}
                                        <BadgeCheck className="size-5 text-[#0033ff]" fill="currentColor" />
                                    </h1>
                                    <p className="text-[#64748b] font-bold text-sm mt-1 uppercase tracking-wider">
                                        {user?.role === 'VENDOR' ? 'Vendeur Certifié' : 'Client Vérifié'}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full mt-10 py-4 px-6 border-2 border-gray-100 dark:border-white/10 text-[#1e293b] dark:text-white rounded-[1.5rem] font-black text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-all active:scale-95"
                                >
                                    Changer la photo
                                </button>
                            </div>

                            {/* Trust Badge Card */}
                            <div className="bg-[#eef2ff] p-6 rounded-[2rem] flex items-center gap-5 border border-blue-50">
                                <div className="size-14 rounded-2xl bg-[#4f46e5] flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                    <ShieldCheck className="size-7" />
                                </div>
                                <div>
                                    <p className="font-black text-[#4f46e5] text-xs uppercase tracking-[0.15em]">Statut du compte</p>
                                    <p className="text-[11px] font-bold text-[#64748b] mt-0.5">
                                        {user?.isVerified ? '✓ Compte Vérifié' : 'Compte en attente'}
                                    </p>
                                </div>
                            </div>
                        </aside>

                        {/* Main Form Content */}
                        <div className="w-full lg:w-2/3 space-y-10">

                            {/* Informations Personnelles */}
                            <section className="space-y-8">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-lg bg-[#f0fdf4] flex items-center justify-center">
                                        <CheckCircle2 className="size-4 text-[#16a34a]" />
                                    </div>
                                    <h2 className="text-lg font-black text-[#1e293b] dark:text-white uppercase tracking-wider">Informations Personnelles</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-[#94a3b8] uppercase tracking-[0.15em] ml-1">Nom Complet</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#94a3b8]" />
                                            <input
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                className="w-full bg-[#f8fafc] dark:bg-white/5 border-none rounded-[1.2rem] pl-12 pr-4 py-4 focus:ring-2 focus:ring-[#002db3]/20 text-[#1e293b] dark:text-white font-bold text-sm transition-all"
                                                type="text"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-[#94a3b8] uppercase tracking-[0.15em] ml-1">E-mail Professionnel</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#94a3b8]" />
                                            <input
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full bg-[#f8fafc] dark:bg-white/5 border-none rounded-[1.2rem] pl-12 pr-4 py-4 focus:ring-2 focus:ring-[#002db3]/20 text-[#1e293b] dark:text-white font-bold text-sm transition-all"
                                                type="email"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-[#94a3b8] uppercase tracking-[0.15em] ml-1">Numéro de téléphone</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#94a3b8]" />
                                            <input
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full bg-[#f8fafc] dark:bg-white/5 border-none rounded-[1.2rem] pl-12 pr-4 py-4 focus:ring-2 focus:ring-[#002db3]/20 text-[#1e293b] dark:text-white font-bold text-sm transition-all"
                                                type="tel"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-[#94a3b8] uppercase tracking-[0.15em] ml-1">Ville de résidence</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#94a3b8]" />
                                            <input
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                className="w-full bg-[#f8fafc] dark:bg-white/5 border-none rounded-[1.2rem] pl-12 pr-4 py-4 focus:ring-2 focus:ring-[#002db3]/20 text-[#1e293b] dark:text-white font-bold text-sm transition-all"
                                                type="text"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Sécurité */}
                            <section className="space-y-8 pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-lg bg-[#fff7ed] flex items-center justify-center">
                                        <ShieldCheck className="size-4 text-[#ea580c]" />
                                    </div>
                                    <h2 className="text-lg font-black text-[#1e293b] dark:text-white uppercase tracking-wider">Sécurité</h2>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.15em] ml-1">Ancien Mot de Passe</label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#94a3b8]" />
                                                <input
                                                    name="oldPassword"
                                                    value={formData.oldPassword}
                                                    onChange={handleChange}
                                                    className="w-full bg-[#f8fafc] dark:bg-white/5 border-none rounded-[1.2rem] pl-12 pr-4 py-4 focus:ring-2 focus:ring-[#002db3]/20 text-[#1e293b] dark:text-white font-bold text-sm transition-all"
                                                    placeholder="••••••••"
                                                    type="password"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.15em] ml-1">Nouveau</label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#94a3b8]" />
                                                <input
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    className="w-full bg-[#f8fafc] dark:bg-white/5 border-none rounded-[1.2rem] pl-12 pr-4 py-4 focus:ring-2 focus:ring-[#002db3]/20 text-[#1e293b] dark:text-white font-bold text-sm transition-all"
                                                    placeholder="••••••••"
                                                    type="password"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.15em] ml-1">Confirmer</label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#94a3b8]" />
                                                <input
                                                    name="confirmPassword"
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    className="w-full bg-[#f8fafc] dark:bg-white/5 border-none rounded-[1.2rem] pl-12 pr-4 py-4 focus:ring-2 focus:ring-[#002db3]/20 text-[#1e293b] dark:text-white font-bold text-sm transition-all"
                                                    placeholder="••••••••"
                                                    type="password"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-gray-50 dark:border-white/5">
                                        <div className="max-w-xs space-y-3">
                                            <label className="text-[11px] font-black text-[#94a3b8] uppercase tracking-[0.15em] ml-1">Code PIN de transaction (4 chiffres)</label>
                                            <input
                                                name="transactionPin"
                                                value={formData.transactionPin}
                                                onChange={handleChange}
                                                className="w-full bg-[#f8fafc] dark:bg-white/5 border-none rounded-2xl px-6 py-5 focus:ring-2 focus:ring-[#002db3]/20 text-center text-2xl font-black tracking-[1.5em] text-[#002db3]"
                                                maxLength={4}
                                                placeholder="****"
                                                type="password"
                                            />
                                            <p className="text-[10px] font-bold text-gray-400 italic text-center">Requis pour valider vos achats et ventes</p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-8 mt-8 bg-[#f8fafc] dark:bg-white/2 border-t border-gray-50 dark:border-white/5 flex flex-col sm:flex-row justify-end gap-5 -mx-8 -mb-8 lg:-mx-12 lg:-mb-12">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-10 py-4 bg-white dark:bg-white/5 border-2 border-gray-100 dark:border-white/10 text-[#64748b] dark:text-gray-300 rounded-[1.5rem] font-black text-sm hover:bg-gray-50 dark:hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-12 py-4 bg-[#002db3] text-white rounded-[1.5rem] font-black text-sm shadow-2xl shadow-blue-500/30 hover:brightness-110 active:scale-95 transition-all tracking-wide flex items-center justify-center gap-2 min-w-[200px] disabled:opacity-80"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="size-5 animate-spin" />
                                    Enregistrement en cours...
                                </>
                            ) : (
                                'Enregistrer les modifications'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;