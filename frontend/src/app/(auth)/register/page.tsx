"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";
import { mapBackendError } from "@/utils/errors";
import {
  PhoneInput,
  defaultCountries,
  CountryData,
} from "react-international-phone";
import "react-international-phone/style.css";

const customCountries = defaultCountries.map((country) => {
  if (country[1] === "cd") {
    const newCountry: CountryData = [...country];
    newCountry[3] = "... ... ...";
    return newCountry;
  }
  return country;
});

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { showToast } = useToast();

  const [role, setRole] = useState<"CLIENT" | "VENDOR">("VENDOR");
  const [fullName, setFullName] = useState("");
  const [boutiqueName, setBoutiqueName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country] = useState("RD Congo");
  const [province] = useState("Nord-Kivu");
  const [city, setCity] = useState("Goma");
  const [commune, setCommune] = useState("Goma");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Field-specific errors
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string;
    boutiqueName?: string;
    email?: string;
    phone?: string;
    password?: string;
  }>({});

  // Helper for Title Case
  const toTitleCase = (str: string) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Validation functions (French messages)
  const validateFullName = (value: string): string | undefined => {
    if (!value.trim()) return "Le nom complet est requis";
    if (value.trim().length < 3)
      return "Le nom doit contenir au moins 3 caractères";
    return undefined;
  };

  const validateEmail = (value: string): string | undefined => {
    if (!value.trim()) return "L'e-mail est requis";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value))
      return "Format invalide. Exemple : wapibei@gmail.com";
    return undefined;
  };

  const validatePhone = (value: string): string | undefined => {
    const digits = value.replace(/\D/g, "");
    if (digits.length < 10) return "Le numéro de téléphone est requis";
    return undefined;
  };

  const validatePassword = (value: string): string | undefined => {
    if (!value) return "Le mot de passe est requis";
    if (value.length < 8) return "Minimum 8 caractères requis";
    if (!/[A-Z]/.test(value)) return "Doit contenir une majuscule";
    if (!/\d/.test(value)) return "Doit contenir au moins un chiffre";
    return undefined;
  };

  const validateBoutiqueName = (value: string): string | undefined => {
    if (role === "VENDOR" && !value.trim())
      return "Le nom de la boutique est requis pour les vendeurs";
    return undefined;
  };

  const handleBlur = (field: keyof typeof fieldErrors, value: string) => {
    let error: string | undefined;
    switch (field) {
      case "email":
        error = validateEmail(value);
        break;
      // Add other fields if immediate validation is needed
    }
    setFieldErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const errors = {
      fullName: validateFullName(fullName),
      email: validateEmail(email),
      phone: validatePhone(phone),
      password: validatePassword(password),
      ...(role === "VENDOR"
        ? { boutiqueName: validateBoutiqueName(boutiqueName) }
        : {}),
    };

    setFieldErrors(errors);
    if (Object.values(errors).some((err) => err !== undefined)) {
      showToast("Veuillez corriger les erreurs dans le formulaire", "error");
      return;
    }

    setIsLoading(true);

    try {
      await register({
        email,
        password,
        fullName,
        phone: phone.replace(/\s/g, ""),
        province,
        commune,
        city,
        country,
        role,
        ...(role === "VENDOR" && boutiqueName ? { boutiqueName } : {}),
      });
      localStorage.setItem("registrationEmail", email);
      showToast("Compte créé ! Veuillez vérifier votre code OTP.", "success");
      router.push("/verify-otp");
    } catch (err) {
      showToast(mapBackendError(err), "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-sans antialiased text-slate-800 dark:text-slate-100 min-h-[calc(100vh-64px)] md:min-h-screen flex items-center justify-center md:p-6 bg-white md:bg-slate-50 dark:bg-slate-950 pt-8 md:pt-6">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 md:rounded-[2.5rem] md:shadow-2xl md:border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col md:flex-row min-h-full md:min-h-[650px] animate-in fade-in zoom-in-95 duration-500">

        {/* Left Side - Hero Content (Hidden on Mobile) */}
        <div className="hidden md:flex md:w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-black">
          {/* Background Image */}
          <img
            src="/hero/slide5.png"
            alt="WapiBei Background"
            className="object-cover absolute inset-0 w-full h-full"
          />
          {/* subtle black gradient just to ensure text is readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

          {/* Logo */}
          <Link href="/" className="relative z-10 flex items-center gap-2 w-fit hover:opacity-90 transition-opacity">
            <div className="flex items-center justify-center size-10 rounded-xl bg-[#E67E22] shadow-lg shadow-[#E67E22]/20">
              <span className="material-symbols-outlined text-white text-[24px]">storefront</span>
            </div>
            <h1 className="text-2xl font-black tracking-tighter uppercase">
              <span className="text-white">Wapi</span><span className="text-[#E67E22]">Bei</span>
            </h1>
          </Link>

          {/* Text Content */}
          <div className="relative z-10 mb-4">
            <h2 className="text-4xl lg:text-5xl font-black text-white leading-[1.15] mb-6">
              Rejoignez une <br />
              <span className="text-[#E67E22]">famille unique.</span>
            </h2>
            <p className="text-white/85 text-lg leading-relaxed max-w-md font-medium">
              Inscrivez-vous pour créer votre boutique ou acheter auprès de millier de vendeurs à travers l'Afrique.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-6 sm:p-10 lg:p-12 relative overflow-y-auto">

          <div className="text-center md:text-left mb-6">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
              Créer un compte
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Inscrivez-vous pour découvrir WapiBei.
            </p>
          </div>

          <div className="w-full max-w-md mx-auto">
            <div className="mb-8">
            <div className="relative flex p-1.5 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-inner">
              {/* Indicateur Coulissant avec effet de relief */}
              <div
                className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white dark:bg-slate-700 rounded-xl shadow-md transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
                  role === "VENDOR" ? "left-1.5" : "left-[calc(50%+2px)]"
                }`}
              >
                {/* Petite lueur discrète sous le bouton actif */}
                  <div className="absolute inset-0 rounded-xl shadow-[0_0_15px_rgba(230,126,34,0.15)] dark:shadow-[0_0_15px_rgba(230,126,34,0.2)]"></div>
              </div>

              {/* Bouton Vendeur */}
              <button
                type="button"
                onClick={() => setRole("VENDOR")}
                className={`relative flex-1 py-3.5 flex items-center justify-center gap-2 text-sm font-bold rounded-xl transition-all duration-300 ${
                  role === "VENDOR"
                  ? "text-[#E67E22] dark:text-[#E67E22] scale-105"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className={`w-4 h-4 transition-transform ${role === "VENDOR" ? "scale-110" : "opacity-70"}`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
                  />
                </svg>
                <span>Vendeur</span>
              </button>

              {/* Bouton Client */}
              <button
                type="button"
                onClick={() => setRole("CLIENT")}
                className={`relative flex-1 py-3.5 flex items-center justify-center gap-2 text-sm font-bold rounded-xl transition-all duration-300 ${
                  role === "CLIENT"
                  ? "text-[#E67E22] dark:text-[#E67E22] scale-105"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className={`w-4 h-4 transition-transform ${role === "CLIENT" ? "scale-110" : "opacity-70"}`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
                <span>Client</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Nom complet"
              placeholder="Ex: Jean Mukendi"
              value={fullName}
              onChange={(e) => setFullName(toTitleCase(e.target.value))}
              error={fieldErrors.fullName}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              }
            />

            {role === "VENDOR" && (
              <Input
                label="Nom de la boutique"
                placeholder="Ex: Goma Fashion"
                value={boutiqueName}
                onChange={(e) => setBoutiqueName(toTitleCase(e.target.value))}
                error={fieldErrors.boutiqueName}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
                    />
                  </svg>
                }
              />
            )}

            <Input
              label="Adresse e-mail"
              type="email"
              placeholder="jean@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              onBlur={() => handleBlur("email", email)}
              error={fieldErrors.email}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-semibold text-slate-600 dark:text-slate-300 ml-1">
                  Téléphone
                </label>
                <div className="relative phone-input-container">
                  <PhoneInput
                    defaultCountry="cd"
                    value={phone}
                    onChange={(phone) => setPhone(phone)}
                    countries={customCountries}
                    forceDialCode
                    inputProps={{
                      placeholder: "974 927 593",
                      required: true,
                    }}
                    inputClassName="!w-full !h-12 !text-base !bg-white dark:!bg-slate-900 !border-slate-200 dark:!border-slate-700 !rounded-2xl !text-slate-800 dark:!text-white focus:!border-orange-500 focus:!ring-4 focus:!ring-orange-500/10 !transition-all !duration-300"
                    countrySelectorStyleProps={{
                      buttonClassName:
                        "!border-slate-200 dark:!border-slate-700 !bg-transparent !rounded-l-2xl !h-12 !px-3",
                      buttonContentWrapperClassName: "!gap-2",
                      dropdownStyleProps: {
                        className:
                          "!bg-white dark:!bg-slate-900 !text-slate-800 dark:!text-white !border-slate-200 dark:!border-slate-700 !rounded-xl !shadow-xl !overflow-hidden",
                        listItemClassName:
                          "hover:!bg-slate-50 dark:hover:!bg-slate-800",
                      },
                    }}
                    inputStyle={{
                      width: "100%",
                      height: "3rem", // h-12
                      borderRadius: "1rem", // rounded-2xl
                      border: "1px solid var(--border-color)", // Fallback
                      fontSize: "1rem",
                    }}
                  />
                  <style jsx global>{`
                    .react-international-phone-input {
                      width: 100%;
                      background-color: transparent;
                    }
                    .react-international-phone-country-selector-button {
                      background-color: transparent !important;
                      border-right: 1px solid #f1f5f9 !important; /* Ajoute cette ligne */
                      margin-right: 8px !important; /* Espace un peu le drapeau du texte */
                    }
                    /* Dark mode adjustments override */
                    .dark .react-international-phone-country-selector-dropdown {
                      background-color: #0f172a !important; /* slate-900 */
                      color: white !important;
                      border-color: #334155 !important; /* slate-700 */
                    }
                    .dark .react-international-phone-country-selector-button {
                      border-right: 1px solid #334155 !important;
                    }
                    .dark
                      .react-international-phone-country-selector-dropdown__list-item:hover {
                      background-color: #1e293b !important; /* slate-800 */
                    }
                  `}</style>
                  {fieldErrors.phone && (
                    <p className="text-red-500 text-xs font-medium mt-1 ml-1 animate-fade-in">
                      {fieldErrors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-600 dark:text-slate-300 ml-1">
                  Ville
                </label>
                <Input
                  placeholder="Ex: Kinshasa, Nairobi..."
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    setCommune(e.target.value);
                  }}
                  className="h-12"
                  /* Positionnement de l'icône via la prop du composant */
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-slate-400 dark:text-slate-500 transition-colors group-focus-within:text-orange-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0z"
                      />
                    </svg>
                  }
                />
              </div>
            </div>

            <Input
              label="Mot de passe"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={fieldErrors.password}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
              }
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  )}
                </button>
              }
            />

            <Button
              type="submit"
              isLoading={isLoading}
              fullWidth
                className="h-12 !bg-[#E67E22] text-white font-bold rounded-2xl 
                              !shadow-lg !shadow-[#E67E22]/25 mt-4 
                              transition-all duration-300 ease-out
                              hover:!bg-[#D35400] hover:!shadow-xl hover:!shadow-[#E67E22]/40 hover:-translate-y-0.5
                              active:scale-[0.98] active:translate-y-0"
            >
              Créer mon compte
            </Button>

            <p className="text-center text-sm text-slate-500 mt-8">
              Vous avez déjà un compte ?{" "}
              <Link
                href="/login"
                  className="relative inline-block font-bold text-[#E67E22] dark:text-[#E67E22] group transition-colors duration-300"
              >
                <span>Connectez-vous</span>

                {/* La barre animée en dessous */}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#E67E22] dark:bg-[#E67E22] transition-all duration-300 group-hover:w-full"></span>

                {/* Petit effet de rebond au clic */}
                <style jsx>{`
                  a:active {
                    transform: scale(0.95);
                  }
                `}</style>
              </Link>
            </p>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
}
