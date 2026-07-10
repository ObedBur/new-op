'use client';

import React, { useEffect, useState } from 'react';
import { Address, AddressService, CreateAddressData } from '@/features/addresses/services/address.service';
import { toast } from 'sonner';
import { MapPin, Plus, Trash2, CheckCircle2, Edit3, X, Loader2 } from 'lucide-react';

export const AddressBookSection = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<CreateAddressData>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const data = await AddressService.getAddresses();
      setAddresses(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des adresses');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.street || !formData.city || !formData.province || !formData.commune) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    try {
      if (editingId) {
        await AddressService.updateAddress(editingId, formData as Partial<CreateAddressData>);
        toast.success('Adresse mise à jour avec succès');
      } else {
        await AddressService.createAddress(formData as CreateAddressData);
        toast.success('Adresse ajoutée avec succès');
      }
      setFormData({});
      setIsAdding(false);
      setEditingId(null);
      loadAddresses();
    } catch (error) {
      toast.error("Une erreur s'est produite");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer cette adresse ?')) return;
    try {
      await AddressService.deleteAddress(id);
      toast.success('Adresse supprimée');
      loadAddresses();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const setAsDefault = async (id: string) => {
    try {
      await AddressService.updateAddress(id, { isDefault: true });
      toast.success('Adresse définie par défaut');
      loadAddresses();
    } catch (error) {
      toast.error('Erreur');
    }
  };

  if (loading && addresses.length === 0) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-[#E67E22]" /></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Carnet d'adresses</h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">Gérez vos adresses de livraison.</p>
        </div>
        {!isAdding && (
          <button
            onClick={() => {
              setFormData({});
              setIsAdding(true);
              setEditingId(null);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#E67E22] text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition-colors"
          >
            <Plus size={16} /> Ajouter
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-100 dark:border-white/5 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold">{editingId ? 'Modifier l\'adresse' : 'Nouvelle adresse'}</h3>
            <button type="button" onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500">Titre (ex: Maison, Bureau)*</label>
              <input type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#F9FAFB] dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm mt-1 outline-none focus:border-[#E67E22]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Avenue / Rue / Quartier*</label>
              <input type="text" value={formData.street || ''} onChange={e => setFormData({...formData, street: e.target.value})} className="w-full bg-[#F9FAFB] dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm mt-1 outline-none focus:border-[#E67E22]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Commune*</label>
              <input type="text" value={formData.commune || ''} onChange={e => setFormData({...formData, commune: e.target.value})} className="w-full bg-[#F9FAFB] dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm mt-1 outline-none focus:border-[#E67E22]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Ville*</label>
              <input type="text" value={formData.city || ''} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-[#F9FAFB] dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm mt-1 outline-none focus:border-[#E67E22]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Province*</label>
              <input type="text" value={formData.province || ''} onChange={e => setFormData({...formData, province: e.target.value})} className="w-full bg-[#F9FAFB] dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm mt-1 outline-none focus:border-[#E67E22]" />
            </div>
          </div>
          
          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="isDefault" checked={formData.isDefault || false} onChange={e => setFormData({...formData, isDefault: e.target.checked})} className="accent-[#E67E22]" />
            <label htmlFor="isDefault" className="text-xs font-semibold text-slate-600 dark:text-slate-300">Définir comme adresse par défaut</label>
          </div>
          
          <div className="flex justify-end pt-4">
            <button type="submit" className="px-6 py-2.5 bg-[#E67E22] text-white rounded-xl text-xs font-bold shadow-sm shadow-orange-500/20 hover:scale-105 transition-transform active:scale-95">
              {editingId ? 'Mettre à jour' : 'Enregistrer l\'adresse'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <div key={address.id} className={`bg-white dark:bg-[#111827] rounded-2xl p-5 border relative ${address.isDefault ? 'border-[#E67E22] ring-1 ring-[#E67E22]/20 shadow-md shadow-orange-500/5' : 'border-slate-100 dark:border-white/5'}`}>
            {address.isDefault && (
              <span className="absolute top-4 right-4 text-[#E67E22] bg-orange-50 dark:bg-orange-500/10 px-2 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase flex items-center gap-1">
                <CheckCircle2 size={12} /> Défaut
              </span>
            )}
            <div className="flex items-start gap-3">
              <div className="size-10 rounded-xl bg-orange-50 dark:bg-white/5 flex items-center justify-center text-[#E67E22] shrink-0">
                <MapPin size={20} />
              </div>
              <div className="space-y-1 pr-12">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{address.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  {address.street},<br />
                  {address.commune}, {address.city}<br />
                  {address.province}, {address.country}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-100 dark:border-white/5">
              {!address.isDefault && (
                <button onClick={() => setAsDefault(address.id)} className="text-[11px] font-bold text-[#E67E22] hover:underline mr-auto">
                  Définir par défaut
                </button>
              )}
              <button onClick={() => {
                setFormData(address);
                setEditingId(address.id);
                setIsAdding(true);
              }} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 dark:bg-white/5 rounded-lg transition-colors">
                <Edit3 size={14} />
              </button>
              <button onClick={() => handleDelete(address.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {addresses.length === 0 && !isAdding && !loading && (
          <div className="col-span-full py-12 text-center text-slate-400">
            <MapPin size={32} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm font-semibold">Aucune adresse enregistrée</p>
          </div>
        )}
      </div>
    </div>
  );
};
