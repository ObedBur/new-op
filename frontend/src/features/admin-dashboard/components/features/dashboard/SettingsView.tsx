import React from 'react';
import { useSettings } from '@/context/SettingsContext';
import { useToast } from '@/context/ToastContext';

const SettingsView: React.FC = () => {
    const { theme, setTheme, language, setLanguage, fontSize, setFontSize } = useSettings();
    const { showToast } = useToast();

    // Local draft state for values before applying
    const [draftTheme, setDraftTheme] = React.useState(theme);
    const [draftLanguage, setDraftLanguage] = React.useState(language);
    const [draftFontSize, setDraftFontSize] = React.useState(fontSize);
    const [isSaving, setIsSaving] = React.useState(false);

    const handleApply = () => {
        setIsSaving(true);
        // Simulate a small delay for premium feel
        setTimeout(() => {
            setTheme(draftTheme);
            setLanguage(draftLanguage);
            setFontSize(draftFontSize);
            setIsSaving(false);
            showToast(t.success, 'success');
        }, 600);
    };

    const themes: { id: typeof theme; label: string; color: string }[] = [
        { id: 'light', label: 'Clair', color: 'bg-white' },
        { id: 'dark', label: 'Sombre', color: 'bg-slate-900' },
        { id: 'emerald', label: 'Émeraude', color: 'bg-emerald-500' },
        { id: 'ocean', label: 'Océan', color: 'bg-sky-500' },
    ];

    const languages: { id: typeof language; label: string }[] = [
        { id: 'fr', label: 'Français' },
        { id: 'en', label: 'English' },
        { id: 'sw', label: 'Swahili' },
    ];

    const fontSizes: { id: typeof fontSize; label: string }[] = [
        { id: 'small', label: 'Petit' },
        { id: 'medium', label: 'Normal' },
        { id: 'large', label: 'Grand' },
    ];

    const t = {
        fr: { title: 'Configuration Globale', theme: 'Thème de l\'interface', lang: 'Langue du système', font: 'Taille de police', apply: 'Appliquer les changements', applying: 'Application en cours...', success: 'Paramètres mis à jour' },
        en: { title: 'Global Settings', theme: 'Interface Theme', lang: 'System Language', font: 'Font Size', apply: 'Apply Changes', applying: 'Applying...', success: 'Settings updated' },
        sw: { title: 'Mipangilio ya Mfumo', theme: 'Mandhari', lang: 'Lugha', font: 'Ukubwa wa maandishi', apply: 'Tekeleza Mabadiliko', applying: 'Inatekeleza...', success: 'Mipangilio imesasishwa' },
    }[draftLanguage]; // Use draftLanguage for previewing translations

    const hasChanges = draftTheme !== theme || draftLanguage !== language || draftFontSize !== fontSize;

    return (
        <div className="w-full max-w-4xl space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-border-sep shadow-sm">
                <h3 className="text-xl font-black text-deep-blue mb-8 tracking-tight">{t.title}</h3>

                <div className="space-y-8">
                    {/* Thème */}
                    <div>
                        <label className="block text-[10px] font-black text-muted uppercase tracking-widest mb-4">{t.theme}</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {themes.map((tItem) => (
                                <button
                                    key={tItem.id}
                                    onClick={() => setDraftTheme(tItem.id)}
                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${draftTheme === tItem.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border-sep hover:bg-slate-50'
                                        }`}
                                >
                                    <div className={`size-6 rounded-full border border-black/5 ${tItem.color}`} />
                                    <span className="text-sm font-bold text-deep-blue">{tItem.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Langue */}
                    <div>
                        <label className="block text-[10px] font-black text-muted uppercase tracking-widest mb-4">{t.lang}</label>
                        <div className="flex flex-wrap gap-2">
                            {languages.map((lItem) => (
                                <button
                                    key={lItem.id}
                                    onClick={() => setDraftLanguage(lItem.id)}
                                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all border ${draftLanguage === lItem.id ? 'bg-deep-blue text-white border-deep-blue shadow-lg' : 'bg-white text-deep-blue border-border-sep hover:bg-slate-50'
                                        }`}
                                >
                                    {lItem.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Police */}
                    <div>
                        <label className="block text-[10px] font-black text-muted uppercase tracking-widest mb-4">{t.font}</label>
                        <div className="flex gap-4">
                            {fontSizes.map((fItem) => (
                                <button
                                    key={fItem.id}
                                    onClick={() => setDraftFontSize(fItem.id)}
                                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all border ${draftFontSize === fItem.id ? 'bg-primary text-white border-primary shadow-lg' : 'bg-white text-deep-blue border-border-sep hover:bg-slate-50'
                                        }`}
                                >
                                    {fItem.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-primary">
                        {!hasChanges && !isSaving && (
                            <>
                                <span className="material-symbols-outlined text-base">check_circle</span>
                                <span className="text-[10px] font-black uppercase tracking-widest">{t.success}</span>
                            </>
                        )}
                    </div>

                    <button
                        onClick={handleApply}
                        disabled={!hasChanges || isSaving}
                        className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-sm transition-all ${hasChanges && !isSaving
                            ? 'bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        {isSaving ? (
                            <>
                                <span className="material-symbols-outlined animate-spin text-lg">sync</span>
                                {t.applying}
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-lg">save</span>
                                {t.apply}
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 flex items-center gap-4">
                <div className="size-12 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm">
                    <span className="material-symbols-outlined text-2xl">info</span>
                </div>
                <div>
                    <p className="text-sm font-bold text-deep-blue">WapiBei Admin v2.4.0</p>
                    <p className="text-xs text-muted font-medium">Instance Afrique - Mode Développement</p>
                </div>
            </div>
        </div>
    );
};

export default SettingsView;


