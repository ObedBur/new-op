"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  total: number;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  total,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    onSubmit(data);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-[#1a1c1e] rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-white/5"
          >
            {/* Header */}
            <div className="relative pt-10 pb-6 px-8 text-center bg-linear-to-b from-gray-50/50 to-transparent dark:from-white/5">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-400"
              >
                <X size={20} />
              </button>
              <div className="mx-auto w-12 h-1 bg-primary/20 rounded-full mb-6" />
              <h2 className="text-2xl md:text-3xl font-black text-deep-blue dark:text-white tracking-tight">
                Finalisez votre commande
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Prêt à recevoir vos trésors ?
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-4">
                <Input
                  label="Nom et Prénom"
                  name="fullName"
                  placeholder="Ex: Jean Dupont"
                  required
                />
                <Input
                  label="Adresse e-mail"
                  name="email"
                  type="email"
                  placeholder="nom@exemple.com"
                  required
                />
                <Input
                  label="Numéro de téléphone"
                  name="phone"
                  placeholder="06 XX XX XX XX"
                  required
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
                    Adresse de livraison
                  </label>
                  <textarea
                    name="address"
                    placeholder="Numéro, rue, ville et code postal"
                    required
                    rows={3}
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none text-deep-blue dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-14 bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/20 text-white font-bold"
                >
                  Confirmer • {total.toLocaleString()} FC
                </Button>
              </div>

              <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest font-medium">
                Paiement sécurisé • Livraison WapiBei
              </p>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
