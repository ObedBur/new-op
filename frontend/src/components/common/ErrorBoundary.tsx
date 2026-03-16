'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_error: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.fallback) {
        return this.fallback;
      }
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="text-center space-y-4">
            <div className="size-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto text-red-600">
              <span className="material-symbols-outlined text-3xl">error_outline</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Oups! Quelque chose a mal tourné.</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
              Une erreur inattendue est survenue dans ce composant. Nous nous excusons pour le désagrément.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-6 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all uppercase tracking-widest"
            >
              Réessayer
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }

  private get fallback() {
    return this.props.fallback;
  }
}

export default ErrorBoundary;
