<<<<<<< HEAD
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { authService } from '@/services/auth.service';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const getErrorMessage = (err: unknown): string => {
    if (err && typeof err === 'object' && 'response' in err) {
      const response = (err as { response?: { data?: { message?: string } } }).response;
      const message = response?.data?.message;
      if (typeof message === 'string' && message.trim()) {
        return message;
      }
    }
    if (err instanceof Error && err.message.trim()) {
      return err.message;
    }
    return 'An error occurred. Please try again.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await authService.forgotPassword({ email });
      setIsSubmitted(true);
    } catch (err: unknown) {
      console.error(err);
      setError(getErrorMessage(err));
=======
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await api.post("/auth/forgot-password", { email });
      // Always show submitted on success regardless or 404
      setIsSubmitted(true);
    } catch (error) {
      // Pour des raisons de sécurité, nous afficherons aussi le succès même en cas d'erreur 404
      // mais en cas d'erreur de connexion, on pourrait vouloir retenter, restons simples :
      setIsSubmitted(true); 
>>>>>>> 290370a19af069c11dcba02e6949aa48c45160ef
    } finally {
      setIsLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <div className="flex items-center justify-center p-4 font-sans">
      {/* Main Container */}
      <div className="relative w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden flex flex-col h-auto min-h-[600px]">

        {/* Top App Bar */}
        <header className="flex items-center justify-between p-6 z-10">
          <Link href="/login" className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-800 dark:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col px-8 pt-4 pb-8">

          {/* Header Section */}
          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-slate-900 dark:text-white text-[32px] font-bold leading-tight tracking-tight mb-3">
              Forgot Password?
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-relaxed">
              Don&apos;t worry! It happens. Please enter the email address associated with your account.
            </p>
          </div>

          {!isSubmitted ? (
            /* Form Section */
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
              {/* Email Input Field */}
              <div className="flex flex-col gap-2">
                <label className="text-slate-700 dark:text-slate-200 text-sm font-semibold ml-1" htmlFor="email">
                  Email address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-600 transition-colors">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
=======
    <div className="min-h-screen bg-[#FCFBF7] flex items-center justify-center px-4 py-6 min-[480px]:px-8 selection:bg-[#BC9C6C] selection:text-white">
      <div className="w-full mx-auto max-w-md lg:max-w-[450px] min-[1440px]:max-w-[500px]">
        
        {/* LOGO MINIMALISTE */}
        <div className="mb-16 text-center">
           <Link href="/" className="inline-block group mx-auto">
             <div className="flex flex-col items-center gap-0.5 mb-2">
               <div className="w-6 h-1 bg-[#BC9C6C] rounded-none group-hover:w-8 transition-all duration-300"></div>
               <div className="w-8 h-1 bg-[#321B13] rounded-none"></div>
             </div>
             <h1 className="text-xl font-black tracking-tighter text-[#321B13] uppercase">
               Kaskade<span className="text-[#BC9C6C]">.</span>
             </h1>
           </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-[#321B13]/10 p-8 md:p-12 shadow-[0_20px_40px_rgba(50,27,19,0.03)]"
        >
          {!isSubmitted ? (
            <>
              <h2 className="text-3xl font-black text-[#321B13] tracking-tighter mb-4 text-center">
                Mot de passe oublié
              </h2>
              <p className="text-[#321B13]/60 text-xs leading-relaxed text-center mb-10 px-4">
                Entrez l'adresse email associée à votre compte, et nous vous enverrons un lien de réinitialisation.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-widest text-[#321B13] mb-2">
                    Adresse Email
                  </label>
>>>>>>> 290370a19af069c11dcba02e6949aa48c45160ef
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
<<<<<<< HEAD
                    autoComplete="email"
                    placeholder="example@wapibei.com"
                    required
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-base shadow-sm"
                  />
                </div>
                {/* Helper Text */}
                <p className="text-slate-500 dark:text-slate-400 text-xs ml-1 font-medium">
                  We will send you a link to reset your password.
                </p>
                {error ? (
                  <p className="text-rose-600 dark:text-rose-400 text-sm font-medium mt-2" role="alert">
                    {error}
                  </p>
                ) : null}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 active:scale-[0.98] transition-all duration-200 rounded-xl h-[52px] shadow-lg shadow-emerald-500/25 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <span className="text-white text-base font-bold tracking-wide">Send Reset Link</span>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Success State */
            <div className="flex flex-col items-center justify-center text-center animate-fade-in">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-emerald-600 dark:text-emerald-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Check your email</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8">
                We have sent a password reset link to <span className="font-semibold text-slate-900 dark:text-white">{email}</span>
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
              >
                Try another email
              </button>
            </div>
          )}

          <div className="mt-auto pb-8 flex justify-center">
            <button className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Need help? Contact Support
            </button>
          </div>

        </main>
=======
                    required
                    className="w-full min-h-[44px] bg-transparent border-b border-[#321B13]/20 py-3 text-sm font-bold text-[#321B13] placeholder-[#321B13]/30 focus:outline-none focus:border-[#BC9C6C] transition-colors"
                    placeholder="votre@email.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full py-4 bg-[#BC9C6C] text-white text-[10px] uppercase font-black tracking-[0.2em] hover:bg-[#321B13] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                  {isLoading ? "Envoi en cours..." : "Envoyer le lien"}
                </button>
              </form>
            </>
          ) : (
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="text-center py-6"
             >
               <div className="w-16 h-16 bg-[#BC9C6C]/10 flex items-center justify-center mx-auto mb-6">
                 <CheckCircle2 className="w-8 h-8 text-[#BC9C6C]" />
               </div>
               <h3 className="text-xl font-black text-[#321B13] uppercase tracking-tight mb-4">Lien envoyé</h3>
               
               {/* SÉCURITÉ : Ne pas confirmer que l'email existe */}
               <p className="text-[#321B13]/70 text-sm leading-relaxed mb-8">
                 Si cet email {email && <span className="font-bold text-[#321B13]">({email})</span>} est associé à un compte, vous recevrez un lien pour réinitialiser votre mot de passe d'ici quelques instants.
               </p>

               <button 
                 onClick={() => setIsSubmitted(false)}
                 className="text-[#321B13]/50 hover:text-[#321B13] text-xs font-bold underline underline-offset-4 decoration-[#321B13]/20"
               >
                 Je n'ai rien reçu
               </button>
             </motion.div>
          )}

        </motion.div>

        <div className="mt-8 text-center">
          <Link href="/login" className="inline-flex items-center gap-2 text-[#321B13]/60 hover:text-[#321B13] text-[10px] font-bold uppercase tracking-widest transition-colors">
            <ArrowLeft className="w-3 h-3" /> Retour à la connexion
          </Link>
        </div>
>>>>>>> 290370a19af069c11dcba02e6949aa48c45160ef
      </div>
    </div>
  );
}
