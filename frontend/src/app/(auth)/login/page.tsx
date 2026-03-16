"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";
import { mapBackendError } from "@/utils/errors";
import { Apple } from "lucide-react";
import Image from "next/image";

// Custom Google Icon component since Lucide might not have the colored version or exact brand icon
const GoogleIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
      <path
        fill="#4285F4"
        d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
      />
      <path
        fill="#34A853"
        d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
      />
      <path
        fill="#FBBC05"
        d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.734 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
      />
      <path
        fill="#EA4335"
        d="M -14.754 43.989 C -12.984 43.989 -11.384 44.599 -10.134 45.789 L -6.734 42.389 C -8.804 40.459 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
      />
    </g>
  </svg>
);

export default function LoginPage() {
  const { login, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setIsLoading(true);

    try {
      const response = await login({ email, password });
      showToast("Connexion réussie", "success");

      if (response.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      const friendlyMessage = mapBackendError(err);
      showToast(friendlyMessage, "error");

      const status =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { status?: number } }).response?.status
          : undefined;

      if (status === 401 || status === 404) {
        setEmailError(" ");
      }
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
              L'excellence à <br />
              <span className="text-[#E67E22]">portée de main.</span>
            </h2>
            <p className="text-white/85 text-lg leading-relaxed max-w-md font-medium">
              Découvrez les meilleures boutiques africaines au juste prix. Connectez-vous et explorez dès maintenant.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-6 sm:p-10 lg:p-12 relative overflow-y-auto">

          <div className="text-center md:text-left mb-8">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
              Bon retour !
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Connectez-vous pour accéder à votre compte.
            </p>
          </div>

          <div className="w-full max-w-sm mx-auto">
          {/* Segmented Control (Tabs) */}
          <div className="w-full bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-2xl grid grid-cols-2 gap-1 mb-8 border border-slate-200/50 dark:border-slate-700/50 shadow-inner">
            {/* Bouton Actif (Connexion) */}
              <button className="relative bg-white dark:bg-slate-700 shadow-md text-[#E67E22] dark:text-[#E67E22] font-bold text-sm py-3 rounded-xl transition-all duration-300 hover:shadow-lg active:scale-[0.97]">
              Connexion
              {/* Petite lueur discrète sous l'élément actif */}
                <span className="absolute inset-0 rounded-xl shadow-[0_0_15px_rgba(230,126,34,0.15)] pointer-events-none"></span>
            </button>

            {/* Lien Inactif (Inscription) */}
            <Link
              href="/register"
                className="group text-slate-500 dark:text-slate-400 hover:text-[#E67E22] dark:hover:text-[#E67E22] font-medium text-sm py-3 rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-white/50 dark:hover:bg-slate-700/30 active:scale-[0.97]"
            >
              <span className="transition-transform duration-300 group-hover:scale-105">
                Inscription
              </span>
            </Link>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="w-full space-y-5">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1"
                >
                  Adresse e-mail <span className="text-orange-500">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  error={emailError}
                  required
                  className="h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:border-orange-500 focus:ring-orange-500/20 rounded-2xl"
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-slate-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                      />
                    </svg>
                  }
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1"
                >
                  Mot de passe <span className="text-orange-500">*</span>
                </label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:border-orange-500 focus:ring-orange-500/20 rounded-2xl"
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-slate-400"
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
                      className="text-slate-400 hover:text-orange-600 transition-colors focus:outline-none"
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
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              fullWidth
                className="h-12 !bg-[#E67E22] text-white font-bold rounded-2xl text-base 
                  !shadow-lg !shadow-[#E67E22]/25 !border-none mt-4 
                  transition-all duration-300 ease-out
                  hover:!bg-[#D35400] hover:!shadow-xl hover:!shadow-[#E67E22]/40 hover:-translate-y-0.5
                  active:scale-[0.98] active:translate-y-0"
            >
              Se connecter
            </Button>
          </form>

          {/* Séparateur social */}
          <div className="w-full mt-8">
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
              </div>
              <span className="relative bg-white dark:bg-slate-900 px-4 text-sm text-slate-400">
                Ou continuer avec
              </span>
            </div>

            <div className="flex items-center justify-center gap-6">
              <button className="group p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-750 hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 transition-all duration-300 shadow-sm">
                <div className="transform group-hover:scale-110 transition-transform duration-300">
                  <GoogleIcon />
                </div>
              </button>

              <button className="group p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-750 hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 transition-all duration-300 shadow-sm text-black dark:text-white">
                <div className="transform group-hover:scale-110 transition-transform duration-300">
                  <Apple size={24} />
                </div>
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
